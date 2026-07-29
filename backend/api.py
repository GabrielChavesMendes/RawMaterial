from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import pandas as pd
from prophet import Prophet
from datetime import datetime

app = FastAPI()

# ==========================================
# 1. Configurações de Banco de Dados e CORS
# ==========================================
# Liberta o acesso para o nosso Front-end em React (Vercel ou localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Substitua 'sua_senha' pela password do seu projeto Supabase
SUPABASE_URL = "postgresql://postgres:Favorito%400007@db.ytcnmqaojipmgnztbdvq.supabase.co:5432/postgres"

def get_db_connection():
    return psycopg2.connect(SUPABASE_URL)


# ==========================================
# 2. Rota 1: Previsão de Preços com IA (Prophet)
# ==========================================
@app.get("/api/previsao/{material}")
def prever_material(material: str, dias_futuros: int = 90):
    try:
        conn = get_db_connection()
        query = "SELECT data as ds, preco as y FROM historico_precos WHERE material = %s ORDER BY data ASC"
        df = pd.read_sql(query, conn, params=(material,))
        conn.close()

        if df.empty:
            raise HTTPException(status_code=404, detail=f"Sem dados históricos para a commodity: {material}")

        # Remove timezone para evitar bugs no Prophet
        df['ds'] = pd.to_datetime(df['ds']).dt.tz_localize(None)

        # Treina o Prophet on-the-fly
        m = Prophet(daily_seasonality=True, yearly_seasonality=False)
        m.fit(df)

        # Previsão futura
        futuro = m.make_future_dataframe(periods=dias_futuros)
        previsao = m.predict(futuro)

        # Filtra apenas os dias futuros
        hoje = pd.to_datetime(datetime.now().date())
        previsao_futura = previsao[previsao['ds'] > hoje][['ds', 'yhat', 'yhat_lower', 'yhat_upper']]

        # Formatação
        previsao_futura['ds'] = previsao_futura['ds'].dt.strftime('%Y-%m-%d')
        previsao_futura['yhat'] = previsao_futura['yhat'].round(2)
        previsao_futura['yhat_lower'] = previsao_futura['yhat_lower'].round(2)
        previsao_futura['yhat_upper'] = previsao_futura['yhat_upper'].round(2)

        return previsao_futura.to_dict(orient="records")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na previsão: {str(e)}")


# ==========================================
# 3. Rota 2: Maiores Altas e Quedas (Pandas)
# ==========================================
@app.get("/api/top-movers")
def obter_top_movers():
    try:
        conn = get_db_connection()
        df = pd.read_sql("SELECT material, data, preco FROM historico_precos ORDER BY data ASC", conn)
        conn.close()

        if df.empty:
            return {"altas": [], "quedas": []}

        materiais = df['material'].unique()
        resultados = []

        for mat in materiais:
            df_mat = df[df['material'] == mat]
            if len(df_mat) < 30:
                continue

            preco_atual = float(df_mat.iloc[-1]['preco'])
            preco_antigo = float(df_mat.iloc[-30]['preco'])

            # Cálculo da variação percentual
            variacao = round(((preco_atual - preco_antigo) / preco_antigo) * 100, 1)

            unidade = "t"
            if "Petróleo" in mat:
                unidade = "barril"
            elif "Gás" in mat:
                unidade = "MMBtu"
            elif "Trigo" in mat:
                unidade = "bushel"

            resultados.append({
                "nome": mat,
                "preco": f"R$ {preco_atual:.2f}/{unidade}",
                "variacao": f"{'+' if variacao >= 0 else ''}{variacao}%",
                "valor_variacao": variacao
            })

        # Top 2 Altas e Top 2 Quedas
        altas = sorted([r for r in resultados if r['valor_variacao'] >= 0], key=lambda x: x['valor_variacao'],
                       reverse=True)[:2]
        quedas = sorted([r for r in resultados if r['valor_variacao'] < 0], key=lambda x: x['valor_variacao'])[:2]

        for r in altas + quedas:
            r.pop('valor_variacao', None)

        return {"altas": altas, "quedas": quedas}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao calcular movimentações: {str(e)}")


# ==========================================
# 4. Rota 3: Ranking de Fornecedores
# ==========================================
@app.get("/api/fornecedores")
def obter_fornecedores():
    return [
        {"id": "1", "nome": "Global Timber Corp", "commodity": "Madeira", "rating": 5},
        {"id": "2", "nome": "PetroLogistics", "commodity": "Petróleo (WTI)", "rating": 5},
        {"id": "3", "nome": "AgroGlobal LCC", "commodity": "Trigo", "rating": 4},
        {"id": "4", "nome": "MinasCalcário S.A.", "commodity": "Calcário", "rating": 3},
        {"id": "5", "nome": "IronOre Brasil", "commodity": "Minério de Ferro", "rating": 5},
        {"id": "6", "nome": "EuroGas Distribution", "commodity": "Gás Natural", "rating": 4}
    ]


# ==========================================
# 5. Rota 4: Insights de IA Dinâmicos
# ==========================================
@app.get("/api/insights/{material}")
def obter_insights(material: str):
    try:
        conn = get_db_connection()
        df = pd.read_sql("SELECT preco FROM historico_precos WHERE material = %s ORDER BY data DESC LIMIT 30", conn,
                         params=(material,))
        conn.close()

        if df.empty:
            raise HTTPException(status_code=404, detail="Commodity não encontrada")

        precos = df['preco'].tolist()
        preco_recente = precos[0]
        preco_antigo = precos[-1]
        subiu = preco_recente >= preco_antigo

        if subiu:
            resumo = f"O mercado de {material.lower()} apresenta uma forte tendência de alta no curto prazo. Sugerimos antecipar as compras planeadas para os próximos meses para evitar custos elevados."
            alerta = f"Risco de volatilidade acrescida nas próximas semanas devido à pressão da procura no mercado interno."
        else:
            resumo = f"O mercado de {material.lower()} está numa trajetória de correção e queda de preços. Recomendamos adiar compras de grande volume para aproveitar margens mais favoráveis em breve."
            alerta = f"Estabilização temporária na cadeia de distribuição regional, reduzindo os riscos de rutura de stock."

        return {
            "resumo": resumo,
            "alerta": alerta
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar insights: {str(e)}")
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import pandas as pd
from prophet import Prophet
from datetime import datetime
import feedparser

app = FastAPI()

# ==========================================
# 1. Configurações de Banco de Dados e CORS
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ligação ao Supabase usando a porta 6543 (Pooler) que funciona no Render
SUPABASE_URL = "postgresql://postgres.ytcnmqaojipmgnztbdvq:Favorito%400007@aws-0-ca-central-1.pooler.supabase.com:6543/postgres"


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

        df['ds'] = pd.to_datetime(df['ds']).dt.tz_localize(None)

        m = Prophet(daily_seasonality=True, yearly_seasonality=False)
        m.fit(df)

        futuro = m.make_future_dataframe(periods=dias_futuros)
        previsao = m.predict(futuro)

        hoje = pd.to_datetime(datetime.now().date())
        previsao_futura = previsao[previsao['ds'] > hoje][['ds', 'yhat', 'yhat_lower', 'yhat_upper']]

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


# ==========================================
# 6. Rota 5: Radar de Notícias Reais (RSS)
# ==========================================
@app.get("/api/noticias")
def obter_noticias():
    try:
        # Busca notícias reais dos últimos 7 dias sobre logística e commodities
        url = "https://news.google.com/rss/search?q=logistica+portos+commodities+when:7d&hl=pt-BR&gl=BR&ceid=BR:pt-419"
        feed = feedparser.parse(url)

        alertas = []
        for entry in feed.entries[:4]:
            data_limpa = entry.published[5:16] if hasattr(entry, 'published') else "Recente"

            alertas.append({
                "id": entry.id if hasattr(entry, 'id') else entry.link,
                "texto": entry.title,
                "tipo": "alerta",
                "data": data_limpa
            })

        if not alertas:
            return [{"id": "1", "texto": "Monitorização ativa. Nenhum alerta crítico reportado nas últimas 24h.",
                     "tipo": "info", "data": "Hoje"}]

        return alertas

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar notícias: {str(e)}")
import yfinance as yf
import psycopg2
from datetime import datetime
import pandas as pd

# O seu link do Supabase
SUPABASE_URL = "postgresql://postgres:Favorito%400007@db.ytcnmqaojipmgnztbdvq.supabase.co:5432/postgres"

# Mapeamento de Materiais para Tickers da Bolsa de Valores (Yahoo Finance)
TICKERS_MERCADO = {
    "Petróleo (WTI)": "CL=F",
    "Ouro": "GC=F",
    "Gás Natural": "NG=F",
    "Trigo": "ZW=F",
    "Cobre": "HG=F",
    "Soja": "ZS=F",
    "Alumínio": "ALI=F"
}


def atualizar_precos_reais():
    print("🔄 Iniciando sincronização com o Yahoo Finance...")

    try:
        conn = psycopg2.connect(SUPABASE_URL)
        cursor = conn.cursor()

        for material, ticker in TICKERS_MERCADO.items():
            print(f"Buscando dados reais para: {material} ({ticker})...")

            # Baixa o histórico dos últimos 6 meses (1mo, 3mo, 6mo, 1y)
            dados_bolsa = yf.Ticker(ticker).history(period="6mo")

            if dados_bolsa.empty:
                print(f"⚠️ Sem dados para {material}.")
                continue

            # Limpa dados antigos deste material para evitar duplicação antes de injetar os novos
            cursor.execute("DELETE FROM historico_precos WHERE material = %s", (material,))

            inseridos = 0
            # Prepara os novos dados reais
            for data, linha in dados_bolsa.iterrows():
                preco_fechamento = float(linha['Close'])
                data_formatada = data.strftime('%Y-%m-%d')

                cursor.execute(
                    "INSERT INTO historico_precos (material, data, preco) VALUES (%s, %s, %s)",
                    (material, data_formatada, preco_fechamento)
                )
                inseridos += 1

            print(f"✅ {inseridos} dias de histórico real inseridos para {material}.")

        # Grava tudo no banco de dados
        conn.commit()
        cursor.close()
        conn.close()
        print("🚀 Sincronização concluída com sucesso! O seu banco de dados agora tem números reais.")

    except Exception as e:
        print(f"❌ Erro crítico: {str(e)}")


if __name__ == "__main__":
    atualizar_precos_reais()
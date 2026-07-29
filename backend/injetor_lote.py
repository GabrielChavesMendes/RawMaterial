import psycopg2
import random
from datetime import datetime, timedelta

# ==========================================
# 1. Configurações do Banco de Dados (SUPABASE)
# ==========================================
# Substitua 'sua_senha' pela password do seu projeto Supabase
SUPABASE_URL = "postgresql://postgres:Favorito%400007@db.ytcnmqaojipmgnztbdvq.supabase.co:5432/postgres"

# ==========================================
# 2. Definição das Commodities e Preços Base
# ==========================================
commodities = {
    # As originais
    "Madeira": {"preco_base": 90.0, "volatilidade": 1.5, "tendencia": 0.02},
    "Petróleo (WTI)": {"preco_base": 82.0, "volatilidade": 2.5, "tendencia": -0.01},
    "Trigo": {"preco_base": 680.0, "volatilidade": 12.0, "tendencia": 0.05},
    "Gás Natural": {"preco_base": 2.4, "volatilidade": 0.1, "tendencia": -0.005},
    "Minério de Ferro": {"preco_base": 124.0, "volatilidade": 3.0, "tendencia": 0.03},
    "Calcário": {"preco_base": 45.0, "volatilidade": 0.8, "tendencia": 0.01},

    # NOVAS ADIÇÕES PARA DEIXAR A PLATAFORMA ROBUSTA
    "Aço Inoxidável": {"preco_base": 2100.0, "volatilidade": 45.0, "tendencia": 1.5},
    "Cobre": {"preco_base": 8500.0, "volatilidade": 120.0, "tendencia": 5.0},
    "Alumínio": {"preco_base": 2200.0, "volatilidade": 30.0, "tendencia": 0.5},
    "Lítio": {"preco_base": 13500.0, "volatilidade": 300.0, "tendencia": 15.0},
    "Soja": {"preco_base": 1200.0, "volatilidade": 15.0, "tendencia": 0.1},
    "Algodão": {"preco_base": 85.0, "volatilidade": 2.0, "tendencia": 0.05},
    "Ouro": {"preco_base": 2300.0, "volatilidade": 25.0, "tendencia": 2.0}
}

def injetar_dados():
    try:
        # Conectando ao Supabase na Nuvem
        conn = psycopg2.connect(SUPABASE_URL)
        cursor = conn.cursor()

        # Destrói a tabela antiga (se existir) para evitar conflitos
        cursor.execute("DROP TABLE IF EXISTS historico_precos;")

        # Cria a tabela nova com a estrutura exata
        cursor.execute("""
            CREATE TABLE historico_precos (
                id SERIAL PRIMARY KEY,
                material VARCHAR(100),
                data DATE,
                preco NUMERIC(10, 2)
            )
        """)
        print("Tabela criada com sucesso. A iniciar injeção em lote...")

        # Gerando dados para os últimos 365 dias
        data_final = datetime.now()
        data_inicial = data_final - timedelta(days=365)

        total_registros = 0

        for nome, config in commodities.items():
            preco_atual = config["preco_base"]

            for dia in range(365):
                data_registro = data_inicial + timedelta(days=dia)

                # Matemática para simular o mercado: Tendência + Ruído Aleatório
                mudanca_aleatoria = random.uniform(-config["volatilidade"], config["volatilidade"])
                preco_atual = preco_atual + config["tendencia"] + mudanca_aleatoria

                # Impede que o preço fique negativo
                preco_atual = max(1.0, preco_atual)

                # Inserindo no banco de dados na nuvem
                cursor.execute(
                    "INSERT INTO historico_precos (material, data, preco) VALUES (%s, %s, %s)",
                    (nome, data_registro.strftime("%Y-%m-%d"), round(preco_atual, 2))
                )
                total_registros += 1

            print(f"✅ 365 dias gerados para: {nome}")

        # Guarda as alterações
        conn.commit()
        cursor.close()
        conn.close()

        print(f"\n🚀 Sucesso! {total_registros} registos injetados no Supabase.")

    except Exception as e:
        print(f"❌ Erro ao conectar ou injetar no banco: {e}")


if __name__ == "__main__":
    injetar_dados()
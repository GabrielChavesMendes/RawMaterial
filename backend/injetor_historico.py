import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sqlalchemy import create_engine

# 1. Configuração do Banco de Dados (Use sua senha real)
STRING_CONEXAO = 'postgresql://postgres:2468@localhost:5432/rawmaterial_db'


def gerar_dados_falsos(dias=365):
    """Gera um histórico de preços simulando o mercado real."""
    dados = []

    # Define a data de hoje e volta 365 dias no passado
    data_atual = datetime.now()
    data_inicial = data_atual - timedelta(days=dias)

    # Preço base do Calcário que vimos no site (ex: R$ 85.00)
    preco_base = 85.0

    for i in range(dias):
        data_registro = data_inicial + timedelta(days=i)

        # Matemática para simular o mercado:
        # Adiciona uma leve tendência de alta ao longo do ano (i * 0.02)
        # Adiciona um "ruído" aleatório entre -2 e +2 reais (np.random.uniform)
        variacao_aleatoria = np.random.uniform(-2, 2)
        preco_simulado = preco_base + (i * 0.02) + variacao_aleatoria

        dados.append({
            'material': 'Calcário Agrícola Simulado',
            'preco_brl': round(preco_simulado, 2),  # Arredonda para 2 casas decimais
            'data_coleta': data_registro
        })

    return pd.DataFrame(dados)


def injetar_no_banco():
    print("Gerando 1 ano de histórico de preços...")
    df_historico = gerar_dados_falsos(365)

    try:
        engine = create_engine(STRING_CONEXAO)
        # Envia para a mesma tabela que criamos: 'historico_precos'
        df_historico.to_sql('historico_precos', engine, if_exists='append', index=False)
        print("Sucesso! O passado foi reescrito no PostgreSQL.")
        print(f"Foram inseridas {len(df_historico)} linhas.")
    except Exception as erro:
        print(f"Erro ao injetar no banco: {erro}")


if __name__ == "__main__":
    injetar_no_banco()
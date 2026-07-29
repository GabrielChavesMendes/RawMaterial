import pandas as pd
from sqlalchemy import create_engine
from prophet import Prophet
import matplotlib.pyplot as plt

# 1. Conexão e Leitura dos Dados
STRING_CONEXAO = 'postgresql://postgres:2468@localhost:5432/rawmaterial_db'
engine = create_engine(STRING_CONEXAO)

# Vamos buscar apenas as datas e os preços do nosso Calcário simulado
query = """
    SELECT data_coleta, preco_brl 
    FROM historico_precos 
    WHERE material = 'Calcário Agrícola Simulado' 
    ORDER BY data_coleta ASC
"""
df = pd.read_sql(query, engine)

# 2. Preparação para a IA (Evitando Bugs)
# A Regra de Ouro: Prophet só aceita colunas chamadas 'ds' (data) e 'y' (valor)
df = df.rename(columns={'data_coleta': 'ds', 'preco_brl': 'y'})

# Tratamento Anti-Bug: O PostgreSQL costuma devolver a data com fuso horário (timezone).
# O Prophet odeia isso e dá erro. Essa linha remove o fuso horário, deixando a data "limpa".
df['ds'] = pd.to_datetime(df['ds']).dt.tz_localize(None)

# 3. Treinamento do Modelo (Machine Learning)
print("Lendo o passado e treinando a IA...")
# Instanciamos o modelo. Como temos dados diários, ativamos a sazonalidade diária
modelo = Prophet(daily_seasonality=True)

# O método .fit() é onde a matemática acontece. A IA estuda a curva de preços.
modelo.fit(df)

# 4. Prevendo o Futuro
print("Desenhando a previsão para os próximos 90 dias (3 meses)...")
# Pedimos para a IA criar uma tabela vazia com as datas de hoje até 90 dias para frente
futuro = modelo.make_future_dataframe(periods=90)

# O método .predict() preenche essa tabela vazia com os preços que a IA acha que vão acontecer
previsao = modelo.predict(futuro)

# 5. Visualização (O Gráfico do Figma)
# Vamos imprimir as colunas mais importantes da previsão no terminal
# yhat = preço previsto | yhat_lower = margem mínima | yhat_upper = margem máxima
print("\n--- Resumo da Previsão ---")
print(previsao[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

# Gera o gráfico visual
fig = modelo.plot(previsao)
plt.title("Previsão de Preço - Calcário (Próximos 90 dias)")
plt.xlabel("Data (ds)")
plt.ylabel("Preço em R$ (y)")
plt.show()
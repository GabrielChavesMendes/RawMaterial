import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
from sqlalchemy import create_engine

# 1. Configurações Iniciais
URL_ALVO = "https://www.mfrural.com.br/busca/calcario"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# 2. Funções do Motor de Extração
def coletar_pagina(url):
    """Faz a requisição HTTP e retorna o conteúdo HTML puro."""
    try:
        resposta = requests.get(url, headers=HEADERS)
        resposta.raise_for_status()  # Dispara um erro se a página não existir (ex: 404)
        return resposta.text
    except requests.exceptions.RequestException as erro:

        print(f"Erro ao acessar a página: {erro}")
        return None


def extrair_precos(html):
    soup = BeautifulSoup(html, 'html.parser')
    dados_extraidos = []

    # O robô agora procura todos os <div> que contenham a palavra 'card' na classe
    cards_anuncios = soup.find_all('div', class_='card')

    for card in cards_anuncios:
        try:
            # 1. Puxando o título (procura um <h2> com a classe 'h5')
            elemento_titulo = card.find('h2', class_='h5')
            if not elemento_titulo:
                continue  # Se esse card não tiver título, pula para o próximo
            nome_produto = elemento_titulo.text.strip()

            # 2. Puxando o preço (procura um <p> com a classe 'mb-1 h6')
            elemento_preco_p = card.find('p', class_='mb-1 h6')
            if not elemento_preco_p:
                continue

            # O valor real está dentro da tag <strong> dentro do <p>
            elemento_strong = elemento_preco_p.find('strong')
            if not elemento_strong:
                continue

            preco_texto = elemento_strong.text.strip()

            # Limpeza do texto: "R$ 82,65" vira o número 82.65
            preco_limpo = preco_texto.replace('R$', '').replace('.', '').replace(',', '.').strip()

            # Salva no formato perfeito para o nosso futuro banco de dados
            dados_extraidos.append({
                'material': nome_produto,
                'preco_brl': float(preco_limpo),
                'data_coleta': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })

        except Exception as erro:
            print(f"Erro ao ler um card específico: {erro}")
            continue

    return dados_extraidos


def salvar_dados(dados):
    """Converte para um Dataframe e envia para o PostgreSQL."""
    if not dados:
        print("Nenhum dado encontrado para salvar.")
        return

    df = pd.DataFrame(dados)

    # ==========================================
    # CONEXÃO COM O BANCO DE DADOS
    # ==========================================
    # Substitua 'postgres' e 'sua_senha_aqui' pelo seu usuário e senha reais do pgAdmin
    # Formato: postgresql://usuario:senha@localhost:5432/nome_do_banco
    string_conexao = 'postgresql://postgres:2468@localhost:5432/rawmaterial_db'

    try:
        engine = create_engine(string_conexao)

        # O pulo do gato: o pandas joga tudo na tabela 'historico_precos' de uma vez
        # if_exists='append' garante que ele vai adicionar as novas cotações sem apagar as de ontem
        df.to_sql('historico_precos', engine, if_exists='append', index=False)

        print("Sucesso! Dados salvos diretamente no banco PostgreSQL.")
        print("-" * 30)
        print(df.head())

    except Exception as erro:
        print(f"Erro ao conectar ou salvar no banco de dados: {erro}")

# 3. Fluxo Principal (O Controlador)
if __name__ == "__main__":
    print(f"Iniciando o extrator para a URL: {URL_ALVO}...\n")
    html_puro = coletar_pagina(URL_ALVO)
    if html_puro:
        print("Página carregada. Analisando a estrutura HTML...")
        dados_estruturados = extrair_precos(html_puro)
        salvar_dados(dados_estruturados)
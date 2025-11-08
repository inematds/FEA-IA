# Projeto 01 — ChatPDF (RAG com LangChain)

Este projeto implementa um ChatPDF simples usando RAG (Retrieval-Augmented Generation) com LangChain: você fornece um ou mais PDFs, o sistema indexa o conteúdo em um vetor store local e responde perguntas citando as fontes.

## Requisitos
- Python 3.10+
- Chave de API da OpenAI em `OPENAI_API_KEY` (ou ajuste o provedor no código)

Instalação das dependências:

```
pip install -r requirements.txt
```

## Uso rápido

Indexar PDFs e perguntar:

```
python app.py --pdf caminho/arquivo1.pdf caminho/arquivo2.pdf --query "Qual é o objetivo principal do documento?"
```

Reutilizar índice já criado (persistência em `./.chroma`):

```
python app.py --reuse --query "Liste os 3 pontos-chave com referência às páginas."
```

Parâmetros úteis:
- `--pdf` Um ou mais caminhos de PDFs para indexar
- `--persist` Diretório de persistência (padrão: `./.chroma`)
- `--reuse` Reutiliza índice existente sem reprocessar PDFs
- `--k` Número de documentos recuperados (padrão: 4)
- `--model` Modelo da OpenAI para respostas (padrão: `gpt-4o-mini`)
- `--embed` Modelo de embedding (padrão: `text-embedding-3-small`)

## Estrutura
- `app.py` — CLI para indexação e perguntas
- `requirements.txt` — dependências

## Notas
- Para uso sem OpenAI, você pode adaptar para Ollama (langchain-community) trocando o LLM/Embeddings.
- O índice usa ChromaDB em disco; apague a pasta de persistência para reindexar do zero.


# Módulo 3: Frameworks de Desenvolvimento - LangChain

**Duração:** 10 horas | **Nível:** Intermediário

> **Frase-guia:** "Não construa do zero. Orquestre o que já existe."

---

![Capa do Módulo 3](../../../imagens-conceituais/modulo3_langchain.png)

## Ato 2: A Construção

> "Você aprendeu a falar com a IA. Agora, você vai dar a ela mãos para agir e uma mente para lembrar. Este é o momento em que passamos de meros conversadores a verdadeiros construtores de aplicações. Com LangChain, você não está mais limitado a uma única interação; você está construindo sistemas inteligentes e persistentes."

Bem-vindo à oficina do Engenheiro de Agentes. Se os LLMs são o motor e os prompts são o volante, **LangChain é o chassi, o sistema de transmissão e todo o conjunto** que transforma um motor potente em um veículo funcional.

Este framework de código aberto nos dá os blocos de construção para criar aplicações de IA que vão muito além de um simples chatbot. Vamos aprender a:
- **Dar memória** aos nossos agentes
- **Conectá-los a fontes de dados externas**
- **Criar cadeias de raciocínio complexas**
- **Orquestrar múltiplos modelos e ferramentas**

---

## Capítulo 3.1: A Arquitetura LangChain

### O Problema que LangChain Resolve

Imagine que você precisa construir um assistente de IA que:
1. Responde perguntas sobre documentos da sua empresa
2. Lembra conversas anteriores
3. Pode buscar informações na web quando necessário
4. Consulta um banco de dados SQL
5. Envia emails automaticamente

Sem um framework, você teria que:
- Escrever código personalizado para cada integração
- Gerenciar manualmente o estado e a memória
- Implementar lógica complexa de orquestração
- Lidar com diferentes formatos de API
- Debugar fluxos de dados entre componentes

**LangChain abstrai toda essa complexidade.**

### Filosofia de Design

LangChain segue princípios fundamentais:

1. **Modularidade:** Cada componente é independente e intercambiável
2. **Composabilidade:** Componentes simples se combinam para criar sistemas complexos
3. **Abstração:** Interfaces unificadas para diferentes provedores e serviços
4. **Extensibilidade:** Fácil criar componentes customizados

### Os 6 Pilares da Arquitetura LangChain

```
┌─────────────────────────────────────────────────────┐
│                    APLICAÇÃO                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐  ┌─────────┐  ┌────────┐  ┌────────┐│
│  │  Models  │  │ Prompts │  │ Chains │  │ Agents ││
│  └──────────┘  └─────────┘  └────────┘  └────────┘│
│                                                     │
│  ┌──────────┐  ┌─────────────────────────────────┐ │
│  │  Memory  │  │         Tools                   │ │
│  └──────────┘  └─────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 1. **Models (Modelos)**
Interface unificada para diferentes LLMs:

```python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_community.llms import Ollama

# Todos usam a mesma interface!
llm_openai = ChatOpenAI(model="gpt-4")
llm_claude = ChatAnthropic(model="claude-3-sonnet")
llm_local = Ollama(model="llama3")

# Trocar de modelo = trocar 1 linha de código
```

**Tipos de modelos suportados:**
- **Chat Models:** Conversacional (ChatGPT, Claude, etc.)
- **LLMs:** Completion-style (GPT-3, etc.)
- **Text Embedding Models:** Para criar vetores
- **Multimodal Models:** Visão + Texto

#### 2. **Prompts**
Gerenciamento avançado de prompts:

```python
from langchain.prompts import PromptTemplate, ChatPromptTemplate

# Template simples
template = PromptTemplate(
    input_variables=["produto", "publico"],
    template="""
    Crie um slogan de marketing para {produto}
    direcionado a {publico}.
    """
)

# Chat template (com papéis)
chat_template = ChatPromptTemplate.from_messages([
    ("system", "Você é um especialista em {dominio}"),
    ("human", "{pergunta}"),
    ("ai", "{resposta_parcial}"),
    ("human", "Continue...")
])
```

**Recursos avançados:**
- Few-shot example selectors
- Conditional prompting
- Prompt composition
- Versioning e A/B testing

#### 3. **Chains**
Sequências de operações:

```python
from langchain.chains import LLMChain

chain = LLMChain(
    llm=llm,
    prompt=template
)

resultado = chain.run(
    produto="Tênis de corrida",
    publico="atletas profissionais"
)
```

**Tipos de Chains:**
- `LLMChain`: Chain básica (LLM + Prompt)
- `SequentialChain`: Encadeia múltiplas chains
- `TransformChain`: Transforma dados entre chains
- `RouterChain`: Direciona para chains específicas
- `MapReduceChain`: Processa documentos em paralelo

#### 4. **Agents**
LLM como motor de decisão:

```python
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool

tools = [
    Tool(
        name="Calculator",
        func=calculator_function,
        description="Útil para cálculos matemáticos"
    ),
    Tool(
        name="Search",
        func=search_function,
        description="Busca informações na web"
    )
]

agent = create_react_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

executor.invoke({"input": "Qual é a raiz quadrada de 144?"})
```

#### 5. **Memory**
Memória conversacional:

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()

# Armazena automaticamente histórico
memory.save_context(
    {"input": "Oi, meu nome é João"},
    {"output": "Olá João! Como posso ajudar?"}
)

# Recupera contexto
memory.load_memory_variables({})
# {'history': 'Human: Oi, meu nome é João\nAI: Olá João!...'}
```

**Tipos de Memory:**
- `ConversationBufferMemory`: Guarda tudo
- `ConversationBufferWindowMemory`: Últimas N mensagens
- `ConversationSummaryMemory`: Resume conversas longas
- `ConversationKGMemory`: Extrai knowledge graph

#### 6. **Tools**
Conexão com o mundo externo:

```python
from langchain.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper

wikipedia = WikipediaQueryRun(
    api_wrapper=WikipediaAPIWrapper()
)

resultado = wikipedia.run("Inteligência Artificial")
```

**Categorias de Tools:**
- **Search:** Google, Bing, DuckDuckGo
- **APIs:** Weather, News, Finance
- **Databases:** SQL, MongoDB, Redis
- **Files:** PDF, CSV, JSON
- **Custom:** Suas próprias funções

---

## Capítulo 3.2: Chains - Construindo Pipelines Inteligentes

### LLMChain: A Fundação

A `LLMChain` é o building block mais básico:

```python
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# 1. Definir o modelo
llm = ChatOpenAI(temperature=0.7)

# 2. Criar template de prompt
prompt = PromptTemplate(
    input_variables=["tema", "tom"],
    template="""
    Escreva um parágrafo sobre {tema}.
    Tom: {tom}
    """
)

# 3. Criar a chain
chain = LLMChain(llm=llm, prompt=prompt)

# 4. Executar
resultado = chain.invoke({
    "tema": "inteligência artificial",
    "tom": "inspirador"
})

print(resultado['text'])
```

### SequentialChain: Workflows Multi-Etapa

Crie pipelines complexos onde a saída de uma chain alimenta a próxima:

```python
from langchain.chains import SequentialChain

# Chain 1: Gerar ideia de produto
chain_ideia = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["categoria"],
        template="Sugira um nome criativo para um produto na categoria: {categoria}"
    ),
    output_key="nome_produto"
)

# Chain 2: Criar descrição
chain_descricao = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["nome_produto"],
        template="Escreva uma descrição de marketing para: {nome_produto}"
    ),
    output_key="descricao"
)

# Chain 3: Gerar slogan
chain_slogan = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["nome_produto", "descricao"],
        template="""
        Baseado no produto {nome_produto} e sua descrição:
        {descricao}

        Crie um slogan memorável (máximo 7 palavras).
        """
    ),
    output_key="slogan"
)

# Combinar em sequência
pipeline_marketing = SequentialChain(
    chains=[chain_ideia, chain_descricao, chain_slogan],
    input_variables=["categoria"],
    output_variables=["nome_produto", "descricao", "slogan"],
    verbose=True
)

# Executar pipeline completo
resultado = pipeline_marketing.invoke({"categoria": "fitness wearables"})

print(f"Produto: {resultado['nome_produto']}")
print(f"Descrição: {resultado['descricao']}")
print(f"Slogan: {resultado['slogan']}")
```

**Saída exemplo:**
```
Produto: FitPulse Pro
Descrição: O FitPulse Pro é o smartwatch definitivo para atletas...
Slogan: Seu batimento, sua vitória
```

### RouterChain: Decisões Dinâmicas

Direcione para chains diferentes baseado no input:

```python
from langchain.chains.router import MultiPromptChain
from langchain.chains.router.llm_router import LLMRouterChain, RouterOutputParser
from langchain.prompts import PromptTemplate

# Definir chains especializadas
chains = {
    "matematica": LLMChain(
        llm=llm,
        prompt=PromptTemplate(
            template="Resolva este problema matemático: {input}",
            input_variables=["input"]
        )
    ),
    "codigo": LLMChain(
        llm=llm,
        prompt=PromptTemplate(
            template="Explique este código: {input}",
            input_variables=["input"]
        )
    ),
    "geral": LLMChain(
        llm=llm,
        prompt=PromptTemplate(
            template="Responda: {input}",
            input_variables=["input"]
        )
    )
}

# Descrições para o router decidir
chain_descriptions = [
    {
        "name": "matematica",
        "description": "Bom para resolver problemas matemáticos e cálculos"
    },
    {
        "name": "codigo",
        "description": "Bom para explicar código e conceitos de programação"
    },
    {
        "name": "geral",
        "description": "Bom para perguntas gerais"
    }
]

# Criar router
router_chain = MultiPromptChain.from_prompts(
    llm=llm,
    destination_chains=chains,
    destinations=chain_descriptions,
    default_chain=chains["geral"]
)

# Teste
print(router_chain.run("Qual é 25 * 17?"))  # → matematica
print(router_chain.run("def factorial(n): ..."))  # → codigo
print(router_chain.run("Qual a capital da França?"))  # → geral
```

### TransformChain: Processamento de Dados

Transforme dados entre chains:

```python
from langchain.chains import TransformChain

def extrair_palavras_chave(inputs: dict) -> dict:
    texto = inputs["texto"]
    # Lógica customizada
    palavras = texto.lower().split()
    freq = {}
    for palavra in palavras:
        if len(palavra) > 4:
            freq[palavra] = freq.get(palavra, 0) + 1

    top_palavras = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:5]
    return {"palavras_chave": [p[0] for p in top_palavras]}

transform_chain = TransformChain(
    input_variables=["texto"],
    output_variables=["palavras_chave"],
    transform=extrair_palavras_chave
)

# Usar em pipeline
resultado = transform_chain.invoke({
    "texto": "Inteligência artificial está revolucionando..."
})
```

---

## Capítulo 3.3: RAG (Retrieval-Augmented Generation)

### O Problema do Conhecimento Limitado

LLMs têm três limitações fundamentais:

1. **Conhecimento Datado:** Treinados até uma data de corte
2. **Sem Dados Privados:** Não conhecem seus documentos internos
3. **Alucinações:** Podem inventar informações

**RAG resolve todos esses problemas.**

### Arquitetura RAG Completa

```
┌─────────────────────────────────────────────────────────┐
│                  FASE 1: INDEXAÇÃO                      │
│  (Executada uma vez ou periodicamente)                  │
└─────────────────────────────────────────────────────────┘

Documentos → Document Loader → Text Splitter → Embedding Model
    ↓                               ↓                ↓
  PDFs                          Chunks            Vetores
  TXTs                       (pedaços)          [0.1, 0.5,...]
  URLs                                              ↓
                                            Vector Database
                                            (Chroma, FAISS)

┌─────────────────────────────────────────────────────────┐
│                  FASE 2: RECUPERAÇÃO                    │
│  (Executada a cada pergunta)                            │
└─────────────────────────────────────────────────────────┘

Pergunta do Usuário → Embedding Model → Busca Semântica
      ↓                     ↓                   ↓
  "Qual garantia?"      [0.2, 0.4,...]   Top K chunks
                                         relevantes

┌─────────────────────────────────────────────────────────┐
│                   FASE 3: GERAÇÃO                       │
│  (Executada a cada pergunta)                            │
└─────────────────────────────────────────────────────────┘

Pergunta + Chunks Relevantes → LLM → Resposta Final
                 ↓
        Context-aware prompt
```

### Implementação Completa: ChatPDF

#### Passo 1: Document Loading

```python
from langchain_community.document_loaders import PyPDFLoader, TextLoader, WebBaseLoader

# Carregar PDF
loader_pdf = PyPDFLoader("manual_produto.pdf")
documentos_pdf = loader_pdf.load()

# Carregar de URL
loader_web = WebBaseLoader("https://docs.empresa.com")
documentos_web = loader_web.load()

# Carregar múltiplos arquivos
from langchain_community.document_loaders import DirectoryLoader

loader = DirectoryLoader(
    "docs/",
    glob="**/*.pdf",
    loader_cls=PyPDFLoader
)
todos_docs = loader.load()

print(f"Carregados {len(todos_docs)} documentos")
```

#### Passo 2: Text Splitting

Documentos precisam ser divididos em chunks para:
- Caber no contexto do LLM
- Melhorar precisão da busca semântica
- Otimizar performance

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # Tamanho de cada chunk
    chunk_overlap=200,      # Overlap entre chunks (continuidade)
    length_function=len,
    separators=["\n\n", "\n", " ", ""]  # Tenta quebrar em parágrafos primeiro
)

chunks = text_splitter.split_documents(todos_docs)

print(f"Documentos divididos em {len(chunks)} chunks")
print(f"Exemplo de chunk:\n{chunks[0].page_content[:200]}...")
```

**Estratégias avançadas de splitting:**

```python
# 1. Markdown-aware splitting
from langchain.text_splitter import MarkdownTextSplitter

md_splitter = MarkdownTextSplitter(
    chunk_size=1000,
    chunk_overlap=100
)

# 2. Code-aware splitting
from langchain.text_splitter import Language, RecursiveCharacterTextSplitter

python_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PYTHON,
    chunk_size=500
)

# 3. Semantic splitting (baseado em significado)
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings

semantic_splitter = SemanticChunker(
    OpenAIEmbeddings(),
    breakpoint_threshold_type="percentile"
)
```

#### Passo 3: Embeddings

```python
from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings

# Opção 1: OpenAI (pago, alta qualidade)
embeddings_openai = OpenAIEmbeddings(
    model="text-embedding-3-small"
)

# Opção 2: Open-source (gratuito)
embeddings_hf = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Testar embedding
vetor = embeddings_openai.embed_query("Qual é a garantia?")
print(f"Dimensões do vetor: {len(vetor)}")
print(f"Primeiros valores: {vetor[:5]}")
```

#### Passo 4: Vector Store

```python
from langchain_community.vectorstores import FAISS, Chroma

# Opção 1: FAISS (local, rápido, sem dependências)
vectorstore_faiss = FAISS.from_documents(
    documents=chunks,
    embedding=embeddings_openai
)

# Salvar para uso posterior
vectorstore_faiss.save_local("vectorstore_local")

# Carregar
vectorstore_carregado = FAISS.load_local(
    "vectorstore_local",
    embeddings_openai,
    allow_dangerous_deserialization=True
)

# Opção 2: Chroma (persistent, com metadados)
vectorstore_chroma = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings_openai,
    persist_directory="./chroma_db"
)

# Opção 3: Pinecone (cloud, escalável)
# from langchain_community.vectorstores import Pinecone
# import pinecone
#
# pinecone.init(api_key="...", environment="...")
# vectorstore_pinecone = Pinecone.from_documents(
#     chunks, embeddings_openai, index_name="meu-indice"
# )
```

#### Passo 5: Retrieval

```python
# Busca simples por similaridade
query = "Qual é a política de devolução?"
docs_relevantes = vectorstore_faiss.similarity_search(
    query,
    k=4  # Top 4 resultados mais relevantes
)

for i, doc in enumerate(docs_relevantes):
    print(f"\n--- Documento {i+1} ---")
    print(doc.page_content[:200])
    print(f"Metadados: {doc.metadata}")

# Busca com score de similaridade
docs_com_score = vectorstore_faiss.similarity_search_with_score(
    query,
    k=4
)

for doc, score in docs_com_score:
    print(f"Score: {score:.4f} | {doc.page_content[:100]}...")
```

**Estratégias avançadas de retrieval:**

```python
# 1. MMR (Maximum Marginal Relevance) - diversidade
docs_mmr = vectorstore_faiss.max_marginal_relevance_search(
    query,
    k=4,
    fetch_k=20,  # Busca 20, retorna 4 diversos
    lambda_mult=0.5  # Balancear relevância vs diversidade
)

# 2. Filtros de metadados
docs_filtrados = vectorstore_chroma.similarity_search(
    query,
    k=4,
    filter={"source": "manual_v2.pdf"}
)

# 3. Retriever com threshold
retriever = vectorstore_faiss.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={
        "score_threshold": 0.7,
        "k": 4
    }
)
```

#### Passo 6: Geração com Contexto

```python
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4", temperature=0)

# Criar chain RAG completa
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",  # Como combinar documentos
    retriever=vectorstore_faiss.as_retriever(search_kwargs={"k": 3}),
    return_source_documents=True,  # Retornar fontes
    verbose=True
)

# Fazer pergunta
pergunta = "Qual é o período de garantia do produto X?"
resultado = qa_chain.invoke({"query": pergunta})

print(f"Pergunta: {pergunta}")
print(f"\nResposta: {resultado['result']}")
print(f"\nFontes utilizadas:")
for doc in resultado['source_documents']:
    print(f"- {doc.metadata['source']}, página {doc.metadata.get('page', 'N/A')}")
```

**Chain Types explicados:**

```python
# 1. "stuff" - Coloca tudo em um prompt (melhor para poucos docs)
qa_stuff = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever
)

# 2. "map_reduce" - Processa docs em paralelo, depois combina
qa_mapreduce = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="map_reduce",
    retriever=retriever
)

# 3. "refine" - Processa docs sequencialmente, refinando resposta
qa_refine = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="refine",
    retriever=retriever
)

# 4. "map_rerank" - Pontua cada doc, escolhe melhor resposta
qa_rerank = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="map_rerank",
    retriever=retriever
)
```

### RAG Conversacional (com memória)

```python
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# Criar memória
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True,
    output_key="answer"
)

# Chain conversacional
conversational_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vectorstore_faiss.as_retriever(),
    memory=memory,
    return_source_documents=True
)

# Conversa multi-turn
perguntas = [
    "Qual é a garantia do produto?",
    "E se eu quiser estender ela?",  # Usa contexto anterior
    "Quanto custa?"  # Ainda referencia "garantia estendida"
]

for pergunta in perguntas:
    resultado = conversational_chain.invoke({"question": pergunta})
    print(f"\nQ: {pergunta}")
    print(f"A: {resultado['answer']}")
```

---

## Capítulo 3.4: Agentes LangChain - Inteligência Autônoma

### Do Scripted ao Autônomo

**Chains** são como seguir uma receita:
- Passo 1: Faça X
- Passo 2: Faça Y
- Passo 3: Faça Z

**Agents** são como ter um chef que decide:
- Qual receita seguir
- Que ingredientes usar
- Quando improvisar

### O Padrão ReAct (Reason + Act)

```
┌─────────────────────────────────────────────┐
│         CICLO DO AGENTE REACT               │
└─────────────────────────────────────────────┘

1. THOUGHT (Pensamento)
   "Preciso saber o clima atual em São Paulo"
   ↓
2. ACTION (Ação)
   Tool: weather_api
   ↓
3. ACTION INPUT (Entrada)
   Input: "São Paulo, Brasil"
   ↓
4. OBSERVATION (Observação)
   Result: "25°C, ensolarado"
   ↓
5. THOUGHT (Pensamento)
   "Agora tenho a informação, posso responder"
   ↓
6. FINAL ANSWER (Resposta Final)
   "O clima em São Paulo está 25°C e ensolarado"
```

### Criando Seu Primeiro Agente

#### Passo 1: Definir Tools

```python
from langchain.tools import Tool
from langchain_community.utilities import WikipediaAPIWrapper
import requests

# Tool 1: Wikipedia
wikipedia = WikipediaAPIWrapper()
tool_wikipedia = Tool(
    name="Wikipedia",
    func=wikipedia.run,
    description="""
    Útil para buscar informações factuais sobre pessoas, lugares,
    eventos históricos, etc. Input deve ser uma pergunta ou termo
    de busca em português.
    """
)

# Tool 2: Calculadora
def calculadora(expression: str) -> str:
    """Avalia expressões matemáticas"""
    try:
        return str(eval(expression))
    except Exception as e:
        return f"Erro: {str(e)}"

tool_calc = Tool(
    name="Calculadora",
    func=calculadora,
    description="""
    Útil para fazer cálculos matemáticos. Input deve ser uma
    expressão matemática válida em Python (ex: '2 + 2', '10 ** 3').
    """
)

# Tool 3: Busca na Web (exemplo com DuckDuckGo)
from langchain_community.tools import DuckDuckGoSearchRun

search = DuckDuckGoSearchRun()
tool_search = Tool(
    name="WebSearch",
    func=search.run,
    description="""
    Útil para buscar informações atualizadas na internet.
    Use quando precisar de notícias recentes, dados atuais,
    ou informações que não estão na Wikipedia.
    """
)

tools = [tool_wikipedia, tool_calc, tool_search]
```

#### Passo 2: Criar o Agente

```python
from langchain.agents import create_react_agent, AgentExecutor
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

llm = ChatOpenAI(model="gpt-4", temperature=0)

# Prompt do agente ReAct
react_prompt = PromptTemplate.from_template("""
Responda à seguinte pergunta o melhor que puder. Você tem acesso às seguintes ferramentas:

{tools}

Use o seguinte formato:

Question: a pergunta de entrada que você deve responder
Thought: você deve sempre pensar sobre o que fazer
Action: a ação a tomar, deve ser uma de [{tool_names}]
Action Input: a entrada para a ação
Observation: o resultado da ação
... (este Thought/Action/Action Input/Observation pode se repetir N vezes)
Thought: Agora eu sei a resposta final
Final Answer: a resposta final para a pergunta original

Comece!

Question: {input}
Thought: {agent_scratchpad}
""")

# Criar agente
agent = create_react_agent(
    llm=llm,
    tools=tools,
    prompt=react_prompt
)

# Executor (gerencia execução)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,  # Mostra raciocínio
    max_iterations=10,  # Limite de segurança
    handle_parsing_errors=True
)
```

#### Passo 3: Executar o Agente

```python
# Teste 1: Requer Wikipedia
resposta1 = agent_executor.invoke({
    "input": "Quem foi Albert Einstein e em que ano nasceu?"
})
print(resposta1['output'])

# Teste 2: Requer Calculadora
resposta2 = agent_executor.invoke({
    "input": "Qual é a raiz quadrada de 12345?"
})
print(resposta2['output'])

# Teste 3: Requer múltiplas tools
resposta3 = agent_executor.invoke({
    "input": """
    O PIB do Brasil em 2023 foi de 10.9 trilhões de reais.
    Se dividirmos isso pela população de 215 milhões,
    quanto é o PIB per capita em reais?
    """
})
print(resposta3['output'])
# Agente vai: buscar confirmação do PIB → calcular divisão → responder
```

**Exemplo de saída (verbose=True):**

```
> Entering new AgentExecutor chain...

Question: Qual é a raiz quadrada de 12345?

Thought: Preciso calcular a raiz quadrada de um número.
Action: Calculadora
Action Input: 12345 ** 0.5
Observation: 111.1081249402829

Thought: Agora eu sei a resposta final.
Final Answer: A raiz quadrada de 12345 é aproximadamente 111.11.

> Finished chain.
```

### Tipos de Agentes no LangChain

#### 1. Zero-Shot ReAct Agent

```python
from langchain.agents import create_react_agent

# Decide ferramentas baseado apenas em descrições
agent_zero_shot = create_react_agent(
    llm=llm,
    tools=tools,
    prompt=react_prompt
)
```

#### 2. Conversational Agent (com memória)

```python
from langchain.agents import create_conversational_agent
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

conversational_agent = create_conversational_agent(
    llm=llm,
    tools=tools,
    memory=memory,
    verbose=True
)

# Agora mantém contexto entre perguntas
executor = AgentExecutor(agent=conversational_agent, tools=tools)

executor.invoke({"input": "Pesquise sobre Python"})
executor.invoke({"input": "E quanto a performance?"})  # Lembra que é sobre Python
```

#### 3. OpenAI Functions Agent

```python
from langchain.agents import create_openai_functions_agent

# Usa function calling nativo do GPT-4
functions_agent = create_openai_functions_agent(
    llm=llm,
    tools=tools,
    prompt=react_prompt
)

# Mais confiável e menos propenso a erros de parsing
```

#### 4. Structured Tool Agent

```python
from langchain.tools import StructuredTool
from pydantic import BaseModel, Field

class CalculatorInput(BaseModel):
    a: float = Field(description="Primeiro número")
    b: float = Field(description="Segundo número")
    operation: str = Field(description="Operação: add, sub, mul, div")

def structured_calculator(a: float, b: float, operation: str) -> str:
    ops = {
        "add": a + b,
        "sub": a - b,
        "mul": a * b,
        "div": a / b if b != 0 else "Erro: divisão por zero"
    }
    return str(ops.get(operation, "Operação inválida"))

structured_tool = StructuredTool.from_function(
    func=structured_calculator,
    name="StructuredCalculator",
    description="Calculadora com operações estruturadas",
    args_schema=CalculatorInput
)

# Agente entende estrutura complexa de inputs
```

### Criando Tools Customizadas

#### Tool Simples (função)

```python
@tool
def consultar_estoque(produto: str) -> str:
    """
    Consulta estoque de um produto no sistema.
    Args:
        produto: Nome do produto a consultar
    """
    # Simular consulta ao banco
    estoque_db = {
        "notebook": 15,
        "mouse": 50,
        "teclado": 30
    }
    quantidade = estoque_db.get(produto.lower(), 0)
    return f"Estoque de {produto}: {quantidade} unidades"

tools.append(consultar_estoque)
```

#### Tool com API Externa

```python
from langchain.tools import tool
import requests

@tool
def buscar_cep(cep: str) -> str:
    """
    Busca endereço a partir do CEP brasileiro.
    Args:
        cep: CEP no formato 12345-678 ou 12345678
    """
    cep_limpo = cep.replace("-", "")
    response = requests.get(f"https://viacep.com.br/ws/{cep_limpo}/json/")

    if response.status_code == 200:
        data = response.json()
        if "erro" not in data:
            return f"""
            Endereço:
            {data['logradouro']}, {data['bairro']}
            {data['localidade']} - {data['uf']}
            """
    return "CEP não encontrado"
```

#### Tool com Banco de Dados

```python
from langchain_community.utilities import SQLDatabase
from langchain.tools import QuerySQLDatabaseTool

# Conectar ao banco
db = SQLDatabase.from_uri("sqlite:///empresa.db")

# Tool de consulta SQL
tool_sql = QuerySQLDatabaseTool(db=db)

# Ou criar tool customizada
@tool
def consultar_vendas(mes: str) -> str:
    """
    Retorna total de vendas de um mês.
    Args:
        mes: Mês no formato 'YYYY-MM'
    """
    query = f"""
    SELECT SUM(valor) as total
    FROM vendas
    WHERE strftime('%Y-%m', data) = '{mes}'
    """
    result = db.run(query)
    return f"Total de vendas em {mes}: R$ {result}"
```

### Agentes Multi-Tool Avançados

```python
from langchain.agents import initialize_agent, AgentType

# Conjunto completo de tools
all_tools = [
    tool_wikipedia,
    tool_calc,
    tool_search,
    consultar_estoque,
    buscar_cep,
    consultar_vendas
]

# Agente com todas as capacidades
super_agent = initialize_agent(
    tools=all_tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True,
    max_iterations=15,
    early_stopping_method="generate"  # Para se não progrediu
)

# Teste complexo
resposta = super_agent.invoke({
    "input": """
    Faça uma análise completa:
    1. Pesquise sobre o mercado de eletrônicos no Brasil
    2. Consulte nosso estoque de notebooks
    3. Calcule quantos notebooks precisamos comprar se queremos
       aumentar o estoque em 50%
    4. Forneça um resumo executivo
    """
})
```

---

## Capítulo 3.5: Memory - Dando Memória aos Agentes

### Por Que Memória é Crucial

LLMs são **stateless** por padrão - cada chamada é independente. Memória permite:
- Conversas naturais multi-turn
- Personalização baseada em histórico
- Contexto acumulado
- Aprendizado de preferências

### Tipos de Memory no LangChain

#### 1. ConversationBufferMemory (Memória Completa)

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()

# Salvar interações
memory.save_context(
    {"input": "Olá! Meu nome é Ana"},
    {"output": "Olá Ana! Como posso ajudar?"}
)

memory.save_context(
    {"input": "Preciso de ajuda com Python"},
    {"output": "Claro! Qual sua dúvida sobre Python?"}
)

# Recuperar histórico completo
print(memory.load_memory_variables({}))
```

**Saída:**
```
{
  'history': 'Human: Olá! Meu nome é Ana\nAI: Olá Ana! Como posso ajudar?\nHuman: Preciso de ajuda com Python\nAI: Claro! Qual sua dúvida sobre Python?'
}
```

**Usar com Chain:**

```python
from langchain.chains import ConversationChain

conversation = ConversationChain(
    llm=llm,
    memory=ConversationBufferMemory(),
    verbose=True
)

conversation.predict(input="Oi, sou João")
conversation.predict(input="Qual é meu nome?")  # Vai lembrar: João
```

#### 2. ConversationBufferWindowMemory (Janela Deslizante)

```python
from langchain.memory import ConversationBufferWindowMemory

# Mantém apenas últimas K interações
memory_window = ConversationBufferWindowMemory(k=3)

# Depois de 10 interações, só lembra as 3 últimas
```

**Quando usar:**
- Conversas longas
- Limitar custos de tokens
- Focar em contexto recente

#### 3. ConversationSummaryMemory (Resumo Inteligente)

```python
from langchain.memory import ConversationSummaryMemory

# Resume conversas longas
memory_summary = ConversationSummaryMemory(llm=llm)

memory_summary.save_context(
    {"input": "Quero comprar um notebook para programação"},
    {"output": "Recomendo um com pelo menos 16GB RAM e SSD"}
)

memory_summary.save_context(
    {"input": "Qual processador você recomenda?"},
    {"output": "Intel i7 ou AMD Ryzen 7 são ótimas opções"}
)

# Em vez de guardar tudo, cria resumo
print(memory_summary.load_memory_variables({}))
```

**Saída:**
```
{
  'history': 'O usuário está interessado em comprar um notebook para programação. Recomendei especificações mínimas de 16GB RAM, SSD, e processadores Intel i7 ou AMD Ryzen 7.'
}
```

#### 4. ConversationSummaryBufferMemory (Híbrido)

```python
from langchain.memory import ConversationSummaryBufferMemory

# Resume antigas, mantém recentes completas
memory_hybrid = ConversationSummaryBufferMemory(
    llm=llm,
    max_token_limit=500  # Limite antes de resumir
)
```

#### 5. ConversationKGMemory (Knowledge Graph)

```python
from langchain.memory import ConversationKGMemory

# Extrai relações entre entidades
memory_kg = ConversationKGMemory(llm=llm)

memory_kg.save_context(
    {"input": "João mora em São Paulo"},
    {"output": "Entendi"}
)

memory_kg.save_context(
    {"input": "Ele trabalha na Google"},
    {"output": "Anotado"}
)

# Cria grafo: João --mora_em--> São Paulo
#             João --trabalha_em--> Google
```

### Memory Persistente (Banco de Dados)

```python
from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_message_histories import RedisChatMessageHistory

# Salvar em Redis
message_history = RedisChatMessageHistory(
    url="redis://localhost:6379/0",
    session_id="user_123"
)

memory_redis = ConversationBufferMemory(
    chat_memory=message_history
)

# Ou SQLite
from langchain.memory.chat_message_histories import SQLChatMessageHistory

sql_history = SQLChatMessageHistory(
    session_id="user_123",
    connection_string="sqlite:///chat_history.db"
)

memory_sql = ConversationBufferMemory(chat_memory=sql_history)
```

### Memory com Agentes

```python
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

agent_with_memory = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

# Conversa com contexto
agent_with_memory.invoke({"input": "Meu nome é Carlos e gosto de futebol"})
agent_with_memory.invoke({"input": "Qual meu esporte favorito?"})  # Lembra!
agent_with_memory.invoke({"input": "E meu nome?"})  # Também lembra!
```

---

## Capítulo 3.6: Integrações e Ecosystem

### Document Loaders (60+ tipos)

```python
# PDFs
from langchain_community.document_loaders import PyPDFLoader, PDFMinerLoader

# Web
from langchain_community.document_loaders import WebBaseLoader, SeleniumURLLoader

# Office
from langchain_community.document_loaders import UnstructuredWordDocumentLoader, UnstructuredExcelLoader

# Código
from langchain_community.document_loaders import GitLoader, NotebookLoader

# Databases
from langchain_community.document_loaders import DataFrameLoader, SQLDatabaseLoader

# APIs
from langchain_community.document_loaders import GoogleDriveLoader, NotionDBLoader
```

### Vector Stores (50+ opções)

```python
# Local
from langchain_community.vectorstores import FAISS, Chroma, DocArrayInMemorySearch

# Cloud
from langchain_community.vectorstores import Pinecone, Weaviate, Qdrant

# Databases
from langchain_community.vectorstores import PGVector, Redis, ElasticsearchStore
```

### LLM Providers

```python
# Proprietários
from langchain_openai import ChatOpenAI, OpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI

# Open-source
from langchain_community.llms import Ollama, HuggingFaceHub, LlamaCpp

# Self-hosted
from langchain_community.llms import HuggingFacePipeline
```

---

## 📝 Resumo Gráfico do Módulo 3

### Conceitos-Chave

**LangChain = Framework de Orquestração**
- Modularidade + Composabilidade
- Abstração de complexidade
- Ecosystem rico

**6 Pilares:**
1. Models (LLMs)
2. Prompts (Templates)
3. Chains (Pipelines)
4. Agents (Autonomia)
5. Memory (Contexto)
6. Tools (Conexões externas)

**RAG (Retrieval-Augmented Generation):**
- Indexação → Embedding → VectorDB
- Retrieval → Busca semântica
- Generation → LLM com contexto

**Agents:**
- ReAct (Reason + Act)
- Tools customizadas
- Decisões autônomas

---

## 🚀 Projeto Prático do Módulo 3

### Desafio: ChatPDF Completo com Interface Web

**Objetivo:** Construir uma aplicação completa de RAG que permite:
1. Upload de múltiplos PDFs
2. Processamento e indexação automática
3. Chat conversacional com memória
4. Citação de fontes
5. Interface web intuitiva

#### Especificações Técnicas

**Stack:**
- LangChain para RAG
- OpenAI para embeddings e LLM
- FAISS para vector store (local)
- Streamlit para interface web
- Python 3.10+

#### Implementação Completa

**Arquivo: `chatpdf_app.py`**

```python
import streamlit as st
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
import tempfile
import os

# Configuração da página
st.set_page_config(
    page_title="ChatPDF - Converse com seus documentos",
    page_icon="📄",
    layout="wide"
)

# Título
st.title("📄 ChatPDF - Converse com seus documentos")
st.markdown("*Faça upload de PDFs e faça perguntas sobre o conteúdo!*")

# Sidebar para configurações
with st.sidebar:
    st.header("⚙️ Configurações")

    openai_api_key = st.text_input(
        "OpenAI API Key",
        type="password",
        help="Insira sua chave da API OpenAI"
    )

    st.divider()

    st.header("📁 Upload de Documentos")
    uploaded_files = st.file_uploader(
        "Escolha arquivos PDF",
        type="pdf",
        accept_multiple_files=True
    )

    process_button = st.button("🚀 Processar Documentos")

# Inicializar session state
if "messages" not in st.session_state:
    st.session_state.messages = []

if "vectorstore" not in st.session_state:
    st.session_state.vectorstore = None

if "conversation_chain" not in st.session_state:
    st.session_state.conversation_chain = None

# Função para processar PDFs
def process_pdfs(files, api_key):
    """Processa PDFs e cria vector store"""

    with st.spinner("📖 Carregando documentos..."):
        documents = []

        for uploaded_file in files:
            # Salvar temporariamente
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
                tmp_file.write(uploaded_file.getvalue())
                tmp_path = tmp_file.name

            # Carregar PDF
            loader = PyPDFLoader(tmp_path)
            docs = loader.load()
            documents.extend(docs)

            # Limpar arquivo temporário
            os.unlink(tmp_path)

        st.success(f"✅ Carregados {len(documents)} páginas de {len(files)} documentos")

    with st.spinner("✂️ Dividindo em chunks..."):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_documents(documents)
        st.success(f"✅ Criados {len(chunks)} chunks")

    with st.spinner("🧠 Criando embeddings..."):
        embeddings = OpenAIEmbeddings(openai_api_key=api_key)
        vectorstore = FAISS.from_documents(chunks, embeddings)
        st.success("✅ Vector store criado com sucesso!")

    return vectorstore

# Função para criar chain conversacional
def create_conversation_chain(vectorstore, api_key):
    """Cria chain de conversação com memória"""

    llm = ChatOpenAI(
        model="gpt-4",
        temperature=0,
        openai_api_key=api_key
    )

    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="answer"
    )

    chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        memory=memory,
        return_source_documents=True,
        verbose=True
    )

    return chain

# Processar documentos quando botão for clicado
if process_button and uploaded_files and openai_api_key:
    st.session_state.vectorstore = process_pdfs(uploaded_files, openai_api_key)
    st.session_state.conversation_chain = create_conversation_chain(
        st.session_state.vectorstore,
        openai_api_key
    )
    st.session_state.messages = []
    st.success("🎉 Sistema pronto! Faça sua pergunta abaixo.")

elif process_button and not openai_api_key:
    st.error("⚠️ Por favor, insira sua API Key da OpenAI")

elif process_button and not uploaded_files:
    st.error("⚠️ Por favor, faça upload de pelo menos um PDF")

# Área de chat
st.divider()

# Mostrar histórico de mensagens
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

        # Mostrar fontes se disponível
        if "sources" in message:
            with st.expander("📚 Ver fontes"):
                for i, source in enumerate(message["sources"]):
                    st.markdown(f"""
                    **Fonte {i+1}:**
                    - Arquivo: {source.metadata.get('source', 'N/A')}
                    - Página: {source.metadata.get('page', 'N/A')}
                    - Trecho: {source.page_content[:200]}...
                    """)

# Input de chat
if prompt := st.chat_input("Faça uma pergunta sobre os documentos..."):

    if not st.session_state.conversation_chain:
        st.error("⚠️ Por favor, processe os documentos primeiro!")
    else:
        # Adicionar mensagem do usuário
        st.session_state.messages.append({
            "role": "user",
            "content": prompt
        })

        with st.chat_message("user"):
            st.markdown(prompt)

        # Gerar resposta
        with st.chat_message("assistant"):
            with st.spinner("Pensando..."):
                result = st.session_state.conversation_chain.invoke({
                    "question": prompt
                })

                answer = result['answer']
                sources = result.get('source_documents', [])

                st.markdown(answer)

                # Mostrar fontes
                if sources:
                    with st.expander("📚 Ver fontes"):
                        for i, source in enumerate(sources):
                            st.markdown(f"""
                            **Fonte {i+1}:**
                            - Arquivo: {source.metadata.get('source', 'N/A')}
                            - Página: {source.metadata.get('page', 'N/A')}
                            - Trecho: {source.page_content[:200]}...
                            """)

        # Adicionar resposta ao histórico
        st.session_state.messages.append({
            "role": "assistant",
            "content": answer,
            "sources": sources
        })

# Footer
st.divider()
st.markdown("""
<div style='text-align: center; color: gray;'>
    <small>
    ChatPDF v1.0 | Powered by LangChain + OpenAI
    </small>
</div>
""", unsafe_allow_html=True)
```

#### Arquivo de Dependências: `requirements.txt`

```
streamlit==1.31.0
langchain==0.1.9
langchain-openai==0.0.5
langchain-community==0.0.20
faiss-cpu==1.7.4
pypdf==4.0.1
python-dotenv==1.0.1
```

#### Como Executar

```bash
# 1. Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Executar aplicação
streamlit run chatpdf_app.py
```

#### Recursos Adicionais do Projeto

**1. Adicionar opção de salvar/carregar vectorstore:**

```python
import pickle

# Salvar
with open("vectorstore.pkl", "wb") as f:
    pickle.dump(st.session_state.vectorstore, f)

# Carregar
with open("vectorstore.pkl", "rb") as f:
    st.session_state.vectorstore = pickle.load(f)
```

**2. Adicionar métricas de performance:**

```python
import time

start_time = time.time()
result = chain.invoke({"question": prompt})
elapsed = time.time() - start_time

st.metric("Tempo de resposta", f"{elapsed:.2f}s")
```

**3. Adicionar download do histórico:**

```python
import json

if st.button("💾 Baixar histórico"):
    history_json = json.dumps(st.session_state.messages, indent=2)
    st.download_button(
        "Download",
        history_json,
        "chat_history.json",
        "application/json"
    )
```

---

## 💡 Dicas de Otimização e Debugging

### 1. Debugging de Chains

```python
# Ativar verbose
chain = LLMChain(llm=llm, prompt=prompt, verbose=True)

# Callbacks customizados
from langchain.callbacks import StdOutCallbackHandler

handler = StdOutCallbackHandler()
chain.run(input="...", callbacks=[handler])

# LangSmith (plataforma oficial)
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "..."
```

### 2. Otimizando RAG

```python
# Cache de embeddings
from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import LocalFileStore

store = LocalFileStore("./cache/")
cached_embeddings = CacheBackedEmbeddings.from_bytes_store(
    underlying_embeddings,
    store,
    namespace="openai_embeddings"
)

# Compressão de contexto
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

compressor = LLMChainExtractor.from_llm(llm)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=retriever
)
```

### 3. Gerenciamento de Custos

```python
from langchain.callbacks import get_openai_callback

with get_openai_callback() as cb:
    result = chain.run(input="...")
    print(f"Tokens: {cb.total_tokens}")
    print(f"Custo: ${cb.total_cost}")
```

---

## 🎯 Próximos Passos

Você dominou LangChain! Agora sabe como:

✓ Criar chains complexas
✓ Implementar RAG completo
✓ Construir agentes autônomos
✓ Gerenciar memória conversacional
✓ Integrar ferramentas externas
✓ Deploy de aplicações reais

**No Módulo 4**, exploraremos o **Agno**, um framework mais recente e minimalista que oferece uma perspectiva diferente sobre a construção de agentes autônomos, focando na simplicidade e elegância.

---

**Continue para o Módulo 4: Agentes Autônomos com Agno** →

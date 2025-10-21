# 🎯 Caso de Uso: Automação de Atendimento ao Cliente

## 📊 Visão Geral

| | |
|---|---|
| **Problema de Negócio** | Sua empresa recebe 500+ mensagens/dia com dúvidas repetitivas |
| **Solução** | Agente de IA que responde automaticamente 70-80% das dúvidas |
| **Tempo de Implementação** | 2-4 horas (versão sem código) |
| **ROI Estimado** | Economia de 15-25h/semana da equipe |
| **Nível** | 🟢 Iniciante (versão sem código) |
| **Custo** | $0-50/mês dependendo do volume |

---

## 🎯 O Que Você Vai Construir

Um sistema que:

✅ **Recebe** mensagens de clientes (email, chat, WhatsApp)
✅ **Entende** a pergunta usando IA
✅ **Busca** a resposta na sua base de conhecimento
✅ **Responde** automaticamente com precisão
✅ **Encaminha** casos complexos para humanos
✅ **Aprende** com cada interação

---

## 📈 Impacto Real (Dados de Implementações)

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Tempo médio de resposta | 4-8 horas | 30 segundos | 📉 97% |
| Mensagens respondidas/dia | 150 | 500+ | 📈 233% |
| Horas da equipe gastas | 25h/semana | 7h/semana | ⏰ 18h economizadas |
| Satisfação do cliente | 72% | 89% | 😊 +17 pontos |
| Custo por atendimento | R$ 8,50 | R$ 0,40 | 💰 95% redução |

---

## 🚀 Versão 1: Sem Código (2 horas)

### O Que Você Precisa

- [ ] Conta no ChatGPT Plus ($20/mês) OU Claude Pro ($20/mês)
- [ ] Conta no Zapier (plano grátis funciona)
- [ ] Acesso ao seu sistema de email/chat

### Passo 1: Preparar Sua Base de Conhecimento (30min)

1. **Liste as 20 perguntas mais frequentes** que seus clientes fazem
2. **Documente as respostas padrão** para cada uma
3. **Crie um documento Google Docs ou Notion** com tudo organizado

**Exemplo de estrutura:**

```markdown
## FAQ - Atendimento ao Cliente

### Categoria: Pagamento

**P: Como faço para pagar com boleto?**
R: Para pagar com boleto, siga estes passos:
1. Acesse sua conta em [link]
2. Vá em "Meu Pedido"
3. Clique em "Gerar Boleto"
4. O boleto será enviado para seu email em até 5 minutos

**P: O boleto pode ser parcelado?**
R: Não, boleto é sempre à vista. Para parcelamento, use cartão de crédito.

[... mais 18 perguntas]
```

### Passo 2: Criar o Agente no ChatGPT (30min)

1. **Acesse o ChatGPT**
2. **Crie um novo "Custom GPT"** (no menu lateral)
3. **Configure assim:**

**Nome:** Assistente de Atendimento [Sua Empresa]

**Instruções:**
```
Você é o assistente de atendimento ao cliente da [SUA EMPRESA].

PAPEL:
- Responder dúvidas de clientes com educação e profissionalismo
- Usar apenas informações da base de conhecimento fornecida
- Ser claro, objetivo e empático

REGRAS:
1. NUNCA invente informações. Se não souber, diga: "Vou encaminhar sua dúvida para um especialista"
2. Seja sempre cordial, use o nome do cliente quando disponível
3. Responda em no máximo 3 parágrafos
4. Se a pergunta for complexa ou exigir acesso a sistemas, encaminhe para humano
5. Ao final, pergunte: "Consegui esclarecer sua dúvida?"

BASE DE CONHECIMENTO:
[Cole aqui o conteúdo do seu documento de FAQ]

CASOS QUE DEVEM SER ENCAMINHADOS PARA HUMANO:
- Reclamações
- Problemas técnicos complexos
- Solicitações de reembolso
- Questões legais
- Dúvidas sobre casos específicos que não estão no FAQ
```

4. **Teste o agente** fazendo perguntas como cliente

### Passo 3: Conectar ao Email com Zapier (1h)

**Objetivo:** Toda vez que chegar um email, o Zapier envia para o ChatGPT e responde automaticamente.

1. **Criar conta no Zapier** (zapier.com)

2. **Criar novo Zap:**
   - **Trigger:** "New Email" (Gmail/Outlook/etc)
   - **Filtro:** Apenas emails para suporte@suaempresa.com

3. **Ação 1:** "ChatGPT - Conversation"
   - Cole o prompt do seu assistente
   - Adicione: "Email do cliente: {trigger.from}" e "Mensagem: {trigger.body}"

4. **Ação 2:** "Send Email"
   - Para: {trigger.from}
   - Assunto: Re: {trigger.subject}
   - Corpo: {ChatGPT.response}

5. **Ativar o Zap!**

### Passo 4: Testar em Produção (30min)

1. **Envie um email de teste** para seu suporte
2. **Aguarde a resposta automática**
3. **Valide:** A resposta faz sentido?
4. **Ajuste** o prompt se necessário
5. **Ative para todo mundo** quando estiver confiante

---

## 🔥 Versão 2: Com Código + RAG (4-6 horas)

### O Que Você Precisa

- [ ] Python 3.10+ instalado
- [ ] Chave de API OpenAI ou Anthropic
- [ ] Conhecimento básico de Python

### Arquitetura

```
┌─────────────┐
│   Cliente   │
│  (Email)    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Sistema de Email   │
│   (Gmail API)       │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐
│  Servidor Python     │
│  FastAPI             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Agente LangChain    │
│  + RAG (Chroma DB)   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Base de Conhecimento│
│  (PDFs, Docs, FAQs)  │
└──────────────────────┘
```

### Código Completo

```python
# atendimento_cliente.py

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.document_loaders import DirectoryLoader, TextLoader
import os

# 1. CARREGAR BASE DE CONHECIMENTO
print("📚 Carregando base de conhecimento...")

loader = DirectoryLoader(
    './base_conhecimento/',  # Pasta com seus FAQs, docs, etc
    glob="**/*.txt",
    loader_cls=TextLoader
)
documents = loader.load()

# 2. DIVIDIR EM CHUNKS
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
texts = text_splitter.split_documents(documents)

# 3. CRIAR VECTOR STORE
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(
    documents=texts,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 4. CRIAR AGENTE DE ATENDIMENTO
llm = ChatOpenAI(
    model="gpt-4-turbo-preview",
    temperature=0.3  # Baixa temperatura = respostas mais consistentes
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
    return_source_documents=True
)

# 5. SYSTEM PROMPT
system_prompt = """
Você é o assistente de atendimento ao cliente da [SUA EMPRESA].

REGRAS:
1. Use APENAS informações da base de conhecimento fornecida
2. Se não souber, responda: "Vou encaminhar para um especialista"
3. Seja empático e profissional
4. Máximo 3 parágrafos
5. Sempre termine perguntando se ajudou

CASOS PARA ESCALAR (não responda, diga que vai encaminhar):
- Reclamações
- Problemas técnicos complexos
- Reembolsos
- Questões legais
"""

# 6. FUNÇÃO DE ATENDIMENTO
def atender_cliente(mensagem_cliente, contexto_cliente=None):
    """
    Processa mensagem do cliente e retorna resposta

    Args:
        mensagem_cliente: A pergunta/mensagem do cliente
        contexto_cliente: Informações adicionais (nome, histórico, etc)

    Returns:
        dict com 'resposta' e 'deve_escalar' (True/False)
    """

    # Monta o prompt completo
    prompt_completo = f"{system_prompt}\n\n"

    if contexto_cliente:
        prompt_completo += f"CONTEXTO DO CLIENTE:\n{contexto_cliente}\n\n"

    prompt_completo += f"MENSAGEM DO CLIENTE:\n{mensagem_cliente}\n\nSUA RESPOSTA:"

    # Busca resposta
    resultado = qa_chain({"query": prompt_completo})

    resposta = resultado['result']
    fontes = resultado['source_documents']

    # Detecta se deve escalar para humano
    palavras_escalar = ['encaminhar', 'especialista', 'não sei', 'complexo']
    deve_escalar = any(palavra in resposta.lower() for palavra in palavras_escalar)

    return {
        'resposta': resposta,
        'deve_escalar': deve_escalar,
        'fontes_usadas': [doc.metadata for doc in fontes],
        'confianca': 'alta' if not deve_escalar else 'baixa'
    }

# 7. TESTE
if __name__ == "__main__":
    print("\n🤖 Agente de Atendimento Inicializado!\n")

    # Teste
    teste = atender_cliente(
        "Como faço para pagar com boleto?",
        contexto_cliente="Nome: João Silva, Cliente desde: 2023"
    )

    print(f"Resposta: {teste['resposta']}\n")
    print(f"Deve escalar? {teste['deve_escalar']}")
    print(f"Confiança: {teste['confianca']}")
```

### Como Usar

1. **Criar pasta `base_conhecimento/`** e colocar seus documentos lá
2. **Instalar dependências:**
```bash
pip install langchain openai chromadb
```

3. **Configurar API Key:**
```bash
export OPENAI_API_KEY='sua-chave-aqui'
```

4. **Executar:**
```bash
python atendimento_cliente.py
```

---

## 📊 Monitoramento e Métricas

### O Que Acompanhar

| Métrica | Como Medir | Meta |
|---------|------------|------|
| Taxa de Resolução Automática | (Respostas automáticas / Total de mensagens) × 100 | >70% |
| Satisfação do Cliente | Pesquisa pós-atendimento | >85% |
| Tempo Médio de Resposta | Timestamp entrada - Timestamp resposta | <1 min |
| Taxa de Escalação | (Encaminhadas para humano / Total) × 100 | <30% |
| Custo por Atendimento | Custo mensal API / Total atendimentos | <R$ 1,00 |

### Ferramentas de Monitoramento

- **Google Analytics** para rastrear volume
- **Zapier Dashboard** para ver execuções
- **ChatGPT Analytics** (se usar Custom GPT)
- **LangSmith** (para versão com código)

---

## 🎓 Próximos Passos

### Melhorias Possíveis

1. **Adicionar canais:**
   - WhatsApp Business API
   - Chat do site
   - Redes sociais (Instagram, Facebook)

2. **Tornar mais inteligente:**
   - Detectar sentimento (cliente irritado = prioridade)
   - Personalização baseada em histórico
   - Sugestão proativa de produtos

3. **Integrar com sistemas:**
   - CRM para buscar dados do cliente
   - ERP para consultar status de pedidos
   - Sistema de tickets

4. **Multilíngue:**
   - Detectar idioma automaticamente
   - Responder no idioma do cliente

---

## 💡 Dicas de Ouro

> **DICA 1:** Comece pequeno. Implemente apenas para 1 canal (ex: email) antes de expandir.

> **DICA 2:** Monitore TUDO nas primeiras 2 semanas. Leia todas as conversas para ajustar o prompt.

> **DICA 3:** Sempre deixe claro para o cliente que é um atendimento automatizado. Transparência gera confiança.

> **DICA 4:** Tenha um botão de "Falar com Humano" sempre visível.

---

## ❓ FAQ Deste Caso de Uso

**P: E se o agente responder errado?**
R: Por isso monitoramos tudo nas primeiras semanas e ajustamos o prompt. A taxa de erro cai drasticamente após otimização.

**P: Clientes vão perceber que é IA?**
R: Sim, e isso é bom! Seja transparente. Clientes valorizam resposta rápida mais que resposta "humana".

**P: Quanto custa realmente?**
R: Versão sem código: ~$20-50/mês. Versão com código: ~$30-100/mês dependendo do volume. Bem menos que 1 funcionário.

**P: Funciona em português?**
R: Sim! ChatGPT e Claude são excelentes em português.

---

## 📚 Conteúdo Relacionado

- [Módulo 3: LangChain RAG](../modulos/modulo-03/rag.md)
- [Templates de Prompts para Atendimento](../recursos/templates-prompts.md)
- [Caso de Uso: Assistente de Vendas](./assistente-vendas.md)

---

<div align="center">

**Pronto para implementar?**

[💬 Dúvidas? Pergunte na Comunidade](https://github.com/inematds/FEA-IA/discussions)

[⬅️ Voltar aos Casos de Uso](./README.md)

</div>

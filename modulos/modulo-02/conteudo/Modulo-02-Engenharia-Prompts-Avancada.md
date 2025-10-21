# Módulo 2: Engenharia de Prompts Avançada

**Duração:** 6 horas | **Nível:** Iniciante-Intermediário

> **Frase-guia:** "Palavras são código. Aprenda a programar com linguagem natural."

---

![Capa do Módulo 2](../../../imagens-conceituais/modulo2_prompt_engineering.png)

## Ato 1: O Despertar (Continuação)

> "Você entendeu a máquina. Agora, você vai aprender a sua linguagem. Não a linguagem de programação, mas a linguagem do pensamento. A engenharia de prompts é a arte de esculpir a intenção em palavras, guiando a vasta inteligência da IA para um propósito específico."

Se o Módulo 1 foi sobre entender o motor, este módulo é sobre aprender a dirigir. Um LLM, por mais poderoso que seja, é um instrumento. A qualidade da música que ele produz depende inteiramente da habilidade do maestro. Aqui, você se tornará esse maestro. Vamos transformar a maneira como você interage com a IA, passando de simples perguntas para instruções complexas e estratégicas que extraem o máximo potencial desses modelos.

---

## Capítulo 2.1: Fundamentos de Prompting

### A Nova Arte da Comunicação

Engenharia de Prompts é mais do que simplesmente "fazer perguntas à IA". É uma disciplina emergente que combina:

- **Psicologia Cognitiva:** Compreender como estruturar informações para melhor processamento
- **Design de Interação:** Criar interfaces conversacionais eficazes
- **Programação Declarativa:** Especificar "o que" você quer, não "como" fazer
- **Retórica e Persuasão:** Usar linguagem estratégica para guiar o raciocínio

A diferença entre um prompt medíocre e um excelente pode significar a diferença entre uma resposta genérica e uma solução transformadora.

### A Anatomia de um Prompt Perfeito

Um prompt não é apenas uma pergunta; é um conjunto de instruções, contexto e exemplos que guiam o modelo para a saída desejada. A clareza e a estrutura do seu prompt são os fatores mais importantes para o sucesso.

Um prompt eficaz geralmente contém **quatro componentes principais**:

#### 1. **Persona (Role)**
Defina quem o LLM deve ser. A persona estabelece:
- Tom de voz (formal, casual, técnico)
- Nível de expertise
- Perspectiva e valores
- Estilo de comunicação

**Exemplos:**
```
"Você é um especialista em marketing digital com 15 anos de experiência..."
"Atue como um professor de física para crianças de 10 anos..."
"Você é um consultor sênior de estratégia empresarial..."
```

#### 2. **Contexto (Context)**
Forneça as informações de fundo necessárias para a tarefa. Inclua:
- Situação atual ou problema
- Dados relevantes
- Restrições e limitações
- Público-alvo
- Objetivos de negócio

**Exemplo:**
```
"Nossa startup de e-commerce vende produtos sustentáveis.
Temos um orçamento limitado de marketing ($5000/mês) e
queremos atingir millennials conscientes ambientalmente."
```

#### 3. **Tarefa (Task)**
Descreva clara e inequivocamente o que você quer que o modelo faça. Use verbos de ação específicos:

- **Análise:** "Analise", "Avalie", "Compare", "Identifique"
- **Criação:** "Crie", "Desenvolva", "Gere", "Escreva"
- **Transformação:** "Traduza", "Resuma", "Simplifique", "Reformule"
- **Solução:** "Resolva", "Proponha", "Recomende", "Otimize"

#### 4. **Formato (Format)**
Especifique como a saída deve ser estruturada:

```
"Retorne a resposta em formato JSON"
"Crie uma tabela com 3 colunas: Problema, Causa, Solução"
"Escreva em um tom amigável e profissional, máximo 200 palavras"
"Liste 5 pontos principais usando bullet points"
```

### Exemplo Completo de Prompt Estruturado

```markdown
**PERSONA:**
Você é um analista de dados especializado em e-commerce com expertise
em análise de comportamento do consumidor.

**CONTEXTO:**
Nossa loja online vendeu 10.000 unidades no último trimestre.
- Taxa de conversão: 2.5%
- Taxa de abandono de carrinho: 68%
- Ticket médio: $45
- Principal fonte de tráfego: Instagram Ads

**TAREFA:**
Analise esses dados e identifique os 3 principais problemas que estão
limitando nosso crescimento. Para cada problema, sugira 2 ações concretas
que possamos implementar.

**FORMATO:**
Estruture sua resposta como:
1. Problema identificado
   - Métrica afetada
   - Ação 1: [descrição]
   - Ação 2: [descrição]
```

### Zero-Shot vs. Few-Shot vs. Many-Shot Prompting

A quantidade de exemplos que você fornece ao modelo afeta dramaticamente sua performance.

#### **Zero-Shot Prompting**
Você pede ao modelo para realizar uma tarefa **sem fornecer nenhum exemplo**.

**Quando usar:**
- Tarefas gerais e bem conhecidas
- Quando você não tem exemplos disponíveis
- Para exploração inicial de capacidades

**Exemplo:**
```
Classifique o sentimento do seguinte texto:
"Eu amei este produto!"
Positivo ou Negativo?
```

**Limitações:**
- Pode falhar em tarefas de nicho
- Interpretação pode variar
- Formato de saída imprevisível

#### **Few-Shot Prompting**
Você fornece ao modelo **alguns exemplos** (geralmente de 1 a 5) de entradas e saídas desejadas antes de fazer o pedido final.

**Quando usar:**
- Tarefas com padrões específicos
- Quando você precisa de formato consistente
- Para domínios especializados

**Exemplo:**
```
Classifique o sentimento dos textos:

Texto: "Este filme foi horrível."
Sentimento: Negativo

Texto: "Uma obra-prima do cinema!"
Sentimento: Positivo

Texto: "Achei o serviço apenas razoável."
Sentimento: Neutro

Texto: "Eu amei este produto!"
Sentimento:
```

**Vantagens:**
- Precisão significativamente maior
- Controle sobre formato de saída
- Não requer fine-tuning do modelo

#### **Many-Shot Prompting**
Com modelos de contexto longo (como Claude com 200K tokens), você pode fornecer **dezenas ou centenas** de exemplos.

**Quando usar:**
- Tarefas extremamente especializadas
- Padrões complexos que precisam de múltiplos exemplos
- Substituir fine-tuning sem retreinar o modelo

**Casos de uso:**
- Tradução de jargão técnico específico
- Classificação de tickets de suporte
- Análise de contratos legais

> **💡 INSIGHT:** O Few-Shot Prompting é uma das técnicas mais poderosas para melhorar a precisão e a confiabilidade de um LLM sem a necessidade de fine-tuning (re-treinamento), que é um processo muito mais caro e complexo. É como dar ao modelo um "mini-treinamento" dentro do próprio prompt.

### Técnicas de Formatação Avançada

#### Delimitadores Claros
Use marcadores visuais para separar diferentes partes do prompt:

```
###INSTRUÇÃO###
Resuma o seguinte artigo

###ARTIGO###
[conteúdo aqui]

###REQUISITOS###
- Máximo 100 palavras
- Foco em conclusões práticas
```

#### Estruturas XML/JSON
Para saídas estruturadas:

```
Extraia informações do texto e retorne em formato JSON:

{
  "nome_produto": "",
  "preco": 0,
  "categoria": "",
  "disponibilidade": true/false
}

Texto: [...]
```

---

## Capítulo 2.2: Técnicas Avançadas de Raciocínio

Para tarefas que exigem lógica, matemática ou planejamento em várias etapas, um prompt simples não é suficiente. Precisamos ensinar o modelo a **"pensar passo a passo"**.

### Chain of Thought (CoT) - A Revolução do Raciocínio

A técnica de **Cadeia de Pensamento (Chain of Thought)** é uma das descobertas mais importantes em engenharia de prompts. Publicada por pesquisadores do Google em 2022, ela demonstrou que modelos de linguagem podem melhorar drasticamente em tarefas de raciocínio complexo simplesmente sendo instruídos a externalizar seu processo de pensamento.

#### Como Funciona

Ao adicionar instruções como:
- "Pense passo a passo"
- "Vamos raciocinar sobre isso"
- "Resolva isso etapa por etapa"

Você força o modelo a:
1. **Decompor** o problema em partes menores
2. **Processar** cada parte sequencialmente
3. **Validar** a lógica em cada etapa
4. **Sintetizar** a resposta final

#### Comparação Prática

**❌ Sem CoT:**
```
Prompt: "João tem 5 maçãs. Ele compra mais 2 caixas de maçãs,
cada uma com 6 maçãs. Quantas maçãs ele tem agora?"

Resposta: 11 maçãs (INCORRETO!)
```

**✅ Com CoT:**
```
Prompt: "João tem 5 maçãs. Ele compra mais 2 caixas de maçãs,
cada uma com 6 maçãs. Quantas maçãs ele tem agora?
Pense passo a passo."

Resposta:
1. Primeiro, vamos calcular quantas maçãs João comprou nas caixas
2. São 2 caixas com 6 maçãs cada, então 2 × 6 = 12 maçãs
3. João já tinha 5 maçãs
4. Somando: 5 + 12 = 17 maçãs

Resposta Final: João tem 17 maçãs. (CORRETO!)
```

#### Aplicações Reais do CoT

**1. Análise de Negócios:**
```
Analise se devemos expandir para o mercado B.
Pense passo a passo sobre:
1. Tamanho do mercado
2. Competição existente
3. Custos de entrada
4. ROI esperado
5. Riscos principais
```

**2. Debug de Código:**
```
O seguinte código tem um bug. Identifique-o pensando passo a passo:
1. Qual é o comportamento esperado?
2. Qual é o comportamento atual?
3. Em que linha está o problema?
4. Por que está acontecendo?
5. Como corrigir?
```

**3. Tomada de Decisão:**
```
Devo aceitar esta oferta de emprego? Analise passo a passo:
1. Alinhamento com objetivos de carreira
2. Compensação total vs. mercado
3. Cultura e valores da empresa
4. Oportunidades de crescimento
5. Impacto no work-life balance
```

### Self-Consistency: Votação de Múltiplos Caminhos

Esta técnica leva o CoT um passo adiante. Em vez de gerar uma única cadeia de pensamento, você gera **múltiplas cadeias** e escolhe a resposta que aparece com mais frequência.

#### Como Implementar

```python
import openai

def self_consistency(prompt, num_samples=5):
    responses = []

    for _ in range(num_samples):
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7  # Maior variação
        )
        responses.append(response.choices[0].message.content)

    # Analisar e encontrar resposta mais comum
    return most_common_answer(responses)
```

#### Quando Usar Self-Consistency

- **Problemas matemáticos complexos**
- **Decisões críticas de negócio**
- **Diagnósticos médicos (suporte)**
- **Análise jurídica**

**Vantagem:** Aumenta significativamente a confiabilidade, especialmente em problemas onde um único erro de raciocínio levaria à resposta errada.

### Tree of Thoughts (ToT): Explorando Possibilidades

**Árvore de Pensamentos** é uma técnica ainda mais avançada onde o modelo explora diferentes caminhos de raciocínio como galhos de uma árvore.

#### Conceito

```
                   [Problema Inicial]
                          |
         +----------------+----------------+
         |                |                |
    [Abordagem A]    [Abordagem B]    [Abordagem C]
         |                |                |
    +----+----+      +----+----+      +----+----+
    |    |    |      |    |    |      |    |    |
   A1   A2   A3     B1   B2   B3     C1   C2   C3
```

O modelo pode:
- **Explorar** múltiplos caminhos simultaneamente
- **Avaliar** a qualidade de cada estado intermediário
- **Retroceder (backtrack)** se um caminho não parece promissor
- **Escolher** o caminho mais lógico para a solução

#### Implementação Prática

```
Problema: Planejar uma viagem de 7 dias para o Japão com orçamento limitado.

Pense em árvore:

1. GERAR: Liste 3 possíveis abordagens diferentes
   - Foco em Tóquio (urbano)
   - Kyoto e templos (cultural)
   - Mix Tóquio + Osaka (equilibrado)

2. AVALIAR: Para cada abordagem, dê uma nota de 1-10 considerando:
   - Custo
   - Experiência cultural
   - Viabilidade logística

3. EXPANDIR: Pegue a abordagem com melhor nota e detalhe:
   - Dia 1: [atividades]
   - Dia 2: [atividades]
   - etc.

4. VALIDAR: Verifique se está dentro do orçamento em cada etapa.
   Se não, retroceda e tente segunda melhor opção.
```

**Aplicações:**
- Planejamento estratégico
- Design de sistemas complexos
- Resolução de puzzles
- Otimização de processos

### ReAct: Reasoning + Acting

**ReAct** combina **raciocínio** (pensamento) com **ação** (uso de ferramentas).

#### Padrão ReAct

```
Thought: [O que preciso fazer?]
Action: [Que ferramenta usar?]
Action Input: [Parâmetros da ferramenta]
Observation: [Resultado da ação]
... (repita até resolver)
Thought: [Agora sei a resposta final]
Final Answer: [Resposta]
```

#### Exemplo Prático

```
Pergunta: Qual é a temperatura atual em Tóquio?

Thought: Preciso de informação em tempo real sobre clima
Action: search_weather
Action Input: "Tokyo current temperature"
Observation: 18°C, partly cloudy

Thought: Tenho a informação necessária
Final Answer: A temperatura atual em Tóquio é 18°C com
céu parcialmente nublado.
```

Este padrão é a base de **agentes autônomos** que veremos nos próximos módulos.

---

## Capítulo 2.3: Prompt Engineering para Agentes de IA

Quando passamos de simples prompts para a criação de agentes autônomos, a engenharia de prompts se torna a base da "personalidade" e do comportamento do agente.

### O System Prompt: A Constituição do Agente

O **System Prompt** é a instrução de mais alto nível que governa todas as interações futuras do agente. É como a "programação" do agente, definindo:

- **Quem ele é** (identidade)
- **O que ele faz** (capacidades)
- **Como ele pensa** (processo de raciocínio)
- **Limites** (restrições éticas e operacionais)

#### Template de System Prompt Profissional

```markdown
# IDENTIDADE
Você é [NOME], um [FUNÇÃO] especializado em [DOMÍNIO].
Suas principais características são: [TRAÇOS DE PERSONALIDADE].

# MISSÃO
Seu objetivo principal é [OBJETIVO PRINCIPAL].
Você deve sempre priorizar [VALORES/PRIORIDADES].

# CAPACIDADES
Você tem acesso às seguintes ferramentas:
- [FERRAMENTA 1]: [Descrição e quando usar]
- [FERRAMENTA 2]: [Descrição e quando usar]
- [FERRAMENTA 3]: [Descrição e quando usar]

# PROCESSO DE RACIOCÍNIO
Para cada tarefa, você deve:
1. Analisar a solicitação do usuário
2. Identificar qual informação você precisa
3. Decidir qual ferramenta usar
4. Executar ações necessárias
5. Validar resultados
6. Fornecer resposta clara e acionável

# RESTRIÇÕES
NUNCA:
- [Ação proibida 1]
- [Ação proibida 2]
- [Ação proibida 3]

SEMPRE:
- [Comportamento obrigatório 1]
- [Comportamento obrigatório 2]
- [Comportamento obrigatório 3]

# TOM E ESTILO
- Use linguagem [FORMAL/CASUAL]
- Seja [CARACTERÍSTICA 1] e [CARACTERÍSTICA 2]
- Explique conceitos técnicos de forma [SIMPLES/DETALHADA]
```

#### Exemplo: Agente de Viagens Personalizado

```markdown
# IDENTIDADE
Você é Sophia, uma agente de viagens virtual especializada em
experiências personalizadas e sustentáveis. Você é entusiasta,
detalhista e genuinamente apaixonada por conectar pessoas a
culturas autênticas.

# MISSÃO
Seu objetivo é criar itinerários de viagem inesquecíveis que
equilibrem perfeitamente: experiência cultural autêntica,
sustentabilidade, segurança e orçamento do viajante.

# CAPACIDADES
Você tem acesso a:
- search_flights(origem, destino, data): Buscar voos disponíveis
- search_hotels(cidade, check_in, check_out, budget): Buscar acomodações
- get_weather(cidade, data): Verificar previsão do tempo
- find_attractions(cidade, interesses): Descobrir atrações locais
- calculate_budget(itinerario): Estimar custo total da viagem

# PROCESSO DE RACIOCÍNIO (ReAct)
Para cada solicitação de viagem:

1. ENTENDER: Faça perguntas para entender:
   - Orçamento total disponível
   - Datas flexíveis ou fixas
   - Interesses específicos (cultural, aventura, relaxamento)
   - Restrições alimentares ou de mobilidade
   - Experiências obrigatórias vs. opcionais

2. PESQUISAR: Use suas ferramentas para:
   - Comparar preços de voos
   - Encontrar acomodações dentro do orçamento
   - Identificar atrações alinhadas com interesses

3. OTIMIZAR: Crie 2-3 opções de itinerário diferentes:
   - Opção econômica
   - Opção equilibrada (melhor recomendação)
   - Opção premium (se orçamento permitir)

4. APRESENTAR: Para cada opção, mostre:
   - Custo total detalhado
   - Dia a dia do itinerário
   - Dicas locais e insights culturais
   - Prós e contras

5. REFINAR: Baseado no feedback, ajuste e personalize

# RESTRIÇÕES
NUNCA:
- Recomende destinos ou atividades perigosas
- Exceda o orçamento declarado pelo viajante
- Ignore restrições alimentares ou de saúde
- Sugira atividades que não respeitem culturas locais

SEMPRE:
- Priorize segurança do viajante
- Inclua opções sustentáveis e que beneficiem comunidades locais
- Verifique requisitos de visto e vacinação
- Forneça contatos de emergência locais

# TOM E ESTILO
- Use linguagem entusiasta mas profissional
- Seja proativa em sugerir experiências únicas
- Explique o "porquê" por trás de cada recomendação
- Use emojis ocasionalmente para tornar a conversa mais amigável ✈️🌍
- Compartilhe fatos culturais interessantes
```

### Técnicas de Prompt para Controle de Comportamento

#### 1. **Guardrails (Barreiras de Segurança)**

```markdown
REGRAS DE SEGURANÇA:
Antes de executar QUALQUER ação, verifique:
✓ A ação está dentro do escopo da tarefa?
✓ A ação não viola privacidade do usuário?
✓ A ação não tem riscos de segurança?
✓ O usuário forneceu consentimento explícito para esta ação?

Se qualquer resposta for "NÃO", PARE e peça esclarecimento ao usuário.
```

#### 2. **Prompt de Validação**

```markdown
Após completar a tarefa, SEMPRE:
1. Revise sua resposta quanto a:
   - Precisão factual
   - Clareza da comunicação
   - Alinhamento com objetivo do usuário
2. Se encontrar problemas, corrija antes de enviar
3. Se não tiver certeza, indique explicitamente
```

#### 3. **Handling de Ambiguidade**

```markdown
Se a solicitação do usuário for ambígua:
1. NÃO faça suposições
2. Identifique especificamente o que precisa ser esclarecido
3. Faça perguntas direcionadas
4. Ofereça opções quando apropriado

Exemplo:
Usuário: "Encontre um bom restaurante"
Você: "Ficarei feliz em ajudar! Para encontrar o restaurante perfeito, preciso saber:
- Qual cidade/região?
- Tipo de culinária preferida?
- Faixa de preço?
- Alguma restrição alimentar?"
```

### Meta-Prompting: Prompts que Geram Prompts

Uma técnica poderosa é usar IA para criar prompts melhores.

```markdown
Você é um especialista em engenharia de prompts.

Dada a seguinte tarefa: [DESCRIÇÃO DA TAREFA]

Crie um prompt otimizado que:
1. Defina claramente a persona apropriada
2. Forneça contexto necessário
3. Especifique a tarefa de forma precisa
4. Defina o formato de saída desejado
5. Inclua exemplos few-shot se apropriado

Retorne o prompt otimizado em um bloco de código markdown.
```

---

## Capítulo 2.4: Prompting Multimodal

Com modelos como GPT-4 Vision, Claude com visão e DALL-E, podemos criar prompts que trabalham com múltiplas modalidades.

### Prompts para Geração de Imagens

#### Anatomia de um Prompt de Imagem Eficaz

```
[SUJEITO PRINCIPAL] + [AÇÃO/POSE] + [CONTEXTO/AMBIENTE] +
[ESTILO ARTÍSTICO] + [ILUMINAÇÃO] + [PERSPECTIVA/ÂNGULO] +
[QUALIDADE/DETALHES]
```

**Exemplo:**
```
Um astronauta solitário [SUJEITO]
contemplando uma paisagem marciana [AÇÃO]
ao pôr do sol, com dois sóis no horizonte [CONTEXTO]
estilo arte conceitual cinematográfica [ESTILO]
iluminação dramática dourada e laranja [ILUMINAÇÃO]
ângulo amplo, composição rule of thirds [PERSPECTIVA]
4K, altamente detalhado, fotorrealista [QUALIDADE]
```

### Prompts para Análise de Imagens

```markdown
Analise a imagem fornecida e retorne:

1. DESCRIÇÃO GERAL:
   - O que você vê?
   - Qual é o contexto/cenário?

2. ELEMENTOS PRINCIPAIS:
   - Liste objetos principais
   - Identifique pessoas (sem identificação facial)
   - Descreva cores dominantes

3. ANÁLISE TÉCNICA:
   - Qualidade da imagem
   - Composição
   - Iluminação

4. TEXTO EXTRAÍDO:
   - Transcreva qualquer texto visível

5. INSIGHTS:
   - Qual parece ser o propósito desta imagem?
   - Que emoção/mensagem ela transmite?
```

### Prompts para Áudio

```markdown
Transcreva o áudio fornecido e:

1. TRANSCRIÇÃO:
   [Texto completo com pontuação]

2. ANÁLISE:
   - Língua detectada
   - Número de falantes
   - Tom/emoção dominante
   - Contexto (reunião, apresentação, conversa, etc.)

3. RESUMO:
   - Principais pontos discutidos
   - Decisões tomadas
   - Ações a serem realizadas

4. TIMESTAMPS:
   - Marque momentos importantes com timestamps
```

---

## Capítulo 2.5: Debugging e Otimização de Prompts

### Estratégias de Debugging

#### 1. **Teste A/B de Prompts**

```python
prompts = {
    "A": "Resuma este artigo",
    "B": "Resuma este artigo em 3 pontos principais",
    "C": "Resuma este artigo em 3 pontos. Use bullet points.
          Cada ponto deve ter no máximo 20 palavras."
}

# Testar com mesmo conteúdo e comparar resultados
```

#### 2. **Engenharia Reversa**

Se você tem uma saída ideal, peça à IA para criar o prompt:

```
Você gerou esta resposta excelente:
[RESPOSTA EXCELENTE]

Qual prompt você usaria para gerar consistentemente
respostas desta qualidade e formato?
```

#### 3. **Decomposição de Problemas**

Se um prompt complexo não funciona, divida em etapas:

```
❌ Prompt único complexo:
"Analise este dataset, encontre padrões, crie visualizações
e faça recomendações"

✅ Sequência de prompts:
1. "Descreva a estrutura deste dataset"
2. "Identifique 3 padrões mais interessantes"
3. "Para cada padrão, sugira uma visualização apropriada"
4. "Baseado nos padrões, liste 5 recomendações acionáveis"
```

### Métricas de Qualidade de Prompts

Como avaliar se seu prompt é bom?

1. **Consistência:** Gera resultados similares com inputs similares?
2. **Precisão:** As respostas são factualmente corretas?
3. **Relevância:** A saída está alinhada com o objetivo?
4. **Completude:** Todas as partes da tarefa são abordadas?
5. **Eficiência:** O prompt é o mais conciso possível mantendo qualidade?

### Prompt Library: Construindo seu Arsenal

Mantenha uma biblioteca de prompts testados e otimizados:

```
prompts/
  ├── analysis/
  │   ├── sentiment-analysis.md
  │   ├── data-insights.md
  │   └── competitive-research.md
  ├── content-creation/
  │   ├── blog-post.md
  │   ├── social-media.md
  │   └── email-campaign.md
  ├── code/
  │   ├── code-review.md
  │   ├── bug-fix.md
  │   └── documentation.md
  └── agents/
      ├── customer-support-agent.md
      ├── research-agent.md
      └── code-assistant-agent.md
```

---

## 📝 Resumo Gráfico do Módulo 2

### Conceitos-Chave

**Anatomia do Prompt:**
- ✓ Persona (Quem)
- ✓ Contexto (Situação)
- ✓ Tarefa (O que fazer)
- ✓ Formato (Como entregar)

**Técnicas de Raciocínio:**
- **CoT:** Pensamento passo a passo
- **Self-Consistency:** Múltiplos caminhos
- **ToT:** Exploração em árvore
- **ReAct:** Raciocínio + Ação

**System Prompts:**
- Define comportamento de agentes
- Estabelece guardrails
- Especifica processo de raciocínio

### Hierarquia de Complexidade

```
Nível 1: Prompt Simples
    ↓
Nível 2: Prompt Estruturado (Persona + Contexto + Tarefa + Formato)
    ↓
Nível 3: Few-Shot Prompting
    ↓
Nível 4: Chain of Thought
    ↓
Nível 5: ReAct (Agentes)
    ↓
Nível 6: Multi-Agent Systems
```

---

## 🚀 Projeto Prático do Módulo 2

### Desafio: Sistema de Análise de Sentimento com Chain of Thought

**Objetivo:** Desenvolva um sistema robusto de análise de sentimento que use CoT para lidar com textos ambíguos e nuançados.

#### Especificações do Projeto

**1. Funcionalidades:**
- Classificar sentimento: Positivo, Negativo, Neutro, Misto
- Explicar o raciocínio (CoT explícito)
- Identificar aspectos específicos (produto, serviço, atendimento)
- Calcular score de confiança (0-100%)

**2. Casos de Teste:**

```python
test_reviews = [
    # Caso simples
    "Este produto é incrível! Adorei.",

    # Caso ambíguo
    "O produto é lindo, mas quebrou no primeiro dia.",

    # Caso complexo
    "O atendimento foi péssimo, demorou 2 horas. Mas o produto "
    "em si é excelente, superou minhas expectativas. Vale a pena "
    "pela qualidade, apesar do transtorno na entrega.",

    # Sarcasmo
    "Ah, claro, esperar 3 meses por um produto que chegou quebrado "
    "foi uma experiência maravilhosa!",

    # Neutro
    "Recebi o produto conforme descrito. Tamanho médio, cor azul."
]
```

**3. Template de Prompt:**

```python
SYSTEM_PROMPT = """
Você é um especialista em análise de sentimento com profundo
entendimento de nuances linguísticas, sarcasmo e contexto.

Para cada avaliação, você deve:

1. LER cuidadosamente todo o texto
2. IDENTIFICAR aspectos mencionados (produto, entrega, atendimento, etc.)
3. ANALISAR sentimento de cada aspecto separadamente
4. DETECTAR sinais de sarcasmo ou ironia
5. AVALIAR intensidade emocional
6. CONSOLIDAR em classificação final
7. EXPLICAR seu raciocínio

FORMATO DE RESPOSTA:
{
  "sentimento_geral": "Positivo|Negativo|Neutro|Misto",
  "confianca": 0-100,
  "aspectos": [
    {
      "aspecto": "nome do aspecto",
      "sentimento": "Positivo|Negativo|Neutro",
      "evidencia": "trecho do texto"
    }
  ],
  "raciocinio": "Explicação passo a passo da análise",
  "flags": ["sarcasmo", "ambiguidade", etc.]
}
"""
```

**4. Implementação Base:**

```python
import openai
import json

def analyze_sentiment_with_cot(review_text):
    """
    Analisa sentimento usando Chain of Thought
    """

    prompt = f"""
{SYSTEM_PROMPT}

TEXTO PARA ANÁLISE:
\"\"\"{review_text}\"\"\"

Pense passo a passo e forneça sua análise completa.
"""

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3  # Baixa para consistência
    )

    return json.loads(response.choices[0].message.content)


# Teste
for review in test_reviews:
    print(f"\n{'='*60}")
    print(f"REVIEW: {review[:100]}...")

    analysis = analyze_sentiment_with_cot(review)

    print(f"\nSENTIMENTO: {analysis['sentimento_geral']}")
    print(f"CONFIANÇA: {analysis['confianca']}%")
    print(f"\nRACIOCÍNIO:")
    print(analysis['raciocinio'])
```

**5. Extensões Opcionais:**

- [ ] Adicionar suporte multilingue
- [ ] Implementar Self-Consistency (rodar 5x e pegar maioria)
- [ ] Criar dashboard web com Streamlit
- [ ] Adicionar análise de tendências temporais
- [ ] Integrar com reviews reais (API do Amazon, etc.)

#### Critérios de Avaliação

✅ **Excelente** (90-100 pontos):
- Detecta corretamente todos os casos de teste
- Identifica sarcasmo e ambiguidade
- Raciocínio CoT é claro e lógico
- Código bem estruturado e documentado

✅ **Bom** (70-89 pontos):
- Acerta maioria dos casos
- Raciocínio presente mas pode melhorar
- Código funcional

✅ **Satisfatório** (50-69 pontos):
- Funciona em casos simples
- Falha em ambiguidades
- Implementação básica

---

## 💡 Insights e Lições Aprendidas

### Princípios Fundamentais de Prompt Engineering

1. **Clareza > Concisão**
   - Um prompt mais longo e claro é melhor que um curto e ambíguo

2. **Exemplos Falam Mais que Instruções**
   - Um bom exemplo vale mil palavras de explicação

3. **Estrutura Cria Consistência**
   - Formatos bem definidos geram saídas previsíveis

4. **Iteração é Essencial**
   - Raramente o primeiro prompt é o melhor

5. **Contexto é Rei**
   - Quanto mais contexto relevante, melhor a resposta

### Armadilhas Comuns a Evitar

❌ **Prompt Vago:**
```
"Escreva sobre marketing"
```

✅ **Prompt Específico:**
```
"Escreva um artigo de 800 palavras sobre estratégias de
marketing digital para startups B2B com orçamento limitado,
focando em táticas orgânicas e de baixo custo. Público-alvo:
fundadores técnicos sem background em marketing."
```

❌ **Assumir Conhecimento Implícito:**
```
"Analise os dados" (que dados? que tipo de análise?)
```

✅ **Explicitar Tudo:**
```
"Analise o dataset CSV anexo de vendas mensais (2020-2024).
Identifique: 1) tendências sazonais, 2) produtos top performers,
3) regiões de crescimento. Apresente insights em bullet points."
```

---

## 🎯 Próximos Passos

Você agora domina a arte de se comunicar com IA de forma eficaz e estratégica. Você aprendeu:

✓ Como estruturar prompts profissionais
✓ Técnicas avançadas de raciocínio (CoT, ToT, ReAct)
✓ Criar System Prompts para agentes
✓ Debugging e otimização de prompts

**Mas para construir aplicações verdadeiramente poderosas, precisamos ir além de prompts isolados.**

No **Módulo 3**, entraremos no mundo dos **frameworks de desenvolvimento** com **LangChain**, onde aprenderemos a:

- Dar **memória** aos nossos agentes
- Conectá-los a **fontes de dados externas**
- Criar **cadeias de raciocínio** complexas
- Construir **aplicações de IA completas**

A engenharia de prompts é sua fundação. Agora vamos construir o edifício.

---

**Continue para o Módulo 3: Frameworks de Desenvolvimento - LangChain** →

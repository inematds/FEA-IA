# 📚 Sistema de Tópicos Compactos ATIA
**Nome de Referência:** `ATIA Compact Topics System`

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura HTML](#estrutura-html)
3. [JavaScript](#javascript)
4. [Estilos CSS/Tailwind](#estilos-csstailwind)
5. [Como Implementar](#como-implementar)
6. [Configurações de Espaçamento](#configurações-de-espaçamento)
7. [Diferenças do FEP](#diferenças-do-fep)
8. [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 Visão Geral

O **Sistema de Tópicos Compactos ATIA** é uma implementação customizada baseada no padrão FEP, otimizada para apresentar conteúdo educacional de forma compacta e eficiente.

**Características:**
- ✅ Design ultra-compacto com espaçamento mínimo
- ✅ Comportamento accordion (fecha outros ao abrir)
- ✅ Event delegation para performance
- ✅ Estrutura de 3 perguntas: "O que é", "Por que aprender", "Conceitos chave"
- ✅ Visual limpo com Tailwind CSS
- ✅ Totalmente responsivo

**Diferencial:** Espaçamento ultra-reduzido para máxima densidade de informação sem perder legibilidade.

---

## 📝 Estrutura HTML

### Template Completo

```html
<!-- Container dos Tópicos -->
<div class="mb-4">
    <h3 class="font-semibold text-gray-900 mb-3">📚 Tópicos-chave:</h3>

    <!-- Lista de Tópicos (espaçamento mínimo) -->
    <ul class="topics-list space-y-0.5">
        <!-- Tópico Individual -->
        <li class="topic-item" data-topic="identificador-unico">
            <!-- Botão Clicável (padding mínimo) -->
            <button class="topic-button w-full text-left px-4 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-medium text-gray-800">
                🔍 Título do Tópico
            </button>

            <!-- Conteúdo Expansível (inicialmente oculto) -->
            <div class="topic-explanation hidden ml-6 mt-2 p-4 bg-blue-50 rounded-lg border-l-4 border-fundamentos">
                <!-- Pergunta 1: O que é -->
                <p class="text-sm mb-1.5">
                    <strong class="text-fundamentos">O que é:</strong> Definição clara e concisa do conceito.
                </p>

                <!-- Pergunta 2: Por que aprender -->
                <p class="text-sm mb-1.5">
                    <strong class="text-fundamentos">Por que aprender:</strong> Benefícios e importância prática.
                </p>

                <!-- Pergunta 3: Conceitos chave -->
                <p class="text-sm">
                    <strong class="text-fundamentos">Conceitos chave:</strong> Termos e ideias principais.
                </p>
            </div>
        </li>
    </ul>
</div>
```

### Classes Importantes

| Classe | Propósito | Valor |
|--------|-----------|-------|
| `topics-list` | Container da lista | - |
| `space-y-0.5` | Espaçamento entre botões | 2px |
| `topic-item` | Container individual do tópico | - |
| `topic-button` | Botão clicável | - |
| `py-1` | Padding vertical do botão | 4px |
| `px-4` | Padding horizontal do botão | 16px |
| `topic-explanation` | Conteúdo expansível | - |
| `hidden` | Classe de ocultação | `display: none` |
| `mb-1.5` | Espaçamento entre parágrafos | 6px |
| `border-fundamentos` | Borda verde (cor do nível) | `#10b981` |

---

## ⚙️ JavaScript

### Código Principal

**Localização:** `js/app.js` (linhas 107-133)

```javascript
/* ========================================
   TOPIC EXPANSION SYSTEM (FEP Pattern)
   ======================================== */

// Toggle topic explanations using event delegation
document.addEventListener('click', function(e) {
    if (e.target.closest('.topic-button')) {
        const button = e.target.closest('.topic-button');
        const topicItem = button.closest('.topic-item');
        const explanation = topicItem.querySelector('.topic-explanation');

        if (explanation) {
            // Toggle (mostra/esconde) a explicação
            explanation.classList.toggle('hidden');

            // COMPORTAMENTO ACCORDION: Fecha outras explicações abertas no mesmo card
            const chapterCard = topicItem.closest('.chapter-card');
            if (chapterCard) {
                chapterCard.querySelectorAll('.topic-explanation').forEach(exp => {
                    if (exp !== explanation) {
                        exp.classList.add('hidden');
                    }
                });
            }
        }
    }
});
```

### Como Funciona

1. **Event Delegation**: Um único listener captura todos os cliques
2. **Navegação DOM**: `closest()` sobe até encontrar o elemento pai correto
3. **Toggle**: Adiciona/remove classe `hidden`
4. **Accordion**: Fecha outros tópicos abertos no mesmo capítulo
5. **Escopo**: Limitado ao `.chapter-card` para evitar interferência entre capítulos

---

## 🎨 Estilos CSS/Tailwind

### Classes de Espaçamento (Configuradas)

```css
/* Espaçamento entre botões de tópicos */
.space-y-0.5 {
    margin-top: 0.125rem; /* 2px */
}

/* Padding dos botões */
.py-1 {
    padding-top: 0.25rem;    /* 4px */
    padding-bottom: 0.25rem; /* 4px */
}

.px-4 {
    padding-left: 1rem;   /* 16px */
    padding-right: 1rem;  /* 16px */
}

/* Espaçamento entre parágrafos internos */
.mb-1.5 {
    margin-bottom: 0.375rem; /* 6px */
}
```

### Cores Personalizadas

```css
/* Cor verde do Nível Fundamentos */
.text-fundamentos {
    color: #10b981;
}

.border-fundamentos {
    border-color: #10b981;
}

.bg-fundamentos {
    background-color: #10b981;
}
```

---

## 🚀 Como Implementar

### Passo 1: Adicionar o JavaScript

Copie o código JavaScript do sistema de expansão para `js/app.js` dentro do `DOMContentLoaded`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // ... outros códigos ...

    /* TOPIC EXPANSION SYSTEM */
    document.addEventListener('click', function(e) {
        if (e.target.closest('.topic-button')) {
            const button = e.target.closest('.topic-button');
            const topicItem = button.closest('.topic-item');
            const explanation = topicItem.querySelector('.topic-explanation');

            if (explanation) {
                explanation.classList.toggle('hidden');

                const chapterCard = topicItem.closest('.chapter-card');
                if (chapterCard) {
                    chapterCard.querySelectorAll('.topic-explanation').forEach(exp => {
                        if (exp !== explanation) {
                            exp.classList.add('hidden');
                        }
                    });
                }
            }
        }
    });
});
```

### Passo 2: Criar a Estrutura HTML

```html
<div class="chapter-card">
    <!-- Conteúdo do capítulo -->

    <div class="mb-4">
        <h3 class="font-semibold text-gray-900 mb-3">📚 Tópicos-chave:</h3>

        <ul class="topics-list space-y-0.5">
            <li class="topic-item" data-topic="topico-1">
                <button class="topic-button w-full text-left px-4 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-medium text-gray-800">
                    📌 Seu Tópico
                </button>
                <div class="topic-explanation hidden ml-6 mt-2 p-4 bg-blue-50 rounded-lg border-l-4 border-fundamentos">
                    <p class="text-sm mb-1.5">
                        <strong class="text-fundamentos">O que é:</strong> Definição
                    </p>
                    <p class="text-sm mb-1.5">
                        <strong class="text-fundamentos">Por que aprender:</strong> Benefícios
                    </p>
                    <p class="text-sm">
                        <strong class="text-fundamentos">Conceitos chave:</strong> Termos
                    </p>
                </div>
            </li>
        </ul>
    </div>
</div>
```

### Passo 3: Ajustar Cores (se necessário)

Para outros níveis além de Fundamentos, ajuste as cores:

```html
<!-- Nível Aplicação (roxo) -->
<div class="border-l-4 border-aplicacao">
    <strong class="text-aplicacao">...</strong>
</div>

<!-- Nível Estratégico (azul) -->
<div class="border-l-4 border-estrategico">
    <strong class="text-estrategico">...</strong>
</div>
```

---

## ⚙️ Configurações de Espaçamento

### Valores Atuais (Ultra-Compacto)

| Elemento | Classe | Valor | Descrição |
|----------|--------|-------|-----------|
| Entre botões | `space-y-0.5` | 2px | Espaçamento vertical mínimo |
| Padding vertical botão | `py-1` | 4px | Altura interna do botão |
| Padding horizontal botão | `px-4` | 16px | Largura interna do botão |
| Entre parágrafos | `mb-1.5` | 6px | Espaço entre perguntas |

### Como Ajustar o Espaçamento

Se precisar modificar o espaçamento no futuro:

**Para aumentar espaço entre botões:**
```html
<!-- De space-y-0.5 para space-y-1 -->
<ul class="topics-list space-y-1">
```

**Para aumentar padding dos botões:**
```html
<!-- De py-1 para py-2 -->
<button class="... py-2 ...">
```

**Para aumentar espaço entre parágrafos:**
```html
<!-- De mb-1.5 para mb-2 -->
<p class="text-sm mb-2">
```

---

## 🔄 Diferenças do FEP

### Semelhanças
- ✅ Event delegation
- ✅ Estrutura topic-item/topic-button/topic-explanation
- ✅ Comportamento accordion
- ✅ Uso de Tailwind CSS

### Diferenças

| Aspecto | FEP | ATIA Compact |
|---------|-----|--------------|
| **Espaçamento entre botões** | `space-y-2` (8px) | `space-y-0.5` (2px) |
| **Padding dos botões** | `py-3` (12px) | `py-1` (4px) |
| **Espaço entre parágrafos** | `mb-2` (8px) | `mb-1.5` (6px) |
| **Estrutura de conteúdo** | Flexível | 3 perguntas fixas |
| **Foco** | Visual confortável | Máxima densidade |
| **Escopo do accordion** | `.module-card` | `.chapter-card` |

---

## 💡 Exemplos de Uso

### Exemplo 1: Capítulo com 4 Tópicos

```html
<div class="chapter-card bg-white rounded-xl shadow-md p-6 mb-6">
    <h2>Capítulo 1: O Tsunami da IA</h2>
    <p>Descrição do capítulo...</p>

    <div class="mb-4">
        <h3 class="font-semibold text-gray-900 mb-3">📚 Tópicos-chave:</h3>

        <ul class="topics-list space-y-0.5">
            <!-- Tópico 1 -->
            <li class="topic-item" data-topic="cap1-exponencial">
                <button class="topic-button w-full text-left px-4 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-medium text-gray-800">
                    📈 Crescimento Exponencial da IA
                </button>
                <div class="topic-explanation hidden ml-6 mt-2 p-4 bg-blue-50 rounded-lg border-l-4 border-fundamentos">
                    <p class="text-sm mb-1.5">
                        <strong class="text-fundamentos">O que é:</strong> Diferente de tecnologias anteriores com crescimento linear, a IA está em expansão exponencial...
                    </p>
                    <p class="text-sm mb-1.5">
                        <strong class="text-fundamentos">Por que aprender:</strong> Entender a natureza exponencial ajuda a antecipar mudanças futuras...
                    </p>
                    <p class="text-sm">
                        <strong class="text-fundamentos">Conceitos chave:</strong> Lei de Moore, aceleração de mudanças, curva exponencial.
                    </p>
                </div>
            </li>

            <!-- Tópico 2 -->
            <li class="topic-item" data-topic="cap1-historia">
                <button class="topic-button w-full text-left px-4 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-medium text-gray-800">
                    📜 História e Evolução da IA
                </button>
                <div class="topic-explanation hidden ml-6 mt-2 p-4 bg-blue-50 rounded-lg border-l-4 border-fundamentos">
                    <p class="text-sm mb-1.5">
                        <strong class="text-fundamentos">O que é:</strong> A jornada da IA desde os primórdios (1950)...
                    </p>
                    <p class="text-sm mb-1.5">
                        <strong class="text-fundamentos">Por que aprender:</strong> Conhecer a história ajuda a contextualizar...
                    </p>
                    <p class="text-sm">
                        <strong class="text-fundamentos">Conceitos chave:</strong> Teste de Turing, sistemas especialistas, machine learning.
                    </p>
                </div>
            </li>

            <!-- Repita para outros tópicos -->
        </ul>
    </div>
</div>
```

### Exemplo 2: Implementação Simples (Mínimo)

```html
<ul class="topics-list space-y-0.5">
    <li class="topic-item" data-topic="exemplo">
        <button class="topic-button w-full text-left px-4 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-medium text-gray-800">
            💡 Tópico Exemplo
        </button>
        <div class="topic-explanation hidden ml-6 mt-2 p-4 bg-blue-50 rounded-lg border-l-4 border-fundamentos">
            <p class="text-sm mb-1.5">
                <strong class="text-fundamentos">O que é:</strong> Definição
            </p>
            <p class="text-sm mb-1.5">
                <strong class="text-fundamentos">Por que aprender:</strong> Benefício
            </p>
            <p class="text-sm">
                <strong class="text-fundamentos">Conceitos chave:</strong> Termos
            </p>
        </div>
    </li>
</ul>
```

---

## 📊 Implementação Atual no ATIA

### Nível Fundamentos (nivel-fundamentos.html)

**Total de Tópicos:** 19 tópicos em 5 capítulos

| Capítulo | Tópicos | IDs dos Tópicos |
|----------|---------|-----------------|
| **Cap 1** | 4 | `cap1-exponencial`, `cap1-historia`, `cap1-convergencia`, `cap1-democratizacao` |
| **Cap 2** | 4 | `cap2-rev4`, `cap2-ind40`, `cap2-tshaped`, `cap2-alfaia` |
| **Cap 3** | 4 | `cap3-cot`, `cap3-fsl`, `cap3-role`, `cap3-ctx` |
| **Cap 4** | 4 | `cap4-rag`, `cap4-emb`, `cap4-kg`, `cap4-fc` |
| **Cap 5** | 3 | `cap5-rpa`, `cap5-nocode`, `cap5-pred` |

---

## ✅ Melhores Práticas

### 1. Nomenclatura de IDs
- Use prefixo do capítulo: `cap1-`, `cap2-`
- Use slugs descritivos: `exponencial`, `historia`, `rag`
- Mantenha consistência: sempre minúsculo, use hífens

### 2. Estrutura de Conteúdo
- **O que é:** Definição clara e objetiva (1-2 frases)
- **Por que aprender:** Benefício prático e relevância (1-2 frases)
- **Conceitos chave:** Lista de termos separados por vírgula

### 3. Ícones
- Use emojis descritivos para cada tópico
- Mantenha consistência visual dentro do capítulo
- Exemplos: 📈 📜 🔄 🌍 🧠 📝 🎭 ⚙️

### 4. Acessibilidade
- Sempre use `<button>` (não `<div>` clicável)
- Mantenha `text-left` para alinhamento natural
- Use cores com bom contraste (`text-gray-800`)

---

## 🔧 Troubleshooting

### Problema: Tópicos não expandem
**Solução:** Verifique se o JavaScript está carregado e se as classes estão corretas:
```javascript
console.log('Topic system loaded');
```

### Problema: Accordion não fecha outros tópicos
**Solução:** Verifique se o elemento pai tem a classe `.chapter-card`:
```html
<div class="chapter-card">
    <!-- seus tópicos aqui -->
</div>
```

### Problema: Espaçamento inconsistente
**Solução:** Verifique as classes Tailwind:
- Lista: `space-y-0.5`
- Botão: `py-1 px-4`
- Parágrafos: `mb-1.5` (exceto último)

---

## 📚 Referências

- **Implementação:** `nivel-fundamentos.html`
- **JavaScript:** `js/app.js` (linhas 107-133)
- **Inspiração:** FEP Sistema de Expansão de Tópicos
- **Framework CSS:** Tailwind CSS 3.x
- **Padrão de Projeto:** Event Delegation + Accordion

---

## 📄 Histórico de Versões

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | 2025-01-04 | Implementação inicial baseada no FEP |
| 1.1 | 2025-01-04 | Ajuste de espaçamento para ultra-compacto |
| 1.2 | 2025-01-04 | Refinamento final de padding e margins |

---

## 🎯 Nome de Referência

**Nome Oficial:** `ATIA Compact Topics System`
**Nome Curto:** `Compact Topics`
**Comando para Referência:** *"Use o sistema Compact Topics"* ou *"Implemente ATIA Compact Topics"*

---

**Última atualização:** 2025-01-04
**Versão:** 1.2
**Autor:** ATIA Team + Claude Code

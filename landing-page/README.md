# Landing Page - Engenharia de Agentes de IA 2.0

Landing page responsiva e moderna para o curso de Engenharia de Agentes de IA.

## 🚀 URL ao Vivo

**Site:** https://inematds.github.io/FEA-IA/

---

## 📁 Estrutura

```
landing-page/
├── index.html          # Página principal
├── css/
│   └── styles.css     # Estilos CSS completos
├── js/
│   └── main.js        # JavaScript para interatividade
├── assets/            # (futuro) Imagens e recursos
├── sitemap.xml        # Mapa do site para SEO
├── robots.txt         # Configuração para crawlers
└── README.md          # Este arquivo
```

---

## 🎨 Características

### Design
- ✅ **Responsivo** - Mobile-first design
- ✅ **Moderno** - Gradientes, glassmorphism, animações
- ✅ **Performance** - CSS otimizado, lazy loading
- ✅ **Acessível** - Semântica HTML5, boas práticas

### Funcionalidades
- ✅ Navegação mobile com menu hamburger
- ✅ Scroll suave entre seções
- ✅ Animações ao scroll (Intersection Observer)
- ✅ Contadores animados nas estatísticas
- ✅ Efeito de digitação no código de exemplo
- ✅ Cards de módulos interativos

### SEO
- ✅ Meta tags completas (Open Graph, Twitter)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ URLs canônicas
- ✅ Estrutura semântica

---

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Design moderno com custom properties
- **JavaScript (Vanilla)** - Sem dependências
- **Google Fonts** - Inter e Space Grotesk

---

## 🚀 Deploy

Esta landing page está configurada para GitHub Pages.

### Pré-requisitos
- Repositório no GitHub
- GitHub Pages habilitado

### Configuração

1. **Settings > Pages**
   - Source: Branch `main`
   - Folder: `/landing-page`
   - Save

2. **Aguardar Deploy**
   - ~1-2 minutos
   - Verificar em Actions

3. **Acessar**
   - https://inematds.github.io/FEA-IA/

Ver guia completo: [GITHUB-PAGES-SETUP.md](../GITHUB-PAGES-SETUP.md)

---

## 🎨 Customização

### Cores

As cores são definidas via CSS custom properties em `css/styles.css`:

```css
:root {
    --primary: #00D9FF;      /* Ciano vibrante */
    --secondary: #8B5CF6;    /* Roxo */
    --dark: #1A1F3A;         /* Azul escuro */
    --text: #E5E7EB;         /* Texto claro */
    /* ... */
}
```

### Conteúdo

Edite `index.html` para atualizar:
- Textos e descrições
- Links para módulos
- Estatísticas
- CTAs

### Estilos

Edite `css/styles.css`:
- Layout e grid
- Animações
- Responsividade
- Temas

### Interatividade

Edite `js/main.js`:
- Navegação
- Animações
- Eventos
- Contadores

---

## 📱 Responsividade

Breakpoints:

```css
/* Mobile: < 768px */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */
```

Testado em:
- ✅ Chrome, Firefox, Safari, Edge
- ✅ iOS Safari, Chrome Mobile
- ✅ Resoluções 320px - 2560px

---

## ⚡ Performance

### Otimizações Aplicadas

- ✅ CSS minificado (pode ser melhorado)
- ✅ Lazy loading de animações
- ✅ Preconnect para Google Fonts
- ✅ Uso de Intersection Observer
- ✅ Sem dependências externas pesadas

### Próximas Otimizações

- [ ] Minificar CSS e JS
- [ ] Otimizar e adicionar imagens WebP
- [ ] Service Worker para cache
- [ ] Critical CSS inline

---

## 📊 Analytics (Opcional)

Para adicionar Google Analytics, edite `index.html` e adicione no `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🐛 Troubleshooting

### CSS não carrega
- Verifique paths: `css/styles.css` (relativo)
- Limpe cache do navegador (Ctrl+Shift+R)

### JavaScript não funciona
- Verifique console do navegador (F12)
- Confirme que `js/main.js` existe

### 404 no GitHub Pages
- Confirme que `index.html` está na pasta `/landing-page`
- Verifique configuração em Settings > Pages

---

## 📄 Licença

MIT License - Ver [LICENSE](../LICENSE)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Ver [CONTRIBUTING.md](../CONTRIBUTING.md)

**Tipos de contribuições:**
- 🐛 Correções de bugs
- 🎨 Melhorias de design
- ⚡ Otimizações de performance
- 📱 Melhorias de responsividade
- ♿ Melhorias de acessibilidade

---

## 📞 Contato

- **GitHub**: https://github.com/inematds/FEA-IA
- **Issues**: https://github.com/inematds/FEA-IA/issues
- **Email**: inematds@gmail.com

---

<div align="center">

**Feito com ❤️ para a comunidade de IA**

[Ver Site](https://inematds.github.io/FEA-IA/) | [Ver Código](https://github.com/inematds/FEA-IA)

</div>

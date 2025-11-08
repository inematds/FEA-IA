// Quick client-side normalization for mojibake seen in some builds
// Safely replaces only known-bad sequences in text nodes
(function fixEncoding() {
  const replacements = new Map([
    ['m��dulo', 'módulo'],
    ['m��dulos', 'módulos'],
    ['InteligǦncia', 'Inteligência'],
    ['conteǧdo', 'conteúdo'],
    ['Conteǧdo', 'Conteúdo'],
    ['In��cio', 'Início'],
    ['Come��ar', 'Começar'],
    ['prǭtico', 'prático'],
    ['prǭticos', 'práticos'],
    ['aplicǭveis', 'aplicáveis'],
    ['indǧstria', 'indústria'],
    ['cria��ǜo', 'criação'],
    ['avan��adas', 'avançadas'],
    ['vocǦ', 'você'],
    ['atǸ', 'até'],
    [' Ǹ ', ' é '], // surrounded by spaces to avoid false positives
  ]);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  for (const node of nodes) {
    let t = node.nodeValue;
    if (!t || !/[-FF-]/.test(t)) continue;
    for (const [bad, good] of replacements) {
      if (t.includes(bad)) t = t.split(bad).join(good);
    }
    if (t !== node.nodeValue) node.nodeValue = t;
  }
})();


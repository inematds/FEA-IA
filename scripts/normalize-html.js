#!/usr/bin/env node
const fs = require('fs');
const path = process.argv[2];
if (!path) { console.error('Usage: node scripts/normalize-html.js <file>'); process.exit(1); }
let html = fs.readFileSync(path, 'utf8');
const pairs = [
  ['m��dulos', 'módulos'], ['m��dulo', 'módulo'], ['M��dulos', 'Módulos'],
  ['m�dulos', 'módulos'], ['m�dulo', 'módulo'], ['M�dulos', 'Módulos'],
  ['InteligǦncia', 'Inteligência'], ['Intelig�ncia', 'Inteligência'],
  ['conteǧdo', 'conteúdo'], ['Conteǧdo', 'Conteúdo'], ['conte�do', 'conteúdo'], ['Conte�do', 'Conteúdo'],
  ['In��cio', 'Início'], ['In�cio', 'Início'],
  ['Come��ar', 'Começar'], ['Come�ar', 'Começar'],
  ['prǭtico', 'prático'], ['prǭticos', 'práticos'],
  ['aplicǭveis', 'aplicáveis'], ['indǧstria', 'indústria'],
  ['cria��ǜo', 'criação'], ['cria��o', 'criação'],
  ['avan��adas', 'avançadas'], ['avan�adas', 'avançadas'],
  ['vocǦ', 'você'], ['VocǦ', 'Você'],
  ['estǭ', 'está'], ['estarǭ', 'estará'],
  ['empresa/carreira serǭ', 'empresa/carreira será'],
  ['questǜo', 'questão'], ['Nǜo', 'Não'], ['nǜo', 'não'],
  ['neg��cios', 'negócios'], ['estratǸgico', 'estratégico'],
  ['tǸcnicas', 'técnicas'], ['tǸcnico', 'técnico'], ['TǸcnico', 'Técnico'],
  ['dispon��veis', 'disponíveis'], ['execu��ǜo', 'execução'],
  ['aplica����es', 'aplicações'],
  ['licen��a', 'licença'], ['Licen��a', 'Licença'],
  ['Contribui����es', 'Contribuições'],
  ['Descri��ǜo', 'Descrição'], ['Descri��o', 'Descrição'],
  ['Visǜo', 'Visão'], ['dura��ǜo', 'duração'], ['Dura��ǜo', 'Duração'],
  ['atǸ', 'até'], [' Ǹ ', ' é '],
  ['�Y�-', '★'], ['�o�', '✓'],
  ['Conteǧdo', 'Conteúdo'], ['M��dulos', 'Módulos'], ['Come��ar Agora', 'Começar Agora'],
  // cp1252-like artifacts
  ['M�dulos', 'Módulos'], ['M�dulo', 'Módulo'], ['m�dulos', 'módulos'], ['m�dulo', 'módulo'],
  ['Conte�do', 'Conteúdo'], ['conte�do', 'conteúdo'],
  ['T�cnico', 'Técnico'], ['t�cnico', 'técnico'], ['t�cnicas', 'técnicas'],
  ['Come�ar', 'Começar'], ['In�cio', 'Início'], ['Vis�o', 'Visão'],
  ['Produ��o', 'Produção'], ['gera��o', 'geração'], ['execu��o', 'execução']
];
for (const [bad, good] of pairs) {
  if (bad) html = html.split(bad).join(good);
}
html = html.replace(/\n\s*<script[^>]*src="js\/fix-encoding\.js"[^>]*><\/script>/, '');
fs.writeFileSync(path, html, { encoding: 'utf8' });
console.log('Normalized:', path);

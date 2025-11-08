#!/usr/bin/env node
const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Usage: node scripts/fix-encoding.js <files...>');
  process.exit(1);
}

const map = new Map([
  // Common mojibake in repo
  ['m��dulos', 'módulos'],
  ['m��dulo', 'módulo'],
  ['m�dulos', 'módulos'],
  ['m�dulo', 'módulo'],
  ['InteligǦncia', 'Inteligência'],
  ['Intelig�ncia', 'Inteligência'],
  ['conteǧdo', 'conteúdo'],
  ['Conteǧdo', 'Conteúdo'],
  ['conte�do', 'conteúdo'],
  ['Conte�do', 'Conteúdo'],
  ['In��cio', 'Início'],
  ['In�cio', 'Início'],
  ['Come��ar', 'Começar'],
  ['Come�ar', 'Começar'],
  ['prǭtico', 'prático'],
  ['prǭticos', 'práticos'],
  ['aplicǭveis', 'aplicáveis'],
  ['indǧstria', 'indústria'],
  ['cria��ǜo', 'criação'],
  ['cria��o', 'criação'],
  ['avan��adas', 'avançadas'],
  ['avan�adas', 'avançadas'],
  ['vocǦ', 'você'],
  ['VocǦ', 'Você'],
  ['estǭ', 'está'],
  ['estarǭ', 'estará'],
  ['empresa/carreira serǭ', 'empresa/carreira será'],
  ['questǜo', 'questão'],
  ['Nǜo', 'Não'],
  ['nǜo', 'não'],
  ['neg��cios', 'negócios'],
  ['estratǸgico', 'estratégico'],
  ['tǸcnicos', 'técnicos'],
  ['TǸcnico', 'Técnico'],
  ['dispon��veis', 'disponíveis'],
  ['execu��ǜo', 'execução'],
  ['aplica����es', 'aplicações'],
  ['licen��a', 'licença'],
  ['Licen��a', 'Licença'],
  ['Contribui����es', 'Contribuições'],
  ['Descri��ǜo', 'Descrição'],
  ['Descri��o', 'Descrição'],
  ['Visǜo', 'Visão'],
  ['dura��ǜo', 'duração'],
  ['Dura��ǜo', 'Duração'],
  ['t�cnicas', 'técnicas'],
  ['t�cnico', 'técnico'],
  ['atǸ', 'até'],
  [' Ǹ ', ' é '],
  // Odds
  ['M��dulo', 'Módulo'],
  ['M�dulo', 'Módulo'],
]);

for (const file of process.argv.slice(2)) {
  try {
    const orig = fs.readFileSync(file, 'utf8');
    let out = orig;
    for (const [bad, good] of map.entries()) {
      if (!bad) continue;
      out = out.split(bad).join(good);
    }
    if (out !== orig) {
      fs.writeFileSync(file, out, { encoding: 'utf8' });
      console.log(`Fixed: ${file}`);
    } else {
      console.log(`No changes: ${file}`);
    }
  } catch (e) {
    console.error(`Error on ${file}:`, e.message);
    process.exitCode = 1;
  }
}


#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para atualizar todos os botões "Acessar Curso" para "INEMA.CLUB"
e trocar o link para http://inema.club
"""
import os
import re
import sys
from pathlib import Path

# Fix encoding issues on Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Padrões a buscar e substituir
PATTERNS = [
    # Padrão 1: Link do GitHub com texto "Acessar Curso"
    (
        r'<a href="https://github\.com/inematds/FEA-IA#readme"([^>]*?)>Acessar Curso</a>',
        r'<a href="http://inema.club"\1>INEMA.CLUB</a>'
    ),
    # Padrão 2: Outros links que possam ter "Acessar Curso"
    (
        r'<a href="[^"]*"([^>]*?)>Acessar Curso</a>',
        r'<a href="http://inema.club"\1>INEMA.CLUB</a>'
    ),
]

def update_file(file_path):
    """Atualiza um arquivo HTML"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Aplicar todos os padrões
        for pattern, replacement in PATTERNS:
            content = re.sub(pattern, replacement, content)

        # Só escreve se houver mudanças
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Atualizado: {file_path}")
            return True
        else:
            print(f"⏭️  Sem alterações: {file_path}")
            return False
    except Exception as e:
        print(f"❌ Erro em {file_path}: {e}")
        return False

def main():
    """Função principal"""
    base_dir = Path(__file__).parent.parent

    # Diretórios a processar
    dirs_to_process = [
        base_dir / "niveis",
        base_dir / "modulos",
        base_dir / "landing-page" / "niveis",
        base_dir / "landing-page" / "modulos",
    ]

    updated_count = 0
    total_count = 0

    print("🔄 Iniciando atualização de botões...\n")

    for directory in dirs_to_process:
        if not directory.exists():
            print(f"⚠️  Diretório não encontrado: {directory}")
            continue

        print(f"\n📁 Processando: {directory}")

        for html_file in directory.glob("*.html"):
            total_count += 1
            if update_file(html_file):
                updated_count += 1

    print(f"\n{'='*60}")
    print(f"✨ Processo concluído!")
    print(f"📊 {updated_count} de {total_count} arquivos atualizados")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()

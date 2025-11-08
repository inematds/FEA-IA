/* ================================================
   FEA-IA - Sistema de Tópicos Compactos
   Baseado no ATIA Compact Topics System
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 FEA-IA Sistema de Tópicos Carregado');

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

                // COMPORTAMENTO ACCORDION: Fecha outras explicações abertas no mesmo módulo
                const moduleCard = topicItem.closest('.module-content');
                if (moduleCard) {
                    moduleCard.querySelectorAll('.topic-explanation').forEach(exp => {
                        if (exp !== explanation) {
                            exp.classList.add('hidden');
                        }
                    });
                }

                // Atualiza ícone do botão (opcional)
                const icon = button.querySelector('.topic-icon');
                if (icon) {
                    icon.textContent = explanation.classList.contains('hidden') ? '▶' : '▼';
                }
            }
        }
    });

    /* ========================================
       SMOOTH SCROLL NAVIGATION
       ======================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    /* ========================================
       PROGRESS TRACKING (LOCAL STORAGE)
       ======================================== */

    // Marcar tópicos como lidos
    const topicButtons = document.querySelectorAll('.topic-button');
    topicButtons.forEach(button => {
        const topicItem = button.closest('.topic-item');
        const topicId = topicItem.dataset.topic;

        if (topicId) {
            // Verificar se já foi lido
            if (localStorage.getItem(`topic-read-${topicId}`) === 'true') {
                button.classList.add('topic-read');
                const checkbox = button.querySelector('.topic-checkbox');
                if (checkbox) checkbox.textContent = '✓';
            }

            // Marcar como lido ao expandir
            button.addEventListener('click', function() {
                localStorage.setItem(`topic-read-${topicId}`, 'true');
                button.classList.add('topic-read');
                const checkbox = button.querySelector('.topic-checkbox');
                if (checkbox) checkbox.textContent = '✓';
            });
        }
    });

    /* ========================================
       MODULE PROGRESS BAR
       ======================================== */

    function updateModuleProgress() {
        const modules = document.querySelectorAll('.module-content');

        modules.forEach(module => {
            const moduleId = module.dataset.module;
            if (!moduleId) return;

            const topics = module.querySelectorAll('.topic-item');
            const readTopics = Array.from(topics).filter(topic => {
                const topicId = topic.dataset.topic;
                return localStorage.getItem(`topic-read-${topicId}`) === 'true';
            });

            const progress = topics.length > 0 ? (readTopics.length / topics.length) * 100 : 0;

            // Atualizar barra de progresso se existir
            const progressBar = module.querySelector('.module-progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }

            // Atualizar texto de progresso
            const progressText = module.querySelector('.module-progress-text');
            if (progressText) {
                progressText.textContent = `${readTopics.length}/${topics.length} tópicos`;
            }
        });
    }

    // Atualizar progresso ao carregar a página
    updateModuleProgress();

    /* ========================================
       MOBILE MENU TOGGLE
       ======================================== */

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    /* ========================================
       COPY CODE BLOCKS
       ======================================== */

    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.textContent = 'Copiar';
        button.title = 'Copiar código';

        pre.style.position = 'relative';
        pre.appendChild(button);

        button.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(block.textContent);
                button.textContent = '✓ Copiado!';
                setTimeout(() => {
                    button.textContent = 'Copiar';
                }, 2000);
            } catch (err) {
                console.error('Erro ao copiar:', err);
                button.textContent = '✗ Erro';
                setTimeout(() => {
                    button.textContent = 'Copiar';
                }, 2000);
            }
        });
    });

    /* ========================================
       PRINT & EXPORT UTILITIES
       ======================================== */

    window.printModule = function() {
        window.print();
    };

    window.resetProgress = function() {
        if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
            const keys = Object.keys(localStorage).filter(k => k.startsWith('topic-read-'));
            keys.forEach(k => localStorage.removeItem(k));
            location.reload();
        }
    };

    console.log('✅ Sistema de Tópicos Pronto');
});

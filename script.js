document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Animação de Fade-in com Intersection Observer ---
    // Seleciona todos os elementos que devem ter a animação
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // relativo ao viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% do elemento visível
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    };

    // Cria o observador
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observa cada elemento
    fadeElements.forEach(el => {
        observer.observe(el);
    });


   // --- 2. Envio do Formulário de Contato com AJAX (FormSubmit) ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impedimos o envio padrão do navegador
        
        // Pegamos os dados do formulário e o 'action' (URL do FormSubmit)
        const formData = new FormData(contactForm);
        const action = contactForm.getAttribute('action');

        // Exibimos uma mensagem de "enviando..."
        formMessage.innerHTML = `
            <div class="alert alert-info" role="alert">
                Enviando sua mensagem...
            </div>
        `;

        // Usamos fetch para enviar os dados via AJAX (sem recarregar a página)
        fetch(action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json' // Pedimos uma resposta em JSON
            }
        })
        .then(response => response.json()) // Convertemos a resposta para JSON
        .then(data => {
            // Se o FormSubmit retornar sucesso
            if (data.success) {
                formMessage.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Obrigado! Sua mensagem foi enviada com sucesso.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                // Limpa o formulário
                contactForm.reset();
            } else {
                // Se o FormSubmit retornar um erro (ex: JSON mal formatado)
                throw new Error('Ocorreu um erro retornado pelo servidor.');
            }
        })
        .catch(error => {
            // Se der erro na rede ou no 'catch' acima
            console.error('Erro ao enviar formulário:', error);
            formMessage.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        });
    });


    // --- 3. Fechar o Menu Mobile ao Clicar em um Link ---
    // (Melhoria de usabilidade para o menu do Bootstrap)
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navMenu = document.getElementById('navMenu');
    
    // Cria uma instância do Collapse do Bootstrap
    const bsCollapse = new bootstrap.Collapse(navMenu, { toggle: false });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Verifica se o menu está aberto (visível em telas pequenas)
            if (navMenu.classList.contains('show')) {
                bsCollapse.hide();
            }
        });
    });

});

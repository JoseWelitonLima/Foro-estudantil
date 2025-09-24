document.addEventListener("DOMContentLoaded", function() {
    let currentIndex = 0;
    const noticias = document.querySelectorAll('.carousel .noticia');
    const totalNoticias = noticias.length;

    // Função para mostrar a próxima notícia
    function showNextNoticia() {
        noticias[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % totalNoticias;
        noticias[currentIndex].classList.add('active');
    }

    // Mostra a primeira notícia
    noticias[0].classList.add('active');

    // Muda a notícia a cada 5 segundos
    setInterval(showNextNoticia, 5000);

    // Adiciona clique nas notícias (opcional: já que cada notícia tem seu próprio link)
    noticias.forEach(noticia => {
        noticia.addEventListener('click', function(e) {
            const link = this.querySelector('a').href;
            window.location.href = link;
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const topBar = document.querySelector('.top-bar');
    const bottomBar = document.querySelector('.bottom-bar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTop) {
            // Scrolling down
            topBar.style.transform = 'translateY(-100%)';
            topBar.style.opacity = '0';
            bottomBar.style.top = '0';
        } else {
            // Scrolling up
            topBar.style.transform = 'translateY(0)';
            topBar.style.opacity = '1';
            bottomBar.style.top = '85px';
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Criar e adicionar botão do menu
    const topBar = document.querySelector('.top-bar');
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.setAttribute('aria-label', 'Menu');
    menuButton.innerHTML = '<span class="menu-icon"></span>';
    
    // Adicionar o botão antes do botão "entre"
    const entreButton = document.querySelector('.entre');
    topBar.insertBefore(menuButton, entreButton);

    const bottomBar = document.querySelector('.bottom-bar');
    
    // Controle do menu mobile
    menuButton.addEventListener('click', function() {
        this.classList.toggle('menu-active');
        bottomBar.classList.toggle('active');
        
        // Prevenir scroll quando menu está aberto
        document.body.style.overflow = bottomBar.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em um link
    const menuLinks = bottomBar.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuButton.classList.remove('menu-active');
            bottomBar.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuButton.classList.remove('menu-active');
            bottomBar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        if (!bottomBar.contains(event.target) && 
            !menuButton.contains(event.target) && 
            bottomBar.classList.contains('active')) {
            menuButton.classList.remove('menu-active');
            bottomBar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
// Redirecionamento discreto do logo
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('logoRedirect');
    
    if (logo) {
        // Adiciona cursor pointer apenas quando hover (opcional)
        logo.style.cursor = 'pointer';
        
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
        
        // Opcional: manter o estilo exatamente igual quando hover
        logo.addEventListener('mouseenter', function() {
            this.style.opacity = '0.9';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
    }
});
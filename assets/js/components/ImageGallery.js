

//Criando Custom HTML Components ─────────────────────────────────────────────────────────────────────────────── ✣ ──

class TImageGallery extends HTMLElement {
    // =======================================
    // Função principal main()
    // =======================================
    //Navegador executa automaticamente a função connectedCallback ao baixar o script
    connectedCallback() {
        setTimeout(() => { // Timeout, esse Callback so vai rodar depois do HTML da pagina ser baixado por inteiro. 
            const Cards_HTML = this.innerHTML; // Salva os <t-cards> dentro do <t-card-carousel>
            this.mainSlider = this.querySelector('.gallery-main');
            this.thumbSlider = this.querySelector('.gallery-thumbs');
            if (!this.mainSlider || !this.thumbSlider) return;

            this.renderizador(Cards_HTML); //Inicia o script de carimbar o HTML na página
            this.initDragToScroll(this.mainSlider);
            this.initThumbnailClickNav();
            this.initScrollSyncObserver();
        }, 0);
    }
    	

    // ====================================
    // Função que faz o HTML Stamping
    // ====================================
    renderizador(){
        // Declaração das variáveis capturadas no HTML ────────────────────────────────────────────────────── ✣ ──
        const PAGINA_ATUAL =
            window.location.pathname
            .split("/")
            .filter(Boolean)
            .pop()
            ?.replace(".html", "") || "index";
        const card_group_id = this.getAttribute("card-group-id");
        const card_id = this.getAttribute("card-id");
        const icon_svg = this.getAttribute("icon-svg") || "";
        const links = {
        };
        
        // Template Stamper (So insere o HTML) ────────────────────────────────────────────────────── ✣ ──
        this.innerHTML = `

<!-- ─── IMAGE GALLERY START ──────────────────────────────────────────────────────────────── ✣ ─ -->



<!-- ─── IMAGE GALLERY END ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ✣ ─ -->
        `
    }


    // ====================================
    // 1. Lógica de Scroll com o Mouse (Seu código original, adaptado)
    // ====================================
    initDragToScroll(slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active'); // CSS desativa o snap e smooth scroll aqui
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return; 
            e.preventDefault(); 
            
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Velocidade do arrasto
            slider.scrollLeft = scrollLeft - walk;
        });
        
        // Previne o "arrastar" nativo das imagens e links pelo navegador
        const imgs = slider.querySelectorAll('img');
        imgs.forEach(el => {
            el.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }

    // ====================================
    // 2. Lógica de Clique nas Miniaturas
    // ====================================
    initThumbnailClickNav() {
        const thumbs = this.thumbSlider.querySelectorAll('.gallery-thumb');
        const mainImages = this.mainSlider.querySelectorAll('.gallery-image');

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                const targetImage = mainImages[index];
                if (!targetImage) return;

                // Rola suavemente a galeria principal para a imagem correspondente
                // O comportamento 'smooth' é crucial aqui.
                this.mainSlider.scrollTo({
                    left: targetImage.offsetLeft - this.mainSlider.offsetLeft,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ====================================
    // 3. Lógica de Sincronização de Rolagem (IntersectionObserver)
    // ====================================
    initScrollSyncObserver() {
        const thumbs = this.thumbSlider.querySelectorAll('.gallery-thumb');
        const mainImages = this.mainSlider.querySelectorAll('.gallery-image');

        // Configuração do Observador:
        // Detecta quando a imagem ocupa pelo menos 60% do centro do slider principal.
        const observerOptions = {
            root: this.mainSlider, // O elemento que contém o scroll
            threshold: 0.6 // 60% da imagem precisa estar visível
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                // Se a imagem principal entrou na área visível
                if (entry.isIntersecting) {
                    // Descobre o índice da imagem visível
                    const index = Array.from(mainImages).indexOf(entry.target);
                    if (index !== -1) {
                        // Atualiza a classe ativa nas miniaturas
                        this.updateActiveThumbnail(thumbs, index);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        // Começa a observar cada imagem da galeria principal
        mainImages.forEach(img => observer.observe(img));
    }

    // Função auxiliar para atualizar as classes
    updateActiveThumbnail(thumbs, activeIndex) {
        thumbs.forEach((thumb, index) => {
            if (index === activeIndex) {
                thumb.classList.add('is-active');
                // Opcional: Rola o slider de miniaturas para manter a ativa visível
                // thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('is-active');
            }
        });
    }
}


customElements.define('t-image-gallery', TImageGallery);
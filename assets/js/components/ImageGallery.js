


//Criando Custom HTML Components ─────────────────────────────────────────────────────────────────────────────── ✣ ──

class TImageGallery extends HTMLElement {
    // =======================================
    // Função principal main()
    // =======================================
    connectedCallback() {
        setTimeout(() => { 
            // 1. Apenas seleciona os elementos que já estão no HTML da página
            this.mainSlider = this.querySelector('.image-gallery__main-container');
            this.thumbSlider = this.querySelector('.image-gallery__thumb-container');
            
            if (!this.mainSlider || !this.thumbSlider) {
                console.warn("⚠️ t-image-gallery: Estrutura da galeria não encontrada no HTML.");
                return;
            }

            // 2. Inicia as funções diretamente nas tags reais da tela!
            this.initDragToScroll(this.mainSlider);
            this.initThumbnailClickNav();
            this.initScrollSyncObserver();
        }, 0);
    }
        

    // ====================================
    // 1. Lógica de Scroll com o Mouse
    // ====================================
    initDragToScroll(slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
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
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeft - walk;
        });
        
        const imgs = slider.querySelectorAll('img');
        imgs.forEach(el => {
            el.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }

    // ====================================
    // 2. Lógica de Clique nas Miniaturas
    // ====================================
    initThumbnailClickNav() {
        const thumbs = this.thumbSlider.querySelectorAll('.image-gallery__thumb-image');
        const mainImages = this.mainSlider.querySelectorAll('.image-gallery__main-image');

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                const targetImage = mainImages[index];
                if (!targetImage) return;

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
        const thumbs = this.thumbSlider.querySelectorAll('.image-gallery__thumb-image');
        const mainImages = this.mainSlider.querySelectorAll('.image-gallery__main-image');

        const observerOptions = {
            root: this.mainSlider, 
            threshold: 0.6 
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(mainImages).indexOf(entry.target);
                    if (index !== -1) {
                        this.updateActiveThumbnail(thumbs, index);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        mainImages.forEach(img => observer.observe(img));
    }

    // Função auxiliar para atualizar as classes
    updateActiveThumbnail(thumbs, activeIndex) {
        thumbs.forEach((thumb, index) => {
            if (index === activeIndex) {
                thumb.classList.add('is-active');
            } else {
                thumb.classList.remove('is-active');
            }
        });
    }
}

customElements.define('t-image-gallery', TImageGallery);
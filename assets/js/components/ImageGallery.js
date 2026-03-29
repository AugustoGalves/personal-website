

//Criando Custom HTML Components ─────────────────────────────────────────────────────────────────────────────── ✣ ──

class TImageGallery extends HTMLElement {
    // =======================================
    // Função principal main()
    // =======================================
    connectedCallback() {
        setTimeout(() => { 
            // 1. Captura imagens E vídeos que você digitou no HTML
            const originalMedia = Array.from(this.querySelectorAll('img, video'));
            
            if (originalMedia.length === 0) {
                console.warn("⚠️ t-image-gallery: Nenhuma tag <img> ou <video> encontrada dentro do componente.");
                return;
            }

            // 2. Extrai os dados (src, alt e o tipo da tag)
            const mediaData = originalMedia.map(media => ({
                type: media.tagName.toLowerCase(), // Verifica se é 'img' ou 'video'
                src: media.getAttribute('src'),
                alt: media.getAttribute('alt') || 'Mídia do projeto'
            }));

            // 3. Renderiza a estrutura completa na tela
            this.renderizador(mediaData);

            // 4. AGORA SIM, com os elementos novos na tela, nós os selecionamos
            this.mainSlider = this.querySelector('.image-gallery__main-container');
            this.thumbSlider = this.querySelector('.image-gallery__thumb-container');
            
            if (!this.mainSlider || !this.thumbSlider) return;

            // 5. Inicia as lógicas de interação
            this.initDragToScroll(this.mainSlider);
            this.initThumbnailClickNav();
            this.initScrollSyncObserver();
        }, 0);
    }
        
    // ====================================
    // Função que faz o HTML Stamping
    // ====================================
    renderizador(mediaList){
        // Constrói o HTML principal (verifica se é vídeo ou imagem)
        const mainMediaHTML = mediaList.map(media => {
            if (media.type === 'video') {
                return `<video src="${media.src}" class="image-gallery__main-image" controls muted loop></video>`;
            }
            return `<img src="${media.src}" alt="${media.alt}" class="image-gallery__main-image" loading="lazy">`;
        }).join('');

        // Constrói o HTML das miniaturas
        const thumbMediaHTML = mediaList.map((media, index) => {
            const activeClass = index === 0 ? 'is-active' : '';
            if (media.type === 'video') {
                return `<video src="${media.src}" class="image-gallery__thumb-image ${activeClass}" muted></video>`;
            }
            return `<img src="${media.src}" alt="Miniatura: ${media.alt}" class="image-gallery__thumb-image ${activeClass}" loading="lazy">`;
        }).join('');
        
        // Carimba a estrutura final no HTML
        this.innerHTML = `
            <section class="image-gallery image-gallery__main-container mb-2 flex gap3 pb-1">
                ${mainMediaHTML}
            </section>
            
            <nav class="image-gallery image-gallery__thumb-container flex gap2 pb-2">
                ${thumbMediaHTML}
            </nav>
        `;
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
        
        // Previne o dragstart em imagens e vídeos para não bugar o scroll manual
        const mediaElements = slider.querySelectorAll('img, video');
        mediaElements.forEach(el => {
            el.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }

    // ====================================
    // 2. Lógica de Clique nas Miniaturas
    // ====================================
    initThumbnailClickNav() {
        const thumbs = this.thumbSlider.querySelectorAll('.image-gallery__thumb-image');
        const mainMedia = this.mainSlider.querySelectorAll('.image-gallery__main-image');

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                const targetMedia = mainMedia[index];
                if (!targetMedia) return;

                this.mainSlider.scrollTo({
                    left: targetMedia.offsetLeft - this.mainSlider.offsetLeft,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ====================================
    // 3. Lógica de Sincronização de Rolagem
    // ====================================
    initScrollSyncObserver() {
        const thumbs = this.thumbSlider.querySelectorAll('.image-gallery__thumb-image');
        const mainMedia = this.mainSlider.querySelectorAll('.image-gallery__main-image');

        const observerOptions = {
            root: this.mainSlider, 
            threshold: 0.6 
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(mainMedia).indexOf(entry.target);
                    if (index !== -1) {
                        this.updateActiveThumbnail(thumbs, index);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        mainMedia.forEach(media => observer.observe(media));
    }

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
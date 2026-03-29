

// Criando Custom HTML Components ─────────────────────────────────────────────────────────────────────────────── ✣ ──

class TImageGallery extends HTMLElement {
    // =======================================
    // Inicialização
    // =======================================
    connectedCallback() {
        requestAnimationFrame(() => this.init());
    }

    init() {
        const originalMedia = Array.from(this.querySelectorAll('img, video'));
        
        if (originalMedia.length === 0) {
            console.warn("⚠️ t-image-gallery: Nenhuma tag <img> ou <video> encontrada.");
            return;
        }

        this.render(originalMedia);

        this.mainSlider = this.querySelector('.image-gallery__main-container');
        this.thumbSlider = this.querySelector('.image-gallery__thumb-container');
        this.modal = this.querySelector('.image-gallery__modal');
        this.modalImg = this.modal.querySelector('img');
        
        if (!this.mainSlider || !this.thumbSlider) return;

        this.setupEvents();
        this.initScrollSyncObserver();
    }
        
    // ====================================
    // Renderização e Estrutura HTML
    // ====================================
    render(mediaList) {
        const createMediaHTML = (media, isMain, index = 0) => {
            const isVideo = media.tagName.toLowerCase() === 'video';
            const src = media.getAttribute('src');
            const alt = media.getAttribute('alt') || 'Mídia do projeto';
            
            const baseClass = isMain 
                ? 'image-gallery__main-image' 
                : `image-gallery__thumb-image ${index === 0 ? 'is-active' : ''}`;

            if (isVideo) {
                return `<video src="${src}" class="${baseClass}" ${isMain ? 'controls loop' : ''} muted></video>`;
            }
            
            // Cursor alterado para pointer (clique normal) nas imagens principais
            const cursorStyle = isMain ? 'style="cursor: pointer;"' : '';
            return `<img src="${src}" alt="${alt}" class="${baseClass}" loading="lazy" ${cursorStyle}>`;
        };

        const mainMediaHTML = mediaList.map(m => createMediaHTML(m, true)).join('');
        const thumbMediaHTML = mediaList.map((m, i) => createMediaHTML(m, false, i)).join('');
        
        // CSS embutido para as setas (pode ser movido para o seu arquivo CSS se preferir)
        const styles = `
            <style>
                .image-gallery__wrapper { position: relative; }
                .image-gallery__nav-arrow {
                    position: absolute; top: 50%; transform: translateY(-50%); z-index: 10;
                    background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%;
                    width: 40px; height: 40px; cursor: pointer; font-size: 18px;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s ease;
                }
                .image-gallery__nav-arrow:hover { background: rgba(0,0,0,0.8); }
                .image-gallery__nav-arrow.prev { left: 10px; }
                .image-gallery__nav-arrow.next { right: 10px; }
                
                /* Oculta as setas em telas menores (mobile/tablets) */
                @media (max-width: 768px) {
                    .image-gallery__nav-arrow { display: none; }
                }
            </style>
        `;

        this.innerHTML = `
            ${styles}
            <div class="image-gallery__wrapper">
                <button class="image-gallery__nav-arrow prev" aria-label="Anterior">&#10094;</button>
                <section class="image-gallery image-gallery__main-container mb-2 flex gap3 pb-1" style="overflow-x: auto;">
                    ${mainMediaHTML}
                </section>
                <button class="image-gallery__nav-arrow next" aria-label="Próximo">&#10095;</button>
            </div>
            
            <nav class="image-gallery image-gallery__thumb-container flex gap2 pb-2">
                ${thumbMediaHTML}
            </nav>

            <div class="image-gallery__modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999; align-items: center; justify-content: center; cursor: zoom-out;">
                <img src="" alt="Imagem Ampliada" style="max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 8px;">
            </div>
        `;
    }

    // ====================================
    // Centralização de Eventos
    // ====================================
    setupEvents() {
        let isDown = false;
        let hasDragged = false; 
        let startX, scrollLeft;

        // --- Eventos de Drag ---
        this.mainSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            hasDragged = false;
            this.mainSlider.classList.add('active'); 
            startX = e.pageX - this.mainSlider.offsetLeft;
            scrollLeft = this.mainSlider.scrollLeft;
        });

        window.addEventListener('mouseup', () => {
            isDown = false;
            if(this.mainSlider) this.mainSlider.classList.remove('active');
        });

        this.mainSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return; 
            e.preventDefault(); 
            
            const x = e.pageX - this.mainSlider.offsetLeft;
            const


// Criando Custom HTML Components ─────────────────────────────────────────────────────────────────────────────── ✣ ──

class TImageGallery extends HTMLElement {
    // =======================================
    // Inicialização
    // =======================================
    connectedCallback() {
        // requestAnimationFrame é mais limpo e seguro que setTimeout para aguardar o parse do DOM
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
        // Função auxiliar para evitar repetição de if/else no map
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
            
            // Adiciona cursor de zoom apenas nas imagens principais
            const cursorStyle = isMain ? 'style="cursor: zoom-in;"' : '';
            return `<img src="${src}" alt="${alt}" class="${baseClass}" loading="lazy" ${cursorStyle}>`;
        };

        const mainMediaHTML = mediaList.map(m => createMediaHTML(m, true)).join('');
        const thumbMediaHTML = mediaList.map((m, i) => createMediaHTML(m, false, i)).join('');
        
        // Estrutura principal + Modal de Zoom oculto
        this.innerHTML = `
            <section class="image-gallery image-gallery__main-container mb-2 flex gap3 pb-1">
                ${mainMediaHTML}
            </section>
            
            <nav class="image-gallery image-gallery__thumb-container flex gap2 pb-2">
                ${thumbMediaHTML}
            </nav>

            <div class="image-gallery__modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999; align-items: center; justify-content: center; cursor: zoom-out;">
                <img src="" alt="Imagem Ampliada" style="max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 8px;">
            </div>
        `;
    }

    // ====================================
    // Centralização de Eventos (Drag, Clicks, Modal)
    // ====================================
    setupEvents() {
        let isDown = false;
        let hasDragged = false; // Previne clique acidental ao arrastar
        let startX, scrollLeft;

        // --- Eventos de Drag ---
        this.mainSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            hasDragged = false;
            this.mainSlider.classList.add('active'); 
            startX = e.pageX - this.mainSlider.offsetLeft;
            scrollLeft = this.mainSlider.scrollLeft;
        });

        // Usar o window para garantir que soltar fora do slider também encerre o drag
        window.addEventListener('mouseup', () => {
            isDown = false;
            if(this.mainSlider) this.mainSlider.classList.remove('active');
        });

        this.mainSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return; 
            e.preventDefault(); 
            
            const x = e.pageX - this.mainSlider.offsetLeft;
            const walk = (x - startX) * 2; 
            
            if (Math.abs(walk) > 5) hasDragged = true; // Se moveu mais de 5px, é drag, não clique
            
            this.mainSlider.scrollLeft = scrollLeft - walk;
        });
        
        this.mainSlider.addEventListener('dragstart', (e) => e.preventDefault());

        // --- Delegação de Eventos (Clicks nas thumbs e imagens principais) ---
        this.addEventListener('click', (e) => {
            const target = e.target;

            // 1. Clique em uma miniatura
            if (target.classList.contains('image-gallery__thumb-image')) {
                // Descobre o índice da miniatura clicada verificando seus irmãos
                const index = Array.from(this.thumbSlider.children).indexOf(target);
                const targetMainMedia = this.mainSlider.children[index];
                
                if (targetMainMedia) {
                    this.mainSlider.scrollTo({
                        left: targetMainMedia.offsetLeft - this.mainSlider.offsetLeft,
                        behavior: 'smooth'
                    });
                }
            }

            // 2. Clique na imagem principal para ampliar (Ignora se for vídeo ou se arrastou)
            if (target.classList.contains('image-gallery__main-image') && target.tagName === 'IMG') {
                if (hasDragged) return; // Se estava arrastando o carrossel, não abre o modal
                this.modalImg.src = target.src;
                this.modal.style.display = 'flex';
            }

            // 3. Clique no modal para fechar
            if (target === this.modal || target === this.modalImg) {
                this.modal.style.display = 'none';
                this.modalImg.src = ''; // Limpa o src por performance
            }
        });
    }

    // ====================================
    // Lógica de Sincronização de Rolagem
    // ====================================
    initScrollSyncObserver() {
        const observerOptions = {
            root: this.mainSlider, 
            threshold: 0.6 
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(this.mainSlider.children).indexOf(entry.target);
                    if (index !== -1) {
                        // Atualiza as classes das miniaturas de forma direta
                        Array.from(this.thumbSlider.children).forEach((thumb, i) => {
                            thumb.classList.toggle('is-active', i === index);
                        });
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        Array.from(this.mainSlider.children).forEach(media => observer.observe(media));
    }
}

customElements.define('t-image-gallery', TImageGallery);
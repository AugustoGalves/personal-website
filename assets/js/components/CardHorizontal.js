

//Criando Custom HTML Components ─────────────────────────────────────────────────────────────────────────────── ✣ ──

class TCardHorizontal extends HTMLElement {
    // =======================================
    // Função principal main()
    // =======================================
    connectedCallback() {
        this.renderizador(); 
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
        const group_id = this.getAttribute("card-group-id") || "list_posts";
        const card_id = this.getAttribute("card-id");
        const alt_text = this.getAttribute("alt-text") || "";
        const badge = {
            class1: this.getAttribute("badge_class1") || "",
            class2: this.getAttribute("badge_class2") || "",
            text1: this.getAttribute("badge-name1") || "",
            text2: this.getAttribute("badge-name2") || "",
        };
        const links = {
            image: this.getAttribute("link_image") || "",
            click: this.getAttribute("link_click") || "#",
        };

        // Os badges agora são inseridos no HTML dentro do card__media para herdar o position absolute em cima da imagem
        const badgesHtml = (badge.text1 || badge.text2) ? `
            <div class="card__badges">
                ${badge.text1 ? `<span class="badge ${badge.class1}">${badge.text1}</span>` : ""}
                ${badge.text2 ? `<span class="badge ${badge.class2}">${badge.text2}</span>` : ""}
            </div>
        ` : "";
        
        // Template Stamper (Utilizando as classes responsivas do seu style.css) ─────────────────────────── ✣ ──
        this.innerHTML = `
<div class="card flex flex-row flex-col-mobile items-center overflow-hidden w-full mb-4"> 
    
    <a href="${links.click}" class="card__media w-40 w-full-mobile" style="flex-shrink: 0; align-self: stretch;">
        ${badgesHtml}
        <img class="card__image" src="${links.image}" loading="lazy" decoding="async" alt="${alt_text}" style="height: 100%;">
    </a>    
    
    <div class="flex flex-col justify-center p-4 w-60 w-full-mobile">
        <a href="${links.click}" style="text-decoration: none;">
            <strong class="card-title block mb-2" data-i18n="pages.${PAGINA_ATUAL}.${group_id}.card${card_id}.title"></strong>
            <span class="card-subtitle block" data-i18n="pages.${PAGINA_ATUAL}.${group_id}.card${card_id}.desc"></span>
        </a>
    </div>

</div>
`
    }
}

customElements.define('t-card-horizontal', TCardHorizontal);
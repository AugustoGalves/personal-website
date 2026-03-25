

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
    renderizador() {
        // Declaração das variáveis capturadas no HTML ────────────────────────────────────────────────────── ✣ ──
        const PAGINA_ATUAL =
            window.location.pathname
            .split("/")
            .filter(Boolean)
            .pop()
            ?.replace(".html", "") || "index";
            
        // PADRONIZADO: Todos os atributos agora usam traços (kebab-case)
        const group_id = this.getAttribute("card-group-id") || "list_posts";
        const card_id = this.getAttribute("card-id");
        const alt_text = this.getAttribute("alt-text") || "";
        
        const badge = {
            class1: this.getAttribute("badge-class1") || "", // Era badge_class1
            class2: this.getAttribute("badge-class2") || "", // Era badge_class2
            text1: this.getAttribute("badge-name1") || "",
            text2: this.getAttribute("badge-name2") || "",
        };
        
        const links = {
            image: this.getAttribute("link-image") || "", // Era link_image
            click: this.getAttribute("link-click") || "#", // Era link_click
        };

        // Os badges agora são inseridos no HTML dentro do card__media para herdar o position absolute
        const badgesHtml = (badge.text1 || badge.text2) ? `
            <div class="card__badges">
                ${badge.text1 ? `<span class="badge ${badge.class1}">${badge.text1}</span>` : ""}
                ${badge.text2 ? `<span class="badge ${badge.class2}">${badge.text2}</span>` : ""}
            </div>
        ` : "";
        
        // Template Stamper ───────────────────────────────────────────────────────────────────────────────── ✣ ──
        // NOTA: Removi os style="..." e substituí pela estrutura de classes limpa. 
        // Certifique-se de que a tag <a> sem sublinhado seja tratada no seu CSS global.
        this.innerHTML = `
<div class="card flex flex-row flex-col-mobile items-center overflow-hidden w-full mb-4"> 
    
    <a href="${links.click}" class="card__media w-40 w-full-mobile shrink-0 self-stretch relative">
        ${badgesHtml}
        <img class="card__image w-full h-full object-cover" src="${links.image}" loading="lazy" decoding="async" alt="${alt_text}">
    </a>    
    
    <div class="flex flex-col justify-center p-4 w-60 w-full-mobile">
        <a href="${links.click}" class="no-underline text-inherit">
            <strong class="card-title block mb-2" data-i18n="pages.${PAGINA_ATUAL}.${group_id}.card${card_id}.title"></strong>
            <span class="card-subtitle block" data-i18n="pages.${PAGINA_ATUAL}.${group_id}.card${card_id}.desc"></span>
        </a>
    </div>

</div>
`;
    }
}

customElements.define('t-card-horizontal', TCardHorizontal);
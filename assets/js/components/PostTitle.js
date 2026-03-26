

//Criando Custom HTML Components ─────────────────────────────────────────────────────────────────────────────── ✣ ──

class TPostTitle extends HTMLElement {
    // =======================================
    // Função principal main()
    // =======================================
    connectedCallback() {
        this.renderizador();
    }

    renderizador() {
        // 1. Lógica Inteligente de Rota (Pega o nome da pasta do projeto)
        // Ex: "/projects/hvac-bmw/index.html" -> Pega o "hvac-bmw"
        let pathArray = window.location.pathname.split("/").filter(Boolean);
        let PAGINA_ATUAL = pathArray.pop() || "index";
        
        // Se a última parte for "index.html" ou "index", pegamos o nome da pasta pai
        if (PAGINA_ATUAL.includes("index") || PAGINA_ATUAL === "") {
            PAGINA_ATUAL = pathArray.pop() || "index"; 
        }
        PAGINA_ATUAL = PAGINA_ATUAL.replace(".html", "");

        // Permite sobrescrever o ID caso necessário via atributo
        const pageId = this.getAttribute("page-id") || PAGINA_ATUAL;

        // 2. Processamento das Badges
        // Formato esperado no HTML: badges="hvac:HVAC, autocad:AutoCAD, engineering:ABNT NBR 16401"
        const badgesAttr = this.getAttribute("badges") || "";
        const badgesHtml = badgesAttr.split(",")
            .map(badge => badge.trim())
            .filter(Boolean)
            .map(badge => {
                // Divide a string "classe:Texto da Badge"
                const partes = badge.split(":");
                const badgeClass = partes[0].trim();
                // Junta o resto caso o texto da badge tenha ":" dentro dele
                const badgeText = partes.slice(1).join(":").trim(); 
                
                return `<span class="badge badge--${badgeClass}">${badgeText}</span>`;
            }).join("");

        // 3. Template Stamper
        this.innerHTML = `
            <section class="mb-6">
                <h1 class="prose" data-i18n="pages.${pageId}.title"></h1>
                
                <p class="subtext mt-1">
                    <strong data-i18n="pages.${pageId}.category"></strong>
                    &nbsp;·&nbsp;
                    <span data-i18n="pages.${pageId}.tech"></span>
                </p>
                
                ${badgesHtml ? `
                <div class="flex gap2 mt-3 flex-wrap">
                    ${badgesHtml}
                </div>
                ` : ""}
            </section>
        `;
    }
}

customElements.define('t-post-title', TPostTitle);
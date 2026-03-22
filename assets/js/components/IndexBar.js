

//Criando Custom HTML Components ─────────────────────────────────────────────────────────────────────────────── ✣ ──

class TIndexBar extends HTMLElement {
    // =======================================
    // Função principal main()
    // =======================================
    //Navegador executa automaticamente a função connectedCallback ao baixar o script
    connectedCallback() {
        this.renderizador(); //Inicia o script de carimbar o HTML na página
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
        const showPath3 = this.getAttribute("show-path3") === "true";
        const links = {
            path1: this.getAttribute("link-path1") || "/",
            path2: this.getAttribute("link-path2") || "",
            path3: this.getAttribute("link-path3") || ""
        };
        
        // Bloco condicional (So insere o HTML) ────────────────────────────────────────────────────── ✣ ──
        const Blockpath3 = showPath3 ? `
            <svg class="svgicon-xsmall" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
            <a href="${links.path3}" class="subtext" data-i18n="pages.${PAGINA_ATUAL}.indexbar.path3">Path3</a>
        ` : "";

        // Template Stamper (So insere o HTML) ────────────────────────────────────────────────────── ✣ ──
        this.innerHTML = `
<!-- ─── INDEX BAR ─────────────────────────────────────────────────────────────────────────────── ✣ ─ -->
<div class="container">
    <div class="flex items-center gap2 text-small my-4 subtext">
        <a href="/" class="subtext" data-i18n="pages.${PAGINA_ATUAL}.indexbar.path1">Home</a>
        <svg class="svgicon-xsmall" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
        <a href="${links.path2}" class="subtext" data-i18n="pages.${PAGINA_ATUAL}.indexbar.path2">Path2</a>
        ${Blockpath3}
    </div>
</div>
<!-- ─── INDEX BAR END ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ✣ ─ -->
        `
    }
}

customElements.define('t-index-bar', TIndexBar);
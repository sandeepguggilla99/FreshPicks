export default class Loader {
    constructor() {
        this.loaderContainer = document.createElement('div');
        this.loaderContainer.className = 'loader-container';

        this.overlay = document.createElement('div');
        this.overlay.className = 'overlay';

        this.loader = document.createElement('div');
        this.loader.className = 'loader';
        this.loader.style.border = '6px solid #3498db';
        this.loader.style.borderTop = '6px solid transparent';
        this.loader.style.borderRadius = '50%';
        this.loader.style.width = '50px';
        this.loader.style.height = '50px';
        this.loader.style.animation = 'spin 2s linear infinite';

        this.loaderContainer.appendChild(this.overlay);
        this.loaderContainer.appendChild(this.loader);
    }

    show() {
        this.overlay.style.display = 'block';
        this.loaderContainer.style.display = 'flex';
        document.body.appendChild(this.loaderContainer);
    }

    hide() {
        this.overlay.style.display = 'none';
        this.loaderContainer.style.display = 'none';
        document.body.removeChild(this.loaderContainer);
    }
}

// Keyframes for the spinning animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`, styleSheet.cssRules.length);

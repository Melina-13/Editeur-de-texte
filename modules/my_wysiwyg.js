export class MyWysiwyg {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.initEditor();
    }

    initEditor() {
        this.toolbar = document.createElement('div');
        this.toolbar.id = 'wysiwyg-toolbar';

        // ajouter un bouton
        const addButton = (label, action) => {
            const btn = document.createElement('button');
            btn.innerText = label;
            btn.addEventListener('click', action);
            this.toolbar.appendChild(btn);
        };

        addButton('B', () => this.applyStyle('fontWeight', 'bold'));
        addButton('I', () => this.applyStyle('fontStyle', 'italic'));
        addButton('S', () => this.applyStyle('textDecoration', 'line-through'));
        addButton('Gauche', () => this.setAlignment('left'));
        addButton('Centre', () => this.setAlignment('center'));
        addButton('Droite', () => this.setAlignment('right'));
        addButton('Justifié', () => this.setAlignment('justify'));
        addButton('Code Source', () => this.toggleSourceView());
        addButton('+', () => this.changeFontSize(2));
        addButton('-', () => this.changeFontSize(-2));

        //couleur
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.addEventListener('input', (e) => this.applyStyle('color', e.target.value));
        this.toolbar.appendChild(colorPicker);

         

        //zone de texte
        this.editor = document.createElement('div');
        this.editor.id = 'wysiwyg-editor';
        this.editor.contentEditable = true;

        this.container.appendChild(this.toolbar);
        this.container.appendChild(this.editor);

        //texte sauvegardé
        window.addEventListener('load', () => {
            const savedContent = localStorage.getItem('editorContent');
            if (savedContent) this.editor.innerHTML = savedContent;
        });

        // bouton sauvegarde
        document.getElementById('save-btn').addEventListener('click', () => this.saveContent());

        // toutes les 5 minutes
        setInterval(() => this.saveContent(), 300000);

        // alerte
        window.addEventListener('beforeunload', (event) => {
            if (localStorage.getItem('editorContent') !== wysiwyg.editor.innerHTML) {
                const confirmExit = confirm('Des modifications non sauvegardées seront perdues. Quitter ?');
                if (!confirmExit) {
                    event.preventDefault();
                }
            }
        });

        // sauvegarde auto
        this.observeChanges();
    }

    // style texte selec
    applyStyle(style, value) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style[style] = value;
        span.appendChild(range.extractContents());
        range.insertNode(span);
    }

    // taille texte selec
    changeFontSize(increment) {
        const currentSize = parseInt(window.getComputedStyle(this.editor).fontSize, 10);
        const newSize = currentSize + increment;
        this.editor.style.fontSize = `${newSize}px`;
    }

    // alignement 
    setAlignment(alignment) {
        this.editor.style.textAlign = alignment;
    }

    // affichage code source
    toggleSourceView() {
        if (this.editor.getAttribute('data-mode') === 'source') {
            this.editor.innerHTML = this.editor.textContent;
            this.editor.contentEditable = 'true';
            this.editor.setAttribute('data-mode', 'wysiwyg');
        } else {
            this.editor.textContent = this.editor.innerHTML;
            this.editor.contentEditable = 'false';
            this.editor.setAttribute('data-mode', 'source');
        }
    }

    // sauvegarde le contenu
    saveContent() {
        localStorage.setItem('editorContent', this.editor.innerHTML);
        alert('Texte sauvegardé!');
    }

    //sauvegarde automatique au changement
    observeChanges() {
        const observer = new MutationObserver(() => {
            localStorage.setItem('editorContent', this.editor.innerHTML);
        });
        observer.observe(this.editor, { childList: true, subtree: true, characterData: true });
    }
}
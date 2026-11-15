# faisaljaman.com

Personal portfolio — static site (plain HTML/CSS/JS, no build step). Deploys directly on GitHub Pages.

- `index.html` – all content
- `css/style.css` – design system (accent colours are CSS variables at the top)
- `js/main.js` – effects, gallery, command palette. Edit `GALLERY`, `ROLES`, `EMAIL` at the top of the file.
- `img/gallery/{thumb,full}` – optimised WebP versions of the gallery photos

Contact form: create a free form at formspree.io and paste its URL into `data-endpoint` on `#contact-form`
in `index.html`. Until then the form opens the visitor's mail app.

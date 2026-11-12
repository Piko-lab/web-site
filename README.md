# PIKO AI website

Static marketing site for **PIKO AI** — a free, local-first AI development
environment for Windows. No build step, no framework, no trackers.

- White background, black type, PIKO violet accents
- Real IDE screenshot, **Download app** and **Source code** buttons
- **PIKO AI × GitHub × Ollama** integration strip
- Developer message translated into 20 languages, Arabic first (RTL)
- Developer contacts and donation details
- `demo.html` — an offline interactive preview of the IDE

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Landing page |
| `demo.html` | Interactive IDE demo |
| `styles.css`, `download.css`, `cta.css`, `theme.css` | Styles |
| `app.js`, `demo.js` | Behaviour |

## Preview locally

```powershell
python -m http.server 5200 --bind 127.0.0.1
# open http://127.0.0.1:5200/index.html
```

Any static file server works. All asset paths are relative, so the site also
runs from a subdirectory such as `https://piko-lab.github.io/web-site/`.

## Edit the links

Everything external lives in the `CONFIG` block at the top of `app.js`:

```js
version:       '1.5.3'
installer:     'https://github.com/Piko-lab/PIKO-AI-A-APP-DOWNLOAD'
portable:      'https://github.com/Piko-lab/PIKO-AI-A-APP-DOWNLOAD/releases/latest/download/PIKO-AI-Portable-1.5.3-x64.exe'
github:        'https://github.com/Piko-lab/Introducing-PIKO-AI-A-Free-AI-Powered-IDE-with-Local-AI-Support'
discordHandle: 'taha29dev'
mail:          'mailto:tahazitoni123@gmail.com'
```

The visible `href` values in `index.html` match these, so the page still works
with JavaScript disabled.

## Deploy

The site is hosted with **GitHub Pages** from the `main` branch, repository root.

1. Push this folder to `https://github.com/Piko-lab/web-site`.
2. Repository → **Settings → Pages**.
3. Source: **Deploy from a branch** · Branch: **main** · Folder: **/ (root)**.
4. Save. The site appears at <https://piko-lab.github.io/web-site/>.

`.nojekyll` is included so GitHub serves the files as-is.

## Links

- Download: <https://github.com/Piko-lab/PIKO-AI-A-APP-DOWNLOAD>
- Source code: <https://github.com/Piko-lab/Introducing-PIKO-AI-A-Free-AI-Powered-IDE-with-Local-AI-Support>
- Website: <https://github.com/Piko-lab/web-site>

## Developer

**TAHA — BLACK2DEV** · Discord `taha29dev` · <tahazitoni123@gmail.com>

### Donation

| | |
| --- | --- |
| Code Banque | 230 |
| Code Ville | 810 |
| N° de Compte | 4955792211008100 |
| Clé RIB | 94 |

## License

MIT — see [LICENSE](LICENSE).

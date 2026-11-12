# Personal Portfolio - Md. Iftekharul Islam

Live site: https://ifti136.github.io/

A static portfolio (no build step) with a slow-moving Three.js network in the background, a tilting hero photo, and a dark/light theme. **All text lives in one file, `data/content.json`.** You never need to edit HTML to update the content.

## Updating content

Open `data/content.json` (on GitHub: open the file, click the pencil icon, edit, commit). The site rebuilds itself from that file on every page load.

| To do this | Edit this |
| --- | --- |
| Change the intro, tagline or buttons | `hero` |
| Add a degree | add an object to `education.items` |
| Add a paper | add an object to `research.items` (`status` is `progress`, `prep` or `published`; add `"link": "https://..."` to make the title a link) |
| Add a role, award or certificate | `activities.leadership` or `activities.achievements` |
| Add a project | add an object to `projects.items` (set `"featured": true` to make it a wide card) |
| Add a skill | add to a group in `skills.groups`, or add a new group |
| Add a social link | add to `contact.links` (`"hero": true` also shows it as an icon in the hero) |
| Hide a section | set `"hidden": true` inside it, or remove its name from the top-level `sections` list |
| Reorder sections | reorder the names in the top-level `sections` list |

Example, adding a paper:

```json
{
  "title": "My New Paper Title",
  "authors": ["Md. Iftekharul Islam", "Co-author Name"],
  "status": "prep",
  "link": "https://doi.org/..."
}
```

Notes:

- Commas matter. Each item in a list needs a comma after it except the last. If the page shows "The page content could not be loaded", the JSON has a typo; paste it into https://jsonlint.com to find it.
- Icons use [Font Awesome 6 free](https://fontawesome.com/search?o=r&m=free) class names, e.g. `"fa-brands fa-github"`.
- Your name in an author list is shown in bold automatically (it must match `site.name`).
- Names and text are inserted as plain text, so characters like `<` or `&` are safe.

## Replacing images

- Profile photo: replace `assets/images/profile-900.jpg` (about 900px wide is plenty) or change `hero.photo.src`.
- QR codes: replace the files in `assets/qrcodes/` or change each link's `qr` path.

## Running locally

Browsers block loading `data/content.json` from `file://`, so use a tiny server:

```sh
python -m http.server 8000
# then open http://localhost:8000
```

## How it is built

```
index.html            page shell, fonts, import map for Three.js
data/content.json     all content
scripts/main.js       loads the content, starts everything
scripts/render.js     turns content.json into the page
scripts/effects.js    theme, nav, scroll progress, tilt
scripts/scene.js      Three.js background (loaded last; the site works without it)
styles/main.css       all styling
```

- Three.js 0.160.0 is loaded from the jsDelivr CDN through the import map in `index.html`. If it fails to load or WebGL is unavailable, the page simply shows its plain background.
- The 3D scene pauses when the tab is hidden, and animations are turned off for visitors who prefer reduced motion.
- Colors and fonts are CSS variables at the top of `styles/main.css`.

## License

MIT, see `LICENSE`.

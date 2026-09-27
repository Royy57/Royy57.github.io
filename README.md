# Souvik Roy — editable robotics portfolio

A lightweight static site for GitHub Pages. No build step, paid service, API key, or framework installation is needed. The design is Midnight + Cyan, following the requested reference's structure. All personal content is in `content.json`.

## Easiest way to edit (forms, no code)

1. Open `editor.html` on your hosted site or local preview.
2. Expand the section you want to change. Edit the fields. Add, remove, or reorder experience, education, skills, and projects.
3. Click **Preview draft**. This previews your content only in that browser tab. Use **Back to editor** to return.
4. Click **Download content.json** to save your changes permanently.
5. In your GitHub repository, upload the downloaded file to replace the existing root `content.json`. Keep the exact filename (remove a download suffix such as `(1)` if present). Commit the change.
6. GitHub Pages publishes the updated file. Refresh the site after deployment finishes.

The editor cannot publish changes. It is a browser-only form and does not hold GitHub credentials. Anyone opening it can edit their own temporary draft, but only someone with repository write access can update your actual site. Do not put secrets in any site file.

Drafts are stored in the current tab's session, not permanently. Download before closing the tab. Import an earlier `content.json` to resume editing. **Discard draft** returns to the currently saved site content.

## Direct editing through GitHub

Open `content.json` in GitHub and click the pencil. Change the text between quotation marks and commit. Keep the JSON punctuation intact. For easier editing and validation, use the forms above.

| Content | Where to edit |
| --- | --- |
| Name, role, headline, links, email, location | Profile & introduction |
| About biography | Profile → About paragraphs (one paragraph per line) |
| Headings and short page introductions | Page headings & descriptions |
| Core technology strip | Core technologies (one item per line) |
| Skill cards | Technical expertise |
| Jobs, dates, descriptions | Experience |
| Degrees | Education |
| Project cards and detail pages | Projects |
| Homepage project selection | Each project's Show on homepage checkbox |

Project IDs must be unique, using lowercase letters, numbers, and hyphens. Keep an ID unchanged to preserve existing project links. Projects link to `project.html?id=your-project-id`; adding a project does not require creating an HTML page.

## Images, videos, and résumé

- Upload your images to `assets/`, then set a project's image field to `assets/your-image.jpg`. Add a useful image description. A 16:9 image works well.
- Set Profile → Portrait to `assets/portrait.jpg` if you want a portrait on About.
- Put a current PDF in `assets/resume.pdf`, then set Profile → Résumé to `assets/resume.pdf`. The navigation and About page will show the résumé link automatically.
- Set project demo URLs to your hosted video or demo page. Set repository URLs only for the actual matching public repository.
- Blank optional fields are hidden. Projects with no image use a text card; there is no broken image placeholder.

The supplied outdated CV is deliberately not included as a public download. Its original personal phone number and third-party reference contacts are not included in the site.

## Initial content sources

- Current role, location, ME3D, ITER job title, and education: the owner's LinkedIn profile, read on September 27, 2026.
- Current role: Robotics Engineer, EVO, May 2026–Present, Viseu, Portugal.
- Earlier LS2N and The Smart Cube experience, technical skills, and the four initial project descriptions: the provided résumé. These remain editable drafts.
- Project images, repository links, demo links, and results are intentionally blank pending the owner's additions. No performance metrics have been invented.

## GitHub Pages setup

1. Create or use `Royy57.github.io` in the `Royy57` GitHub account.
2. Upload the **contents** of this folder to the repository root, including `assets/`. Do not nest everything inside another `portfolio` folder.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, then your main branch and **/(root)**. Save.
4. After GitHub's deployment finishes, the site will be at `https://royy57.github.io/`.

The portfolio repository is `https://github.com/Royy57/Royy57.github.io`. Its GitHub Pages address is `https://royy57.github.io/`, and the content editor is at `https://royy57.github.io/editor.html`. Relative paths also allow the same files to work under a project-repository subpath.

## Local preview

Run a static HTTP server from this folder, for example:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/` and `http://127.0.0.1:8765/editor.html`.

Opening HTML by double-click is not supported because browsers restrict loading JSON from `file://` URLs.

## Design files

- `styles.css`: shared Midnight + Cyan colors, typography, responsive layouts.
- `app.js`: content rendering and navigation, shared by the public pages.
- `editor.js`: browser-only content editing, validation, draft preview, and download.
- `index.html`, `about.html`, `projects.html`, `project.html`, `contact.html`: page entry points.
- `.nojekyll`: serves the plain static files without Jekyll processing.

Public pages require JavaScript. No analytics, external fonts, or remote runtime dependencies are included.

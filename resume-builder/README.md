# Resume builder

Generate Lucas Huang's resume from editable context with Node.js 18 or newer. The resume has contact links, a short profile, core skills, six experience entries with substantive responsibility and achievement bullets, and seven brief project summaries. Experience is not squeezed into a single line or constrained to a one-page layout. No additional npm dependencies or online service is required. PDF generation uses a locally installed Chrome, Chromium, or Edge browser.

## Generate

From the repository root:

```sh
bash resume-builder/generate.sh --pdf
```

On Windows, including systems where PowerShell scripts are disabled:

```powershell
node resume-builder/generate.mjs --pdf
# Or use the PowerShell wrapper:
powershell -NoProfile -ExecutionPolicy Bypass -File resume-builder/generate.ps1 --pdf
```

The wrappers also work from outside the repository. `npm run resume -- --pdf` is another option (`npm.cmd` on Windows if execution policy blocks npm.ps1).

Outputs go into `resume-builder/output/`, which is ignored by Git:

- `lucas-huang-resume.html`: a standalone, printable resume.
- `lucas-huang-resume.md`: the same resume as editable text.
- `lucas-huang-resume.pdf`: created with `--pdf`.
- `review-notes.txt`: missing facts and timeline questions, separate from the resume.

Without `--pdf`, only HTML, Markdown, and review notes are generated. If no browser is detected, set `RESUME_BROWSER` to the full executable path, or open the HTML and use Print → Save as PDF. `--output DIR` changes the destination. `--context FILE` uses an alternative context file; paths passed through options are relative to the calling directory.

## Update the content

- `context.json` → `profile`: name, title, location, email, portfolio website, and GitHub.
- `context.json` → `resume`: the short profile, grouped skills, selected experience IDs, and brief project summaries referenced by `slug`. Experience bullets come directly from `json/experience.json`, keeping them in sync with the About page. Add optional `resume.education` entries with `institution`, `qualification`, and `dates` when ready.
- `../json/experience.json`: career entries shared by the website and resume. Upwork appears directly above Freelancer.com. Each entry has `id`, `company`, `industry`, `position`, `startDate`, `endDate`, `type`, `location`, `description`, `highlights`, and `skills`. Portfolio cards show the role, company, and short description; Expand opens a modal with the full details, including industry. The resume keeps the detailed experience bullets and industry.
- `../json/data.json`: all seven portfolio projects with their full descriptions. The resume reads titles, dates, and links from here and uses the short summaries under `resume.projects`.

The other context fields retain longer background for future editing. They are not copied into the resume. Review notes stay in `review-notes.txt`; the resume contains no editing instructions or company research. The generator does not change project records.

All six roles appear in both the portfolio experience section and the standard resume. Dates and locations display as plain text. Drafting provenance stays in the source data and separate review notes. Generate a separately named review copy with:

```sh
bash resume-builder/generate.sh --include-drafts --pdf
```

The compatibility flag `--include-drafts` creates `lucas-huang-resume-draft.*` files containing the same concise content, with a Review copy label. All selected experience is already included by default. Update career details in the shared file; keep any editing notes in `reviewNeeded` or the context review notes.

## Update the website's downloadable CV

```sh
bash resume-builder/generate.sh --publish
# Or regenerate the latest copy and sync the download button:
npm run resume:sync
```

`--publish` generates a PDF and replaces the local `public/docs/cv.pdf` served by the existing Download CV link. It does not deploy the site.

`npm run resume:sync` also keeps a copy in `resume-builder/output/latest/`. Run it after editing the shared career data or resume context. Start the local portfolio with `npm run dev`; the About-page experience section is at `/about#experience`.

## Checks

```sh
node --test resume-builder/generate.test.mjs
```

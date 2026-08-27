# Bharath Naveen — Personal Portfolio

Live site source. This repo is connected to Netlify: every change committed to the
`main` branch is automatically published to the live site within about a minute.

## Files

- `index.html` — the entire website (all text, layout, and styling). This is the file you edit.
- `assets/headshot.jpg` — profile photo.
- `assets/resume-p1.png`, `assets/resume-p2.png` — the résumé pages shown on the page.
- `assets/Bharath_Naveen_Resume.pdf` — the downloadable résumé file.

## How to make a change (edit in the browser, no software needed)

1. Open `index.html` here on GitHub and click the pencil (Edit) icon.
2. Make your edit.
3. Scroll down, write a short note in "Commit changes," and commit.
4. Netlify rebuilds automatically. Refresh the live site in ~1 minute.

## How to preview a big change before it goes live

When committing, choose **"Create a new branch for this commit and start a pull request."**
Netlify posts a **Deploy Preview** link on the pull request. Open it, check everything looks
right, then click **Merge** to make it live. Nothing goes live until you merge.

## Common edits

### Update the résumé
Replace the three résumé files in `assets/` with new versions, keeping the exact same
filenames (`resume-p1.png`, `resume-p2.png`, `Bharath_Naveen_Resume.pdf`).

### Add a new project
In `index.html`, find the `<!-- PROJECT CARD -->` blocks inside the "Selected work" section.
Copy one whole `<article class="card">...</article>` block, paste it below the others, and
change the title, description, tags, and metrics. Point its "View on GitHub" link at the repo.

### Edit an existing project
Find that project's `<article class="card">` block and change the text inside it.

### Update a link
Search for the URL (e.g. `github.com/Bharath-Naveen`) and replace it.

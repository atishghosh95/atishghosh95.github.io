# Atish Ghosh — personal website

A plain HTML/CSS site hosted free on GitHub Pages. No build tools needed.

## Files

| File | What it is | Do you edit it? |
|---|---|---|
| `index.html` | All the text: name, research, experience, publications, contact | Yes, most edits happen here |
| `style.css` | Colors, fonts, spacing | Only to change the look (colors are at the top) |
| `script.js` | Draws the lattice animation in the header | No |
| `gallery.html` | The photo gallery page | Yes, to add or remove photos |
| `gallery.js` | Opens photos full-size when clicked | No |
| `assets/gallery/` | Your gallery photos | Upload photos here |
| `assets/profile.png` | Your photo | Replace with your own |
| `assets/Atish_Ghosh_CV.pdf` | Your CV, linked from the header | Upload it here |

## Making changes on github.com (no software needed)

1. Open the repository, click the file (for example `index.html`).
2. Click the pencil icon (Edit).
3. Make your change, then click **Commit changes**.
4. Wait 1–2 minutes and refresh your site.

## Common edits

- **Add a paper:** in `index.html`, search for `EDIT: to add a paper`. Copy the template line into the right year.
- **Add a job:** search for `EDIT: newest first`. Copy one `<li> ... </li>` block and change the text.
- **Add a gallery photo:**
  1. Open `assets/gallery/`, click Add file → Upload files, and upload your photo (keep it under ~1 MB).
  2. Open `gallery.html`, click the pencil, search for `HOW TO ADD A PHOTO`, copy the `<figure>` template, paste it inside `<div class="gallery">`, and type your file name and caption.
  3. Commit. Photos appear left to right in the order they are listed.
- **Remove the sample photos:** delete their `<figure>` blocks in `gallery.html`, then delete `photo1.jpg` … `photo6.jpg` from `assets/gallery/`.
- **Change a link:** search for `EDIT: links`.
- **Change colors:** edit the hex values at the top of `style.css`. The second block is for dark mode.
- **Replace your photo:** upload a square image named `profile.png` into `assets/` (Add file → Upload files). It overwrites the old one.

## Tips

- Special characters in HTML: write `&amp;` for `&`.
- If something breaks, open the repo's **Commits** history and look at your last change; you can always revert it.
- Preview locally by double-clicking `index.html` on your computer.

# Atish Ghosh — personal website

A plain HTML/CSS site hosted free on GitHub Pages. No build tools needed.

## Files

| File | What it is | Do you edit it? |
|---|---|---|
| `index.html` | All the text: name, research, experience, publications, contact | Yes, most edits happen here |
| `style.css` | Colors, fonts, spacing | Only to change the look (colors are at the top) |
| `script.js` | Draws the research animations in the header | Only to change their captions (search for EDIT) |
| `explained.html` | "My research, explained simply" page with animations | Yes, to change text or add a chapter to the journey |
| `anim.js` | Draws the research animations | No |
| `gallery.html` | The photo gallery page | Yes, to add or remove photos |
| `gallery.js` | Opens photos full-size when clicked | No |
| `assets/gallery/` | The six main gallery photos | Upload photos here |
| `assets/photography/`, `assets/photography2/` | Digital Wheel 1 and 2 (small copies, with large copies in `full/`) | Replace files with the same names |
| `assets/profile.jpg` | Your photo | Upload a new square photo with the same name to change it |
| `assets/profile.png` | Small icon shown in the browser tab | No |
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
- **Add or swap an animation:** any line like `<canvas class="anim" data-anim="dft"></canvas>` shows an animation. Change the word after `data-anim=` to one of: dft, aimd, namd, hop, gnn, pv, water, nrr, electro, spin, battery, thermo, qd.
- **Change a link:** search for `EDIT: links`.
- **Change colors:** edit the hex values at the top of `style.css`. The second block is for dark mode.
- **Replace your photo:** upload a square image named `profile.jpg` into `assets/` (Add file → Upload files). It overwrites the old one.

## Tips

- Special characters in HTML: write `&amp;` for `&`.
- If something breaks, open the repo's **Commits** history and look at your last change; you can always revert it.
- Preview locally by double-clicking `index.html` on your computer.

# Paletto

Paletto is a random color palette generator and manager where you can generate random palettes, craft custom palettes, and save your favorite palettes to use anytime.

Demo: Open [https://palettogen.netlify.app/] in a modern browser.

---

## Features

- Generate a random 5-color palette.
- Create custom palettes by entering hex color codes.
- Add, edit, and remove colors from a custom palette.
- Copy hex color codes to clipboard by clicking any color.
- Save up to 10 favorite palettes to use anytime.
- View, edit and remove your favorite palettes.
- Responsive UI for different screen sizes (desktop, tablet, phone).

## Files

- `index.html` — main app UI.
- `main.js` — main page logic (generate, add/edit/remove/save palettes; clipboard & toast messages).
- `style.css` — styles for the main page.
- `favorites/` — favorite palettes view:
  - `favorites/index.html` — UI to view, edit, and remove saved palettes.
  - `favorites/style.css` — styles for the favorites view.
  - `favorites/main.js` — favorites page logic (view/edit/remove favorite palettes; clipboard & toast messages).
- `LICENSE` — MIT license.
- `Steps.md` — project plan / notes.

## Usage

1. Open `index.html` in your browser (double-click or serve the folder).
2. Click "Generate New Palette" to get a random palette.
3. To build a custom palette:
   - Type a hex color in the input (the `#` is kept automatically).
   - Press Enter or click the "+" button to add the color.
   - Add at least 2 colors, then click "Save Palette" to store it in Favorites.
4. Open `favorites/index.html` to view, edit, or remove saved palettes.

Notes:

- The custom palette input accepts uppercase/lowercase hex; it validates and shows a toast on invalid input.
- A maximum of 10 colors per custom palette and 10 saved favorite palettes are enforced.

## Development

- No build step required — the project is plain HTML/CSS/JS.
- To run locally, open `index.html` in any modern browser.

## Contributing

Contributions are welcomed 😊🤝

If you want to contribute:

- Open an issue describing the change.
- Send a PR with a clear description and small focused changes.

## License

This project is licensed under the MIT License — see `LICENSE` for details.

---

Made with ❤️ by Ahmed Gaballah# Paletto

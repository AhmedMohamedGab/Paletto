let emptyPalette = document.getElementById('empty-palette');   // empty palette container
let favoritesSection = document.getElementById('favorites-section');   // favorite palette section
let favorites = []; // an array to hold favorite palettes

document.addEventListener('DOMContentLoaded', function () {
    showFavorites();    // show favorite color palettes
});

// display favorite palettes
function showFavorites() {
    // if favorites array does not exist or is empty ->
    if (!localStorage.favorites || localStorage.favorites == '[]') {
        // place the empty area
        favoritesSection.innerHTML = `
            <div id="empty-palette">
                <div class="website-logo-bg">
                    <img width="58" height="58" src="../paletto-logo-bg.png" alt="color-palette" />
                </div>
                <p>Your favorite palettes will appear here. <a href="../index.html#border">Create Now!</a></p>
            </div>
        `;
        favorites = []; // empty favorites array
    } else {    // favorites array exists and has palettes to display
        favoritesSection.innerHTML = ``;    // clear favorites section
        // copy favorite palettes from local storage
        favorites = JSON.parse(localStorage.favorites);
        // create container for all favorite palettes
        let favoritePalettes = document.createElement('div');
        favoritePalettes.id = 'favorite-palettes';
        favoritesSection.appendChild(favoritePalettes);

        favorites.forEach((palette, paletteIndex) => {  // for each favorite palette -> add palette to favorite palettes
            palette.id = paletteIndex;  // update palette ID
            let paletteEl = ''; // palette colors element
            palette.colors.forEach((color, colorIndex) => {   // for each color in the palette -> add color to palette
                paletteEl += `
                    <div class="palette-color" style="background-color:#${color}" onmouseenter="showColorCode(${palette.id}, ${colorIndex})"
                        onmouseleave="hideColorCode(${palette.id}, ${colorIndex})" onclick="copyColorCode(${palette.id}, ${colorIndex})"></div>
                `;
            });
            // create palette element
            let favoriteElement = `
                <div id="${palette.id}" class="favorite-element">
                    <div class="palette-container">${paletteEl}</div>
                    <div class="palette-tools">
                        <i class="fa-regular fa-pen-to-square" onclick="editPalette(${palette.id})"></i>
                        <i class="fa-solid fa-trash" onclick="removePalette(${palette.id})"></i>
                    </div>
                </div>
            `;
            favoritePalettes.innerHTML += favoriteElement; // add palette element to page
        });
        localStorage.favorites = JSON.stringify(favorites); // refresh local storage
    }
}

// show color code on mouse enter
function showColorCode(paletteId, colorIndex) {
    let colorDiv = document.getElementById(paletteId).querySelector('.palette-container').children[colorIndex];

    if (isLight(`#${favorites[paletteId].colors[colorIndex]}`) === "light") {
        colorDiv.style.color = "#2b303b";   // set dark text color for light background
    } else {
        colorDiv.style.color = "#fff";   // set light text color for dark background
    }
    colorDiv.innerHTML = `${favorites[paletteId].colors[colorIndex]}`;  // show color code
}

// determine if color is light or dark
function isLight(hex) {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.5 ? "light" : "dark";
}

// hide color code on mouse leave
function hideColorCode(paletteId, colorIndex) {
    let colorDiv = document.getElementById(paletteId).querySelector('.palette-container').children[colorIndex];
    colorDiv.innerHTML = ``;
}

// copy color code to clipboard on click
function copyColorCode(paletteId, colorIndex) {
    let colorDiv = document.getElementById(paletteId).querySelector('.palette-container').children[colorIndex];

    navigator.clipboard.writeText(`${favorites[paletteId].colors[colorIndex]}`);    // copy color code to clipboard
    colorDiv.innerHTML = `<i class="fa-solid fa-check"></i>`;    // show check icon
    showToast('check', 'Color code copied to clipboard!'); // show toast message
}

// show toast message
function showToast(icon, message) {
    // create toast container
    let toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
    // add toast content
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid fa-${icon}"></i>
        </div>
        <div class="toast-content">
            ${message}
        </div>
    `;
    // hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.add("close");
    }, 3000);
    setTimeout(() => {
        toast.style.display = "none";
    }, 4000);

}

// remove favorite palette
function removePalette(paletteId) {
    favorites.splice(paletteId, 1); // remove palette from favorites array
    localStorage.favorites = JSON.stringify(favorites); // refresh local storage
    showFavorites();    // refresh favorite palettes
}

// edit favorite palette
function editPalette(paletteId) {
    sessionStorage.setItem("paletteToEdit", paletteId);
    window.location.href = "../index.html#border";
}
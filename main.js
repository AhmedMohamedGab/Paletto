let initialPalette = ['EF476F', 'FFD166', '06D6A0', '118AB2', '073B4C'];    // initial generated color palette
let generatedPalette = [...initialPalette];  // current generated color palette
let customPalette = [];  // custom color palette
let colorMode = 'add';  // variable to setcolor input mode (add, edit)
let editIndex;  // index of color to be edited
let favorites = []; // an array to hold favorite palettes

let paletteColor = document.querySelectorAll('.palette-color'); // generated palette color divs
let colorInput = document.getElementById('color-input');    // color input field
let emptyPalette = document.getElementById('empty-palette');   // empty palette container
let createSection = document.getElementById('create-section');  // create section

document.addEventListener('DOMContentLoaded', function () {
    showPalette();    // show initial generated color palette

    if (!localStorage.favorites) {   // if favorites array in local storage is not created yet -> create it
        localStorage.setItem('favorites', JSON.stringify([]));
    }

    if (localStorage.favorites == '[]') {   // if no favorite palettes -> no palette to edit
        sessionStorage.paletteToEdit = '';
    }

    if (sessionStorage.paletteToEdit) { // if there is a favorite palette to be edited
        favorites = JSON.parse(localStorage.favorites); // get favorite palettes from local storage
        customPalette = favorites[sessionStorage.paletteToEdit].colors; // fetch palette to edit into customPalette array
        showCustomPalette();    // display palette for user
    }
});

// show generated color palette
function showPalette() {
    paletteColor.forEach((colorDiv, index) => {
        colorDiv.style.backgroundColor = `#${generatedPalette[index]}`;
    });
}

// convert RGB to HEX
function rgbToHex(color) {
    const rgbMatch = color.match(/^rgba?\(\s*([^)]+)\)/i);
    const parts = rgbMatch[1].split(',').map(s => s.trim());
    const r = Math.max(0, Math.min(255, parseInt(parts[0], 10) || 0));
    const g = Math.max(0, Math.min(255, parseInt(parts[1], 10) || 0));
    const b = Math.max(0, Math.min(255, parseInt(parts[2], 10) || 0));
    return [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// show color code on mouse enter
function showColorCode(e, i = 100) {
    let colorDiv = e.target;
    let bgColor = rgbToHex(colorDiv.style.backgroundColor.toString());

    if (isLight(`#${bgColor}`) === "light") {
        colorDiv.style.color = "#2b303b";   // set dark text color for light background
    } else {
        colorDiv.style.color = "#fff";   // set light text color for dark background
    }

    if (colorDiv.childElementCount <= 1) {    // generated palette
        colorDiv.innerHTML = `${bgColor}`;  // show color code
    } else {    // custom palette
        // show control icons
        colorDiv.querySelector('.color-tools').innerHTML = `
                <i class="fa-regular fa-pen-to-square" onclick="editColor(${i})"></i>
                <i class="fa-solid fa-trash" onclick="removeColor(${i})"></i>
            `;
        colorDiv.querySelector('.custom-color').innerHTML = `${bgColor}`;   // show color code
    }
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
function hideColorCode(e) {
    let colorDiv = e.target;

    if (colorDiv.childElementCount <= 1) {    // generated palette
        colorDiv.innerHTML = ``;    // hide color code
    } else {    // custom palette
        colorDiv.querySelector('.color-tools').innerHTML = ``;  // hide control icons
        colorDiv.querySelector('.custom-color').innerHTML = ``; // hide color code
    }
}

// copy color code to clipboard on click
function copyColorCode(e) {
    let colorDiv = e.target;
    let bgColor = rgbToHex(colorDiv.style.backgroundColor.toString());

    navigator.clipboard.writeText(`${bgColor}`);    // copy color code to clipboard
    colorDiv.innerHTML = `<i class="fa-solid fa-check"></i>`;    // show check icon
    showToast('check', 'Color code copied to clipboard!'); // show toast message
}

// show toast message
function showToast(icon, message) {
    // create toast container
    let toast = document.createElement('div');
    toast.id = 'toast';
    let toastBox = document.querySelector('.toastBox');
    toastBox.appendChild(toast);
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

// generate random color
function generateRandomColor() {
    const letters = "0123456789ABCDEF"; // hex letters
    let color = ''; // color string
    // generate 6 digit hex color
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];   // append random hex letter to color string
    }
    return color;
}

// generate random color palette
function generateRandomPalette() {
    generatedPalette = [];  // reset generated color palette
    // generate 5 random colors
    for (let i = 0; i < 5; i++) {
        let color = generateRandomColor();  // generate random color
        generatedPalette.push(color);   // add random color to generated palette
    }
    showPalette();    // update generated color palette
}

// Always keep '#' at the start and restrict input
function keepHash(event) {
    // If the user pressed Enter -> add color
    if (event && event.key === 'Enter') {
        addColor();
        return;
    }
    // Always ensure it starts with '#'
    if (!colorInput.value.startsWith("#")) {
        colorInput.value = "#" + colorInput.value.replace(/#/g, "");
    }
    // Limit to 6 hex digits
    colorInput.value = "#" + colorInput.value.slice(1, 7);
}

// add color to custom palette or edit existing color
function addColor() {
    let colorCode = colorInput.value.slice(1).toUpperCase();    // adjust user input
    // if color code is not valid hex or palette has no remaining space -> do not add color
    if (!isValid(colorCode)) {
        return; // do not proceed
    }
    // check color input mode
    if (colorMode === 'add') {  // if mode is 'add' ->
        customPalette.push(colorCode);  // add color to customPalette array
    } else {    // if mode is 'edit' ->
        customPalette[editIndex] = colorCode;   // edit color in customPalette array
        colorMode = 'add';  // reset color input mode to 'add'
    }
    showCustomPalette();    // refresh the custom palette
    colorInput.value = '#'; // clear input field
    colorInput.focus(); // refocus on input field for better user experience
    showToast('check', 'Color added to palette!');  // show toast message
}

// check user input and palette remaining space
function isValid(colorCode) {
    // limit palette to 10 colors
    if (customPalette.length >= 10) {
        showToast('exclamation', 'Maximum 10 colors per palette');  // show toast message
        return false;   // can not add color
    }
    // check if user input is not valid hex code
    if (isNotHex(colorCode)) {
        showToast('exclamation', 'Please enter a valid hex color (e.g., #FF5733)');  // show toast message
        return false;   // can not add color
    }
    // color code is valid hex and palette has remaining space
    return true;
}

// check color entered by user
function isNotHex(colorCode) {
    let pureHex = colorCode.replace(/[^0-9A-F]/g, '');  // removingany non hex digit from color code
    // if color code is empty, less than 6 digits, or has a non hex digit -> return true
    if (colorCode === '' || colorCode.length < 6 || colorCode !== pureHex) {
        return true;
    }
    // if color code is valid -> return false
    return false;
}

// show custom color palette
let customPaletteContainer = document.createElement('div'); // create container of custom palette

function showCustomPalette() {
    customPaletteContainer.id = 'palette-container';    // assign this ID to give container certain styles
    createSection.appendChild(customPaletteContainer);  // append the container to create section
    emptyPalette.remove();  // remove the empty area
    let paletteEl = ''; // palette element
    // add colors to custom palette
    for (let i = 0; i < customPalette.length; i++) {
        paletteEl += `
            <div class="color-container" id="${i}" style="background-color:#${customPalette[i]}"
                onmouseenter="showColorCode(event, ${i})" onmouseleave="hideColorCode(event)">
                <div class="color-tools"></div>
                <div class="custom-color" style="background-color:#${customPalette[i]}" onclick="copyColorCode(event)"></div>
            </div>
        `;
    }
    customPaletteContainer.innerHTML = paletteEl;   // show custom palette
}

// remove a color from custom palette
function removeColor(i) {
    // if color to remove is the last -> remove the whole palette and place the empty area
    if (customPalette.length <= 1) {
        customPalette = []; // empty the customPalette array
        customPaletteContainer.remove();    // remove the custom palette
        createSection.appendChild(emptyPalette);    // append the empty area to create section
        return; // exit the function
    }
    // color to remove is not the last
    let colorDiv = document.getElementById(i);
    colorDiv.remove();  // remove the color from custom palette
    customPalette.splice(i, 1); // remove the color from customPalette array
    colorMode = 'add'; // reset color input mode to 'add' in case user removed the color he/she was editing
    showCustomPalette();    // refresh the custom palette
}

// edit a color in the custom palette
function editColor(i) {
    colorInput.value = `#${customPalette[i]}`; // place color code into input field
    colorInput.focus(); // focus on input field for better user experience
    colorMode = 'edit'; // change mode to edit
    editIndex = i; // set global variable editIndex to the index of color to be edited
}

// save palette to favorites
function savePalette() {
    if (!sessionStorage.paletteToEdit) {    // if adding a new palette
        if (favorites.length >= 10) {  // if favorites reached 10 -> do not save more palettes
            showToast('exclamation', 'Maximum 10 favorite palettes');  // show toast message
            return; // do not proceed
        }
    }

    if (customPalette.length <= 1) {    // if no colors or only one color added -> inform the user and exit
        showToast('exclamation', 'Minimum 2 colors per palette');  // show toast message
        return; // do not proceed
    }

    // there is at least one remaining place for the new palette,
    // and palette has valid number of colors

    // copy favorite palettes from local storage
    favorites = JSON.parse(localStorage.favorites);

    if (!sessionStorage.paletteToEdit) {    // if adding a new palette
        // object to save the new palette
        let newPalette = {
            id: favorites.length,
            colors: customPalette
        }
        // save new palette in favorites array in local storage
        favorites.push(newPalette);
    } else {    // updating an existing palette
        // save existing palette in favorites array in local storage
        favorites[sessionStorage.paletteToEdit].colors = customPalette;
        sessionStorage.paletteToEdit = '';  // reset paletteToEdit to return to add mode
    }

    // update favorites array in local storage
    localStorage.favorites = JSON.stringify(favorites);
    customPalette = []; // empty the customPalette array
    customPaletteContainer.remove();    // remove the custom palette
    createSection.appendChild(emptyPalette);    // append the empty area to create section
    showToast('check', 'Palette saved to favorites!');  // show toast message
}
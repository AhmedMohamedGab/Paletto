let initialPalette = ['EF476F', 'FFD166', '06D6A0', '118AB2', '073B4C'];    // initial generated color palette
let generatedPalette = [...initialPalette];  // current generated color palette
let customPalette = [];  // custom color palette

let paletteColor = document.querySelectorAll('.palette-color'); // generated palette color divs
let colorInput = document.getElementById('color-input');    // color input field
let emptyPalette = document.getElementById('empty-palette');   // empty palette container
let createSection = document.getElementById('create-section');  // create section

document.addEventListener('DOMContentLoaded', function () {
    showPalette();    // show initial generated color palette
});

// show generated color palette
function showPalette() {
    paletteColor.forEach((colorDiv, index) => {
        colorDiv.style.backgroundColor = `#${generatedPalette[index]}`;
    });
}

// show color code on mouse enter
function showColorCode(id) {
    let colorDiv = document.getElementById(id);

    if (id < 5) {   // generated palette
        if (isLight(`#${generatedPalette[id]}`) === "light") {
            colorDiv.style.color = "#2b303b";   // set dark text color for light background
        } else {
            colorDiv.style.color = "#fff";   // set light text color for dark background
        }
        colorDiv.innerHTML = `${generatedPalette[id]}`;  // show color code
    } else {    // custom palette
        if (isLight(`#${customPalette[id - 5]}`) === "light") {
            colorDiv.style.color = "#2b303b";   // set dark text color for light background
        } else {
            colorDiv.style.color = "#fff";   // set light text color for dark background
        }
        // show color code and icons
        colorDiv.querySelector('.color-tools').innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            <i class="fa-solid fa-trash" onclick="removeColor(${id})"></i>
        `;
        colorDiv.querySelector('.custom-color').innerHTML = `${customPalette[id - 5]}`;
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
function hideColorCode(id) {
    let colorDiv = document.getElementById(id);
    if (id < 5) {   // generated palette
        colorDiv.innerHTML = ``;
    } else {    // custom palette
        colorDiv.querySelector('.color-tools').innerHTML = ``;
        colorDiv.querySelector('.custom-color').innerHTML = ``;
    }
}

// copy color code to clipboard on click
function copyColorCode(id) {
    let colorDiv = document.getElementById(id);

    if (id < 5) {   // generated palette
        navigator.clipboard.writeText(`${generatedPalette[id]}`);    // copy color code to clipboard
        colorDiv.innerHTML = `<i class="fa-solid fa-check" style="font-size:22px"></i>`;    // show check icon
    } else {    // custom palette
        navigator.clipboard.writeText(`${customPalette[id - 5]}`);    // copy color code to clipboard
        // show check icon
        colorDiv.querySelector('.custom-color').innerHTML = `
            <i class="fa-solid fa-check" style="font-size:22px"></i>
        `;
    }

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
function keepHash() {
    // Always ensure it starts with '#'
    if (!colorInput.value.startsWith("#")) {
        colorInput.value = "#" + colorInput.value.replace(/#/g, "");
    }
    // Limit to 6 hex digits
    colorInput.value = "#" + colorInput.value.slice(1, 7);
}

// add color to custom palette
let customPaletteContainer = document.createElement('div'); // create container of custom palette

function addColor() {
    // limit palette to 10 colors
    if (customPalette.length >= 10) {
        showToast('exclamation', 'Maximum 10 colors per palette');  // show toast message
        return; // exit the function
    }

    let colorCode = colorInput.value.slice(1).toUpperCase();    // adjust user input
    // if user input is not valid hex code -> do not proceed
    if (isNotHex(colorCode)) {
        showToast('exclamation', 'Please enter a valid hex color (e.g., #FF5733)');  // show toast message
        return; // exit the function
    }
    // user input is valid
    // if customPalette array is empty -> create the custom palette
    if (customPalette.length === 0) {
        customPaletteContainer.id = 'palette-container';    // assign this ID to give container certain styles
        createSection.appendChild(customPaletteContainer);  // append the container to create section
        emptyPalette.remove();  // remove the empty area
    }
    customPalette.push(colorCode);  // add color to customPalette array
    showCustomPalette();    // refresh the custom palette
    colorInput.value = '#'; // clear input field
    showToast('check', 'Color added to palette!');  // show toast message
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
function showCustomPalette() {
    let paletteEl = ''; // palette element
    // add colors to custom palette
    for (let i = 5; i < customPalette.length + 5; i++) {
        paletteEl += `
            <div class="color-container" id="${i}" style="background-color:#${customPalette[i - 5]}"
                onmouseenter="showColorCode(${i})" onmouseleave="hideColorCode(${i})">
                <div class="color-tools"></div>
                <div class="custom-color" onclick="copyColorCode(${i})"></div>
            </div>
        `;
    }
    customPaletteContainer.innerHTML = paletteEl;   // show custom palette
}

// remove a color from custom palette
function removeColor(id) {
    // if color to remove is the last -> remove the whole palettea and place the empty area
    if (customPalette.length <= 1) {
        customPalette = []; // empty the customPalette array
        customPaletteContainer.remove();    // remove the custom palette
        createSection.appendChild(emptyPalette);    // append the empty area to create section
        return; // exit the function
    }
    // color to remove is not the last
    let colorDiv = document.getElementById(id);
    colorDiv.remove();  // remove the color from custom palette
    customPalette.splice(id - 5, 1);    // remove the color from customPalette array
    showCustomPalette();    // refresh the custom palette
}
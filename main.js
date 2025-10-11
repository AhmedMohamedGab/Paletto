let initialPalette = ['EF476F', 'FFD166', '06D6A0', '118AB2', '073B4C'];    // initial generated color palette
let generatedPalette = [...initialPalette];  // current generated color palette

let generateBtn = document.getElementById('generate-btn'); // generate button
let paletteColor = document.querySelectorAll('.palette-color'); // color divs

document.addEventListener('DOMContentLoaded', function () {
    showPalette();    // show initial generated color palette
});

// show color palette
function showPalette() {
    paletteColor.forEach((colorDiv, index) => {
        colorDiv.style.backgroundColor = `#${generatedPalette[index]}`;
    });
}

// show color code on mouse enter
function showColorCode(id) {
    let colorDiv = document.getElementById(id);

    if (isLight(`#${generatedPalette[id]}`) === "light") {
        colorDiv.style.color = "#2b303b";   // set dark text color for light background
    } else {
        colorDiv.style.color = "#fff";   // set light text color for dark background
    }

    colorDiv.innerHTML = `${generatedPalette[id]}`;  // show color code
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
    colorDiv.innerHTML = ``;
}

// copy color code to clipboard on click
function copyColorCode(id) {
    navigator.clipboard.writeText(`${generatedPalette[id]}`);    // copy color code to clipboard
    let colorDiv = document.getElementById(id);
    colorDiv.innerHTML = `<i class="fa-solid fa-check" style="font-size:22px"></i>`;    // show check icon
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
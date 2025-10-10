let initialPalette = ['EF476F', 'FFD166', '06D6A0', '118AB2', '073B4C'];    // initial color palette
let palette = [...initialPalette];  // current color palette

let generateBtn = document.getElementById('generate-btn'); // generate button
let paletteColor = document.querySelectorAll('.palette-color'); // color divs

window.onload = showPalette();    // initialize color palette

// show color palette
function showPalette() {
    paletteColor.forEach((colorDiv, index) => {
        colorDiv.style.backgroundColor = `#${palette[index]}`;
    });
}

// show color code on mouse enter
function showColorCode(id) {
    let colorDiv = document.getElementById(id);
    colorDiv.innerHTML = `${palette[id]}`;
}

// hide color code on mouse leave
function hideColorCode(id) {
    let colorDiv = document.getElementById(id);
    colorDiv.innerHTML = ``;
}

// copy color code to clipboard on click
function copyColorCode(id) {
    navigator.clipboard.writeText(`${palette[id]}`);    // copy color code to clipboard
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
    palette = [];  // reset palette
    // generate 5 random colors
    for (let i = 0; i < 5; i++) {
        let color = generateRandomColor();  // generate random color
        palette.push(color);   // add random color to palette
    }
    showPalette();    // update color palette
    showToast('bolt', 'New color palette generated!'); // show toast message
}
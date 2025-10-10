let initialPalette = ['EF476F', 'FFD166', '06D6A0', '118AB2', '073B4C'];    // initial color palette
let palette = [...initialPalette];  // current color palette

let paletteColor = document.querySelectorAll('.palette-color');

window.onload = initializePalette();    // initialize color palette

// initialize color palette
function initializePalette() {
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
    let toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid fa-${icon}"></i>
        </div>
        <div class="toast-content">
            ${message}
        </div>
    `;

    setTimeout(() => {
        toast.classList.add("close");
    }, 3000);
    setTimeout(() => {
        toast.style.display = "none";
    }, 4000);

}
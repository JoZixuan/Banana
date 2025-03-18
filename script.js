let startX, startY, isSelecting = false, resizing = false;
let selections = [];
let currentSelection = null;

// Dummy text options
const dummyTexts = [
    "QRSRQSRSSSRQSQRSQRSQQRASQRASRQRASRQRASASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQQRSQRSQQRASQRASRQRASRQRQRQSRSQRQSRQSRQRQRASQRASRQRASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRQRASQRASRQRASRQRQRQSRSQRQSRQSRSRQSRSSSRQSQRSQRSQQRASQRASRQRSRSQRQSRQSRQRSRQSRSSSRQSQRSQQRSRQSRSSSRQSQRSQRSQQRASQRASRQRASRQRASASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQQRSQRSQQRASQRASRQRASRQRQRQSRSQRQSRQSRQRQRASQRASRQRASRQRQRQSRSQRQSRQSRRASQRASRQRASRQRASASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQQRASQRASRQRASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQQRASQRASRQRASRQRQRQSRSQRQSRQSRQSSSRQSQRSQRSQQRASQRASRQRASRQRASRSRRRAAAASRSRRARARARAARRRSSSSSAAAQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQRSQQRASQRASRQRASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQQRASQRASRQRASRQRASASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRRSQQRASQRASRQRASRQRASRSRRRAAAASRSRRARARARAARRRSSSSSAAAQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQRSQQRASQRASRQRASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQQRASQRASRQRASRQRASASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQQRASQRASRQRASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQQRASQRASRQRASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQQRASQRASRQRASRQRASQRASRQRASRQRASASRQRQRQSRSQRQSRQSRQRSRQSRSSSRQSQRSQRSQQRASQRASRQRASRQRQRQSRSQRQSRQSRQR",
    "FLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFFLFLFLFLFLFLFLFFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFLFFLFLFLFLFLFLFLFFLFLFLFLFLFLFLFFLFLFLFLF",
    "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
    "rsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrssrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsrsr",
    "AIAIAIAIAIAIAIAIAIAAIIAIIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAAIAIAIAIAIAAIAIAIAIAIAIAIAIAAIAIAIAIAIAIAAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAAIAIAIAAIAIAIAIAIAIAI",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWaWaWaWaWaWaWaWaWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWaWaWaWaWaWaW",
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
];

// Create UI for text styling controls
const controlPanel = document.createElement("div");
controlPanel.id = "control-panel";
controlPanel.innerHTML = `
    <label style="font-family:sans-serif">Font Size:</label> <input type="range" class="control-input" id="font-size-slider" min="10" max="500" step="1" value="16">
    <label style="font-family:sans-serif">Text Color:</label> <input type="color" class="control-input" id="color-picker" value="#000000">
    <label style="font-family:sans-serif">Line Height:</label> <input type="range" class="control-input" id="line-height-slider" min="0.5" max="6" step="0.1" value="1.5">
    <label style="font-family:sans-serif">Letter Spacing:</label> <input type="range" class="control-input" id="letter-spacing-slider" min="-2.5" max="5" step="0.1" value="0">
`;
document.body.appendChild(controlPanel);

// Prevent selection creation when interacting with sliders
document.addEventListener("mousedown", (e) => {
    // Ignore clicks on sliders, color picker, and input elements
    if (e.target.classList.contains("control-input")) {
        return; // Do nothing if interacting with UI elements
    }

    if (e.button !== 0) return; // Ignore right-clicks or middle-clicks

    let clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    if (clickedElement.classList.contains("selection")) {
        currentSelection = clickedElement;
        updateSliders(currentSelection);
        return; // Do not create a new selection if clicking inside an existing one
    }

    startX = e.clientX;
    startY = e.clientY;
    isSelecting = true;

    document.addEventListener("mousemove", detectDrag);
    document.addEventListener("mouseup", cancelIfNotDragged);
});

function detectDrag(e) {
    if (!isSelecting) return;

    let dx = Math.abs(e.clientX - startX);
    let dy = Math.abs(e.clientY - startY);

    if (dx > 5 || dy > 5) {
        createSelection(startX, startY);
        document.removeEventListener("mousemove", detectDrag);
        document.removeEventListener("mouseup", cancelIfNotDragged);
    }
}

function cancelIfNotDragged() {
    isSelecting = false;
    document.removeEventListener("mousemove", detectDrag);
    document.removeEventListener("mouseup", cancelIfNotDragged);
}

function createSelection(x, y) {
    let selection = document.createElement("div");
    selection.classList.add("selection");
    selection.style.left = `${x}px`;
    selection.style.top = `${y}px`;
    selection.style.position = "absolute";
    selection.style.border = "0px solid #fff04b";
    selection.style.backgroundColor = "rgba(255,255,255,0)"; // Transparent background
    selection.style.mixBlendMode = "multiply";
    selection.contentEditable = "true"; // Makes text editable
    selection.style.padding = "10px";

    document.body.appendChild(selection);
    selections.push(selection);
    currentSelection = selection;

    document.addEventListener("mousemove", resizeSelection);
    document.addEventListener("mouseup", finalizeSelection);
}

function resizeSelection(e) {
    if (!isSelecting) return;
    let selection = currentSelection;

    let endX = e.clientX;
    let endY = e.clientY;

    selection.style.width = `${Math.abs(endX - startX)}px`;
    selection.style.height = `${Math.abs(endY - startY)}px`;
    selection.style.left = `${Math.min(startX, endX)}px`;
    selection.style.top = `${Math.min(startY, endY)}px`;
}

function finalizeSelection() {
    isSelecting = false;
    let selection = currentSelection;

    if (!selection || selection.offsetWidth < 5 || selection.offsetHeight < 5) {
        selection.remove();
        selections.pop();
        return;
    }

    let randomText = dummyTexts[Math.floor(Math.random() * dummyTexts.length)];
    selection.innerText = randomText;
    selection.style.color = getRandomColor();
    selection.style.fontSize = `${Math.floor(Math.random() * (200 - 16 + 1)) + 16}px`;
    selection.style.display = "block";
    selection.style.alignItems = "left";
    selection.style.justifyContent = "left";
    selection.style.textAlign = "left";
    selection.style.overflow = "hidden";
    selection.style.padding = "5px";
    selection.style.wordBreak = "break-word";
    selection.style.wordWrap = "break-word";

    document.removeEventListener("mousemove", resizeSelection);
    document.removeEventListener("mouseup", finalizeSelection);
}

// Event Listeners for Style Controls
document.getElementById("font-size-slider").addEventListener("input", function () {
    if (currentSelection) {
        currentSelection.style.fontSize = this.value + "px";
    }
});

document.getElementById("color-picker").addEventListener("input", function () {
    if (currentSelection) {
        currentSelection.style.color = this.value;
    }
});

document.getElementById("line-height-slider").addEventListener("input", function () {
    if (currentSelection) {
        currentSelection.style.lineHeight = this.value;
    }
});

document.getElementById("letter-spacing-slider").addEventListener("input", function () {
    if (currentSelection) {
        currentSelection.style.letterSpacing = this.value + "px";
    }
});

// Update Sliders to Match Current Selection
function updateSliders(selection) {
    document.getElementById("font-size-slider").value = parseInt(window.getComputedStyle(selection).fontSize);
    document.getElementById("color-picker").value = rgbToHex(window.getComputedStyle(selection).color);
    document.getElementById("line-height-slider").value = parseFloat(window.getComputedStyle(selection).lineHeight);
    document.getElementById("letter-spacing-slider").value = parseFloat(window.getComputedStyle(selection).letterSpacing);
}

// Helper Function to Convert RGB to Hex
function rgbToHex(rgb) {
    let values = rgb.match(/\d+/g).map(Number);
    return `#${values.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}


function getRandomColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
}
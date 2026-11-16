const clockEl = document.getElementById('clock');

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);
updateClock();

/* da open-close window */
const icons = document.querySelectorAll('.icon');
icons.forEach((icon) => {
    icon.addEventListener('click', () => {
        const appName = icon.dataset.app;
        const targetWindow = document.getElementById(windowId);
        if (targetWindow) {
            targetWindow.classList.remove('active');
        }
    });
});

const notepadWin = document.getElementById("window-notepad");
const notepadHeader = notepadWin.querySelector(".window-header");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

notepadHeader.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - notepadWin.offsetLeft;
    offsetY = e.clientY - notepadWin.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    notepadWin.style.left = '${e.clientX - offsetX}px';
    notepadWin.style.top = '${e.clientY - offsetY}px';
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});
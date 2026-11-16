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
        const targetWindow = document.getElementById(`window-${appName}`);
        if (targetWindow) {
            targetWindow.classList.add('active');
        }
    });
});

const closeBtns = document.querySelectorAll('.btn-close');
closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const windowId = btn.dataset.close;
        const targetWindow = document.getElementById(windowId);
        if (targetWindow) {
            targetWindow.classList.remove('active');
        }
    });
});

const windows = document.querySelectorAll('.window');
let highestZ = 10;

windows.forEach((win) => {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    win.addEventListener('mousedown', () => {
        highestZ++;
        win.style.zIndex = highestZ;
    });

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = `${e.clientX - offsetX}px`;
        win.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});

const notepadText = document.getElementById("notepad-text");
const notepadStatus = document.getElementById("notepad-status");

function updateNotepadStatus() {
    const text = notepadText.value;
    const charCount = text.length;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    notepadStatus.textContent = `${charCount} character(s) | ${wordCount} word(s)`;
}

const savedNote = localStorage.getItem('retro-notepad-content');
if (savedNote !== null) {
    notepadText.value = savedNote;
    updateNotepadStatus();
}

notepadText.addEventListener('input', () => {
    localStorage.setItem('retro-notepad-content', notepadText.value);
    updateNotepadStatus();
});
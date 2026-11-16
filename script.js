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

const terminalOutput = document.getElementById("terminal-output");
const terminalInput = document.getElementById("terminal-input");

function printTerminal(text) {
    const p = document.createElement('p');
    p.textContent = text;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const rawInput = terminalInput.value.trim();
        const cmd = rawInput.toLowerCase();

        if (rawInput !== '') {
            printTerminal(`> ${rawInput}`);
        }
        terminalInput.value = '';

        if (cmd === 'help') {
            printTerminal('Commands: help, about, date, whoami, clear');
        } else if (cmd === 'clear') {
            terminalOutput.innerHTML = '';
        } else if (cmd === 'about') {
            printTerminal('it\'s a retro terminal simulation. it ain\'t real');
        } else if (cmd === 'date') {
            const now = new Date();
            printTerminal(now.toString());
        } else if (cmd === 'whoami') {
            printTerminal('user');
        } else if (cmd !== '') {
            printTerminal(`Command not found: ${cmd}`);
        }
    }
});
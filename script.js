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
    if (currentFileId !== null) {
        const file = explorerData.find(item =>  item.id === currentFileId);
        if(file) {
            file.content = notepadText.value;
            localStorage.setItem('retro-files', JSON.stringify(explorerData));
        }
    }
});

let username = 'user';
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
            printTerminal(username);
        } else if (cmd !== '') {
            printTerminal(`Command not found: ${cmd}`);
        }
    }
});

const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('paint-color');
const sizePicker = document.getElementById('paint-size');
const clearBtn = document.getElementById('paint-clear');
const saveBtn = document.getElementById('paint-save');

let isPainting = false;

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isPainting) return;
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = sizePicker.value;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
    isPainting = false;
});

canvas.addEventListener('mouseleave', () => {
    isPainting = false;
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'drawing.png';
    link.click();
});

const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

startBtn.addEventListener('click', () => {
    startMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.classList.remove('active');
    }
});

const startItems = document.querySelectorAll('.start-item');
startItems.forEach((item) => {
    item.addEventListener('click', () => {
        const appName = item.dataset.app;
        const targetWindow = document.getElementById(`window-${appName}`);
        if (targetWindow) {
            targetWindow.classList.add('active');
            highestZ++;
            targetWindow.style.zIndex = highestZ;
        }
        startMenu.classList.remove('active');
    });
});
const calcDisplay = document.getElementById('calc-display');
const calcButtons = document.querySelectorAll('.calc-btn');

let currentCalc = '';
calcButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        if (value === 'C') {
            currentCalc = '';
            calcDisplay.value = '';
        } else if (value === '=') {
            try {
                currentCalc = eval (currentCalc).toString();
                calcDisplay.value = currentCalc;
            } catch (error) {
                calcDisplay.value = 'Error';
            }
        } else {
            currentCalc += value;
            calcDisplay.value = currentCalc;
        }
    
    });
});

const bgPicker = document.getElementById('bg-picker');
const usernameInput = document.getElementById('username-input');
const savedUsername = localStorage.getItem('retro-username');
const saveSettingsBtn = document.getElementById('save-settings');

bgPicker.addEventListener('input', () => {
    document.body.style.backgroundColor = bgPicker.value;
});

saveSettingsBtn.addEventListener('click', () => {
    if (usernameInput.value.trim() !== '') {
        username = usernameInput.value.trim();
        localStorage.setItem('retro-username', username);
    }
})

if (savedUsername !== null) {
    username = savedUsername;
    usernameInput.value = savedUsername;
}

let explorerData = JSON.parse(localStorage.getItem('retro-files')) || [];
let currentFolder = 'root';
let currentFileId = null;
let newFileButton = document.getElementById('btn-new-file');
let newFolderButton = document.getElementById('btn-new-folder');
let backButton = document.getElementById('btn-back');
let explorerContent = document.getElementById('explorer-list');
let explorerPath = document.getElementById('explorer-path')

function renderExplorer() {
    explorerContent.innerHTML = '';
    const items = explorerData.filter(item => item.parentId === currentFolder);
    items.forEach(item => {
        const btn = document.createElement('button');
        btn.textContent = (item.type === 'folder' ? '📁 ' : '📄 ') + item.name;
        btn.addEventListener('click', () => {
            if (item.type === 'folder') {
                currentFolder = item.id;
                renderExplorer();
            } else if (item.type === 'file') {
                currentFileId = item.id;
                const fileContent = item.content || '';
                notepadText.value = fileContent;
                updateNotepadStatus();
                const notepadWin = document.getElementById('window-notepad');
                notepadWin.classList.add('active');
                highestZ++;
                notepadWin.style.zIndex = highestZ;
            }
        })
        explorerContent.appendChild(btn);
    })
}

newFileButton.addEventListener('click', () => {
    const fileName = prompt("what's da file name?");
    if (!fileName) return;

    explorerData.push({
        id: Date.now(),
        name: fileName,
        type: 'file',
        parentId: currentFolder,
        content: ''
    });

    localStorage.setItem('retro-files', JSON.stringify(explorerData));
    renderExplorer();
});

newFolderButton.addEventListener('click', () => {
    const folderName = prompt("what's da folder name?");
    if (!folderName) return;
    explorerData.push({
        id: Date.now(),
        name: folderName,
        type: 'folder',
        parentId: currentFolder,
    });
    localStorage.setItem('retro-files', JSON.stringify(explorerData));
    renderExplorer();
});

backButton.addEventListener('click', () => {
    if (currentFolder === 'root') return;
    const folder = explorerData.find(item => item.id === currentFolder);
    currentFolder = folder ? folder.parentId : 'root';
    renderExplorer();
});

renderExplorer();
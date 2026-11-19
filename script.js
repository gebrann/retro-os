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

    header.addEventListener('touchstart', (e) => {
        isDragging = true;
        highestZ++;
        win.style.zIndex = highestZ;
        const touch = e.touches[0];
        offsetX = touch.clientX - win.offsetLeft;
        offsetY = touch.clientY - win.offsetTop;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        win.style.left = `${touch.clientX - offsetX}px`;
        win.style.top = `${touch.clientY - offsetY}px`;
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    })
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

canvas.addEventListener('touchstart', (e) => {
    e.preventDefauld();
    isPainting = true;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    if (!isPainting) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = sizePicker.value;
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
}, { passive: false });

canvas.addEventListener('touchend', () => {
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

const snakeCanvas = document.getElementById('snake-canvas');
const snakeCtx = snakeCanvas.getContext('2d');
const snakeScoreEl = document.getElementById('snake-score');
const snakeStartBtn = document.getElementById('snake-start');

let snake = [{ x: 150, y: 100 }];
let food = { x:60, y: 60 };
let dx = 10;
let dy = 0;
let score = 0;
let gameInterval = null;

function drawSnake() {
    snakeCtx.clearRect(0, 0, 300, 200);

    snakeCtx.fillStyle = 'red';
    snakeCtx.fillRect(food.x, food.y, 10, 10);

    snakeCtx.fillStyle = '#00ff00';
    snake.forEach(part => {
        snakeCtx.fillRect(part.x, part.y, 10, 10);
    });
};

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    const hitWall = head.x < 0 || head.x >= 300 || head.y < 0 || head.y >= 200;
    const hitSelf = snake.some(part => part.x === head.x && part.y === head.y);

    if (hitWall || hitSelf) {
        clearInterval(gameInterval);
        alert('Game Over! Score: ' + score);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        snakeScoreEl.textContent = score;
        food = {
            x: Math.floor(Math.random() * 30) * 10,
            y: Math.floor(Math.random() * 20) *10
        };
    }   else {
        snake.pop();
    }

    drawSnake();
}

snakeStartBtn.addEventListener('click', () => {
    snake = [{ x: 150, y: 100 }];
    dx = 10;
    dy = 0;
    score = 0;
    snakeScoreEl.textContent = score;

    clearInterval(gameInterval);
    drawSnake();
    gameInterval = setInterval(moveSnake, 120);
});

document.addEventListener('keydown', (e) => {
    const snakeWin = document.getElementById('window-snake');
    if (!snakeWin.classList.contains('active')) return;

    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -10; }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 10; }
    if (e.key === 'ArrowLeft' && dx === 0 ) { dx = -10; dy = 0; }
    if (e.key === 'ArrowRight' && dx === 0) { dx = 10; dy = 0; }
});
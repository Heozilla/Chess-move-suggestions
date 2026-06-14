const menuHTML = `
  <div id="chess-hint-menu" class="chess-hint-floating-menu chess-hint-hidden">
    <div id="chess-hint-header" class="chess-hint-header">
      <div class="chess-hint-header-left">
        <svg class="chess-hint-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15Z" />
          <path d="M12 2v8.5M12 2a3 3 0 1 1 0 6 3 3 0 1 1 0-6Z" />
          <path d="M7.5 10.5h9" />
        </svg>
        <span class="chess-hint-title">TaiSleep Chess AI</span>
      </div>
      <div class="chess-hint-header-right">
        <button id="chess-hint-settings" class="chess-hint-settings-btn" title="Cài đặt">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
        <div id="chess-hint-server-status" class="chess-hint-status-badge offline">• Ngắt kết nối</div>
      </div>
    </div>
    
    <div class="chess-hint-subheader">
      <div id="chess-hint-connection-status" class="chess-hint-connection disconnected">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
        </svg>
        <span>Chưa kết nối</span>
      </div>
      <div id="chess-hint-turn-indicator" class="chess-hint-turn-indicator">Lượt: --</div>
    </div>

    <div class="chess-hint-body">
      <!-- Gambit Opening Library Section -->
      <div class="chess-hint-section">
        <div class="chess-hint-section-header">
          <div class="chess-hint-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Thư viện khai cuộc Gambit</span>
          </div>
        </div>
        <div class="chess-hint-select-wrapper">
          <select id="chess-hint-gambit-select" class="chess-hint-select">
            <!-- Populated via JS -->
          </select>
        </div>
        <div class="chess-hint-gambit-moves-box">
          <span class="chess-hint-gambit-moves-label">Nước đi:</span>
          <span id="chess-hint-gambit-moves-list" class="chess-hint-gambit-moves-text">--</span>
        </div>
      </div>

      <!-- Current FEN Section -->
      <div class="chess-hint-section">
        <div class="chess-hint-section-header">
          <div class="chess-hint-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Mã FEN hiện tại</span>
          </div>
          <button id="chess-hint-copy-fen" class="chess-hint-copy-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          </button>
        </div>
        <div id="chess-hint-fen-val" class="chess-hint-fen-box">Đang chờ kết nối với bàn cờ...</div>
      </div>

      <!-- Control row: Speed -->
      <div class="chess-hint-control-row">
        <span class="chess-hint-control-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          Tốc Độ
        </span>
        <div class="chess-hint-slider-container">
          <input type="range" id="chess-hint-speed" class="chess-hint-slider" min="5" max="25" value="15">
          <span id="chess-hint-speed-val" class="chess-hint-slider-val">15</span>
        </div>
      </div>

      <!-- Control row: Suggested moves -->
      <div class="chess-hint-control-row">
        <span class="chess-hint-control-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Số nước gợi ý
        </span>
        <div class="chess-hint-btn-group" id="chess-hint-suggest-group">
          <button class="chess-hint-group-btn" data-val="1">1 nước</button>
          <button class="chess-hint-group-btn active" data-val="3">3 nước</button>
        </div>
      </div>

      <!-- Control row: Auto analyze -->
      <div class="chess-hint-control-row">
        <span class="chess-hint-control-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Tự động phân tích
        </span>
        <div class="chess-hint-switch-container">
          <span class="chess-hint-switch-text" id="chess-hint-auto-text">Liên tục</span>
          <label class="chess-hint-switch">
            <input type="checkbox" id="chess-hint-auto-checkbox" checked>
            <span class="chess-hint-switch-slider"></span>
          </label>
        </div>
      </div>

      <!-- Control row: Only my turn -->
      <div class="chess-hint-control-row">
        <span class="chess-hint-control-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          Chỉ phân tích lượt của tôi
        </span>
        <div class="chess-hint-switch-container">
          <span class="chess-hint-switch-text" id="chess-hint-turn-only-text">Bật</span>
          <label class="chess-hint-switch">
            <input type="checkbox" id="chess-hint-turn-only-checkbox" checked>
            <span class="chess-hint-switch-slider"></span>
          </label>
        </div>
      </div>

      <!-- Analyze button -->
      <button id="chess-hint-btn" class="chess-hint-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        <span>Phân tích nước đi</span>
      </button>

      <!-- Suggested moves list display -->
      <div id="chess-hint-suggestions-list" class="chess-hint-results-container">
        <div class="chess-hint-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4M12 8h.01"></path>
          </svg>
          <span>Đang chờ kết nối với bàn cờ...</span>
        </div>
      </div>
    </div>
  </div>
`;

// Insert layout
document.body.insertAdjacentHTML('beforeend', menuHTML);

// Select DOM references
const floatingMenu = document.getElementById('chess-hint-menu');
const menuHeader = document.getElementById('chess-hint-header');
const hintBtn = document.getElementById('chess-hint-btn');
const serverStatus = document.getElementById('chess-hint-server-status');
const connectionStatus = document.getElementById('chess-hint-connection-status');
const turnIndicator = document.getElementById('chess-hint-turn-indicator');
const gambitSelect = document.getElementById('chess-hint-gambit-select');
const gambitMovesList = document.getElementById('chess-hint-gambit-moves-list');
const copyFenBtn = document.getElementById('chess-hint-copy-fen');
const fenVal = document.getElementById('chess-hint-fen-val');
const speedSlider = document.getElementById('chess-hint-speed');
const speedVal = document.getElementById('chess-hint-speed-val');
const suggestGroup = document.getElementById('chess-hint-suggest-group');
const autoCheckbox = document.getElementById('chess-hint-auto-checkbox');
const autoText = document.getElementById('chess-hint-auto-text');
const turnOnlyCheckbox = document.getElementById('chess-hint-turn-only-checkbox');
const turnOnlyText = document.getElementById('chess-hint-turn-only-text');
const suggestionsList = document.getElementById('chess-hint-suggestions-list');

// State variables
let selectedSuggestionsCount = 3;
let lastFen = null;
let activeArrows = {};
let pingInterval = null;
let boardTrackerInterval = null;

// Gambit Library Database
const GAMBITS = [
    { name: "-- Chọn khai cuộc Gambit --", moves: "" },
    { name: "Queen's Gambit (Hậu Gambit)", moves: "1. d4 d5 2. c4" },
    { name: "King's Gambit (Vua Gambit)", moves: "1. e4 e5 2. f4" },
    { name: "Evans Gambit", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4" },
    { name: "Danish Gambit (Đan Mạch)", moves: "1. e4 e5 2. d4 exd4 3. c3" },
    { name: "Budapest Gambit", moves: "1. d4 Nf6 2. c4 e5" },
    { name: "Stafford Gambit", moves: "1. e4 e5 2. Nf3 Nf6 3. Nxe5 Nc6" },
    { name: "Blackmar-Diemer Gambit", moves: "1. d4 d5 2. e4 dxe4 3. Nc3" },
    { name: "Smith-Morra Gambit", moves: "1. e4 c5 2. d4 cxd4 3. c3" },
    { name: "Tennison Gambit", moves: "1. e4 d4 2. Nf3 dxe4 3. Ng5" }
];

// Populate opening library dropdown
GAMBITS.forEach(gambit => {
    const option = document.createElement('option');
    option.value = gambit.moves;
    option.textContent = gambit.name;
    gambitSelect.appendChild(option);
});

gambitSelect.addEventListener('change', (e) => {
    const moves = e.target.value;
    gambitMovesList.textContent = moves || "--";
});

// Setup Slider Listener
speedSlider.addEventListener('input', (e) => {
    speedVal.textContent = e.target.value;
});

// Setup Number of suggestions buttons
const suggestButtons = suggestGroup.querySelectorAll('.chess-hint-group-btn');
suggestButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        suggestButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSuggestionsCount = parseInt(btn.getAttribute('data-val'));
    });
});

// Setup toggles text updates
autoCheckbox.addEventListener('change', (e) => {
    autoText.textContent = e.target.checked ? "Liên tục" : "Tắt";
});
turnOnlyCheckbox.addEventListener('change', (e) => {
    turnOnlyText.textContent = e.target.checked ? "Bật" : "Tắt";
});

// Setup Copy FEN Action
copyFenBtn.addEventListener('click', () => {
    const text = fenVal.textContent;
    if (text && text !== "Đang chờ kết nối với bàn cờ..." && text !== "Không tìm thấy bàn cờ") {
        navigator.clipboard.writeText(text).then(() => {
            const label = copyFenBtn.querySelector('span');
            const originalText = label.textContent;
            label.textContent = "Copied!";
            setTimeout(() => {
                label.textContent = originalText;
            }, 1200);
        });
    }
});

// Dragging floating panel logic
let isDragging = false, currentX = 0, currentY = 0, initialX, initialY, xOffset = 0, yOffset = 0;

menuHeader.addEventListener("mousedown", (e) => {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    if (e.target === menuHeader || menuHeader.contains(e.target)) {
        if (e.target.closest('.chess-hint-settings-btn') || e.target.closest('.chess-hint-status-badge')) return;
        isDragging = true;
    }
});

document.addEventListener("mouseup", () => {
    initialX = currentX; 
    initialY = currentY; 
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX; 
        yOffset = currentY;
        floatingMenu.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
});

// Listen to extension action click
chrome.runtime.onMessage.addListener((req) => {
    if (req.action === "toggle-menu") {
        const isHidden = floatingMenu.classList.toggle('chess-hint-hidden');
        if (!isHidden) {
            startPingInterval();
            startBoardTracker();
        } else {
            stopPingInterval();
            stopBoardTracker();
            document.querySelectorAll('.chess-hint-visual-overlay').forEach(el => el.remove());
        }
    }
});

// Ping interval checks Node server status
function startPingInterval() {
    if (pingInterval) clearInterval(pingInterval);
    checkServerPing();
    pingInterval = setInterval(checkServerPing, 5000);
}

function stopPingInterval() {
    if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
    }
}

async function checkServerPing() {
    try {
        const res = await fetch('http://localhost:3000/');
        if (res.ok) {
            serverStatus.className = 'chess-hint-status-badge online';
            serverStatus.textContent = '• Ready';
        } else {
            serverStatus.className = 'chess-hint-status-badge offline';
            serverStatus.textContent = '• Ngắt kết nối';
        }
    } catch {
        serverStatus.className = 'chess-hint-status-badge offline';
        serverStatus.textContent = '• Ngắt kết nối';
    }
}

// Track chess board status & updates
function startBoardTracker() {
    if (boardTrackerInterval) clearInterval(boardTrackerInterval);
    trackBoard();
    boardTrackerInterval = setInterval(trackBoard, 1000);
}

function stopBoardTracker() {
    if (boardTrackerInterval) {
        clearInterval(boardTrackerInterval);
        boardTrackerInterval = null;
    }
}

function trackBoard() {
    const boardEl = document.querySelector('chess-board') || document.querySelector('cg-board') || document.querySelector('.board') || document.querySelector('.chessground-board');
    
    if (boardEl) {
        connectionStatus.className = 'chess-hint-connection connected';
        connectionStatus.querySelector('span').textContent = 'Đã kết nối';
        
        try {
            const currentFen = getFenFromBoard();
            if (currentFen) {
                fenVal.textContent = currentFen;
                
                // Track turn from FEN
                const parts = currentFen.split(' ');
                const turn = parts[1]; // 'w' or 'b'
                turnIndicator.textContent = `Lượt: ${turn === 'w' ? 'Trắng' : 'Đen'}`;
                
                if (currentFen !== lastFen) {
                    lastFen = currentFen;
                    // Trigger auto analysis if checked
                    if (autoCheckbox.checked) {
                        let shouldAnalyze = true;
                        if (turnOnlyCheckbox.checked) {
                            const isFlipped = boardEl.classList.contains('flipped') || boardEl.classList.contains('orientation-black') || boardEl.classList.contains('board-b');
                            const myColor = isFlipped ? 'b' : 'w';
                            shouldAnalyze = (turn === myColor);
                        }
                        if (shouldAnalyze) {
                            triggerAnalysis(currentFen);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Lỗi trích xuất FEN:", err);
        }
    } else {
        connectionStatus.className = 'chess-hint-connection disconnected';
        connectionStatus.querySelector('span').textContent = 'Chưa kết nối';
        turnIndicator.textContent = 'Lượt: --';
        fenVal.textContent = 'Đang chờ kết nối với bàn cờ...';
        lastFen = null;
    }
}

// Manual Analyze button trigger
hintBtn.addEventListener('click', () => {
    triggerAnalysis();
});

// Main Analysis trigger function
async function triggerAnalysis(fenInput) {
    const fen = fenInput || getFenFromBoard();
    if (!fen) {
        showError("Không thể tìm thấy thế cờ hiện tại.");
        return;
    }
    
    hintBtn.disabled = true;
    hintBtn.classList.add('loading');
    suggestionsList.innerHTML = `
        <div class="chess-hint-loading-state">
            <div class="chess-hint-spinner"></div>
            <span>Đang quét thế cờ và phân tích...</span>
        </div>
    `;
    
    try {
        const depth = speedSlider.value || 15;
        const response = await fetch('http://localhost:3000/api/bestmove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fen, depth, multipv: selectedSuggestionsCount })
        });
        
        const data = await response.json();
        if (data.success && data.suggestions) {
            renderSuggestions(data.suggestions);
            
            // Draw visual arrow for best move (#1) by default
            if (data.suggestions.length > 0) {
                drawVisual(data.suggestions[0].move, 1);
            }
        } else {
            throw new Error("Lỗi phản hồi từ server");
        }
    } catch (err) {
        showError("Lỗi: Không thể kết nối hoặc phân tích!");
    } finally {
        hintBtn.disabled = false;
        hintBtn.classList.remove('loading');
    }
}

function showError(msg) {
    suggestionsList.innerHTML = `
        <div class="chess-hint-error-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>${msg}</span>
        </div>
    `;
}

// Render Suggestions List inside container
function renderSuggestions(suggestions) {
    if (suggestions.length === 0) {
        suggestionsList.innerHTML = `
            <div class="chess-hint-empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4M12 8h.01"></path>
                </svg>
                <span>Hết nước đi hợp lệ (Chiếu bí hoặc Hòa)</span>
            </div>
        `;
        return;
    }
    
    suggestionsList.innerHTML = '';
    
    suggestions.forEach(item => {
        const fromSq = item.move.substring(0, 2);
        const toSq = item.move.substring(2, 4);
        const promo = item.move.substring(4, 5);
        const moveText = `${fromSq} - ${toSq}${promo ? `=${promo.toUpperCase()}` : ''}`;
        
        const card = document.createElement('div');
        card.className = `chess-hint-suggestion-item rank-${item.rank}`;
        
        card.innerHTML = `
            <div class="chess-hint-suggestion-left">
                <span class="chess-hint-suggestion-rank">#${item.rank}</span>
                <span class="chess-hint-suggestion-dot"></span>
                <span class="chess-hint-suggestion-move">${moveText}</span>
            </div>
            <div class="chess-hint-suggestion-right">
                <span class="chess-hint-suggestion-score">${item.score}</span>
                <button class="chess-hint-visualize-btn ${item.rank === 1 ? 'active' : ''}" title="Hiển thị nước đi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </div>
        `;
        
        const vizBtn = card.querySelector('.chess-hint-visualize-btn');
        vizBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            document.querySelectorAll('.chess-hint-visualize-btn').forEach(btn => btn.classList.remove('active'));
            vizBtn.classList.add('active');
            
            drawVisual(item.move, item.rank);
        });
        
        suggestionsList.appendChild(card);
    });
}

// Convert Board DOM to FEN (Supports Chess.com & Lichess)
function getFenFromBoard() {
    const boardEl = document.querySelector('chess-board') || document.querySelector('cg-board') || document.querySelector('.board') || document.querySelector('.chessground-board');
    if (!boardEl) return null;

    let board = Array(8).fill().map(() => Array(8).fill(''));
    
    // Chess.com piece elements are .piece, Lichess are piece
    const pieces = boardEl.querySelectorAll('.piece, piece, .cg-piece');

    pieces.forEach(p => {
        // 1. Chess.com style parse
        let pMatch = p.className.match(/\b([wb][pnbrqk])\b/);
        let sqMatch = p.className.match(/square-(\d)(\d)/);
        
        if (pMatch && sqMatch) {
            const file = parseInt(sqMatch[1]);
            const rank = parseInt(sqMatch[2]);
            board[8 - rank][file - 1] = pMatch[1][0] === 'w' ? pMatch[1][1].toUpperCase() : pMatch[1][1];
        } else {
            // 2. Lichess / Chessground style parse
            let color = p.classList.contains('white') ? 'w' : (p.classList.contains('black') ? 'b' : null);
            let type = null;
            ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'].forEach(t => {
                if (p.classList.contains(t)) {
                    type = t === 'knight' ? 'n' : t[0];
                }
            });
            
            const transform = p.style.transform;
            if (transform && color && type) {
                const match = transform.match(/translate\((\d+(?:\.\d+)?)(%|px),\s*(\d+(?:\.\d+)?)(%|px)\)/);
                if (match) {
                    const xVal = parseFloat(match[1]);
                    const xUnit = match[2];
                    const yVal = parseFloat(match[3]);
                    const yUnit = match[4];
                    
                    let file = 0;
                    let rank = 0;
                    
                    if (xUnit === '%') {
                        file = Math.round(xVal / 12.5) + 1;
                        rank = 8 - Math.round(yVal / 12.5);
                    } else if (xUnit === 'px' && boardEl.clientWidth) {
                        const sqWidth = boardEl.clientWidth / 8;
                        file = Math.round(xVal / sqWidth) + 1;
                        rank = 8 - Math.round(yVal / sqWidth);
                    }
                    
                    if (file >= 1 && file <= 8 && rank >= 1 && rank <= 8) {
                        board[8 - rank][file - 1] = color === 'w' ? type.toUpperCase() : type;
                    }
                }
            }
        }
    });

    // 1. Turn detector (from highlight markers)
    let turn = 'w';
    const highlights = boardEl.querySelectorAll('.highlight, .last-move');
    if (highlights.length >= 2) {
        let sq1 = null;
        let sq2 = null;
        
        highlights.forEach(hl => {
            let match = hl.className.match(/square-(\d)(\d)/);
            if (match) {
                const file = parseInt(match[1]);
                const rank = parseInt(match[2]);
                if (!sq1) sq1 = { file, rank };
                else if (!sq2) sq2 = { file, rank };
            } else {
                // Lichess cg-board key highlight markers or style positioning
                const key = hl.getAttribute('data-key'); // e.g. "e2" or "e4"
                if (key && key.length === 2) {
                    const file = key.charCodeAt(0) - 96;
                    const rank = parseInt(key.charAt(1));
                    if (!sq1) sq1 = { file, rank };
                    else if (!sq2) sq2 = { file, rank };
                }
            }
        });
        
        if (sq1 && sq2) {
            const p1 = board[8 - sq1.rank][sq1.file - 1];
            const p2 = board[8 - sq2.rank][sq2.file - 1];
            
            let movedPiece = null;
            if (p1 && !p2) movedPiece = p1;
            else if (p2 && !p1) movedPiece = p2;
            else if (p1 && p2) movedPiece = p2;
            
            if (movedPiece) {
                const isWhite = movedPiece === movedPiece.toUpperCase();
                turn = isWhite ? 'b' : 'w';
            }
        }
    }

    // 2. Castling Rights detector
    let castling = "";
    if (board[7][4] === 'K') {
        if (board[7][7] === 'R') castling += 'K';
        if (board[7][0] === 'R') castling += 'Q';
    }
    if (board[0][4] === 'k') {
        if (board[0][7] === 'r') castling += 'k';
        if (board[0][0] === 'r') castling += 'q';
    }
    if (castling === "") castling = "-";

    // 3. Construct standard FEN string
    const fenBoard = board.map(row => 
        row.map(cell => cell === '' ? '1' : cell).join('').replace(/1+/g, m => m.length)
    ).join('/');

    return `${fenBoard} ${turn} ${castling} - 0 1`;
}

// Draw visually highlighting suggestions
function drawVisual(move, rank = 1) {
    document.querySelectorAll('.chess-hint-visual-overlay').forEach(el => el.remove());
    const boardEl = document.querySelector('chess-board') || document.querySelector('cg-board') || document.querySelector('.board') || document.querySelector('.chessground-board');
    if (!boardEl) return;

    const isFlipped = boardEl.classList.contains('flipped') || boardEl.classList.contains('orientation-black') || boardEl.classList.contains('board-b');
    const fromPos = getSquareCoords(move.charCodeAt(0) - 96, parseInt(move.charAt(1)), isFlipped);
    const toPos = getSquareCoords(move.charCodeAt(2) - 96, parseInt(move.charAt(3)), isFlipped);

    const overlay = document.createElement('div');
    overlay.className = 'chess-hint-visual-overlay';
    overlay.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999;';

    let primaryColor, shadowColor, borderStyle;
    if (rank === 1) {
        primaryColor = '#f59e0b';
        shadowColor = 'rgba(245, 158, 11, 0.4)';
        borderStyle = '2px dashed #f59e0b';
    } else if (rank === 2) {
        primaryColor = '#2b76f6';
        shadowColor = 'rgba(43, 118, 246, 0.4)';
        borderStyle = '2px solid #2b76f6';
    } else {
        primaryColor = '#00bcd4';
        shadowColor = 'rgba(0, 188, 212, 0.4)';
        borderStyle = '2px solid #00bcd4';
    }

    const highlightFrom = document.createElement('div');
    highlightFrom.style.cssText = `position: absolute; width: 12.5%; height: 12.5%; left: ${fromPos.x}%; top: ${fromPos.y}%; background: ${shadowColor.replace('0.4', '0.18')}; border: ${borderStyle}; box-shadow: 0 0 15px ${shadowColor}; border-radius: 4px; box-sizing: border-box; animation: chess-hint-pulse 1.5s infinite alternate;`;
    overlay.appendChild(highlightFrom);

    const highlightTo = document.createElement('div');
    highlightTo.style.cssText = `position: absolute; width: 12.5%; height: 12.5%; left: ${toPos.x}%; top: ${toPos.y}%; background: ${shadowColor.replace('0.4', '0.18')}; border: 2px solid ${primaryColor}; box-shadow: 0 0 15px ${shadowColor}; border-radius: 4px; box-sizing: border-box;`;
    overlay.appendChild(highlightTo);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0;';
    
    const dx = toPos.cx - fromPos.cx;
    const dy = toPos.cy - fromPos.cy;
    const angle = Math.atan2(dy, dx);
    const offset = 4.5;
    const x2 = toPos.cx - offset * Math.cos(angle);
    const y2 = toPos.cy - offset * Math.sin(angle);

    svg.innerHTML = `
        <defs>
            <filter id="chess-hint-glow-${rank}" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <marker id="chess-hint-arrow-${rank}" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <path d="M 0 0 L 4 2 L 0 4 z" fill="${primaryColor}" />
            </marker>
        </defs>
        <line x1="${fromPos.cx}" y1="${fromPos.cy}" x2="${x2}" y2="${y2}" stroke="${primaryColor}" stroke-width="1.6" stroke-linecap="round" marker-end="url(#chess-hint-arrow-${rank})" filter="url(#chess-hint-glow-${rank})" style="opacity: 0.9;" />
    `;
    overlay.appendChild(svg);
    boardEl.appendChild(overlay);
}

function getSquareCoords(file, rank, isFlipped) {
    const x = isFlipped ? (8 - file) * 12.5 : (file - 1) * 12.5;
    const y = isFlipped ? (rank - 1) * 12.5 : (8 - rank) * 12.5;
    return { x, y, cx: x + 6.25, cy: y + 6.25 }; 
}
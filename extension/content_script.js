const menuHTML = `
  <div id="chess-hint-menu" class="chess-hint-floating-menu chess-hint-hidden">
    <div id="chess-hint-header" class="chess-hint-header">
      <div class="chess-hint-header-left">
        <svg class="chess-hint-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15Z" />
          <path d="M12 2v8.5M12 2a3 3 0 1 1 0 6 3 3 0 1 1 0-6Z" />
          <path d="M7.5 10.5h9" />
        </svg>
        <span class="chess-hint-title">Chess Suggestion AI</span>
      </div>
      <div class="chess-hint-header-right">
        <div id="chess-hint-server-status" class="chess-hint-status offline">
          <span class="chess-hint-status-dot"></span>
          <span class="chess-hint-status-text">Ngắt kết nối</span>
        </div>
        <span id="chess-hint-close-btn" class="chess-hint-close" title="Đóng Tool">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      </div>
    </div>
    <div class="chess-hint-body">
      <div class="chess-hint-control-group">
        <div class="chess-hint-label-row">
          <label for="chess-hint-depth">Độ sâu phân tích (Depth):</label>
          <span id="chess-hint-depth-val" class="chess-hint-val">15</span>
        </div>
        <input type="range" id="chess-hint-depth" class="chess-hint-slider" min="5" max="25" value="15">
      </div>
      
      <button id="chess-hint-btn" class="chess-hint-btn">
        <svg class="chess-hint-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        <span>Phân tích nước đi</span>
      </button>
      
      <div id="chess-hint-result" class="chess-hint-result-box">
        <div class="chess-hint-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>Sẵn sàng phân tích thế cờ</span>
        </div>
      </div>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', menuHTML);

const floatingMenu = document.getElementById('chess-hint-menu');
const menuHeader = document.getElementById('chess-hint-header');
const hintBtn = document.getElementById('chess-hint-btn');
const statusText = document.getElementById('chess-hint-server-status');
const statusTextLabel = statusText.querySelector('.chess-hint-status-text');
const resultBox = document.getElementById('chess-hint-result');
const closeBtn = document.getElementById('chess-hint-close-btn');
const depthSlider = document.getElementById('chess-hint-depth');
const depthVal = document.getElementById('chess-hint-depth-val');

depthSlider.addEventListener('input', (e) => {
    depthVal.textContent = e.target.value;
});

closeBtn.addEventListener('click', () => {
    floatingMenu.classList.add('chess-hint-hidden');
    document.querySelectorAll('.chess-hint-visual-overlay').forEach(el => el.remove());
    stopPingInterval();
});

let isDragging = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

menuHeader.addEventListener("mousedown", (e) => {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    if (e.target === menuHeader || menuHeader.contains(e.target)) {
        // Don't drag if clicking buttons
        if (e.target.closest('.chess-hint-close') || e.target.closest('.chess-hint-status')) return;
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

chrome.runtime.onMessage.addListener((req) => {
    if (req.action === "toggle-menu") {
        const isHidden = floatingMenu.classList.toggle('chess-hint-hidden');
        if (!isHidden) {
            startPingInterval();
        } else {
            stopPingInterval();
        }
    }
});

let pingInterval = null;

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
            statusText.className = 'chess-hint-status online';
            statusTextLabel.textContent = 'Đang chạy';
        } else {
            statusText.className = 'chess-hint-status offline';
            statusTextLabel.textContent = 'Ngắt kết nối';
        }
    } catch {
        statusText.className = 'chess-hint-status offline';
        statusTextLabel.textContent = 'Ngắt kết nối';
    }
}

hintBtn.addEventListener('click', async () => {
    // UI Loading state
    hintBtn.disabled = true;
    hintBtn.classList.add('loading');
    resultBox.innerHTML = `
        <div class="chess-hint-loading-state">
            <div class="chess-hint-spinner"></div>
            <span>Đang quét thế cờ và phân tích...</span>
        </div>
    `;
    
    try {
        const boardFen = getFenFromBoard();
        const response = await fetch('http://localhost:3000/api/bestmove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fen: boardFen, depth: depthSlider.value || 15 })
        });

        const data = await response.json();
        if (data.success && data.bestMove) {
            const formattedMove = data.bestMove.toUpperCase();
            const fromSq = formattedMove.substring(0, 2);
            const toSq = formattedMove.substring(2, 4);
            
            resultBox.innerHTML = `
                <div class="chess-hint-success-state">
                    <div class="chess-hint-result-title">Nước đi tốt nhất đề xuất:</div>
                    <div class="chess-hint-move-container">
                        <span class="chess-hint-move-sq from">${fromSq}</span>
                        <svg class="chess-hint-move-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                        <span class="chess-hint-move-sq to">${toSq}</span>
                    </div>
                </div>
            `;
            drawVisual(data.bestMove);
        } else throw new Error("Lỗi Server");
    } catch (error) {
        resultBox.innerHTML = `
            <div class="chess-hint-error-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Lỗi: Không thể phân tích thế cờ hiện tại!</span>
            </div>
        `;
    } finally {
        hintBtn.disabled = false;
        hintBtn.classList.remove('loading');
    }
});

function getFenFromBoard() {
    const boardEl = document.querySelector('chess-board') || document.querySelector('cg-board') || document.querySelector('.board');
    if (!boardEl) return null;

    let board = Array(8).fill().map(() => Array(8).fill(''));
    const pieces = boardEl.querySelectorAll('.piece');

    pieces.forEach(p => {
        const pMatch = p.className.match(/\b([wb][pnbrqk])\b/);
        const sqMatch = p.className.match(/square-(\d)(\d)/);
        if (pMatch && sqMatch) {
            board[8 - parseInt(sqMatch[2])][parseInt(sqMatch[1]) - 1] = pMatch[1][0] === 'w' ? pMatch[1][1].toUpperCase() : pMatch[1][1];
        }
    });

    // 1. Tự động phát hiện lượt đi
    let turn = 'w';
    const highlights = boardEl.querySelectorAll('.highlight');
    if (highlights.length >= 2) {
        let sq1 = null;
        let sq2 = null;
        highlights.forEach(hl => {
            const match = hl.className.match(/square-(\d)(\d)/);
            if (match) {
                const file = parseInt(match[1]);
                const rank = parseInt(match[2]);
                if (!sq1) sq1 = { file, rank };
                else if (!sq2) sq2 = { file, rank };
            }
        });
        
        if (sq1 && sq2) {
            const p1 = board[8 - sq1.rank][sq1.file - 1];
            const p2 = board[8 - sq2.rank][sq2.file - 1];
            
            let movedPiece = null;
            if (p1 && !p2) {
                movedPiece = p1;
            } else if (p2 && !p1) {
                movedPiece = p2;
            } else if (p1 && p2) {
                movedPiece = p2; // Mặc định chọn quân cờ ở vị trí đích
            }
            
            if (movedPiece) {
                const isWhite = movedPiece === movedPiece.toUpperCase();
                turn = isWhite ? 'b' : 'w';
            }
        }
    }

    // 2. Tự động phát hiện quyền nhập thành (Castling Rights)
    let castling = "";
    // Vua trắng ở e1 (board[7][4])
    if (board[7][4] === 'K') {
        if (board[7][7] === 'R') castling += 'K'; // Xe trắng ở h1
        if (board[7][0] === 'R') castling += 'Q'; // Xe trắng ở a1
    }
    // Vua đen ở e8 (board[0][4])
    if (board[0][4] === 'k') {
        if (board[0][7] === 'r') castling += 'k'; // Xe đen ở h8
        if (board[0][0] === 'r') castling += 'q'; // Xe đen ở a8
    }
    if (castling === "") castling = "-";

    // 3. Tạo FEN board chuẩn (sửa lỗi ô trống)
    const fenBoard = board.map(row => 
        row.map(cell => cell === '' ? '1' : cell).join('').replace(/1+/g, m => m.length)
    ).join('/');

    return `${fenBoard} ${turn} ${castling} - 0 1`;
}

function drawVisual(move) {
    document.querySelectorAll('.chess-hint-visual-overlay').forEach(el => el.remove());
    const boardEl = document.querySelector('chess-board') || document.querySelector('cg-board') || document.querySelector('.board');
    if (!boardEl) return;

    const isFlipped = boardEl.classList.contains('flipped');
    const fromPos = getSquareCoords(move.charCodeAt(0) - 96, parseInt(move.charAt(1)), isFlipped);
    const toPos = getSquareCoords(move.charCodeAt(2) - 96, parseInt(move.charAt(3)), isFlipped);

    const overlay = document.createElement('div');
    overlay.className = 'chess-hint-visual-overlay';
    overlay.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999;';

    const highlightFrom = document.createElement('div');
    highlightFrom.style.cssText = `position: absolute; width: 12.5%; height: 12.5%; left: ${fromPos.x}%; top: ${fromPos.y}%; background: rgba(0, 210, 255, 0.18); border: 2px dashed rgba(0, 210, 255, 0.75); box-shadow: 0 0 15px rgba(0, 210, 255, 0.4); border-radius: 4px; box-sizing: border-box; animation: chess-hint-pulse 1.5s infinite alternate;`;
    overlay.appendChild(highlightFrom);

    const highlightTo = document.createElement('div');
    highlightTo.style.cssText = `position: absolute; width: 12.5%; height: 12.5%; left: ${toPos.x}%; top: ${toPos.y}%; background: rgba(0, 230, 118, 0.18); border: 2px solid rgba(0, 230, 118, 0.75); box-shadow: 0 0 15px rgba(0, 230, 118, 0.4); border-radius: 4px; box-sizing: border-box;`;
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
            <filter id="chess-hint-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <marker id="chess-hint-arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <path d="M 0 0 L 4 2 L 0 4 z" fill="#00e676" />
            </marker>
        </defs>
        <line x1="${fromPos.cx}" y1="${fromPos.cy}" x2="${x2}" y2="${y2}" stroke="#00e676" stroke-width="1.6" stroke-linecap="round" marker-end="url(#chess-hint-arrow)" filter="url(#chess-hint-glow)" style="opacity: 0.9;" />
    `;
    overlay.appendChild(svg);
    boardEl.appendChild(overlay);
}

function getSquareCoords(file, rank, isFlipped) {
    const x = isFlipped ? (8 - file) * 12.5 : (file - 1) * 12.5;
    const y = isFlipped ? (rank - 1) * 12.5 : (8 - rank) * 12.5;
    return { x, y, cx: x + 6.25, cy: y + 6.25 }; 
}
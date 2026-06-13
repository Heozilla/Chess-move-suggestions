// ==========================================
// 1. TẠO HTML CHO FLOATING MENU (UI NỔI)
// ==========================================
const menuHTML = `
  <div id="ltl-chess-menu" class="ltl-floating-menu" style="display: none;">
    <div id="ltl-menu-header" class="ltl-header">
      <span class="ltl-title">♟️ LTL Chess Engine</span>
      <span id="ltl-server-status" class="ltl-status offline">● Ngắt kết nối</span>
    </div>
    <div class="ltl-body">
      <div class="ltl-form-group">
        <label>Độ sâu (Depth):</label>
        <input type="number" id="ltl-depth" value="15" min="1" max="25">
      </div>
      <button id="ltl-hint-btn" class="ltl-btn">💡 Lấy Gợi Ý Nước Đi</button>
      <div id="ltl-result" class="ltl-result-box">Chưa có dữ liệu...</div>
    </div>
  </div>
`;

// Chèn menu vào body của trang web
document.body.insertAdjacentHTML('beforeend', menuHTML);

// ==========================================
// 2. CÁC BIẾN DOM
// ==========================================
const floatingMenu = document.getElementById('ltl-chess-menu');
const menuHeader = document.getElementById('ltl-menu-header');
const hintBtn = document.getElementById('ltl-hint-btn');
const statusText = document.getElementById('ltl-server-status');
const resultBox = document.getElementById('ltl-result');

// ==========================================
// 3. LOGIC KÉO THẢ (DRAG & DROP)
// ==========================================
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

menuHeader.addEventListener("mousedown", dragStart);
document.addEventListener("mouseup", dragEnd);
document.addEventListener("mousemove", drag);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    if (e.target === menuHeader || e.target.parentNode === menuHeader) {
        isDragging = true;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        floatingMenu.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
}

// ==========================================
// 4. LẮNG NGHE LỆNH BẬT/TẮT TỪ BACKGROUND.JS
// ==========================================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle-menu") {
        if (floatingMenu.style.display === "none") {
            floatingMenu.style.display = "block";
            checkServerPing(); // Ping server mỗi khi mở menu lên
        } else {
            floatingMenu.style.display = "none";
        }
    }
});

// ==========================================
// 5. LOGIC PING SERVER KIỂM TRA KẾT NỐI
// ==========================================
async function checkServerPing() {
    try {
        const res = await fetch('http://localhost:3000/');
        if (res.ok) {
            statusText.textContent = '● Đang chạy';
            statusText.className = 'ltl-status online';
        }
    } catch (error) {
        statusText.textContent = '● Ngắt kết nối';
        statusText.className = 'ltl-status offline';
    }
}

// ==========================================
// 6. LOGIC LÕI: CÀO DOM -> GỌI API -> VẼ VISUAL
// ==========================================
hintBtn.addEventListener('click', async () => {
    resultBox.innerHTML = "<em>⏳ Đang quét bàn cờ...</em>";
    resultBox.style.color = "#FFD700"; // Màu vàng
    
    try {
        // B1: Quét HTML và tạo chuỗi FEN
        const fen = getFenFromBoard();
        console.log("♟️ Chuỗi FEN hiện tại:", fen);

        // B2: Gọi Local Server
        const depthInput = document.getElementById('ltl-depth').value || 15;
        const response = await fetch('http://localhost:3000/api/bestmove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fen: fen, depth: depthInput })
        });

        const data = await response.json();

        if (data.success) {
            const bestMove = data.bestMove; // vd: "e2e4"
            resultBox.innerHTML = `Nước đi tốt nhất: <strong>${bestMove.toUpperCase()}</strong>`;
            resultBox.style.color = "#4CAF50"; // Màu xanh

            // B3: Vẽ Visual Xanh lên bàn cờ
            drawVisual(bestMove);
        } else {
            throw new Error("Lỗi từ Stockfish Server");
        }
    } catch (error) {
        console.error(error);
        resultBox.innerHTML = "❌ Lỗi: Không thể phân tích!";
        resultBox.style.color = "#f44336";
    }
});

// ==========================================
// 7. THUẬT TOÁN CÀO FEN (CHUẨN GITHUB)
// ==========================================
function getFenFromBoard() {
    let board = Array(8).fill().map(() => Array(8).fill(''));
    const pieces = document.querySelectorAll('.piece');
    
    // Kiểm tra xem bàn cờ có đang bị lật ngược không (Trường hợp cầm quân Đen)
    const boardEl = document.querySelector('chess-board');
    const isFlipped = boardEl && boardEl.classList.contains('flipped');

    pieces.forEach(piece => {
        const className = piece.className;
        const pieceTypeMatch = className.match(/\b([wb][pnbrqk])\b/);
        const squareMatch = className.match(/square-(\d)(\d)/);

        if (pieceTypeMatch && squareMatch) {
            const pType = pieceTypeMatch[1]; 
            const file = parseInt(squareMatch[1]); // Cột a->h (1->8)
            const rank = parseInt(squareMatch[2]); // Hàng 1->8

            const fenChar = pType[0] === 'w' ? pType[1].toUpperCase() : pType[1];
            
            // Map vào mảng (Hàng 8 index 0)
            board[8 - rank][file - 1] = fenChar;
        }
    });

    let fenRows = [];
    for (let row = 0; row < 8; row++) {
        let emptyCount = 0;
        let fenRow = "";
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === '') {
                emptyCount++;
            } else {
                if (emptyCount > 0) { fenRow += emptyCount; emptyCount = 0; }
                fenRow += board[row][col];
            }
        }
        if (emptyCount > 0) fenRow += emptyCount;
        fenRows.push(fenRow);
    }

    let turn = "w"; // Mặc định lượt quân Trắng
    
    // Ghép chuỗi hoàn chỉnh
    return fenRows.join('/') + ` ${turn} KQkq - 0 1`;
}

// ==========================================
// 8. HÀM VẼ VISUAL HIGHLIGHT Ô CỜ
// ==========================================
function drawVisual(move) {
    // Xóa các highlight cũ của lượt trước
    document.querySelectorAll('.ltl-highlight').forEach(el => el.remove());

    // Cắt tọa độ (vd: "b4d5" -> from: b4, to: d5)
    const fromFile = move.charCodeAt(0) - 96; // 'a' -> 1, 'b' -> 2
    const fromRank = move.charAt(1);
    const toFile = move.charCodeAt(2) - 96;
    const toRank = move.charAt(3);

    const boardEl = document.querySelector('chess-board');
    if (!boardEl) return;

    // Helper tạo thẻ Div highlight
    function createHighlight(file, rank, colorClass) {
        const highlight = document.createElement('div');
        // Bí quyết: Dùng class 'square-xy' của chính Chess.com để nó tự căn tọa độ
        highlight.className = `highlight ltl-highlight square-${file}${rank} ${colorClass}`;
        boardEl.appendChild(highlight);
    }

    // Vẽ 2 ô: Ô xuất phát và Ô đích đến
    createHighlight(fromFile, fromRank, 'ltl-from');
    createHighlight(toFile, toRank, 'ltl-to');
}
const { spawn } = require('child_process');
const path = require('path');

// Trỏ đường dẫn tuyệt đối đến file engine để tránh lỗi sai thư mục khi chạy
const enginePath = path.join(__dirname, '../engine/stockfish.exe');

const getBestMove = (fen, depth = 15) => {
    return new Promise((resolve, reject) => {
        // Khởi chạy file stockfish.exe dưới dạng một Child Process
        const stockfish = spawn(enginePath);
        let bestMove = null;

        // Bắt sự kiện stdout để đọc dữ liệu Stockfish in ra màn hình
        stockfish.stdout.on('data', (data) => {
            const output = data.toString();
            
            // Stockfish sẽ in ra rất nhiều luồng suy nghĩ. Ta chỉ bắt dòng có chứa kết quả cuối cùng.
            // Format chuẩn của UCI: "bestmove e2e4 ponder e7e5"
            if (output.includes('bestmove')) {
                // Dùng Regex để bóc tách chính xác tọa độ nước đi (vd: e2e4, g1f3)
                const match = output.match(/bestmove\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
                if (match && match[1]) {
                    bestMove = match[1];
                    // Tìm thấy nước đi rồi thì gửi lệnh 'quit' để đóng Engine lại
                    stockfish.stdin.write('quit\n');
                }
            }
        });

        // Khi Engine đã đóng hoàn toàn, trả kết quả về cho API
        stockfish.on('close', (code) => {
            if (bestMove) {
                resolve(bestMove);
            } else {
                reject(new Error('Stockfish không tìm thấy nước đi hợp lệ. (Có thể chuỗi FEN bị sai)'));
            }
        });

        // Bắt lỗi nếu file .exe không chạy được (thiếu file, sai đường dẫn...)
        stockfish.on('error', (err) => {
            reject(new Error(`Lỗi khởi chạy Stockfish: ${err.message}`));
        });

        // Bắt đầu gửi lệnh (stdin) yêu cầu Engine làm việc theo chuẩn UCI
        stockfish.stdin.write('uci\n'); // Kích hoạt chế độ UCI
        stockfish.stdin.write(`position fen ${fen}\n`); // Nạp trạng thái bàn cờ hiện tại
        stockfish.stdin.write(`go depth ${depth}\n`); // Bắt đầu tính toán với độ sâu (depth) quy định
    });
};

module.exports = { getBestMove };
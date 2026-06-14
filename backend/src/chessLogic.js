const { spawn } = require('child_process');
const path = require('path');

const enginePath = path.join(process.cwd(), 'engine', 'stockfish.exe');

const getBestMove = (fen, depth = 15) => {
    return new Promise((resolve, reject) => {
        const stockfish = spawn(enginePath);
        let bestMove = null;

        stockfish.stdout.on('data', (data) => {
            const output = data.toString();
            // Lấy nước đi tốt nhất
            if (output.includes('bestmove')) {
                const match = output.match(/bestmove\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
                if (match && match[1]) {
                    bestMove = match[1];
                    stockfish.stdin.write('quit\n'); // Tắt Engine ngay khi có kết quả
                }
            }
        });

        stockfish.on('close', () => {
            if (bestMove) resolve(bestMove);
            else reject(new Error('Không tìm thấy nước đi.'));
        });

        stockfish.on('error', (err) => reject(err));

        stockfish.stdin.write('uci\n');
        stockfish.stdin.write(`position fen ${fen}\n`);
        stockfish.stdin.write(`go depth ${depth}\n`);
    });
};

module.exports = { getBestMove };
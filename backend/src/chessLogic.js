const { spawn } = require('child_process');
const path = require('path');

const enginePath = path.join(process.cwd(), 'engine', 'stockfish.exe');

const getBestMove = (fen, depth = 15, multiPv = 1) => {
    return new Promise((resolve, reject) => {
        const stockfish = spawn(enginePath);
        const infoLines = {};
        let buffer = '';

        stockfish.stdout.on('data', (data) => {
            buffer += data.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep unfinished line in buffer

            for (let line of lines) {
                line = line.trim();
                
                // Parse Stockfish info lines
                if (line.startsWith('info') && line.includes('multipv')) {
                    const depthMatch = line.match(/depth (\d+)/);
                    const multipvMatch = line.match(/multipv (\d+)/);
                    const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
                    const pvMatch = line.match(/pv\s+([a-h][1-8][a-h][1-8][qrbn]?)/);

                    if (depthMatch && multipvMatch && scoreMatch && pvMatch) {
                        const d = parseInt(depthMatch[1]);
                        const pv = parseInt(multipvMatch[1]);
                        const scoreType = scoreMatch[1];
                        const scoreVal = parseInt(scoreMatch[2]);
                        const move = pvMatch[1];

                        // Keep the highest depth info for each multipv rank
                        if (!infoLines[pv] || infoLines[pv].depth <= d) {
                            let scoreStr = '?';
                            if (scoreType === 'mate') {
                                scoreStr = `M${scoreVal}`;
                            } else {
                                const val = (scoreVal / 100).toFixed(2);
                                scoreStr = scoreVal > 0 ? `+${val}` : `${val}`;
                            }

                            infoLines[pv] = {
                                depth: d,
                                move: move,
                                score: scoreStr
                            };
                        }
                    }
                }

                if (line.startsWith('bestmove')) {
                    stockfish.stdin.write('quit\n');
                }
            }
        });

        stockfish.on('close', () => {
            const result = [];
            for (let i = 1; i <= multiPv; i++) {
                if (infoLines[i]) {
                    result.push({
                        rank: i,
                        move: infoLines[i].move,
                        score: infoLines[i].score
                    });
                }
            }
            resolve(result);
        });

        stockfish.on('error', (err) => reject(err));

        stockfish.stdin.write('uci\n');
        stockfish.stdin.write(`setoption name MultiPV value ${multiPv}\n`);
        stockfish.stdin.write(`position fen ${fen}\n`);
        stockfish.stdin.write(`go depth ${depth}\n`);
    });
};

module.exports = { getBestMove };
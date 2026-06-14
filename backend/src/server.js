const express = require('express');
const cors = require('cors');
const { getBestMove } = require('./chessLogic'); 

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.json({ success: true, status: 'ok' });
});

app.post('/api/bestmove', async (req, res) => {
    const { fen, depth } = req.body; 
    if (!fen) return res.status(400).json({ error: 'Missing FEN' });

    try {
        const move = await getBestMove(fen, depth || 15);
        console.log('✅ Tìm thấy nước đi tốt nhất:', move);
        res.json({ success: true, bestMove: move });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`));
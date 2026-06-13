const express = require('express');
const cors = require('cors');
// Import hàm xử lý logic cờ vua vừa viết
const { getBestMove } = require('./chessLogic'); 

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Chess Hint Local Server is running perfectly!');
});

// Cập nhật thành Async function để sử dụng Await chờ Engine tính toán
app.post('/api/bestmove', async (req, res) => {
    const { fen } = req.body; 

    if (!fen) {
        return res.status(400).json({ error: 'Bad Request: Missing FEN string!' });
    }

    console.log('📦 Đang phân tích FEN:', fen);

    try {
        // Gọi Stockfish tính toán (Depth 15 là mức lý tưởng: đủ thông minh mà không bị quá chậm)
        const bestMove = await getBestMove(fen, 15);
        
        console.log('✅ Tìm thấy nước đi tốt nhất:', bestMove);
        res.json({ 
            success: true,
            bestMove: bestMove 
        });
    } catch (error) {
        console.error('❌ Lỗi xử lý:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
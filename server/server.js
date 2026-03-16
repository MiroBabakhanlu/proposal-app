const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const http = require('http');
const { initializeSocket } = require('./src/socket/index')
dotenv.config();

const app = express();
app.use(helmet());

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// Initialize socket.io
const io = initializeSocket(server);
app.set('io', io);


app.use(cors({
    origin: process.env.REQ_ORIGIN
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const userRoutes = require('./src/routes/userRoutes');
const proposalRoutes = require('./src/routes/proposalRoutes');
const tagRoutes = require('./src/routes/tagRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');

app.use('/api/users', userRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/reviews', reviewRoutes);


// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
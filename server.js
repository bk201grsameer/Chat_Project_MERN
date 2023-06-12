const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = process.env.port || 5000;
const { connectToDb } = require('./models/db');
dotenv.config();
connectToDb();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

let users = [];
io.on("connection", (socket) => {
    console.log(`⚡:${socket.id} connected`);

    socket.on('newUser', (data) => {
        users.push(data);
        console.log(users);
        io.emit('newUserResponse', users);
    });

    socket.on('newMessage', (data) => {
        console.log(data);
        io.emit('newMessageResponse', data);
    });

    socket.on('disconnect', () => {
        console.log(`🔥: ${socket.id} disconnected`);
        users = users.filter((user) => { return user.socketID != socket.id; });
        console.log(users);
        io.emit('newUserResponse', users);
        console.log('--------------------------------------------------------------------------------------------------');
    });
});


app.use(express.json());
app.use(cors({
    origin: '*'
}));


app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/message', require('./routes/messageRoutes'));






httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
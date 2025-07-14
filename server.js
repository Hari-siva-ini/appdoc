const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('join', room => {
    socket.join(room);
    const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
    console.log(`User joined room: ${room}`);

    if (roomSize > 1) {
      socket.to(room).emit('user-joined', room);
    }
  });

  socket.on('offer', (offer, room) => {
    socket.to(room).emit('offer', offer);
  });

  socket.on('answer', answer => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate, room) => {
    socket.to(room).emit('ice-candidate', candidate);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

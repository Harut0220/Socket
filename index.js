import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile('C:\\Users\\DELL\\Desktop\\NewSocket\\index.html', 'utf8');
});


io.on('connection', (socket) => {
    socket.on('chat message', (msg,user) => {
        io.emit('chat message', `${user}`);
      });

    
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });



io.on('connection', (socket) => {
    const roomId="fshj6763h"
    console.log(`${socket.id}# a user connected`);
    socket.on('disconnect', () => {
      console.log(`${socket.id}# user disconnected`);
    });


    
});
  
io.on('connection', (socket) => {
    console.log(`${socket.id}# a user connected`);
});
  
server.listen(3000, () => {
  console.log('<http># server running at http://localhost:3000');
}); 
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import http from "http"



const app = express();
const server = createServer(app);
export const io = new Server(server);


app.get('/', (req, res) => {
    res.sendFile('C:\\Users\\DELL\\Desktop\\NewSocket\\index.html', 'utf8');
});






io.on('connection', (socket) => {
    const roomId="fshj6763h"
    socket.on("join",(user)=>{
      socket.join(roomId)
      console.log(`${user}# a user connected`);
    })
    socket.on('chat message', (userObj,roomId) => {
      
      io.emit('chat message',userObj,roomId);
    });

    socket.on('disconnect', () => {
      console.log(`${socket.eventNames}# user disconnected`);
    });   
});
  

  
server.listen(3000, () => {
  console.log('<http># server running at http://localhost:3000');
}); 


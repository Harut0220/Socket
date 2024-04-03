import express from "express";
import { Server } from "socket.io";
import http from "http";
import { config } from "dotenv";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidV4 } from "uuid";
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { OAuth2Client } from 'google-auth-library';

const app = express();
const server = http.createServer(app);
export const io = new Server(server);
config();
app.use(cors());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.use(express.static(path.join(__dirname, "Public")));

app.get("/", (req, res) => {
  res.render(`LoginPage`, { roomId: req.params.room });
});

app.post(`/:room`, (req, res) => {
  res.sendFile(path.join(__dirname, "Front", "Views.html"));
});

let rooms = {};

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("create-room", (roomId) => {
    // Logic to create a new room
    if (!rooms[roomId]) {
      rooms[roomId] = {
        members: [socket.id],
      };
      // socket.join(roomId);
      socket.emit("room-created", roomId);
      console.log(`Room created: ${roomId}`);
    } else {
      // Room already exists
      socket.emit("room-exists");
    }
  });

  socket.on("join-room", (roomId) => {
    // Logic to handle joining an existing room
    const room = rooms[roomId];

    if (room && room.members.length < 3) {
      // room.members.push(socket.id);
      // socket.join(roomId);
      console.log("Sending join request to room owner", socket.id);
      io.to(room.members[0]).emit("join-request", socket.id);
    } else {
      // Room is full or does not exist
      socket.emit("room-unavailable");
    }
  });

  socket.on("approve-join-request", (roomId, requesterUserId) => {
    console.log(roomId, requesterUserId);
    const room = rooms[roomId];

    if (room) {
      if (room.members[0] == socket.id) {
        room.members.push(requesterUserId);
        // socket.join(roomId);
        io.to(requesterUserId).emit("join-approved");
        console.log(`User ${requesterUserId} approved to join room ${roomId}`);
        io.to(requesterUserId).emit("start-peer-connection", socket.id);
      }
    }
  });

  socket.on("offer-request", (data) => {
    const { fromOffer, to } = data;
    console.log("Forwarding offer request to: " + to);
    socket.to(to).emit("offer-request", { from: socket.id, offer: fromOffer });
  });

  socket.on("offer-answer", (data) => {
    const { answere, to } = data;
    console.log("Forwarding offer answer to: " + to);
    socket.to(to).emit("offer-answer", { from: socket.id, offer: answere });
  });

  socket.on("peer-updated", (data) => {
    const { candidate, to } = data;
    console.log("Peer updated");
    socket
      .to(to)
      .emit("peer-updated", { from: socket.id, candidate: candidate });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Handle user disconnection, leave rooms, etc.
  });
});

// io.on("connection", (socket) => {
//   // When someone attempts to join the room
//   socket.on("join-room", (roomId, userId) => {
//     socket.join(roomId); // Join the room
//     socket.broadcast.emit("user-connected", userId); // Tell everyone else in the room that we joined

//     // Communicate the disconnection
//     socket.on("disconnect", () => {
//       socket.broadcast.emit("user-disconnected", userId);
//     });
//   });
// });

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

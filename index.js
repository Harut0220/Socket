import express from "express";
import { Server } from "socket.io";
import http from "http";
import { config } from "dotenv";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import viewsRouter from "./Router/SocketRouter.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
config();
app.use(cors());
app.set("view engine", "ejs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "Views"));
app.use(express.static(path.join(__dirname, "Public")));
app.use("/call", viewsRouter);

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next(); // Call next middleware
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("offer", (offer, targetSocketId) => {
    io.to(targetSocketId).emit("offer", offer, socket.id);
  });

  socket.on("answer", (answer, senderSocketId) => {
    io.to(senderSocketId).emit("answer", answer);
  });

  socket.on("icecandidate", (candidate, targetSocketId) => {
    io.to(targetSocketId).emit("icecandidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

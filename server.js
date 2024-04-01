import express from "express";
import { Server } from "socket.io";
import http from "http";
import { config } from "dotenv";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
// import viewsRouter from "./Router/SocketRouter.js";
import { v4 as uuidV4 } from "uuid";

const app = express();
const server = http.createServer(app);
export const io = new Server(server);
config();
app.use(cors());


const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "Login"));
 
app.use(express.static(path.join(__dirname, 'public')));
// app.get("/", (req, res) => {
//     res.redirect(`/`)
//   //   ${uuidV4()}`);
//   });
// Handle form submissions
app.post('/:room', (req, res) => {
  // Process form data (not shown here)
  // For example, you can access form data using req.body

  // Send a response with an HTML file
  res.sendFile(path.join(__dirname, 'Front', 'Views.html'));
});

// If they join the base link, generate a random UUID and send them to a new room with said UUID

// If they join a specific room, then render that room
app.get("/:room", (req, res) => {
  res.render("LoginPage")
//    { roomId: req.params.room });
});

// app.get("/", (req, res) => res.render("Views"))
// When someone connects to the server
io.on("connection", (socket) => {
  // When someone attempts to join the room
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId); // Join the room
    socket.broadcast.emit("user-connected", userId); // Tell everyone else in the room that we joined

    // Communicate the disconnection
    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", userId);
    });
  });
});

// app.set("views", path.join(__dirname, "Views"));
// app.use(express.static(path.join(__dirname, "Public")));
// app.use("/call", viewsRouter);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

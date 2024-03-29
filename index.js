import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import http from "http";
import connection from "./Utils/Connection.js";
import MessageModel from "./Model/MessageModel.js";
import { config, configDotenv } from "dotenv";
import cors from "cors";

// index.js

import jsdom from "jsdom";
import { fileURLToPath } from "node:url";
import path from "node:path";
import viewsRouter from "./Router/SocketRouter.js";
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const document = window.document;

const app = express();
const dotenv = configDotenv();
const conn = connection();
app.use(cors());

app.set("view engine", "ejs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "Views"));
app.use(express.static(path.join(__dirname, "Public")));
app.use("/", viewsRouter);
const server = createServer(app);
export const io = new Server(server);

// const dat=document.getElementById("div")
// const span=document.createElement("span")

// span.textContent="aaaaaa"
// dat.appendChild(span)

// app.get("/", (req, res) => {
//   res.sendFile("C:\\Users\\DELL\\Desktop\\NewSocket\\index.html", "utf8");
// });

io.on("connection", (socket) => {
  socket.on("join", async () => {
    const dbAll = await MessageModel.find();
    io.emit("join", dbAll, socket.id);
  });
});

io.on("connection", async (socket) => {
  const roomId = "fshj6763h";
  const dbAll = await MessageModel.find();

  socket.on("chat message", async (userObj) => {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const dayOfMonth = currentDate.getDate();
    const formattedMonth = month < 10 ? "0" + month : month;
    const formattedDay = dayOfMonth < 10 ? "0" + dayOfMonth : dayOfMonth;
    const resultDate = formattedMonth + "." + formattedDay + "." + year;
    const resultTime = hours + ":" + minutes + ":" + seconds;
    const user = socket.id;
    const objDb = {
      // roomId,
      user: user,
      message: userObj.message,
      date: resultDate,
      time: resultTime,
    };
    socket.eventNames = userObj.user;
    const seededItems = await MessageModel.insertMany(objDb);
    const dbMessages = await MessageModel.find();

    io.emit("chat message", dbMessages, user);
  });
});

server.listen(process.env.PORT, () => {
  console.log("<http># server running at http://localhost:3000");
});

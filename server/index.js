//server
const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");
const router = require("./router");

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);

//create socket.io instance
//https://socket.io/docs/#Using-with-Node-http-server
const io = socketio(server);
io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    //retrieving data from client side
    const { user, error } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      //user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    socket.broadcast.to(user.room).emit("message", {
     // user: "admin",
      text: `${user.name} has joined the chat!`,
    });

    socket.join(user.room); //user gets inside of a room

    callback(); //after 'join' is emitted, do
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//check if the server is running on client side
app.use(router);

//run the server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

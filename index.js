//server
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInChannel,
} = require("./users.js");
const router = require("./router");

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);

//create socket.io instance
//https://socket.io/docs/#Using-with-Node-http-server !!DEPRECIATED
//go to https://socket.io/docs/#Minimal-working-example instead
const io = socketio(server);
io.on("connection", (socket) => {
  console.log("user connected");

  // ***
  //retrieving data from client side
  socket.on("join", ({ name, channel }, callback) => {
    const { user, error } = addUser({ id: socket.id, name, channel });

    if (error) return callback(error);

    socket.emit("message", {
      user: "admin", //<--admin generated message-->
      text: `${user.name}, welcome to the channel ${user.channel}`,
    });
    socket.broadcast.to(user.channel).emit("message", {
      user: "admin", //<--admin generated message-->
      text: `${user.name} has joined the chat!`,
    });

    socket.join(user.channel); //user gets inside of a channel

    io.to(user.channel).emit("channelData", {
      channel: user.channel,
      users: getUsersInChannel(user.channel),
    });

    callback(); //after 'join' is emitted, do
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.channel).emit("message", { user: user.name, text: message });
    io.to(user.channel).emit("channelData", {
      channel: user.channel,
      users: getUsersInChannel(user.channel),
    });
    callback(); //after the message is sent on the front end, do something in the backend
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.channel).emit("message", {
        user: "admin", //<--admin generated message-->
        text: `${user.name} has left.`,
      });
    }
  });
});

//check if the server is running on client side
app.use(router);

app.use(cors());

//run the server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

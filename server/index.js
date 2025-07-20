const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();

const socket = require("socket.io");

require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log('Error in DB Connection: ',err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map(); // map for user id,socketId - it is global and can be used anywhere

// Event listener for adding a user to the onlineUsers Map
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Event listener for sending messages
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to); // if receiver is offline data only store to db
    if (sendUserSocket) { // if receiver is ONLINE data is send to user and store to db
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

});

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
// const mongoose = require("mongoose");
require("dotenv").config();
const Message = require("./modules/messegeModel");

const { PORT, SERVER, FRONTEND_URL } = process.env;

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL || "http://localhost:3000", // Use environment variable for frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware to fetch messages
app.get("/messages/:room", async (req, res) => {
  const { room } = req.params;
  try {
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle joining a room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    const { room, sender, message } = data;
    // Save message to MongoDB
    try {
      const newMessage = new Message({ room, sender, message });
      await newMessage.save();
      // Broadcast message to the room
      io.to(room).emit("receive_message", data);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT || 3005, () => {
  console.log(`Server is running on ${SERVER || "http://localhost:"}${PORT || 3005}`);
});
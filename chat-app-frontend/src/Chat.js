import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3005";
const socket = io(BACKEND_URL);

function Chat() {
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [sender, setSender] = useState("");

    // Fetch message history when joining a room
    const fetchMessages = async (room) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/messages/${room}`);
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Join Room
    const joinRoom = () => {
        if (room && sender) {
            socket.emit("join_room", room);
            fetchMessages(room);
        }
    };

    // Send Message
    const sendMessage = () => {
        if (message && room) {
            const messageData = { room, sender, message };
            socket.emit("send_message", messageData);
            setMessage("");
        }
    };

    // Receive Messages in Real-Time
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Real-Time Chat App</h1>
            <div>
                <input
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="Your Name"
                />
                <input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Room ID"
                />
                <button onClick={joinRoom}>Join Room</button>
            </div>
            <div>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                <h3>Messages:</h3>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.sender}</strong>: {msg.message}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default Chat;
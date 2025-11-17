const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: { origin: "*" }
});

app.use(express.static(__dirname));

let rooms = {};

io.on("connection", (socket) => {
    
    socket.on("createRoom", (roomId, playerName) => {
        if (!rooms[roomId]) {
            rooms[roomId] = { players: [] };
        }

        socket.join(roomId);
        rooms[roomId].players.push({
            id: socket.id,
            name: playerName,
            role: null
        });

        io.to(roomId).emit("playersUpdate", rooms[roomId].players);
    });

    socket.on("joinRoom", (roomId, playerName) => {
        if (!rooms[roomId]) return;

        socket.join(roomId);
        rooms[roomId].players.push({
            id: socket.id,
            name: playerName,
            role: null
        });

        io.to(roomId).emit("playersUpdate", rooms[roomId].players);
    });

    socket.on("assignRoles", (roomId) => {
        if (!rooms[roomId]) return;

        let players = rooms[roomId].players;

        // สุ่มหมาป่า 1 ตัว
        const wolfIndex = Math.floor(Math.random() * players.length);
        players.forEach((p, i) => {
            p.role = i === wolfIndex ? "Werewolf" : "Villager";
        });

        // ส่งบทบาทให้แต่ละคน (เฉพาะตัวเขาเท่านั้น)
        players.forEach((p) => {
            io.to(p.id).emit("yourRole", p.role);
        });
    });

    socket.on("disconnect", () => {
        for (const room in rooms) {
            rooms[room].players = rooms[room].players.filter(p => p.id !== socket.id);
            io.to(room).emit("playersUpdate", rooms[room].players);
        }
    });

});

http.listen(3000, () => console.log("Server ON"));

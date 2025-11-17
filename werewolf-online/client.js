const socket = io();

let currentRoom = "";

function createRoom() {
    const room = document.getElementById("room").value;
    const name = document.getElementById("name").value;

    currentRoom = room;
    socket.emit("createRoom", room, name);
}

function joinRoom() {
    const room = document.getElementById("room").value;
    const name = document.getElementById("name").value;

    currentRoom = room;
    socket.emit("joinRoom", room, name);
}

function startGame() {
    socket.emit("assignRoles", currentRoom);
}

socket.on("playersUpdate", (players) => {
    const list = document.getElementById("players");
    list.innerHTML = "";
    players.forEach(p => list.innerHTML += `<li>${p.name}</li>`);
});

socket.on("yourRole", (role) => {
    document.getElementById("role").innerText = "Your Role: " + role;
});

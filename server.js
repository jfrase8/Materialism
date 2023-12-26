const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

class Lobby
{
    constructor(name)
    {
        this.name = name;
        this.clients = [];
    }

    addClient(clientID)
    {
        this.clients.push(clientID);
    }

    removeClient(clienID)
    {
        const index = this.clients.indexOf(clientID);
        if (index !== -1)
            this.clients.splice(index, 1);
    }

    getClientsCount()
    {
        return this.clients.length;
    }
}

class LobbyManager
{
    constructor()
    {
        this.lobbies = {};
    }

    createLobby(lobbyName)
    {
        if (!this.lobbies[lobbyName])
        {
            console.log("Added lobby: " + lobbyName);
            this.lobbies[lobbyName] = new Lobby(lobbyName);
            return true;
        }
        else
        {
            return false; // Lobby already exists
        }
    }

    joinLobby(lobbyName, clientID)
    {
        const lobby = this.lobbies[lobbyName];
        if (!lobby)
        {
            console.log(lobbyName);
            return { status: false, reason: 'Lobby does not exist' };
        }
        else if (lobby.getClientsCount() >= 2)
        {
            return { status: false, reason: 'Lobby is full' };
        }
        else
        {
            lobby.addClient(clientID);
            return { status: true }; // Joined lobby successfully
        }
    }

    leaveLobby(lobbyName, clientID)
    {
        const lobby = this.lobbies[lobbyName];
        if (lobby)
        {
            lobby.removeClient(clientID);
            if (lobby.getClientsCount() === 0)
            {
                delete this.lobbies[lobbyName];
            }
            return true; // Left lobby successfully
        }
        return false; // Lobby doesn't exist
    }

    getLobby(lobbyName)
    {
        const lobby = this.lobbies[lobbyName];
        if (lobby)
            return lobby;
        else
            return false;
    }

    getAllLobbyNames()
    {
        return Object.keys(this.lobbies); // Returns an array of lobby names
    }
}

const lobbyManager = new LobbyManager();

io.on("connection", (socket) =>
{
    // Handle creating a lobby
    socket.on("createLobby", (lobbyName) =>
    {
        if (lobbyManager.createLobby(lobbyName))
        {
            console.log(lobbyManager.getAllLobbyNames());
            io.to(socket.id).emit('lobbyCreated', lobbyName);

            const lobbies = lobbyManager.getAllLobbyNames();
            io.emit('displayLobbies', lobbies);
        }
        else
        {
            io.to(socket.id).emit('lobbyFunctionFailed', "Lobby already exists");
        }
    });

    // Handle joining a lobby
    socket.on("joinLobby", (lobbyName, clientID) =>
    {
        const result = lobbyManager.joinLobby(lobbyName, clientID);
        if (result.status)
        {
            const lobby = lobbyManager.getLobby(lobbyName);
            const clientCount = lobby.getClientsCount();
            if (clientCount == 2)
            {
                // Redirect clients to the game screen
                for (const client of lobby.clients)
                    io.to(client).emit('redirect', '/game.html');
            }
            else
            {
                // Display waiting message
                io.to(lobby.clients[0]).emit('wait', 'Waiting for other player');
            }
        }
        else
        {
            // Emit failure event to client
            io.to(socket.id).emit('lobbyFunctionFailed', result.reason);
        }
    });

    // Handle disconnecting from lobby
    socket.on('disconnect', (lobbyName, clientID) =>
    {
        // Remove disconnected client from lobby
        lobbyManager.leaveLobby(lobbyName, clientID)
        io.to(socket.id).emit('redirect', '/index.html');

    });
});

server.listen(1337);

const socket = io();

const buttons = document.getElementsByClassName("button");

const lobbyScreen = document.getElementsByClassName("lobbyButton");
const createLobby = document.querySelector(".createLobby");
const joinLobby = document.querySelector(".joinLobby");
const playButtonText = document.getElementsByClassName("buttonText")[0];

let lobbyName = '';

function Play()
{
    for (lobbyButton of lobbyScreen)
        lobbyButton.style.display = "block";

    playButtonText.style.display = "none";
    buttons[0].removeAttribute("onclick");
}
function LocalGame()
{
    window.location.href = "/game.html";
}
function CreateLobby()
{
    createLobby.style.display = "block";
    joinLobby.style.display = "none";
}
function LobbyCreated()
{
    let nameInput = document.getElementById('textInput');
    lobbyName = nameInput.value;

    // Emit 'createLobby' event to the server with the lobby name
    socket.emit('createLobby', lobbyName);
}

socket.on('lobbyCreated', (newLobbyName) =>
{
    // Join the newly created lobby
    socket.emit('joinLobby', newLobbyName, socket.id);
});


// Refreshes all currently displayed lobbies
socket.on('displayLobbies', (lobbies) =>
{

    // Remove all current lobbies
    joinLobby.innerHTML = '';

    // Display new list of lobbies
    for (lobby of lobbies)
    {

        // Create a button for lobby
        let button = document.createElement('button');
        button.textContent = lobby;
        button.setAttribute("onclick", "JoinLobby(this)");
        button.className = "lobby";

        // Add this lobby to html page
        joinLobby.appendChild(button);
    } 
});
socket.on('lobbyFunctionFailed', (failureMessage) =>
{
    alert(failureMessage);
});

function DisplayLobbies()
{
    joinLobby.style.display = "block";
    createLobby.style.display = "none";
}
function JoinLobby(lobby)
{
    lobbyName = lobby.textContent;

    // Emit 'joinLobby' event to the server with the lobby name
    socket.emit('joinLobby', lobbyName, socket.id);
}

// Two clients successfully joined a lobby
socket.on("redirect", (url) =>
{
    window.location.href = url;
});

socket.on("wait", (waitMessage) =>
{
    alert(waitMessage);
});

function Back(event)
{
    event.stopPropagation();
    for (lobbyButton of lobbyScreen)
    {
        lobbyButton.style.display = "none";
    }
    playButtonText.style.display = "block";
    createLobby.style.display = "none";
    joinLobby.style.display = "none";
    buttons[0].setAttribute("onclick", "Play()");
}
function Tutorial()
{
    window.location.href = "./tutorial.html";
}
let buttons = document.getElementsByClassName("button");
let playButton = buttons[0].dataset.page == "game" ? buttons[0] : buttons[1];
let quitButton = buttons[1].dataset.page == "game" ? buttons[0] : buttons[1];

playButton.setAttribute("onclick", "Play()");
quitButton.setAttribute("onclick", "Tutorial()");

function Play()
{
    window.location.href = "./game.html";
}
function Tutorial()
{
    window.location.href = "./tutorial.html";
}
// JavaScript source code
let gameBoard = [];
let activeSquare;
let phase = 1;
let squares = document.querySelectorAll(".square");

for (let i = 0; i < squares.length; i++) {
    squares[i].style.backgroundColor = i % 2 == 0 ? "gold" : "whitesmoke";
}

// Object for pieces
class Piece {

    constructor(name, active, row, col) {
        this.name = name;
        this.active = active;
        this.row = row;
        this.col = col;
    }
};

// Update players starting pieces

let playerPieces = [

    new Piece("Diamond", false, -1, -1),
    new Piece("Emerald", false, -1, -1),
    new Piece("Ruby", false, -1, -1),
    new Piece("Steel", false, -1, -1),
    new Piece("Steel", false, -1, -1),
    new Piece("Rock", false, -1, -1),
    new Piece("Rock", false, -1, -1),
    new Piece("Rock", false, -1, -1),
    new Piece("Clay", false, -1, -1),
    new Piece("Clay", false, -1, -1),
    new Piece("Clay", false, -1, -1),
    new Piece("Clay", false, -1, -1),
    new Piece("Glass", false, -1, -1),
    new Piece("Glass", false, -1, -1),
    new Piece("Paper", false, -1, -1),
    new Piece("Paper", false, -1, -1),
    new Piece("Paper", false, -1, -1),
    new Piece("Paper", false, -1, -1),
    new Piece("Paper", false, -1, -1),
    new Piece("Paper", false, -1, -1)
]


// Create an array of empty squares
for (let i = 0; i < 15; i++) {
    gameBoard.push([]);
    for (let j = 0; j < 15; j++) {
        let square = "empty";
        gameBoard[i].push(square);
    }
}

// Phase 1: Placing your pieces
let numDiamonds = 1;
let numEmerald = 1;
let numRuby = 1;
let numSteel = 2;
let numRock = 3;
let numClay = 4;
let numGlass = 2;
let numPaper = 6;

if (phase == 1) {

    // Open up starting area to place pieces
    for (let i = 0; i < 5; i++)
    {
        for (let j = 10; j < 15; j++)
        {
            for (let k = 0; k < squares.length; k++)
            {

                // Get the row and column of the square
                let currentCol = squares[k].parentElement.parentElement.dataset.col;
                let currentRow = squares[k].parentElement.dataset.row;

                // If this square is in the starting area
                if (currentRow == i && currentCol == j)
                {
                    // When square is clicked, check if a piece was selected, and if so call the PiecePlaced function.
                    // Otherwise, window alert that a piece has not been selected.
                    squares[k].style.backgroundColor = "green";
                    squares[k].addEventListener('click', function () {

                        // Check the current selected piece

                        UpdatePiece("Diamond", [currentRow, currentCol], squares[k], "place");
                    });
                }
            }
        }
    }
}

// If a piece is placed, update the square in the array and then update HTML board
function UpdatePiece(pieceName, location, square, action) {

    window.alert(pieceName + " " + location + " " + square);


    // Place: Update the array so that this piece has a valid location and is active
    if (action == "place")
    {
        for (let i = 0; i < playerPieces.length; i++) {

            if (pieceName == playerPieces[i].name && row == -1)
            {
                playerPieces[i].row = location[0];
                playerPieces[i].col = location[1];
                playerPieces[i].active = true;

            }
        }

        // Update the HTML gameboard
        square.style.backgroundColor = ChangeColor(pieceName);
        //window.alert(playerPieces[i].col + "," + playerPieces[i].row + " | " + playerPieces[i].active)
    }

    // Move: Update the array so that this piece has new location
    /*if (action == "move") {
        for (let i = 0; i < playerPieces.length; i++) {

            if (pieceName == i.name && row == ) {
                i.row = location[0];
                i.col = location[1];
                i.active = true;

            }
        }
    }*/

    // Remove: Update the array so that this piece is now inactive
    if (action == "remove") {
        for (let i = 0; i < playerPieces.length; i++) {

            if (row == location[0] && col == location[1] && i.active == true) {
                i.active = false;
            }
        }
    }
}

function ChangeColor(pieceName)
{
    switch (pieceName)
    {
        case "Diamond":
            return "cornflowerblue"
            break;
        case "Emerald":
            return "lime"
            break;
        case "Ruby":
            return "red"
            break;
        case "Steel":
            return "lightslategrey"
            break;
        case "Rock":
            return "burlywood"
            break;
        case "Clay":
            return "brown"
            break;
        case "Glass":
            return "linear-gradient(white, cadetblue)"
            break;
        case "Paper":
            return "white"
            break;
    }
}

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


// Phase 1: Placing your pieces //


/* piecesInfo contains info about the amount of pieces left to place and the color
   that those pieces should be based on the name of the piece */
let piecesInfo = {
    "Diamond": {"Count": 1, "Color": "blue"},
    "Emerald": { "Count": 1, "Color": "lime" },
    "Ruby": { "Count": 1, "Color": "red" },
    "Steel": { "Count": 2, "Color": "lightslategrey" },
    "Rock": { "Count": 3, "Color": "burlywood" },
    "Clay": { "Count": 4, "Color": "brown" },
    "Glass": { "Count": 2, "Color": "cadetblue" },
    "Paper": { "Count": 6, "Color": "white" }
}

// Make selectable options for pieces to place
let options = document.querySelectorAll(".option");

// Value to hold the currently selected option | once in phase 2, this value will be for currently selected piece
let currentSelected;




// Add click events to make options selectable
for (let i = 0; i < options.length; i++) {
    options[i].addEventListener('click', function () {

        for (let j = 0; j < options.length; j++) {
            options[j].style.border = "none";
        }
        currentSelected = options[i].dataset.piece;
        options[i].style.border = "2px solid White";
    })
}


for (let i = 0; i < squares.length; i++)
{
    if (squares[i].hasAttribute("data-safeArea"))
    {
        squares[i].style.backgroundColor = "green";
    }
}

// Open up starting area to place pieces
for (let i = 0; i < 5; i++) {
    for (let j = 10; j < 15; j++) {
        for (let k = 0; k < squares.length; k++) {

            // Get the row and column of the square
            let currentCol = squares[k].parentElement.parentElement.dataset.col;
            let currentRow = squares[k].parentElement.dataset.row;

            // If this square is in the starting area
            if (currentRow == i && currentCol == j) {
                // Add a listener to each square that calls UpdatePiece if that square is clicked
                
            }
        }
    }
}

// Cheat to move on to phase 2 immediately
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        PhaseTwo();
    }
})


function PlacePiece(square) {


    let row = square.parentElement.dataset.row;
    let col = square.parentElement.parentElement.dataset.col;

    // First check if the square clicked already has a piece
    for (let i = 0; i < playerPieces.length; i++) {
        // If a square has a piece already placed on it, return that piece to player
        if (playerPieces[i].row == row && playerPieces[i].col == col) {

            playerPieces[i].row = -1;
            playerPieces[i].col = -1;
            playerPieces[i].active = false;
            square.style.backgroundColor = "green";
            ChangePieceCount(playerPieces[i].name, 1);
            break;
        }

        // Place new piece
        if (currentSelected == playerPieces[i].name && playerPieces[i].row == -1 && !playerPieces[i].active) {
            playerPieces[i].row = row;
            playerPieces[i].col = col;
            playerPieces[i].active = true;

            // Update the HTML gameboard
            square.style.backgroundColor = piecesInfo[currentSelected]["Color"];
            ChangePieceCount(currentSelected, -1);
            break;
        }
    }

    // Check if all pieces have been placed
    let count = 0;
    for (let i = 0; i < playerPieces.length; i++) {
        if (playerPieces[i].row != -1) {
            count++;
        }

    }
    if (count == playerPieces.length) {
        PhaseTwo();
    }
    else {
        count = 0;
    }
}

// Changes the count variable of that piece by -1 or +1
function ChangePieceCount(pieceName, direction)
{
    // Update dictionary
    piecesInfo[pieceName]["Count"] += direction;

    // Update HTML
    document.querySelector(`.option[data-piece="${pieceName}"]`).innerText = piecesInfo[pieceName]["Count"];
}




// Phase 2: Playing the Game //


function PhaseTwo()
{
    // First remove Options Window
    alert("Phase 2");
    options[0].parentElement.remove();

    // Disable onclick functions of starting squares
    for (let i = 0; i < 5; i++) {
        for (let j = 10; j < 15; j++) {
            for (let k = 0; k < squares.length; k++) {

                // Get the row and column of the square
                let currentCol = squares[k].parentElement.parentElement.dataset.col;
                let currentRow = squares[k].parentElement.dataset.row;

                // If this square is in the starting area
                if (currentRow == i && currentCol == j) {

                    // Disable onclick functions
                    squares[k].onclick = null;
                }
            }
        }
    }

    // Add new onclick function to every square, except opponents safe zone.
    for (let i = 0; i < squares.length; i++)
    {
        squares[i].setAttribute("onclick", "SquareClicked(this)")
    }

    currentSelected = null;
}



// Square clicked should first check if a piece is currently selected:
//     NO = Check if this square has your piece on it
//         YES = Select that piece
//         NO = Do nothing
//     YES = Check if this piece is allowed to move to square that was clicked:
//         NO = Do nothing
//         YES = Check if that square has an opponents piece or your piece:
//             OPPONENT = Remove opponents piece, and place your piece in square | activate special abilities of piece if applicable
//             FRIENDLY = Do nothing
//             NEITHER = Move piece to that square | activate special abilities if applicable       

function SquareClicked(square)
{
    // Get the row and column of the square
    let col = square.parentElement.parentElement.dataset.col;
    let row = square.parentElement.dataset.row;

    if (currentSelected == null)
    {
        for (let i = 0; i < playerPieces.length; i++)
        {
            if (playerPieces[i].row == row && playerPieces[i].col == col)
            {
                SelectPiece(square, playerPieces[i]);
            }
        }
    }
    else
    {
        MovePiece(square);
    }

}

function SelectPiece(square, piece)
{
    currentSelected = piece;
    square.style.filter = "brightness(50%)";
}

function MovePiece(square)
{
    // Get the row and column of the clicked square
    let col = square.parentElement.parentElement.dataset.col;
    let row = square.parentElement.dataset.row;



    // Find the current square that the selected piece is on
    let currentSquare;
    for (let i = 0; i < squares.length; i++)
    {
        if (squares[i].parentElement.parentElement.dataset.col == currentSelected.col &&
            squares[i].parentElement.dataset.row == currentSelected.row)
        {
            currentSquare = squares[i];
            break;
        }
    }

    // Remove piece from current square
    currentSquare.style.filter = "brightness(100%)";

    if (currentSquare.hasAttribute("data-safeArea"))
    {
        currentSquare.style.backgroundColor = "green";

    }
    else if (currentSquare.parentElement.parentElement.dataset.col % 2 == 0 && currentSquare.parentElement.dataset.row % 2 == 0
        || currentSquare.parentElement.parentElement.dataset.col % 2 != 0 && currentSquare.parentElement.dataset.row % 2 != 0)
    {
        currentSquare.style.backgroundColor = "gold";
    }
    else
    {
        currentSquare.style.backgroundColor = "whitesmoke";
    }

    // Place piece in new square
    currentSelected.row = row;
    currentSelected.col = col;

    square.style.backgroundColor = piecesInfo[currentSelected.name]["Color"];
    currentSelected = null; 
}
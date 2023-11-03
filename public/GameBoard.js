let squares = document.querySelectorAll(".square");
let boardImg1 = "url(Sprites/bg1.png)";
let boardImg2 = "url(Sprites/bg2.png)";
let turn = "b"; // value for whos turn it is

let currentSelected; // value to hold the currently selected option | once in phase 2, this value will be for currently selected piece

let piecesList = ["Diamond", "Emerald", "Ruby", "Steel", "Rock", "Clay", "Glass", "Paper"]; // list containing name of every piece

// Object for pieces
class Piece
{

    constructor(name, active, row, col)
    {
        this.name = name;
        this.active = active;
        this.row = row;
        this.col = col;
    }
};

// Create arrays with both players pieces
let playerPieces_b = [

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
];

let playerPieces_w = [

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
];

/* piecesInfo contains info about the different types of pieces */
let piecesInfo = {
    "Diamond": {
        "OriginalCount": 1, "CurrentCount": 1,
        "ImgB": 'url("Sprites/b_diamond.png")', "ImgW": 'url("Sprites/w_diamond.png")',
        "Movement": [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]], //all directions
        "MoveAmount": 15, // unlimited movement
        "MoveType": "normal"
    },
    "Emerald": {
        "OriginalCount": 1, "CurrentCount": 1,
        "ImgB": 'url("Sprites/b_emerald.png")', "ImgW": 'url("Sprites/w_emerald.png")',
        "Movement": [[1, 0], [0, 1], [-1, 0], [0, -1]], // cardinal
        "MoveAmount": 15,
        MoveType: "jump" // can move through pieces
    },
    "Ruby": {
        "OriginalCount": 1, "CurrentCount": 1,
        "ImgB": 'url("Sprites/b_ruby.png")', "ImgW": 'url("Sprites/w_ruby.png")',
        "Movement": [[1, 1], [1, -1], [-1, 1], [-1, -1]], // diagonal
        "MoveAmount": 4,
        MoveType: "aoe" // affects all squares surrounding square
    },
    "Steel": {
        "OriginalCount": 2, "CurrentCount": 2,
        "ImgB": 'url("Sprites/b_steel.png")', "ImgW": 'url("Sprites/w_steel.png")',
        "Movement": [[1, 0], [0, 1], [-1, 0], [0, -1]], // cardinal
        "MoveAmount": 4,
        MoveType: "fortified" // can survive aoe attacks
    },
    "Rock": {
        "OriginalCount": 3, "CurrentCount": 3,
        "ImgB": 'url("Sprites/b_rock.png")', "ImgW": 'url("Sprites/w_rock.png")',
        "Movement": [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]], // all directions
        "MoveAmount": 2,
        MoveType: "normal"
    },
    "Clay": {
        "OriginalCount": 4, "CurrentCount": 4,
        "ImgB": 'url("Sprites/b_clay.png")', "ImgW": 'url("Sprites/w_clay.png")',
        "Movement": [[3, 1], [3 - 1], [-3, 1], [-3, -1], [1, 3], [-1, 3], [-1, -3], [1, -3]], // hook-shape movement
        "MoveAmount": 1,
        MoveType: "jump"
    },
    "Glass": {
        "OriginalCount": 2, "CurrentCount": 2,
        "ImgB": 'url("Sprites/b_glass.png")', "ImgW": 'url("Sprites/w_glass.png")',
        "Movement": [[1, 1], [1, -1], [-1, 1], [-1, -1]], // diagonal
        "MoveAmount": 15,
        MoveType: "replenish" // can move again after taking a piece
    },
    "Paper": {
        "OriginalCount": 6, "CurrentCount": 6,
        "ImgB": 'url("Sprites/b_paper.png")', "ImgW": 'url("Sprites/w_paper.png")',
        "Movement": [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]], // all directions
        "MoveAmount": 1,
        MoveType: "normal"
    }
}

// Figures out and returns the player based on square
function getPlayer(square)
{

    for (piece of piecesList)
    {
        if (piecesInfo[piece]["ImgW"] == square.style.backgroundImage)
        {
            return "w";
        }
            

        if (piecesInfo[piece]["ImgB"] == square.style.backgroundImage)
        {
            return "b";
        }
            
            
    }
}


// Make selectable options for pieces to place
let options = document.querySelectorAll(".option");


// Add click events to make options selectable
for (let i = 0; i < options.length; i++)
{
    options[i].addEventListener('click', function ()
    {

        for (let j = 0; j < options.length; j++)
        {
            options[j].style.border = "none";
        }
        currentSelected = options[i].dataset.piece;
        options[i].style.border = "2px solid White";
    })
}


// Create Game Board
for (let i = 0; i < squares.length; i++) {
    squares[i].style.backgroundImage = i % 2 == 0 ? boardImg1 : boardImg2;
}

// Create Safe Area for black
CreateSafeArea(turn);

// Make safe area for current player
function CreateSafeArea(player)
{
    if (player == "b")
    {
        for (let i = 0; i < squares.length; i++)
        {
            if (squares[i].hasAttribute("data-safeArea_b"))
            {
                squares[i].style.backgroundImage = "url(Sprites/safe_area.png)";
                squares[i].setAttribute("onclick", "PlacePiece(this)");
            }
        }
    }
    else
    {
        for (let i = 0; i < squares.length; i++)
        {
            if (squares[i].hasAttribute("data-safeArea_w"))
            {
                squares[i].style.backgroundImage = "url(Sprites/safe_area.png)";
                squares[i].setAttribute("onclick", "PlacePiece(this)");
            }

            // Remove click event for black pieces and reset amount of pieces to place
            if (squares[i].hasAttribute("data-safeArea_b"))
            {
                squares[i].onclick = null;

                for (let piece of piecesList)
                {
                    piecesInfo[piece]["CurrentCount"] = piecesInfo[piece]["OriginalCount"];
                    document.querySelector(`.option[data-piece="${piece}"]`).innerText = piecesInfo[piece]["CurrentCount"];
                }
            }
        }
    }
}


// Cheat to move on to phase 2 immediately
document.addEventListener('keyup', event => {
    if (event.code === 'Space')
        PhaseTwo();
})


function PlacePiece(square) {

    let row = square.parentElement.dataset.row;
    let col = square.parentElement.parentElement.dataset.col;

    // Figure out which side is placing a piece
    let player = square.hasAttribute("data-safeArea_w") ? "w" : "b";
    let turnPlayerPieces = player == "w" ? playerPieces_w : playerPieces_b;

    // First check if the square clicked already has a piece
    for (let i = 0; i < turnPlayerPieces.length; i++) {
        // If a square has a piece already placed on it, return that piece to player
        if (turnPlayerPieces[i].row == row && turnPlayerPieces[i].col == col) {

            turnPlayerPieces[i].row = -1;
            turnPlayerPieces[i].col = -1;
            turnPlayerPieces[i].active = false;
            square.style.backgroundImage = "url(Sprites/safe_area.png)";
            ChangePieceCount(turnPlayerPieces[i].name, 1);
            break;
        }

        // Place new piece
        if (currentSelected == turnPlayerPieces[i].name && turnPlayerPieces[i].row == -1 && !turnPlayerPieces[i].active) {
            turnPlayerPieces[i].row = row;
            turnPlayerPieces[i].col = col;
            turnPlayerPieces[i].active = true;

            // Update the HTML gameboard
            square.style.backgroundImage = turn == "b" ? piecesInfo[currentSelected]["ImgB"] : piecesInfo[currentSelected]["ImgW"];
            ChangePieceCount(currentSelected, -1);
            break;
        }
    }

    // Check if all pieces have been placed
    let count = 0;
    for (let i = 0; i < turnPlayerPieces.length; i++) {
        if (turnPlayerPieces[i].row != -1) {
            count++;
        }

    }

    if (count == turnPlayerPieces.length && turn == "w") {
        PhaseTwo();
    }
    else if (count == turnPlayerPieces.length && turn == "b")
    {
        turn = "w";
        count = 0;
        CreateSafeArea(turn);
        
    }
    else {
        count = 0;
    }
}

// Changes the count variable of that piece by -1 or +1
function ChangePieceCount(pieceName, direction)
{
    // Update dictionary
    piecesInfo[pieceName]["CurrentCount"] += direction;

    // Update HTML
    document.querySelector(`.option[data-piece="${pieceName}"]`).innerText = piecesInfo[pieceName]["CurrentCount"];
}




// Phase 2: Playing the Game //

function SwitchTurns()
{
    // Flip the current safe area
    for (square of squares)
    {
        if (turn == "w" && square.hasAttribute("data-safeArea_w"))
            square.onclick = null;
        else if (turn == "w" && square.hasAttribute("data-safeArea_b"))
            square.setAttribute("onclick", "SquareClicked(this)");

        else if (turn == "b" && square.hasAttribute("data-safeArea_b"))
            square.onclick = null;
        else if (turn == "b" && square.hasAttribute("data-safeArea_w"))
            square.setAttribute("onclick", "SquareClicked(this)");
    }

    // Flip turn value
    turn = turn == "w" ? "b" : "w";
}



function PhaseTwo()
{
    // First remove Options Window
    alert("Phase 2");
    options[0].parentElement.remove();


    // Make all squares clickable
    for (square of squares)
        square.setAttribute("onclick", "SquareClicked(this)");

    // Switch turn
    SwitchTurns();

    currentSelected = null;
}

 
function SquareClicked(square)
{
    // Get the row and column of the square
    let col = square.parentElement.parentElement.dataset.col;
    let row = square.parentElement.dataset.row;

    // Get the turn player pieces
    let player = getPlayer(square);
   
    if (currentSelected == null)
    {

        // Check that the clicked piece is the turn player's piece.
        // If TRUE, call SelectPiece function
        if (player == turn)
        {
            let playerPieces = player == "w" ? playerPieces_w : playerPieces_b;

            for (let i = 0; i < playerPieces.length; i++)
            {
                if (playerPieces[i].row == row && playerPieces[i].col == col)
                {
                    SelectPiece(square, playerPieces[i]);
                }
            }
        }

    }
    else
    {
        // Make sure that the square the piece moves to does not have the turn player's piece
        if (player != turn)
        {
            for (currentSquare of squares)
            {
                // Check if the piece selected is currently in safe area
                if (currentSelected.row == currentSquare.parentElement.dataset.row && currentSelected.col == currentSquare.parentElement.parentElement.dataset.col)
                {
                    // Check if this square is in a safe area
                    if (currentSquare.hasAttribute("data-safeArea_w") || currentSquare.hasAttribute("data-safeArea_b"))
                    {
                        MovePiece(square);
                        break;
                    }
                        
                    // If not, make sure the square clicked is not a safe area
                    else if (square.style.backgroundImage != 'url("Sprites/safe_area.png")')
                    {
                        MovePiece(square);
                        break;
                    }
                }
            }
        }
    }
}

function SelectPiece(square, piece)
{
    currentSelected = piece;
    square.style.filter = "brightness(50%)";

    // Highlight all available moving spots
    for (let i = 1; i <= piecesInfo[currentSelected.name]["MoveAmount"]; i++)
    {
        // Check which squares are in the piece's range/restrictions
        for (let j = 0; j < squares.length; j++)
        {
            let col = squares[j].parentElement.parentElement.dataset.col;
            let row = squares[j].parentElement.dataset.row;

            for (let k = 0; k < piecesInfo[currentSelected.name]["Movement"].length; k++)
            {
                if (row == Number(currentSelected.row) + (piecesInfo[currentSelected.name]["Movement"][k][0] * i) &&
                    col == Number(currentSelected.col) + (piecesInfo[currentSelected.name]["Movement"][k][1] * i))
                {
                    squares[j].style.filter = "brightness(120%)";
                    squares[j].setAttribute("data-inRange", true);

                }
            }
        }
    }

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

    // Get the turn player pieces
    let player = getPlayer(currentSquare);
    let playerPieces = player == "w" ? playerPieces_w : playerPieces_b;

    // Check if current selected piece can move to new square
    if (square.getAttribute("data-inRange"))
    {
        // Remove piece from current square
        if (turn == "w" && currentSquare.hasAttribute("data-safeArea_w") ||
            turn == "b" && currentSquare.hasAttribute("data-safeArea_b"))
            currentSquare.style.backgroundImage = "url(Sprites/safe_area.png)";

        else if (currentSquare.parentElement.parentElement.dataset.col % 2 == 0 && currentSquare.parentElement.dataset.row % 2 == 0 ||
            currentSquare.parentElement.parentElement.dataset.col % 2 != 0 && currentSquare.parentElement.dataset.row % 2 != 0)
            currentSquare.style.backgroundImage = "url(Sprites/bg1.png)";

        else
            currentSquare.style.backgroundImage = "url(Sprites/bg2.png)";


        // Remove all highlighted squares
        for (let i = 0; i < squares.length; i++)
        {
            squares[i].style.filter = "brightness(100%)";
            squares[i].removeAttribute("data-inRange");
        }

        // Remove piece in clicked square
        for (let i = 0; i < playerPieces.length; i++)
        {
            if (playerPieces[i].row == row && playerPieces[i].col == col)
            {
                playerPieces[i].col = -1;
                playerPieces[i].row = -1;
            }
        }

        // Place piece in new square
        currentSelected.row = row;
        currentSelected.col = col;

        square.style.backgroundImage = player == "w" ? piecesInfo[currentSelected.name]["ImgW"] : piecesInfo[currentSelected.name]["ImgB"];
        currentSelected = null;

        // Switch turns
        SwitchTurns();
    }
}
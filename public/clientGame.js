// Designate square types
let squares = document.querySelectorAll(".square");
let bSafeSquares = document.querySelectorAll("[data-safeArea_b]");
let wSafeSquares = document.querySelectorAll("[data-safeArea_w]");
let upgradeSquares = document.querySelectorAll("[data-upgrade]");

// Variables for square images
let upgradeImgActive = 'url("Sprites/upgrade_active.png")';
let upgradeImgUnactive = 'url("Sprites/upgrade_unactive.png")';
let safeAreaImg = 'url("Sprites/safe_area.png")';
let boardImg = 'url("Sprites/bg1.png")';
let hidden = 'url("Sprites/hidden.png")';

// Create Game Board
for (let i = 0; i < squares.length; i++)
{
    squares[i].style.backgroundImage = boardImg;
}
for (square of upgradeSquares)
{
    square.style.backgroundImage = upgradeImgUnactive;
}

let turn = "b"; // value for whos turn it is
let replenishMode = false; // value for setting replenish mode on and off
let upgradeScreen = false; // value for if the upgrade screen is currently showing

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
        "OptionImg": "linear-gradient(to right, lightblue, blue)",
        "Movement": [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]], //all directions
        "MoveAmount": 15, // unlimited movement
        "MoveType": "normal"
    },
    "Emerald": {
        "OriginalCount": 1, "CurrentCount": 1,
        "ImgB": 'url("Sprites/b_emerald.png")', "ImgW": 'url("Sprites/w_emerald.png")',
        "OptionImg": "linear-gradient(to right, lightgreen, lime)",
        "Movement": [[1, 0], [0, 1], [-1, 0], [0, -1]], // cardinal
        "MoveAmount": 15,
        MoveType: "jump" // can move through pieces
    },
    "Ruby": {
        "OriginalCount": 1, "CurrentCount": 1,
        "ImgB": 'url("Sprites/b_ruby.png")', "ImgW": 'url("Sprites/w_ruby.png")',
        "OptionImg": "linear-gradient(to right, pink, red)",
        "Movement": [[1, 1], [1, -1], [-1, 1], [-1, -1]], // diagonal
        "MoveAmount": 4,
        MoveType: "aoe" // affects all squares surrounding square
    },
    "Steel": {
        "OriginalCount": 2, "CurrentCount": 2,
        "ImgB": 'url("Sprites/b_steel.png")', "ImgW": 'url("Sprites/w_steel.png")',
        "OptionImg": "linear-gradient(to right, lightgray, lightslategray)",
        "Movement": [[1, 0], [0, 1], [-1, 0], [0, -1]], // cardinal
        "MoveAmount": 4,
        MoveType: "fortified" // can survive aoe attacks
    },
    "Rock": {
        "OriginalCount": 3, "CurrentCount": 3,
        "ImgB": 'url("Sprites/b_rock.png")', "ImgW": 'url("Sprites/w_rock.png")',
        "OptionImg": "linear-gradient(to right, burlywood, saddlebrown)",
        "Movement": [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]], // all directions
        "MoveAmount": 2,
        MoveType: "normal"
    },
    "Clay": {
        "OriginalCount": 4, "CurrentCount": 4,
        "ImgB": 'url("Sprites/b_clay.png")', "ImgW": 'url("Sprites/w_clay.png")',
        "OptionImg": "linear-gradient(to right, orange, maroon)",
        "Movement": [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [-2, 1], [-2, -1], [2, -1]], // hook-shape movement
        "MoveAmount": 1,
        MoveType: "jump"
    },
    "Glass": {
        "OriginalCount": 2, "CurrentCount": 2,
        "ImgB": 'url("Sprites/b_glass.png")', "ImgW": 'url("Sprites/w_glass.png")',
        "OptionImg": "linear-gradient(to right, white, cadetblue)",
        "Movement": [[1, 1], [1, -1], [-1, 1], [-1, -1]], // diagonal
        "MoveAmount": 15,
        MoveType: "replenish" // can move again after taking a piece
    },
    "Paper": {
        "OriginalCount": 6, "CurrentCount": 6,
        "ImgB": 'url("Sprites/b_paper.png")', "ImgW": 'url("Sprites/w_paper.png")',
        "OptionImg": "linear-gradient(to right, white, white)",
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

// Returns possible upgrades for a piece
function getUpgrades(pieceName)
{
    switch (pieceName)
    {
        case "Diamond":
            return [];
            break;
        case "Emerald":
            return [];
            break;
        case "Ruby":
            return [];
            break;
        case "Steel":
            return ["Diamond", "Emerald", "Ruby"];
            break;
        case "Glass":
            return [];
        case "Rock":
            return ["Steel", "Glass"];
            break;
        case "Clay":
            return ["Rock"];
            break;
        case "Paper":
            return ["Clay"];
            break;

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
            if (currentSelected == options[j].dataset.piece)
                options[j].style.animationName = "reveil";
        }
        currentSelected = options[i].dataset.piece;
        options[i].style.animationName = "unveil";
    })
}

// Create Safe Area for black
CreateSafeArea(turn);

// Make safe area for current player
function CreateSafeArea(player)
{
    if (player == "b")
    {
        for (square of bSafeSquares)
        {
            square.style.backgroundImage = safeAreaImg;
            square.setAttribute("onclick", "PlacePiece(this)");
        }
    }
    else
    {
        for (square of wSafeSquares)
        {
            square.style.backgroundImage = safeAreaImg;
            square.setAttribute("onclick", "PlacePiece(this)");
        }

        // Remove click event for black pieces and reset amount of pieces to place
        for (square of bSafeSquares)
        {
            square.onclick = null;
            if (square.style.backgroundImage == safeAreaImg)
                square.setAttribute("data-img", safeAreaImg);
            else
                square.setAttribute("data-img", square.style.backgroundImage);

            square.style.backgroundImage = hidden;
        }
        
        for (let piece of piecesList)
        {
            piecesInfo[piece]["CurrentCount"] = piecesInfo[piece]["OriginalCount"];
            document.querySelector(`.option[data-piece="${piece}"]`).innerText = `${piece}: ${piecesInfo[piece]["CurrentCount"]}`;
            document.querySelector(`.option[data-piece="${piece}"]`).style.backgroundImage = piecesInfo[piece]["OptionImg"];
        }
        currentSelected = null;
    }
}

// Cheat to place all pieces immediately
document.addEventListener('keyup', event => {
    if (event.code === 'Space')
    {
        currentSelected = "Diamond";
        if (turn == "b")
        {
            for (let i = 0; i < squares.length; i++)
            {
                if (squares[i].hasAttribute("data-safeArea_b"))
                {
                    // Check that all pieces are not used up
                    let count = 0;
                    for (let i = 0; i < playerPieces_b.length; i++)
                    {
                        if (playerPieces_b[i].row != -1)
                        {
                            count++;
                        }

                    }
                    if (count == playerPieces_b.length)
                        break;

                    if (piecesInfo[currentSelected]["CurrentCount"] == 0)
                    {
                        for (piece of piecesList)
                        {
                            if (piecesInfo[piece]["CurrentCount"] > 0)
                            {
                                currentSelected = piece;
                                break;
                            }
                        }
                    }
                    PlacePiece(squares[i]);
                }
            }
        }
        else
        {
            for (let i = 0; i < squares.length; i++)
            {
                if (squares[i].hasAttribute("data-safeArea_w"))
                {
                    // Check that all pieces are not used up
                    let count = 0;
                    for (let i = 0; i < playerPieces_w.length; i++)
                    {
                        if (playerPieces_w[i].row != -1)
                        {
                            count++;
                        }

                    }
                    if (count == playerPieces_w.length)
                        break;

                    if (piecesInfo[currentSelected]["CurrentCount"] == 0)
                    {
                        for (piece of piecesList)
                        {
                            if (piecesInfo[piece]["CurrentCount"] > 0)
                            {
                                currentSelected = piece;
                                break;
                            }
                        }
                    }
                    PlacePiece(squares[i]);
                }
            }
        }
    }
})


function PlacePiece(square) {

    let row = square.parentElement.dataset.row;
    let col = square.parentElement.parentElement.dataset.col;

    // Figure out which side is placing a piece
    let player = square.hasAttribute("data-safeArea_w") ? "w" : "b";
    let turnPlayerPieces = player == "w" ? playerPieces_w : playerPieces_b;

    // Make sure that if there is already a piece on the square that gets taken away, dont place a new piece
    let dontPlace = false;

    // First check if the square clicked already has a piece
    for (let i = 0; i < turnPlayerPieces.length; i++)
    {
        // If a square has a piece already placed on it, return that piece to player
        if (turnPlayerPieces[i].row == row && turnPlayerPieces[i].col == col)
        {
            turnPlayerPieces[i].row = -1;
            turnPlayerPieces[i].col = -1;
            turnPlayerPieces[i].active = false;
            square.style.backgroundImage = "url(Sprites/safe_area.png)";
            ChangePieceCount(turnPlayerPieces[i].name, 1);
            dontPlace = true;
            break;
        }
    }
    if (!dontPlace)
    {
        for (piece of turnPlayerPieces)
        {
            // Place new piece
            if (currentSelected == piece.name && piece.row == -1 && !piece.active)
            {
                piece.row = row;
                piece.col = col;
                piece.active = true;

                // Update the HTML gameboard
                square.style.backgroundImage = turn == "b" ? piecesInfo[currentSelected]["ImgB"] : piecesInfo[currentSelected]["ImgW"];
                ChangePieceCount(currentSelected, -1);
                break;
            }
        }
    }
    dontPlace = false;

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
    document.querySelector(`.option[data-piece="${pieceName}"]`).innerText = `${pieceName}: ${piecesInfo[pieceName]["CurrentCount"]}`;

    currentColor = document.querySelector(`.option[data-piece="${pieceName}"]`).style.backgroundImage;
    if (piecesInfo[pieceName]["CurrentCount"] == 0)
    {
        document.querySelector(`.option[data-piece="${pieceName}"]`).style.backgroundImage = "linear-gradient(black, black)";
        document.querySelector(`.option[data-piece="${pieceName}"]`).style.animationName = "reveil";
    }
        
    else
        document.querySelector(`.option[data-piece="${pieceName}"]`).style.backgroundImage = piecesInfo[pieceName]["OptionImg"];
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

function Unhighlight()
{
    // Remove all highlighted squares
    for (square of squares)
    {
        square.style.filter = "brightness(100%)";
        square.removeAttribute("data-inRange");
    }
    currentSelected = null;
}

function UpgradePiece(upgrade)
{
    for (let i = 0; i < squares.length; i++)
    {
        let col = squares[i].parentElement.parentElement.dataset.col;
        let row = squares[i].parentElement.dataset.row;

        if (row == currentSelected.row && col == currentSelected.col)
        {
            let pieceNameUpper = upgrade.getAttribute("data-upgradeName"); // uppercase piece name
            let pieceNameLower = pieceNameUpper.toLowerCase(); // lowercase piece name
            currentSelected.name = pieceNameUpper;
            squares[i].style.backgroundImage = `url("Sprites/${turn}_${pieceNameLower}.png")`;
        }
    }
    upgradeScreen = false;
    document.getElementsByClassName("screenCover")[0].style.display = "none";

    // Update turns
    SwitchTurns();
    currentSelected = null;
    replenishMode = false;

    // Update HTML
    document.getElementsByClassName("upgrades")[0].innerHTML = "";

    // Switch upgrade squares
    for (square of upgradeSquares)
    {
        if (square.dataset.upgrade == "unactive")
        {
            if (square.style.backgroundImage == upgradeImgUnactive)
                square.style.backgroundImage = upgradeImgActive;
        }
        square.dataset.upgrade = square.dataset.upgrade == "active" ? "unactive" : "active";
    }
}

function PhaseTwo()
{
    // First remove Options Window
    options[0].parentElement.remove();


    // Make all squares clickable
    for (square of squares)
        square.setAttribute("onclick", "SquareClicked(this)");

    // Change black's pieces back to original set
    for (square of bSafeSquares)
    {
        square.style.backgroundImage = square.getAttribute("data-img");
    }

    // Switch turn
    SwitchTurns();

    currentSelected = null;


    // Randomize which upgrade square is active first
    let random = Math.random();
    if (random >= 0.51)
    {
        upgradeSquares[0].dataset.upgrade = "active";
        upgradeSquares[0].style.backgroundImage = upgradeImgActive
    }
    else
    {
        upgradeSquares[1].dataset.upgrade = "active";
        upgradeSquares[1].style.backgroundImage = upgradeImgActive
    }
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
            MovePiece(square);
        }
        else
        {
            // Only unhighlight if replenish mode is off
            if (!replenishMode)
                Unhighlight();
        }
            
    }
}

function SelectPiece(square, piece)
{
    currentSelected = piece;
    square.style.filter = "brightness(50%)";

    // Array with sides that should be restricted because of a piece blocking path
    let restrictSide = [];

    let inSafeArea = false;
    for (cSquare of squares)
    {
        // Check if the piece selected is currently in safe area
        if (currentSelected.row == cSquare.parentElement.dataset.row &&
            currentSelected.col == cSquare.parentElement.parentElement.dataset.col)
        {
            if (cSquare.hasAttribute("data-safeArea_w") || cSquare.hasAttribute("data-safeArea_b"))
            {
                inSafeArea = true;
            }                
        }
    }


    let upgrades = getUpgrades(currentSelected.name).length;

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
                // Check if this side is restricted
                let sideRestricted = false;
                for (side of restrictSide)
                {
                    if (side == piecesInfo[currentSelected.name]["Movement"][k])
                        sideRestricted = true;
                }
                // If a side is restricted, then skip the highlighting of this side, unless they can jump
                if (sideRestricted && piecesInfo[currentSelected.name]["MoveType"] != "jump")
                    continue;


                if (row == Number(currentSelected.row) + (piecesInfo[currentSelected.name]["Movement"][k][0] * i) &&
                    col == Number(currentSelected.col) + (piecesInfo[currentSelected.name]["Movement"][k][1] * i))
                {
                    
                    // Check if the square to be highlighted is a piece
                    if (squares[j].style.backgroundImage != safeAreaImg &&
                        squares[j].style.backgroundImage != boardImg &&
                        squares[j].style.backgroundImage != upgradeImgActive &&
                        squares[j].style.backgroundImage != upgradeImgUnactive)
                    {
                        restrictSide.push(piecesInfo[currentSelected.name]["Movement"][k]);
                    }

                    // IF a piece is fully upgraded, it cannot move onto an active upgrade square or an unactive upgrade square
                    // No pieces can move onto an unactive square
                    if (upgrades != 0 && squares[j].style.backgroundImage != upgradeImgUnactive ||
                        upgrades == 0 && squares[j].style.backgroundImage != upgradeImgActive &&
                        squares[j].style.backgroundImage != upgradeImgUnactive)
                    {
                        // If this square is not in a safe area
                        if (!inSafeArea)
                        {
                            if (squares[j].style.backgroundImage != 'url("Sprites/safe_area.png")')
                            {
                                squares[j].style.filter = "brightness(150%)";
                                squares[j].setAttribute("data-inRange", true);
                            }
                        }
                        else
                        {
                            squares[j].style.filter = "brightness(150%)";
                            squares[j].setAttribute("data-inRange", true);
                        }
                    }
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

    let pieceTaken = false; // variable for if a piece ends up being taken or not


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
    let opponentPieces = player != "w" ? playerPieces_w : playerPieces_b;

    // Check if current selected piece can move to new square
    if (square.getAttribute("data-inRange"))
    {
        
        // Remove piece from current square
        if (turn == "w" && currentSquare.hasAttribute("data-safeArea_w") ||
            turn == "b" && currentSquare.hasAttribute("data-safeArea_b"))
            currentSquare.style.backgroundImage = "url(Sprites/safe_area.png)";

        else if (currentSquare.hasAttribute("data-upgrade"))
        {
            if (currentSquare.dataset.upgrade == "active")
                currentSquare.style.backgroundImage = upgradeImgActive;
            else
                currentSquare.style.backgroundImage = upgradeImgUnactive;
        }
        else
            currentSquare.style.backgroundImage = boardImg;


        // Remove all highlighted squares
        for (let i = 0; i < squares.length; i++)
        {
            squares[i].style.filter = "brightness(100%)";
            squares[i].removeAttribute("data-inRange");
        }


        // Check if this is an aoe piece that moved
        if (piecesInfo[currentSelected.name]["MoveType"] == "aoe")
        {
            for (let j = 0; j < squares.length; j++)
            {
                let aoeCol = squares[j].parentElement.parentElement.dataset.col;
                let aoeRow = squares[j].parentElement.dataset.row;

                for (let k = 0; k < piecesInfo["Paper"]["Movement"].length; k++)
                {
                    if (row == Number(aoeRow) + (piecesInfo["Paper"]["Movement"][k][0]) &&
                        col == Number(aoeCol) + (piecesInfo["Paper"]["Movement"][k][1]))
                    {
                        // Check if this piece is an opponents piece, and fortified is unaffected
                        let aoePlayer = getPlayer(squares[j]);
                        let aoePlayerPieces = aoePlayer == "w" ? playerPieces_w : playerPieces_b;
                        if (aoePlayer != turn && squares[j].style.backgroundImage != 'url("Sprites/b_steel.png")' &&
                            squares[j].style.backgroundImage != 'url("Sprites/w_steel.png")')
                        {
                            // Check if this piece is in safe area
                            if (!squares[j].hasAttribute("data-safeArea_w") && !squares[j].hasAttribute("data-safeArea_b"))
                            {
                                // Check if this is an upgrade square
                                if (squares[j].style.backgroundImage != upgradeImgUnactive &&
                                    squares[j].style.backgroundImage != upgradeImgUnactive)
                                {
                                    for (piece of aoePlayerPieces)
                                    {
                                        if (piece.row == aoeRow && piece.col == aoeCol)
                                        {
                                            piece.row = -1;
                                            piece.col = -1;
                                        }
                                    }
                                    if (squares[j].hasAttribute("data-upgrade"))
                                    {
                                        if (squares[j].style.backgroundImage != upgradeImgActive)
                                            squares[j].style.backgroundImage = upgradeImgUnactive;
                                    }
                                        
                                    else
                                        squares[j].style.backgroundImage = boardImg;
                                }  
                            }
                        }
                    }
                }
            }

            // After eliminating all piece in aoe range, get rid of piece in clicked square, if there is one
            for (let i = 0; i < opponentPieces.length; i++)
            {
                if (row == opponentPieces[i].row && col == opponentPieces[i].col)
                {
                    opponentPieces[i].row = -1;
                    opponentPieces[i].col = -1;
                }
            }
        }
        // Only eliminate piece in clicked square
        else
        {
            for (let i = 0; i < opponentPieces.length; i++)
            {
                if (row == opponentPieces[i].row && col == opponentPieces[i].col)
                {
                    opponentPieces[i].row = -1;
                    opponentPieces[i].col = -1;

                    pieceTaken = true;
                }
            }
        }

        // Place piece in new square
        currentSelected.row = row;
        currentSelected.col = col;

        square.style.backgroundImage = player == "w" ? piecesInfo[currentSelected.name]["ImgW"] : piecesInfo[currentSelected.name]["ImgB"];

        // If piece is a replenish piece, and a piece was captured, do not switch turns
        if (pieceTaken && piecesInfo[currentSelected.name]["MoveType"] == "replenish")
        {
            // make it so only this replinished piece is able to move again
            replenishMode = true;
            SelectPiece(currentSquare, currentSelected);
        }
        else
        {
            // Before switching turns, check if the current square is an upgrade square
            if (square.getAttribute("data-upgrade") == "active")
            {
                upgradeScreen = true;
                document.getElementsByClassName("screenCover")[0].style.display = "block";

                // Display possible upgrades
                let upgrades = getUpgrades(currentSelected.name);

                for (upgrade of upgrades)
                {
                    var div = document.createElement("div");
                    div.className = "upgrade";
                    document.getElementsByClassName("upgrades")[0].appendChild(div);
                    let pieceName = upgrade.toLowerCase();
                    div.style.backgroundImage = `url("Sprites/${turn}_${pieceName}.png")`;
                    div.setAttribute("data-upgradeName", `${upgrade}`);
                    div.setAttribute("onclick", "UpgradePiece(this)");
                }

            }
            // Do not do anything until upgrade screen is gone
            if (!upgradeScreen)
            {
                SwitchTurns();

                currentSelected = null;
                replenishMode = false;
            }
        }
    }
    else
    {
        if (!replenishMode)
        {
            Unhighlight();
        }
    }
}
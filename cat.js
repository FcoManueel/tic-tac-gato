/**
 * Created by mvalle on 9/17/15.
 */

// Game functions that manipulate the DOM
function UI() {
    this.setSquareById = function ($square, $playerNum, $value) {
        var squareID = 'square' + String($square),
            squareDiv = document.getElementById(squareID);
        squareDiv.innerHTML = '<h2 class="text-center vertical-center">' + $value + '</h2>';
        squareDiv.className = 'square ';
        if ($playerNum != undefined) {
            playerClass = 'player' + String($playerNum);
            squareDiv.className += playerClass;
        }
    };

    this.showEndScreen = function ($msg) {
        var gameFinishedDiv = document.getElementById('end-screen');
        gameFinishedDiv.className = 'end';

        var endMessageElement = document.getElementById('end-msg');
        endMessageElement.innerHTML = $msg
    };

    this.hidePreStart = function () {
        var preStartDiv = document.getElementById('pre-start');
        preStartDiv.className = 'hidden';
    };

    this.restart = function () {
        var preStartDiv = document.getElementById('pre-start');
        preStartDiv.className = '';

        var gameFinishedDiv = document.getElementById('end-screen');
        gameFinishedDiv.className = 'hidden';
        for (var i=0; i<9; i++) {
            ui.setSquareById(i,undefined,"");
        }
    }
}

function Board($height, $width) {
    var board = new Array($width);
    for (var i = 0; i < $width; i++) {
        board[i] = new Array($height);
    }
    board.height = $height;
    board.width = $width;
    return board
}

function Game($gameboard, $players) {
    this.isFinished = false;
    this.board = $gameboard;
    this.players = $players;
    this.currentPlayer = null;
    this.turnsPlayed = 0;
    this.totalGamesPlayed = 1;
    this.DRAW_GAME = 'DRAW_GAME';

    this.restart = function() {
        var totalSquares = this.board.width*this.board.height
        for (var i=0; i<totalSquares; i++) {
            game.setSquareById(i, undefined);
        }
        game.isFinished = false;
        game.currentPlayer = game.randomPlayer();
        game.turnsPlayed = 0;
        game.totalGamesPlayed++;

    };
    this.randomPlayer = function () {
        return 0
    };

    this.advanceToNextPlayer = function () {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.turnsPlayed++;
        return this.currentPlayer
    };

    this.getSquareById = function ($square) {
        return this.board[$square % this.board.width][$square / this.board.height];
    };

    this.setSquareById = function ($square, $player) {
        this.board[$square % this.board.width][$square / this.board.height] = $player;
        return $player;
    };

    this.getWinner = function () {
        var winningCombinations = Array(
            Array(0,1,2), Array(3,4,5), Array(6,7,8), // rows
            Array(0,3,6), Array(1,4,7), Array(2,5,8), // columns
            Array(0,4,8), Array(2,4,6));              // diagonals

        var that = this;
        var allSame = function(combination) {
            var firstSquare = that.getSquareById(combination[0]);
            if (firstSquare == undefined) {
                return false;
            }
            for (var i = 1; i < combination.length; i++) {
                var currentSquare = that.getSquareById(combination[i]);
                if (firstSquare != currentSquare) {
                    return false;
                }
            }
            return true;
        };

        // Check winning combinations
        for (var i = 0; i < winningCombinations.length; i++) {
            if (allSame(winningCombinations[i])) {
                return this.getSquareById(winningCombinations[i][0]);
            }
        }
        var totalSquares = this.board.width*this.board.height,
            isLastTurn = this.turnsPlayed+1 == totalSquares;
        if (isLastTurn) {
            return this.DRAW_GAME;
        }
        return undefined;
    };

    this.currentPlayer = this.randomPlayer();
}

function init() {
    game = new Game(new Board(3, 3), ['X', 'O']);
    ui = new UI();
}

init();

function randomWinningMessage() {
    messages = Array("te saliste con la tuya",
                    "te llevaste la gloria",
                    "te la rifaste",
                    "eso fue impresionante!",
                    "hermosa jugada",
                    "sublime!",
                    "ganaron tus reflejos de gato",
                    "eres un maestro del deporte gatuno",
                    "ponte a chambear");
    return messages[Math.floor(Math.random()*messages.length)];
}

function squareClicked($square) {
    var squareIsOccupied = game.getSquareById($square) != undefined;
    if (squareIsOccupied || game.isFinished) {
        return
    }
    if (game.turnsPlayed == 1) {
        ui.hidePreStart()
    }

    game.setSquareById($square, game.currentPlayer);
    ui.setSquareById($square, game.currentPlayer+1, game.players[game.currentPlayer]);

    // prepare for next turn
    var winner = game.getWinner();
    if (winner == undefined) {
        game.advanceToNextPlayer();
    } else {
        game.isFinished = true;
        console.log("Jugador '%s', Ganador! ", game.players[winner]);

        if (winner == game.DRAW_GAME) {
            var endMessage = "El juego acabo en empate\n Aburridos!";
        }else{
            var endMessage = "Jugador " + String(winner+1) + ", <br> " + randomWinningMessage()
        }

        ui.showEndScreen(endMessage);
    }
}

function restart() {
    ui.restart();
    game.restart();
}
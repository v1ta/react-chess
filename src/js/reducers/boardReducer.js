import {determinePiece, getMoveSet} from '../util/boardUtils';

const board = {
    tiles: {},
    pieces: {},
    activePiece: {},
    moveHistory: [],
    boardSize: null,
    currentPlayer: 'white'
};

let yCoordDeadPiece = 0;

export default (state=null, action) => {

    if (Object.keys(board.tiles).length === 0) {
        loadDefaultBoard();
    }

    switch(action.type) {
        case 'MOVE_PIECE':
            let piece = board.activePiece,
                tile = action.payload.tile,
                cell = action.payload.cell,
                refPiece = board.pieces[piece.type + piece.startingTile]

            if (validMove(tile, cell, refPiece)) {
                board.currentPlayer = board.currentPlayer === 'white' ? 'black' : 'white';
            }
            break;
        case 'ACTIVE_PIECE':
            board.activePiece = action.payload;
            break;
    }

    return board;
}

function loadDefaultBoard() {
    for (let i = 7; i >= 0; i--) {
        let tileColorFlag = i % 2 == 0;

        for (let j = 0; j < 8; j++) {
            let cellId = String.fromCharCode(97 + j) + (i + 1),
                tileNumber = i * 8 + j,
                piece = determinePiece(tileNumber);

            board.tiles[cellId] = {
                backgroundColor: (tileColorFlag = !tileColorFlag) ? 'white' : 'black',
                piece: piece ? piece.type + cellId : false
            }

            if (piece) {
                board.pieces[piece.type + cellId] = piece;
            }
        }
    }
}

function validMove(tile, cell, piece) {
    // TODO add castling case
    if (tile.piece && new RegExp(board.currentPlayer).test(tile.piece)) {
        return false;
    }

    let moveSet = piece.moveSet,
        destColumn = cell[0].charCodeAt() - 97,
        destRow = Number(cell[1]),
        currColumn = piece.currentTile[0].charCodeAt() - 97,
        currRow = Number(piece.currentTile[1]),
        numMoves = moveSet.numMoves;

    for(var i = 0; i < moveSet.moves.length; i++) {
        let moveVector = moveSet.moves[i];
        for (var j = 1; j <= numMoves; j++) {
            let rowVector = moveVector[0] * j,
                colVector = moveVector[1] * j;

            if (colVector + currColumn === destColumn
                && rowVector + currRow === destRow) {

                    if (tile.piece) {
                        let enemyPiece = board.pieces[tile.piece]
                        enemyPiece.alive = false;
                        enemyPiece.x = board.boardSize;
                        enemyPiece.y = yCoordDeadPiece;
                        yCoordDeadPiece += 20;
                    }

                    // Update coordinates
                    piece.x = tile.x;
                    piece.y = tile.y;

                    // Update tiles
                    board.tiles[cell].piece = piece.type + piece.startingTile;
                    board.tiles[piece.currentTile].piece = false;

                    // Update piece
                    piece.currentTile = cell;

                    return true;
            } else if (!containsPiece(resolveBoardCell(colVector + currColumn, rowVector + currRow))) {
                break;
            }
        }


    }
    return false;
}

function resolveBoardCell(colNumber, rowNumber) {
    return String.fromCharCode(97 + colNumber) + rowNumber;
}

function containsPiece(boardCell) {
    var validBoardCell = function(boardCell) {
        let row = Number(boardCell.substr(1));

        if (!/[a-h]/.test(boardCell[0])) {
            return false;
        } else if (row < 1 || row > 8) {
            return false;
        } else {
            return true;
        }
    }

    if (!validBoardCell(boardCell)) {
        return false;
    }

    return !board.tiles[boardCell].piece
}
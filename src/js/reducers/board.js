import {determinePiece, getMoveSet} from '../util/boardUtils';
import u from 'updeep';
import $ from 'jquery'

const width = $(document).width(),
    height = $(document).height(),
    boardSize = width < height ? width : height;

let yCoordDeadPiece = 0;

const boardReducer = (state={}, action) => {

    switch(action.type) {
        case 'MOVE_PIECE':
            let tile = action.payload.tile,
                cell = action.payload.cell,
                move = validMove(state, tile, cell);

            if (move) {
                state = u(move, state);
            }
            break;
        case 'ACTIVE_PIECE':
            state = u({activePiece: action.payload}, state);
            break;
    }
    return state;
}

const validMove = (state, tile, cell) => {

    let piece = state.activePiece;
    // TODO add castling case
    if (tile.piece && new RegExp(state.currentPlayer).test(tile.piece)) {
        return false;
    }

    let moveSet = piece.moveSet,
        destColumn = cell[0].charCodeAt() - 97,
        destRow = Number(cell[1]),
        currColumn = piece.currentTile[0].charCodeAt() - 97,
        currRow = Number(piece.currentTile[1]),
        numMoves = moveSet.numMoves,
        move = {
            pieces: {},
            tiles: {},
            currentPlayer: state.currentPlayer === 'white' ? 'black' : 'white'
        };


    for(var i = 0; i < moveSet.moves.length; i++) {
        let moveVector = moveSet.moves[i];
        for (var j = 1; j <= numMoves; j++) {
            let rowVector = moveVector[0] * j,
                colVector = moveVector[1] * j;

            if (colVector + currColumn === destColumn
                && rowVector + currRow === destRow) {

                    if (tile.piece) {
                        move.pieces[tile.piece] = {
                            alive: false,
                            x: boardSize,
                            y: yCoordDeadPiece
                        }
                        yCoordDeadPiece += 20;
                    }

                    // Update coordinates
                    move.pieces[piece.type + piece.startingTile] = {
                        x: tile.x,
                        y: tile.y
                    }

                    // Update tiles
                    move.tiles[cell] = {
                        piece: piece.type + piece.startingTile
                    }

                    move.tiles[piece.currentTile] = {
                        piece: false
                    }

                    // Update piece
                    move.pieces[piece.type + piece.startingTile].currentTile = cell;

                    return move;
            } else if (!containsPiece(
                state,
                resolveBoardCell(colVector + currColumn, rowVector + currRow)
            )) {
                break;
            }
        }
    }
    return false;
}

const resolveBoardCell = (colNumber, rowNumber) => {
    return String.fromCharCode(97 + colNumber) + rowNumber;
}

const containsPiece = (state, boardCell) => {

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

    return !state.tiles[boardCell].piece
}

const currentPlayer = (state) => {
    return state.board.currentPlayer;
}

const getPiece = (state, key) => {
    return state.board.pieces[key];
}

const getTile = (state, key) => {
    return state.board.tiles[key];
}

export { boardReducer, currentPlayer, getPiece, getTile }
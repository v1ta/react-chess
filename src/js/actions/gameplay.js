import {determinePiece, getMoveSet} from '../util/boardUtils';
import $ from 'jquery'

const width = $(document).width(),
    height = $(document).height(),
    boardSize = width < height ? width : height;

const board = {
    tiles: {},
    pieces: {},
    activePiece: {},
    moveHistory: [],
    currentPlayer: 'white'
};

const dropPiece = (tile, cell) => {
    return {
        type: 'MOVE_PIECE',
        payload: {
            cell: cell,
            tile: tile
        }
    }
};

const activePiece = (piece) => {
    return {
        type: 'ACTIVE_PIECE',
        payload: piece
    }
}

const defaultBoard = () => {

    if (Object.keys(board.tiles).length !== 0) {
        return {board: board};
    }

    let x = 0,
        y = 0;

    for (let i = 7; i >= 0; i--) {
        let tileColorFlag = i % 2 == 0;

        for (let j = 0; j < 8; j++) {
            let cellId = String.fromCharCode(97 + j) + (i + 1),
                tileNumber = i * 8 + j,
                piece = determinePiece(tileNumber, {
                    x: x,
                    y: y,
                    startingTile: cellId,
                    currentTile: cellId,
                    alive: true
                });

            board.tiles[cellId] = {
                backgroundColor: (tileColorFlag = !tileColorFlag) ? 'white' : 'black',
                piece: piece ? piece.type + cellId : false,
                x: x,
                y: y
            };

            if (piece) {
                board.pieces[piece.type + cellId] = piece;
            }
            x += boardSize / 8;
        }
        x = 0;
        y += boardSize / 8;
    }

    return {board: board};
}

export {dropPiece, activePiece, defaultBoard}
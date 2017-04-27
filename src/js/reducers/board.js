import {determinePiece, getMoveSet} from '../util/boardUtils';
import u from 'updeep';

let yCoordDeadPiece = 0;

const boardReducer = (state={}, action) => {

    switch(action.type) {
        case 'MOVE_PIECE':
            let move = movePiece(
                    state,
                    state.activePiece,
                    action.payload.tile,
                    action.payload.cell
                );

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

const movePiece = (state, piece, tile, cell, moveCheck = true) => {
    // TODO add castling case
    if (tile.piece && new RegExp(state.currentPlayer).test(tile.piece)) {
        return false;
    }

    let moveSet = piece.moveSet,
        move = {
            pieces: {},
            tiles: {},
            currentPlayer: state.currentPlayer === 'white' ? 'black' : 'white'
        };

    const validMove = (state, piece, destinationCell, moveVector) => {

        let destVector = [Number(cell[1]), cell[0].charCodeAt() - 97],
            currLocationVector = [Number(piece.currentTile[1]), piece.currentTile[0].charCodeAt() - 97],
            pieceType = piece.type[5];

        switch(pieceType) {
            case 'p':
                // Opening move (2 tiles forward)
                if (piece.moveSet.sMove && moveVector[1] === 0) {
                    if (moveVector[0] * 2 + currLocationVector[0] === destVector[0]
                        && moveVector[1] + currLocationVector[1] === destVector[1]) {
                        return !containsPiece(
                            state,
                            resolveBoardCell(
                                moveVector[1] + currLocationVector[1],
                                moveVector[0] * 2 + currLocationVector[0]
                            )
                        ) ? [true,  {sMove: false}] : [false, null];
                    }
                }

                const pawnAttack = (vector) => {

                    let hasOpposingPiece = containsPiece(
                        state,
                        resolveBoardCell(
                            vector[1] + currLocationVector[1],
                            vector[0] + currLocationVector[0]
                        ),
                        piece.type.includes('white') ? 'black' : 'white'
                    );

                    return vector[0] + currLocationVector[0] === destVector[0]
                        && vector[1] + currLocationVector[1] === destVector[1]
                        && hasOpposingPiece ? true : false;
                }
                // Allow diagonal movement if tile has opposing piece
                if (piece.moveSet.sMoves.some(pawnAttack)) {
                    return [true, null];
                }
                // Pawns can't attack via a forward move, block move
                if (containsPiece(
                    state,
                    resolveBoardCell(
                        moveVector[1] + currLocationVector[1],
                        moveVector[0] + currLocationVector[0]
                    )
                )) {
                    return [false, null];
                }

                break;
            case 'k':
                // TODO castling
                break;
        }

        return moveVector[0] + currLocationVector[0] === destVector[0]
            && moveVector[1] + currLocationVector[1] === destVector[1]
            && checkPath(state, currLocationVector, destVector, pieceType)
            ? [true, null] : [false, null];
    }


    for(let i = 0; i < moveSet.moves.length; i++) {
        let moveVector = moveSet.moves[i];
        for(let j = 1; j <= moveSet.numMoves; j++) {
            let [isValid, sMove] = validMove(state, piece, cell, [moveVector[0] * j, moveVector[1] * j]);

            if (isValid) {
                if (tile.piece) {
                    move.pieces[tile.piece] = {
                        alive: false,
                        x: state.boardSize,
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
                if (sMove) {
                    move.pieces[piece.type + piece.startingTile].moveSet = sMove
                }

                if (moveCheck) {
                    return !inCheck(state, move) ? move : false;
                } else {
                    return move;
                }

            }
        }
    }
    return false;
}

const checkPath = (state, originVector, destVector, pieceType) => {

    if (!/[rqb]/.test(pieceType)){
        return true;
    }

    const getDirection = (origin, dest) => {
        return origin < dest ? 1 : origin > dest ? -1 : 0;
    }

    // Determine direction
    let yDir = getDirection(originVector[0], destVector[0]),
        xDir = getDirection(originVector[1], destVector[1]);

    const nextTile = () => {
        destVector[0] -= yDir;
        destVector[1] -= xDir;
    }

    nextTile();

    while(destVector[0] !== originVector[0] || destVector[1] !== originVector[1]) {
        if (containsPiece(state, resolveBoardCell(destVector[1], destVector[0]))) {
            return false;
        } else {
            nextTile();
        }
    }

    return true;
}

const inCheck = (state, tempMove) => {

    let stateClone = u(tempMove, JSON.parse(JSON.stringify(state))),
        tile,
        cell;

    // Get king location for current player
    if (state.currentPlayer === 'black') {
        cell = stateClone.pieces.blackke8.currentTile;
        tile = stateClone.tiles[cell];
    } else {
        cell = stateClone.pieces.whiteke1.currentTile;
        tile = stateClone.tiles[cell];
    }

    return Object
        .keys(stateClone.pieces)
        .map(key => stateClone.pieces[key])
        .some((piece) => {
            if (piece.type.includes(state.currentPlayer)) {
                return false;
            }
            return movePiece(stateClone, piece, tile, cell, false) ? true : false;
        });
}

const resolveBoardCell = (colNumber, rowNumber) => {
    return String.fromCharCode(97 + colNumber) + rowNumber;
}

const containsPiece = (state, boardCell, enemy = false) => {

    const validBoardCell = function(boardCell) {
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

    let tilePiece = state.tiles[boardCell].piece;

    if (enemy && tilePiece) {
        return tilePiece.includes(enemy);
    } else {
        return tilePiece ? true : false;
    }

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
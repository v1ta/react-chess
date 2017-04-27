const determinePiece = (tileNumber, extras = {}) => {
    // Determine piece type
    const namedPiece = (tileNumber) => {
        switch (tileNumber % 8) {
            // Rook
            case 0: case 7:
                return 'r';
            // Knight
            case 1: case 6:
                return 'n';
            // Bishop
            case 2: case 5:
                return 'b';
            // Queen
            case 3:
                return 'q';
            // King
            case 4:
                return 'k'
            default:
                return false;
        }
    }

    const createPiece = (type, extras = {}) => {
        return Object.assign({
            type: type,
            moveSet: getMoveSet(type)
        }, extras);
    }

    // Determine piece faction
    if (tileNumber <= 15) {
        return createPiece(tileNumber <= 7 ? 'white' + namedPiece(tileNumber) : 'white' + 'p', extras);
    } else if (tileNumber >= 48) {
        return createPiece(tileNumber >= 56 ? 'black' + namedPiece(tileNumber) : 'black' + 'p', extras);
    } else {
        return false;
    }
}

const getMoveSet = (piece) => {

    const moveSet = (moves, numMoves, extras = {}) => {
        return Object.assign({
            moves: moves,
            numMoves: numMoves
        }, extras);
    }

    switch(piece[5]) {
        case 'p':
            let factionFlag = /black/.test(piece);

            return  moveSet(factionFlag ? [[-1, 0]] : [[1, 0]], 1, {
                sMoves : factionFlag ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]],
                sMove: true
            });
        case 'b':
            return moveSet([[1, 1], [-1, 1], [-1, -1], [1, -1]], 7);
        case 'k':
            return moveSet([[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]], 1, {
                sMoves: [[0, 1], [0, -1]],
                sMove: true
            });
        case 'n':
            return moveSet([[2, 1], [-2, 1], [-2, -1], [2, -1], [1, 2], [-1, 2], [-1, -2], [1, -2]], 1);
        case 'q':
            return moveSet([[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]], 7);
        case 'r':
            return moveSet([[1, 0], [0, 1], [-1, 0], [0, -1]], 7);
    }
}

export {determinePiece, getMoveSet}
function determinePiece(tileNumber) {

    // Determine piece type
    var namedPiece = (tileNumber) => {
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
            case 3:
            // Queen
                return 'q';
            case 4:
            // King
                return 'k'
            default:
                return false;
        }
    }

    var createPiece = (type) => {
        return {
            type: type,
            moveSet: getMoveSet(type),
            x: -1,
            y: -1
        }
    }

    // Determine piece faction
    if (tileNumber <= 15) {
        let type = tileNumber <=7 ? 'white' + namedPiece(tileNumber) : 'white' + 'p';
        return createPiece(type)
    } else if (tileNumber >= 48) {
        let type = tileNumber >= 56 ? 'black' + namedPiece(tileNumber) : 'black' + 'p';
        return createPiece(type)
    } else {
        return false;
    }
}

function getMoveSet(piece) {

    switch(piece[5]) {
        case 'p':
            let moveSet = {
                moves: [[1, 0]],
                sMoves: [[1, -1], [1, 1]],
                numMoves: 1,
                sMove: true,
            }
            if (/black/.test(piece)) {
                moveSet.moves = [[-1, 0]];
                moveSet.sMoves = [[-1, -1], [-1, 1]];
            }
            return moveSet;

        case 'b':
            return {
                moves: [[1, 1], [-1, 1], [-1, -1], [1, -1]],
                numMoves: 7
            }
        case 'k':
            return {
                moves: [[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]],
                sMoves: [[0, 1], [0, -1]],
                numMoves: 1,
                sMove: true
            }
        case 'n':
            return {
                moves: [[2, 1], [-2, 1], [-2, -1], [2, -1], [1, 2], [-1, 2], [-1, -2], [1, -2]],
                numMoves: 1
            }
        case 'q':
            return {
                moves: [[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]],
                numMoves: 7
            }
        case 'r':
            return {
                moves: [[1, 0], [0, 1], [-1, 0], [0, -1]],
                numMoves: 7
            }
    }
}

export {determinePiece, getMoveSet}
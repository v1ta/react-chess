import {determinePiece, getMoveSet} from '../util/boardUtils';

export default () => {
    const board = {};

    for (let i = 0; i < 8; i++) {
        let tileColorFlag = i % 2 == 0;

        for (let j = 0; j < 8; j++) {
            let cellId = String.fromCharCode(97 + j) + (i + 1),
                tileNumber = i * 8 + j;

            board[cellId] = {
                backgroundColor: (tileColorFlag = !tileColorFlag) ? 'white' : 'black',
                piece: determinePiece(tileNumber)
            }
        }
    }

    return board;
}
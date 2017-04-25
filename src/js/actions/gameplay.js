function dropPiece(tile, cell) {
    return {
        type: 'MOVE_PIECE',
        payload: {
            cell: cell,
            tile: tile
        }
    }
};

function activePiece(piece) {
    return {
        type: 'ACTIVE_PIECE',
        payload: piece
    }
}

export {dropPiece, activePiece}
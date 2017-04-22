function dropPiece(tile) {
    return {
        type: 'MOVE_PIECE',
        payload: tile
    }
};

export {dropPiece}
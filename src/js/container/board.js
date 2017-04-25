import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import {dropPiece, activePiece, setLocation} from '../actions/gameplay';
import {bindActionCreators} from 'redux';
import Tile from '../components/Tile';
import Piece from '../components/Piece'
import $ from 'jquery';
require('../../scss/style.scss');

const width = $(document).width(),
    height = $(document).height(),
    boardSize = width < height ? width : height;

class Board extends Component {

    createBoard() {
        const board = {
            tiles: [],
            pieces: []
        };

        let x = 0,
            y = 0,
            i = 0,
            row = [];

        this.props.board.boardSize = boardSize;

        for(var cell in this.props.board.tiles) {
            let tile = this.props.board.tiles[cell],
                cellId = cell;
                tile.x = x;
                tile.y = y;

            row.push(<Tile
                key={cellId}
                style={{backgroundColor: tile.backgroundColor}}
                dropPiece={() => this.props.dropPiece(tile, cellId)}
            />)

            if (tile.piece) {
                let pieceKey = tile.piece,
                    piece = this.props.board.pieces[pieceKey];
                    piece.x = x;
                    piece.y = y;
                    piece.startingTile = cell;
                    piece.currentTile = cell;
                    piece.alive = true;

                board.pieces.push(<Piece
                    key={pieceKey}
                    style={{
                        height: boardSize / 8,
                        width: boardSize / 8
                    }}
                    piece={piece}
                    activePiece={() => this.props.activePiece(piece)}
                />);
            }
            x += boardSize / 8;

            if (++i >= 8) {
                board.tiles.push(React.createElement(
                    'div',
                    { className: 'board-row', key: board.tiles.length },
                    row)
                )
                i = 0;
                row = [];
                y += boardSize / 8;
                x = 0;
            }

        }
        return board;
    }

    render(){
        let gameBoard = this.createBoard();
        return(
            <div className="board" style={{width: boardSize, height:boardSize}}>
                {gameBoard.tiles}
                {gameBoard.pieces}
           </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        board: state.board
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        dropPiece: dropPiece,
        activePiece: activePiece
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Board);
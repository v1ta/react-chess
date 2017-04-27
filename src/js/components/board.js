import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import {defaultBoard} from '../actions/gameplay';
import Tile from '../containers/Tile';
import Piece from '../containers/Piece'
require('../../scss/style.scss');

class Board extends Component {

    constructor(props){
        super(props)
        this.gameBoard = this.createBoard();
    }

    createBoard() {

        let i = 0,
            row = [],
            defBoard = defaultBoard().board;

        const board = {
            tiles: [],
            pieces: [],
            boardSize: defBoard.boardSize
        };

        for(var cell in defBoard.tiles) {
            let tile = defBoard.tiles[cell],
                cellId = cell;

            row.push(<Tile
                key={cellId}
                cellId={cellId}
                style={{backgroundColor: tile.backgroundColor}}
            />)

            if (tile.piece) {
                let pieceKey = tile.piece,
                    piece = defBoard.pieces[pieceKey];

                board.pieces.push(<Piece
                    key={pieceKey}
                    pieceKey={pieceKey}
                    style={{
                        height: board.boardSize / 8,
                        width: board.boardSize / 8
                    }}
                />);
            }

            if (++i >= 8) {
                board.tiles.push(React.createElement(
                    'div',
                    { className: 'board-row', key: board.tiles.length },
                    row)
                )
                i = 0;
                row = [];
            }

        }
        return board;
    }

    render(){
        return(
            <div
                className="board"
                style={{
                    width: this.gameBoard.boardSize,
                    height: this.gameBoard.boardSize
                }}
            >
                {this.gameBoard.tiles}
                {this.gameBoard.pieces}
           </div>
        );
    }
}

export default Board;
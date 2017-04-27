import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import {defaultBoard} from '../actions/gameplay';
import Tile from '../containers/Tile';
import Piece from '../containers/Piece'
import $ from 'jquery';
require('../../scss/style.scss');

const width = $(document).width(),
    height = $(document).height(),
    boardSize = width < height ? width : height;

class Board extends Component {

    constructor(props){
        super(props)

        this.gameBoard = this.createBoard();
    }

    createBoard() {

        const board = {
            tiles: [],
            pieces: []
        };

        let i = 0,
            row = [],
            defBoard = defaultBoard().board;

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
                        height: boardSize / 8,
                        width: boardSize / 8
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
            <div className="board" style={{width: boardSize, height:boardSize}}>
                {this.gameBoard.tiles}
                {this.gameBoard.pieces}
           </div>
        );
    }
}

export default Board;
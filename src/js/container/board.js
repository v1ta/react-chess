import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import {dropPiece} from '../actions/gameplay';
import {bindActionCreators} from 'redux';
import Tile from '../components/Tile';
import Piece from '../components/Piece'
import $ from 'jquery';
require('../../scss/style.scss');

const width = $(document).width(),
    height = $(document).height(),
    boardSize = width < height ? width : height;

class Board extends Component {
    constructor(props){
        super(props);

        this.board = this.createBoard();
    }

    createBoard() {
        const board = {
            tiles: [],
            pieces: []
        }
        let x = 0,
            y = 0,
            i = 0,
            row = [];

        for(var cell in this.props.board) {
            let tile = this.props.board[cell];

            tile.x = x;
            tile.y = y;

            row.push(<Tile
                key={cell}
                style={{backgroundColor: tile.backgroundColor}}
                dropPiece={() => this.props.dropPiece(tile)}
            />)

            if (tile.piece) {
                let type = tile.piece.type;

                tile.piece.x = x;
                tile.piece.y = y;

                board.pieces.push(<Piece
                    key={type+cell}
                    style={{
                        height: boardSize / 8,
                        width: boardSize / 8
                    }}
                    piece={type}
                    pos = {{
                        x: tile.piece.x,
                        y: tile.piece.y
                    }}
                />);
            }
            x += boardSize / 8;

            if (++i >= 8) {
                board.tiles.push(React.createElement('div', { className: 'board-row', key: board.tiles.length }, row))
                i = 0;
                row = [];
                y += boardSize / 8;
                x = 0;
            }

        }

        board.tiles = board.tiles.reverse();

        return board;

    }

    dropPiece() {
        // TODO
    }

    render(){
        return(
            <div className="board" style={{width: boardSize, height:boardSize}}>
                {this.board.tiles}
                {this.board.pieces}
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
    return bindActionCreators({dropPiece: dropPiece}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Board);
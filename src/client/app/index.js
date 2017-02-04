import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import '../css/style.css';

const width = $(document).width();
const height = $(document).height();
const boardSize = width < height ? width : height;

class Piece extends React.Component {
    constructor(props){
        super();
    }

    render(){
        return(
            <img src={'assets/' + this.props.piece + '.png'} style={this.props.style}/>
        );
    }
}

class Tile extends React.Component {
    constructor(props){
        super();
    }
    
    render() {
        let piece = determinePiece(this.props.tileNum);
        return (
            <div className="tile" style={this.props.style}>
                { piece ? (
                    <Piece
                        style={{
                            height: boardSize / 8,
                            width: boardSize / 8
                        }}
                        piece={piece}
                    />) : ''
                }
            </div>
        );
    }
}

class Board extends React.Component {
    constructor(){
        super();
    }

    render(){
        const board = [];
        
        for (let i = 0; i < 8; i++) {
            let flag = i % 2 == 0;
            const row = [];
            for (let j = 0; j < 8; j++) {
                row.push(<Tile 
                    key={i * 8 + j} 
                    style={{ backgroundColor: (flag = !flag) ? 'white' : 'black'}}
                    tileNum={i * 8 + j}
                />);
            }
            board.push(React.createElement('div', { className: 'board-row', key: -(i + 1) }, row));
        }
        

        return(
            <div className="board" style={this.props.style}>
               {board}
           </div>
        );
    }
}

ReactDOM.render(
    <Board 
        style={{
            height: boardSize,
            width: boardSize 
        }}
    />,
    document.getElementById('container')
);

function determinePiece(tileNumber) {
    var namedPiece = function(tileNumber) {
        switch (tileNumber % 8) {
            case 0: case 7:
                return 'r';
            case 1: case 6:
                return 'n';
            case 2: case 5:
                return 'b';
            case 3:
                return 'q';
            case 4:
                return 'k'
            default: 
                return false;
        }
    }

    if (tileNumber <= 15) {
        return tileNumber <=7 ? 'black' + namedPiece(tileNumber) : 'black' + 'p';
    } else if (tileNumber >= 48) {
        return tileNumber >= 56 ? 'white' + namedPiece(tileNumber) : 'white' + 'p';
    } else {
        return false;
    }
}
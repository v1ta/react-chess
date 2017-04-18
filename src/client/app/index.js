import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const width = $(document).width();
const height = $(document).height();
const boardSize = width < height ? width : height;

class Piece extends React.Component {
    constructor(props){
        super();

        this.state = {
            rel: {x: 0, y: 0},
            pos: props.pos,
            moveSet: props.moveSet
        }

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.validMove = this.validMove.bind(this);

    }

    onMouseDown(event) {

        // Obtain position of click
        const ref = this.getRef();
        const body = document.body;
        const box = ref.getBoundingClientRect();

        this.setState({
            rel: {
                x: event.pageX - (box.left + body.scrollLeft - body.clientLeft),
                y: event.pageY - (box.top + body.scrollTop - body.clientTop)
            },
            origin: this.state.pos
        });

        $('.droppableContainer').css({'z-index': '2'});
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);

        event.preventDefault();
    }

    onMouseMove(event){

        this.setState({
            pos:{
                x: event.pageX - this.state.rel.x,
                y: event.pageY - this.state.rel.y
            }
        });

        event.preventDefault();
    }

    onMouseUp(event) {

        if (this.validMove(this.state.pos)) {
            this.setState({ pos: this.state.origin });
        }

        $('.droppableContainer').css({'z-index': '0'});

        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        event.preventDefault();
    }

    validMove(pos) {

        //TODO
        let moveSet = this.state.moveSet;

        if (moveSet.sMove) {

        }

        return true;
    }

    getRef(){
        return ReactDOM.findDOMNode(this.refs[this.props.piece]);
    }

    render(){
        return(
            <div
                onMouseDown={this.onMouseDown}
                ref={this.props.piece}
                style={{
                    position: 'absolute',
                    left: this.state.pos.x,
                    top: this.state.pos.y,
                    zIndex: 1
                }}>
                <img
                    src={'assets/' + this.props.piece + '.png'}
                    style={this.props.style}
                />
            </div>
        );
    }
}

class Tile extends React.Component {
    constructor(props){
        super();
        this.state = {
            piece: determinePiece(props.tileNum),
            tileNum: props.tileNum
        }
    }

    render() {
        return (
            <div className="tile" style={this.props.style}>
                <div className="droppableContainer" onMouseOver={()=>{/* TODO */}}/>
            </div>
        );
    }
}

class Board extends React.Component {
    constructor(){
        super();
    }

    render(){
        const board = [],
            pieces = [];
        let coords = {x:0,y:0}

        for (let i = 0; i < 8; i++) {
            let flag = i % 2 == 0,
                tileNum,
                piece;

            const row = [];

            for (let j = 0; j < 8; j++) {
                tileNum = i * 8 + j;
                row.push(<Tile
                    key={tileNum}
                    style={{ backgroundColor: (flag = !flag) ? 'white' : 'black'}}
                    tileNum={tileNum}
                />);

                piece = determinePiece(tileNum);
                if (piece){
                    pieces.push(<Piece
                        key={tileNum}
                        style={{
                            height: boardSize / 8,
                            width: boardSize / 8
                        }}
                        piece={piece}
                        onMove={this.move}
                        pos = {{
                            x: coords.x,
                            y: coords.y
                        }}
                        moveSet = {getMoveSet(piece)}
                    />)
                }
                coords.x += boardSize / 8;
            }
            board.push(React.createElement('div', { className: 'board-row', key: -(i + 1) }, row));
            coords.y += boardSize / 8;
            coords.x = 0;

        }

        return(
            <div className="board" style={this.props.style}>
               {board}
               {pieces}
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

    // Determine type of piece
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

    // Determine piece faction
    if (tileNumber <= 15) {
        return tileNumber <=7 ? 'black' + namedPiece(tileNumber) : 'black' + 'p';
    } else if (tileNumber >= 48) {
        return tileNumber >= 56 ? 'white' + namedPiece(tileNumber) : 'white' + 'p';
    } else {
        return false;
    }
}

function getMoveSet(piece) {

    switch(piece[5]) {
        case 'p':
            return {
                moves: [[1, 0]],
                sMoves: [[-1, -1], [-1, 1]],
                numMoves: 1,
                sMove: true,
            }
        case 'b':
            return {
                moves: [[1, 1], [-1, 1], [-1, -1], [1, -1]],
                numMoves: 7
            }
        case 'k':
            return {
                moves: [[1, 1], [-1, 1], [-1, ,-1], [1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]],
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
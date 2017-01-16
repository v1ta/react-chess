import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import '../css/style.css';

const width = $(document).width();
const height = $(document).height();
const boardSize = width < height ? width : height;

class Tile extends React.Component {
    constructor(){
        super();
    }

    render() {
        return (
            <div className="tile" style={this.props.style}></div>
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
                row.push(<Tile key={i * 8 + j} style={{
                    backgroundColor: (flag = !flag) ? 'white' : 'black'
                }}/>);
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
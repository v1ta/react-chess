import React, {Component} from 'react';

class Tile extends Component {
    render() {
        return (
            <div className="tile" style={this.props.style}>
                <div className="droppableContainer" onMouseUp={this.props.dropPiece}/>
            </div>
        );
    }
}

export default Tile;
import React, {Component} from 'react';
import {getTile} from '../reducers/board';
import {dropPiece} from '../actions/gameplay';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Tile extends Component {
    render() {
        return (
            <div className="tile" style={this.props.style}>
                <div
                    className="droppableContainer"
                    onMouseUp={() => {this.props.dropPiece(this.props.tile, this.props.cellId)}}
                />
            </div>
        );
    }
}

const mapStateToDispatch = (dispatch) => {
    return bindActionCreators({
        dropPiece: dropPiece
    }, dispatch);
}

const mapStateToProps = (state, ownProps) => {
    return {
        tile: getTile(state, ownProps.cellId)
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(Tile);
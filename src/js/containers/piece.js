import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {getPiece, currentPlayer} from '../reducers/board';
import {activePiece} from '../actions/gameplay';
import {bindActionCreators} from 'redux';
import $ from 'jquery';

class Piece extends Component {
    constructor(props){
        super(props);

        this.state = {
            rel: {
                x: 0,
                y: 0
            },
            pos: {
                x: props.piece.x,
                y: props.piece.y
            },
            dragging: false
        }

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

    }

    onMouseDown(event) {

        if (!new RegExp(this.props.currentPlayer).test(this.props.piece.type)) {
            return false;
        }

        // Obtain position of click
        let ref = this.getRef(),
            body = document.body,
            box = ref.getBoundingClientRect();

        // Inform store which piece is being moved
        this.props.activePiece(this.props.piece);

        // Record current location and cursor location
        this.setState({
            rel: {
                x: event.pageX - (box.left + body.scrollLeft - body.clientLeft),
                y: event.pageY - (box.top + body.scrollTop - body.clientTop)
            },
            dragging: true
        });

        // Enable tiles to recieve drop event
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

        this.setState({
            dragging: false
        });

        $('.droppableContainer').css({'z-index': '-1'});
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.validMove);

        event.preventDefault();
    }

    getRef(){
        return ReactDOM.findDOMNode(this.refs[this.props.piece.type]);
    }

    render(){

        let x, y;

        if (this.state.dragging) {
            x = this.state.pos.x;
            y = this.state.pos.y;
        } else {
            x = this.props.piece.x;
            y = this.props.piece.y;
        }

        return(
            <div
                onMouseDown={this.onMouseDown}
                ref={this.props.piece.type}
                style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    zIndex: 1
                }}>
                <img
                    src={'assets/' + this.props.piece.type + '.png'}
                    style={this.props.style}
                />
            </div>
        );
    }
}

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        activePiece: activePiece
    }, dispatch);
}

const mapStateToProps = (state, ownProps) => {
    return {
        piece: getPiece(state, ownProps.pieceKey),
        currentPlayer: currentPlayer(state)
    }
}

export default connect(mapStateToProps, matchDispatchToProps)(Piece);
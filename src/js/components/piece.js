import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class Piece extends Component {
    constructor(props){
        super(props);

        this.state = {
            rel: {x: 0, y: 0},
            pos: props.pos,
            dragging: false
        }

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

    }

    onMouseDown(event) {

        // Obtain position of click
        let ref = this.getRef(),
            body = document.body,
            box = ref.getBoundingClientRect();

        // Record current location and cursor location
        this.setState({
            rel: {
                x: event.pageX - (box.left + body.scrollLeft - body.clientLeft),
                y: event.pageY - (box.top + body.scrollTop - body.clientTop)
            },
            origin: this.state.pos,
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
            pos: this.state.origin,
            dragging: false
        });

        $('.droppableContainer').css({'z-index': '-1'});

        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.validMove);

        event.preventDefault();
    }

    getRef(){
        return ReactDOM.findDOMNode(this.refs[this.props.piece]);
    }

    render(){
        let x, y;

        if (this.state.dragging) {
            x = this.state.pos.x;
            y = this.state.pos.y;
        } else {
            x = this.props.pos.x;
            y = this.props.pos.y;
        }

        return(
            <div
                onMouseDown={this.onMouseDown}
                ref={this.props.piece}
                style={{
                    position: 'absolute',
                    left: x,
                    top: y,
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

export default Piece;
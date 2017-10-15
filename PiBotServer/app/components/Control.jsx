import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import uuid from 'uuid';

import FaMinusCircle from 'react-icons/lib/fa/minus-circle';
import FaPlusCircle from 'react-icons/lib/fa/plus-circle';
import FaAngleDoubleUp from 'react-icons/lib/fa/angle-double-up';
import FaAngleDoubleDown from 'react-icons/lib/fa/angle-double-down';
import FaAngleDoubleRight from 'react-icons/lib/fa/angle-double-right';
import FaAngleDoubleLeft from 'react-icons/lib/fa/angle-double-left';

import * as actions from 'actions';

const io = require('socket.io-client');
const socket = io('');

class Control extends React.Component {
  constructor(props) {
    super(props);
  }
  handleZoomOut() {
    var {dispatch, zoomValue} = this.props;
    if (zoomValue < 200) {
      zoomValue = zoomValue + 10;
      dispatch(actions.setZoomValue(zoomValue));
    }
  }
  handleZoomIn() {
    var {dispatch, zoomValue} = this.props;
    if (zoomValue > 50) {
      zoomValue = zoomValue - 10;
      dispatch(actions.setZoomValue(zoomValue));
    }
  }
  forward() {
    socket.emit('direction', 'forward');
  }
  turnLeft() {
    socket.emit('direction', 'left');
  }
  turnRight() {
    socket.emit('direction', 'right');
  }
  backward() {
    socket.emit('direction', 'backward');
  }
  stopCar() {
    socket.emit('direction', 'stop');
  }
  camTurnLeft() {
    socket.emit('direction', 'camleft');
  }
  camTurnRight() {
    socket.emit('direction', 'camright');
  }
  render() {
    var {zoomValue} = this.props;
    return (
      <div className="fade__in">
        <div className="center__div row">
          <div className="control__left columns">
            <label>Bot</label>
            <h3 className="control">
              <FaAngleDoubleUp className="direction" onMouseDown={this.forward.bind(this)} onMouseUp={this.stopCar.bind(this)} />
            </h3>
            <h3 className="control">
              <FaAngleDoubleLeft className="direction"  onMouseDown={this.turnLeft.bind(this)} onMouseUp={this.stopCar.bind(this)}/>
              <FaAngleDoubleUp className="placeholder" />
              <FaAngleDoubleRight className="direction" onMouseDown={this.turnRight.bind(this)} onMouseUp={this.stopCar.bind(this)}/>
            </h3>
            <h3 className="control">
              <FaAngleDoubleDown className="direction"  onMouseDown={this.backward.bind(this)} onMouseUp={this.stopCar.bind(this)}/>
            </h3>
          </div>
          <div className="control__right columns">
            <label>Camera</label>
            <div>
              <h3 className="control">
                <FaAngleDoubleLeft className="direction"  onMouseDown={this.camTurnLeft.bind(this)} />
                <FaAngleDoubleUp className="placeholder" />
                <FaAngleDoubleRight className="direction" onMouseDown={this.camTurnRight.bind(this)} />
              </h3>
            </div>
            <div className="zoom__div">
              <label className="zoom">
                <FaMinusCircle className="zoom__button" onClick={this.handleZoomIn.bind(this)} />
                <span className="zoom__value">{zoomValue}</span>
                <FaPlusCircle className="zoom__button" onClick={this.handleZoomOut.bind(this)} />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return state;
  })(Control);

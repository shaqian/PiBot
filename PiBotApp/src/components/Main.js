import React, { Component} from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import io from 'socket.io-client';
import uuid from 'uuid';

import VideoView from './VideoView';
import Control from './Control';

import * as actions from '../actions';

class Main extends Component {
  componentWillMount() {
    const { socket, setSocket } = this.props;
    if (!socket.socket) {
      var websocket = io(socket.host);
      setSocket(websocket);
    }
  }

  componentWillUnmount() {
    const { socket, clearSocket, setControl, setVideoRecord } = this.props;
    socket.socket.close();
    clearSocket();
    setControl('remote');
    setVideoRecord(false);
  }

  render() {
    var { orientation } = this.props;
    return (
      <View style={styles.container}>
        <VideoView />
        {
          orientation === 'portrait' ?
          <Control /> : undefined
        }
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
};

const mapStateToProps = state => {
  return {
    orientation: state.orientation,
    socket: state.socket
  };
};

export default connect(mapStateToProps, actions)(Main);

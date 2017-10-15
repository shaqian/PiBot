import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, StyleSheet, PanResponder, Alert } from 'react-native';
import Video from 'react-native-video';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as Animatable from 'react-native-animatable';
import * as actions from '../actions';

class VideoView extends Component {
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt) => true,
      onMoveShouldSetPanResponder: (evt) => true,
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
      onPanResponderMove: this._handleResponderMove.bind(this),
    });
  }

  _handleResponderMove(evt, gestureState) {
    const { socket, direction, setDirection } = this.props;
    if(direction === null) {
      const swipeDirection = this._getSwipeDirection(gestureState);
      if (swipeDirection) {
        socket.emit('direction', swipeDirection === 'left' ? 'right': swipeDirection === 'right' ? 'left': swipeDirection );
        setDirection(swipeDirection);
      }
    }
  }

  _handlePanResponderEnd(evt, gestureState) {
    const { socket, direction, setDirection } = this.props;
    if (direction) {
      socket.emit('direction', 'stop');
      setDirection(null);
    }
  }

  _getSwipeDirection(gestureState) {
    const {dx, dy} = gestureState;
    if (Math.abs(gestureState.dx) < 60  && Math.abs(gestureState.dy) < 60) {
      return null;
    }
    if (Math.abs(gestureState.dy) < 60) {
      return (dx > 0)
        ? 'right' //SWIPE_RIGHT
        : 'left'; //SWIPE_LEFT
    } else if (Math.abs(gestureState.dx) < 60) {
      return (dy > 0)
        ? 'backward' //SWIPE_DOWN
        : 'forward'; //SWIPE_UP
    }
    return null;
  }

  _onLoad = response => {
    const { screen, setVideoSize } = this.props;

    this.setState({error: undefined});

    var { width, height } = response.naturalSize;
    if (width === "undefined" || height === "undefined")
    {
      width = 1280;
      height = 720;
    }
    setVideoSize({
      height: height * (screen.width / width),
      width: screen.width
    });
  }

  _onError = data => {
    Alert.alert(
      '',
      'Failed to load video. Error: ' + data.error.domain,
      [{text: 'OK'}]
    );
  }

  render() {
    var { direction, orientation, video } = this.props;
    // console.log(video.uri);
    var renderArrow = () => {
      var name;
      switch (direction) {
        case 'forward':
          name = "angle-double-up";
          animation = "fadeInUp";
          break;
        case 'backward':
          name = "angle-double-down";
          animation = "fadeInDown";
        break;
        case 'left':
          name = "angle-double-left";
          animation = "fadeInRight";
          break;
        case 'right':
          name = "angle-double-right";
          animation = "fadeInLeft";
          break;
        default:
          return undefined
      }
      return (
        <View style={styles.arrow}>
          <Animatable.Text animation={animation} direction="alternate">
            <FontAwesome name={name} size={
                orientation === "portrait" ? 120 : 240
              } color="rgba(255, 255, 255, 0.65)" />
          </Animatable.Text>
        </View>
      );
    }

    var renderRecord = () => {
      if (video.record) {
        return (
          <View style={styles.record}>
            <MaterialCommunityIcons name='record-rec' size={
                orientation === "portrait" ? 50 : 80
              } color="rgba(244, 67, 54, 0.75)" />
          </View>
        )
      }
    }

    return (
      <View {...this._panResponder.panHandlers}
        style={
          orientation === "landscape" ?
          {flex: 1} :
          {
            width: video.size.width,
            height: video.size.height,
          }
        }>
        <Video
          ref={ref => this.player = ref}
          source={{uri: video.uri}}
          paused={false}
          rate={1.0}
          volume={1.0}
          muted={video.muted}
          resizeMode={"cover"}
          style={
            orientation === "landscape" ?
              styles.landscape
              :
              {
                position: 'absolute',
                width: video.size.width,
                height: video.size.height,
              }
            }
          onLoad={this._onLoad}
          onError={this._onError}
        />
        {renderArrow()}
        {renderRecord()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  landscape: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  arrow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'transparent'
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  record: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor:'transparent'
  },
});

const mapStateToProps = state => {
  return {
    screen: state.screen,
    orientation: state.orientation,
    video: state.video,
    direction: state.direction,
    socket: state.socket.socket
  };
};

export default connect(mapStateToProps, actions)(VideoView);

import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import Video from 'react-native-video';

import * as actions from '../actions';
import * as style from '../style';

class VideoList extends Component {
  state = {
    play: false,
    index: null,
    recordingUri: '',
    width: 0,
    height: 0
  }

  componentWillMount() {
    const { socket, setRecordings, setVideoMuted } = this.props;
    if (Platform.OS === 'android') {
      setVideoMuted(true);
    }
    if (socket) {
      socket.emit('recordedVideos');
      socket.on('recordedVideos', (recordings) => {
        setRecordings(recordings);
      });
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      this.props.setVideoMuted(false);
    }
  }

  _onLoad = response => {
    const { width, height } = response.naturalSize;
    this.setState({ height, width });
  }

  _onPress(index, recording) {
    const { video } = this.props;
    if( index === this.state.index) {
      this.setState({ play: !this.state.play });
    } else {
      this.setState({ index });
      this.setState({ recordingUri: video.recordingsPath + recording});
      this.setState({ play: true });
    }
  }

  render() {
    var _renderVideos = () => {
      const { recordingUri } = this.state;
      const { recordings, video, screen } = this.props;
      if(recordings) {
        return recordings.map((recording, index) =>
          <View key={index} style={styles.videoContainer}>
            <View>
              <TouchableOpacity onPress={() => this._onPress(index, recording)}>
                <Text style={styles.text} >{recording.split('.')[0]}</Text>
              </TouchableOpacity>
            </View>
            {
              index === this.state.index && this.state.play === true ?
              <View style={styles.video}>
                <Video
                  ref={ref => this.player = ref}
                  source={{uri: this.state.recordingUri}}
                  paused={false}
                  rate={1.0}
                  volume={1.0}
                  muted={false}
                  resizeMode={"contain"}
                  style={{
                    width: screen.width - 40,
                    height: this.state.height * (screen.width - 40) / this.state.width
                  }}
                  onLoad={this._onLoad}
                />
              </View> : undefined
            }
          </View>
        );
      } else {
        return <Text style={{...styles.text, padding: 10}} >No video</Text>;
      }
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          {_renderVideos()}
          <View style={styles.bottom} />
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: style.lightGrey,
  },
  bottom: {
    paddingTop: 10
  },
  text: {
    fontSize: 16,
    margin: 3,
    color: style.darkGrey,
    fontFamily: style.font,
  },
  video: {
    paddingTop: 5,
  },
  videoContainer: {
    flex:1,
    alignItems: 'center',
    padding: 8,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 3,
    // shadowOpacity: 0.15,
    // shadowRadius: 1,
    // shadowColor: 'black',
    // shadowOffset: { height: 1, width: 0 },
  },
};

const mapStateToProps = state => {
  return {
    recordings: state.recordings,
    socket: state.socket.socket,
    video: state.video,
    screen: state.screen
  };
};

export default connect(mapStateToProps, actions)(VideoList);

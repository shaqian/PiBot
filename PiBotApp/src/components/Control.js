import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Slider from "react-native-slider";
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import * as actions from '../actions';
import * as style from '../style';

import RemoteControl from './RemoteControl';
import AudioControl from './AudioControl';
import MusicList from './MusicList';

class Control extends Component {
  _record() {
    const { record, setVideoRecord, socket } = this.props;
    socket.emit('record', !record);
    setVideoRecord(!record);
  }

  _getMusic() {
    const { socket, setMusic, setControl } = this.props;
    if (socket) {
      socket.emit('refreshMusicFiles');
      socket.on('refreshMusicFiles', (musicFiles) => {
        setMusic(musicFiles);
      });
    }
    setControl('music');
  }

  render() {
    const { control, record, setControl, setVideoRecord } = this.props;
    const show = {flex: 1}, hide = {height: 0, width: 0};
    switch (control) {
      case 'audio':
        audio = show;
        remote = hide;
        music = hide;
        break;
      case 'music':
        music = show;
        audio = hide;
        remote = hide;
        break;
      default:
        remote = show;
        audio = hide;
        music = hide;
    }
    return (
      <View style={styles.container}>
        <View style={styles.middleContainer}>
          <TouchableOpacity onPress={() => setControl('remote')}>
            <Feather name={'sliders'} size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setControl('audio')}>
            <MaterialIcons name={'keyboard-voice'} size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._record.bind(this)}>
            <Feather name={'video'} size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._getMusic.bind(this)}>
            <Feather name={'music'} size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={remote}>
          <RemoteControl />
        </View>
        <View style={audio}>
          <AudioControl />
        </View>
        <View style={music}>
          <MusicList />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style.lightGrey,
  },
  middleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 45,
    backgroundColor: style.blue,
  },
});

const mapStateToProps = state => {
  return {
    socket: state.socket.socket,
    control: state.control,
    record: state.video.record,
    music: state.music
  };
};

export default connect(mapStateToProps, actions)(Control);

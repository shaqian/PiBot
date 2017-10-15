import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import * as actions from '../actions';
import * as style from '../style';

class MusicList extends Component {
  _onPress(music) {
    const { socket } = this.props;
    if (socket) {
      socket.emit('music', music);
    }
  }

  render() {
    var _renderMusic = () => {
      const { musicFiles, screen } = this.props;
      if(musicFiles) {
        return musicFiles.map((music, index) =>
          <View key={index} style={styles.thumbnailContainer}>
            <View>
              <TouchableOpacity onPress={() => this._onPress(music)}>
                <Text style={styles.text} >{music.split('.')[0]}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        return <Text style={{...styles.text, padding: 10}} >No music</Text>;
      }
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          {_renderMusic()}
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
  thumbnailContainer: {
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
    socket: state.socket.socket,
    musicFiles: state.musicFiles
  };
};

export default connect(mapStateToProps, actions)(MusicList);

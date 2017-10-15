import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import * as actions from '../actions';
import * as style from '../style';

import AudioInput from './AudioInput';

class AudioControl extends Component {
  render() {
    const { control } = this.props;
    return (
      <View style={styles.container}>
        {
          control === 'audio' ?
            <AudioInput />
          : undefined
        }
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: style.lightGrey,
  },
}

const mapStateToProps = state => {
  return {
    control: state.control
  };
};

export default connect(mapStateToProps, actions)(AudioControl);

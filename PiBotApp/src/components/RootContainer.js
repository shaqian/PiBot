import React, {Component} from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native'

import Navigator from './Navigator';
import * as actions from '../actions';

class RootContainer extends Component {
  _updateDimensions(event) {
    const { screen, orientation, setScreen, setOrientation } = this.props;
    const { height, width } = event.nativeEvent.layout;
    if ((orientation !== 'portrait') || (orientation === 'portrait' && width > screen.width)) {
      setScreen({ height, width });
      setOrientation(height > width ? 'portrait' : 'landscape');
    }
  }

  render() {
    return (
      <View style={{flex: 1}} onLayout={this._updateDimensions.bind(this)}>
        <Navigator screenProps={this.props.orientation}/>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    screen: state.screen,
    orientation: state.orientation,
  };
};

export default connect(mapStateToProps, actions)(RootContainer);

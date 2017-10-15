import React, { Component } from 'react';
import { View, Switch, Text, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import { connect } from 'react-redux';
import Slider from "react-native-slider";

import * as actions from '../actions';
import * as style from '../style';

const blue = style.blue;
const Space = () => <View style={styles.space} />;
const Space2 = () => <View style={styles.space2} />;
const Img = (props) => <Image source={props.src} style={styles.image} />;

class RemoteControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: '',
      humidity: '',
      ac: false,
      fan: false,
      speaker: 0,
      camera: 0,
    }
    this.socket = this.props.socket;
    this.socket.on('roomTemp', this._setTemp.bind(this));
    this.socket.on('roomHumidity', this._setHumidity.bind(this));
  }

  _acOnOff(ac) {
    this.setState({ ac });
    this.socket.emit('ac', ac);
  }

  _fanOnOff(fan) {
    this.setState({ fan });
    this.socket.emit('fan', fan);
  }

  _speakerChange(speaker) {
    this.setState({ speaker });
    this.socket.emit('speaker', speaker);
  }

  _cameraChange(camera) {
    this.setState({ camera });
    this.socket.emit('camera', 0 - camera);
  }

  _setTemp(temp) {
    this.setState({temp});
  }

  _setHumidity(humidity) {
    this.setState({humidity});
  }

  _update() {
    this.socket.emit('roomTemp');
    this.socket.emit('roomHumidity');
  }

  componentDidMount() {
    this._update();
    this.interval = setInterval(() => this._update(), 30*1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <Space />
          <View style={styles.box}>
            <Img src={require('../icons/thermometer.png')} />
            <Space2 />
            <View style={styles.text}>
              <Text style={styles.digit} ref={(ref) => this.temp = ref}>{this.state.temp}</Text>
              <Text style={styles.unit}>℃</Text>
            </View>
          </View>
          <Space />
          <View style={styles.box}>
            <Img src={require('../icons/air-conditioner.png')} />
            <Space2 />
            <Switch value={this.state.ac} onValueChange={this._acOnOff.bind(this)} />
          </View>
          <Space />
        </View>
        <View style={styles.row}>
          <Space />
          <View style={styles.box}>
            <Img src={require('../icons/drop.png')} />
            <Space2 />
            <View style={styles.text}>
              <Text style={styles.digit}>{this.state.humidity}</Text>
              <Text style={styles.unit}>%</Text>
            </View>
          </View>
          <Space />
          <View style={styles.box}>
            <Img src={require('../icons/fan.png')} />
            <Space2 />
            <Switch value={this.state.fan} onValueChange={this._fanOnOff.bind(this)} />
          </View>
          <Space />
        </View>
        <View style={styles.row}>
          <Space />
          <View style={{...styles.box, flex: 2.25}}>
            <Img src={require('../icons/speaker.png')} />
            <View style={styles.slider}>
              <Slider
                minimumTrackTintColor={blue}
                maximumTrackTintColor={style.lightGrey}
                minimumValue={0}
                maximumValue={100}
                value={this.state.speaker}
                onSlidingComplete={this._speakerChange.bind(this)}
                step={5}
                thumbTintColor={blue}
              />
            </View>
          </View>
          <Space />
        </View>
        <View style={styles.row}>
          <Space />
          <View style={{...styles.box, flex: 2.25}}>
            <Img src={require('../icons/camera.png')} />
            <View style={styles.slider}>
              <Slider
                minimumTrackTintColor={blue}
                maximumTrackTintColor={blue}
                minimumValue={-9}
                maximumValue={9}
                value={this.state.camera}
                onSlidingComplete={this._cameraChange.bind(this)}
                step={3}
                thumbTintColor={blue}
              />
            </View>
          </View>
          <Space />
        </View>
        <View style={styles.bottom} />
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    paddingTop: 10,
    backgroundColor: 'white',
  },
  image: {
    width: 45,
    height: 45
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 10
  },
  bottom: {
    paddingTop: 20
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Platform.OS === 'ios' ? 10 : 15,
    backgroundColor: 'white',
    borderRadius: 10,
    height: 60,
    borderColor: style.lightGrey,
    borderWidth: 1,
  },
  space: {
    flex: 0.25,
  },
  space2: {
    flex: 0.5,
  },
  digit: {
    fontFamily: Platform.OS === 'ios' ? 'LCD AT&T Phone Time/Date': 'LCDAT&TPhoneTimeDate',
    color: style.darkGrey,
    fontSize: Platform.OS === 'ios' ? 45 : 50,
  },
  unit: {
    color: style.darkGrey,
    fontSize: 16
  },
  text: {
    flexDirection:'row',
    paddingTop: Platform.OS === 'ios' ? 10 : 0
  },
  slider: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
}

const mapStateToProps = state => {
  return {
    socket: state.socket.socket,
  };
};

export default connect(mapStateToProps, actions)(RemoteControl);

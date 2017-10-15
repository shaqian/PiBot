import React from 'react';
import { connect } from 'react-redux';
import Hls from 'hls.js';
import Record from 'Recorder';
import Modal from 'react-modal';

import MdRecordVoiceOver from 'react-icons/lib/md/record-voice-over';
import FaGamepad from 'react-icons/lib/fa/gamepad';
import MdVideoCollection from 'react-icons/lib/md/video-collection';

import * as actions from 'actions';
import Control from 'Control';
import Videos from 'Videos';

const io = require('socket.io-client');
const socket = io('');

const style = {
  overlay: {
    backgroundColor      : 'rgba(51, 51, 51, 0.5)'
  },
  content: {
    border                : '0',
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '140vh',
    height                : '80%'
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioInput: false,
      control: false,
      showModal: false
    };
  }
  handleControl(e) {
    this.setState({control: !this.state.control});
  }
  handleAudioInput() {
    this.setState({audioInput: !this.state.audioInput});
  }
  showVideos(e) {
    e.preventDefault();
    this.setState({ showModal: true });
    $("body").addClass("modal-open");
  }
  handleCloseModal () {
    this.setState({ showModal: false });
    $("body").removeClass("modal-open");
  }
  componentDidMount() {
    var {dispatch} = this.props;
    socket.emit('recordedVideos');
    socket.on('recordedVideos', (recordedVideos) => {
      dispatch(actions.setVideos(recordedVideos.reverse()));
    });

    var video = this.refs.video;
    if(Hls.isSupported()) {
      var hls = new Hls();
      var base = window.location.href;
      hls.loadSource(base + 'hls/index.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED,function() {
        video.play();
      });
    }
  }
  render() {
    var {zoomValue} = this.props;
    return (
      <div>
        <div className="text float__bottom bottom__left">
          {
            this.state.control ?
            <div><Control /></div>
            : <div className="control__hidden"><Control /></div>
          }
          {
            this.state.audioInput ?
              <Record ref={instance => { this.child = instance; }} />
            : <div></div>
          }
          <button className="success button user__button button__left" onClick={this.handleAudioInput.bind(this)}>
            <span className="button__text"><MdRecordVoiceOver /></span>
          </button>
          <button className="button user__button button__left" onClick={this.showVideos.bind(this)}>
            <span className="button__text"><MdVideoCollection /></span>
          </button>
          <button className="button user__button button__left" onClick={this.handleControl.bind(this)}>
            <span className="button__text"><FaGamepad /></span>
          </button>
        </div>
        <div>
          <Modal isOpen={this.state.showModal} style={style}
            onRequestClose={this.handleCloseModal.bind(this)} contentLabel="Modal">
            <Videos />
          </Modal>
          <video className="video" id="video" ref="video" style={{
            width: zoomValue + "%",
            height: zoomValue + "%"
          }}></video>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return state;
  })(Main);

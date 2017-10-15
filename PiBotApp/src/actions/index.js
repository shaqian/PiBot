export const setDirection = (direction) => {
  return {
    type: 'set_direction',
    payload: direction
  };
};

export const setScreen = (screen) => {
  return {
    type: 'set_screen',
    payload: screen
  };
};

export const setOrientation = (orientation) => {
  return {
    type: 'set_orientation',
    payload: orientation
  };
};

export const setVideoMuted = (muted) => {
  return {
    type: 'set_video_muted',
    payload: muted
  }
}
export const setVideoSize = (size) => {
  return {
    type: 'set_video_size',
    payload: size
  };
};

export const setVideoUri = (uri) => {
  return {
    type: 'set_video_uri',
    payload: uri
  };
};

export const setVideoRecord = (start) => {
  return {
    type: 'set_video_record',
    payload: start
  };
};

export const setRecordingsPath = (uri) => {
  return {
    type: 'set_recordings_path',
    payload: uri
  };
};

export const clearRecordings = () => {
  return {
    type: 'clear_recordings',
  };
};

export const setRecordings = (recordings) => {
  return {
    type: 'set_recordings',
    payload: recordings
  };
};

export const clearMusic = () => {
  return {
    type: 'clear_music',
  };
};

export const setMusic = (musicFiles) => {
  return {
    type: 'set_music',
    payload: musicFiles
  };
};


export const clearSocket = (socket) => {
  return {
    type: 'clear_socket',
    payload: socket
  };
};

export const setSocket = (socket) => {
  return {
    type: 'set_socket',
    payload: socket
  };
};

export const setHost = (host) => {
  return {
    type: 'set_host',
    payload: host
  };
};

export const addConfig = (config) => {
  return {
    type: 'add_config',
    payload: config
  };
};

export const deleteConfig = (id) => {
  return {
    type: 'delete_config',
    payload: id
  };
};

export const updateConfig = (config) => {
  return {
    type: 'update_config',
    payload: config
  };
};

export const setControl = (control) => {
  return {
    type: 'set_control',
    payload: control
  }
}

export const setAudioInput = (start) => {
  return {
    type: 'set_audio_input',
    payload: start
  };
}

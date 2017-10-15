import { combineReducers } from 'redux';

const DirectionReducer = (state = null, action) => {
  switch (action.type) {
    case 'set_direction':
      return action.payload;
    default:
      return state;
  }
}

const OrientationReducer = (state = null, action) => {
  switch (action.type) {
    case 'set_orientation':
      return action.payload;
    default:
      return state;
  }
}

const ScreenReducer = (state = null, action) => {
  switch (action.type) {
    case 'set_screen':
      return action.payload;
    default:
      return state;
  }
}

const VideoReducer = (state = {
    size: {
      height: 0,
      width: 0
    },
    uri: '',
    recordingsPath: '',
    muted: false,
    record: false
  }, action) => {
  switch (action.type) {
    case 'set_video_size':
      return { ...state, size: action.payload};
    case 'set_video_uri':
      return { ...state, uri: action.payload};
    case 'set_video_muted':
      return { ...state, muted: action.payload};
    case 'set_recordings_path':
      return { ...state, recordingsPath: action.payload};
    case 'set_video_record':
      return { ...state, record: action.payload};
    default:
      return state;
  }
}

const SocketReducer = (state = {}, action) => {
  switch (action.type) {
    case 'set_socket':
      return { ...state, socket: action.payload};
    case 'set_host':
      return { ...state, host: action.payload};
    case 'clear_socket':
      return { ...state, socket: null};
    default:
      return state;
  }
}

const RecordingsReducer = (state = null, action) => {
  switch (action.type) {
    case 'set_recordings':
      return action.payload;
    case 'clear_recordings':
      return null;
    default:
      return state;
  }
}

const MusicReducer = (state = false, action) => {
  switch (action.type) {
    case 'set_music':
      return action.payload;
    case 'clear_music':
      return null;
    default:
      return state;
  }
}

const ConfigReducer = (state = [], action) => {
  switch (action.type) {
    case 'add_config':
      return [ ...state, action.payload ];
    case 'update_config':
      var id1 = Object.keys(action.payload)[0];
      const updatedItems = state.map(item => {
        var id2 = Object.keys(item)[0];
        if(id1 === id2){
          return { ...item, ...action.payload }
        }
        return item;
      })
      return updatedItems;
    case 'delete_config':
      var id1 = action.payload;
      return state.filter(item => {
        var id2 = Object.keys(item)[0];
        return id1 !== id2;
      });
    default:
      return state;
  }
}

const ControlReducer = (state = 'remote', action) => {
  switch (action.type) {
    case 'set_control':
      return action.payload;
    default:
      return state;
  }
}

const AudioInputReducer = (state = false, action) => {
  switch (action.type) {
    case 'set_audio_input':
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  screen: ScreenReducer,
  orientation: OrientationReducer,
  video: VideoReducer,
  direction: DirectionReducer,
  socket: SocketReducer,
  configs: ConfigReducer,
  recordings: RecordingsReducer,
  control: ControlReducer,
  audioInput: AudioInputReducer,
  musicFiles: MusicReducer
});

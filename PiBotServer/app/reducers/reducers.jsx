export var zoomReducer = (state = 100, action) => {
  switch (action.type) {
    case 'SET_ZOOMVALUE':
      return action.zoomValue;
    default:
      return state;
  }
}

export var videosReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_VIDEOS':
      return action.videos;
    default:
      return state;
  }
}

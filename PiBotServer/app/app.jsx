import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import * as actions from 'actions';
import Main from 'Main';

var store = require('configureStore').configure();

store.subscribe(() => {
  var state = store.getState();
});

// Load foundation
$(document).foundation();

// App css
require('style-loader!css-loader!sass-loader!applicationStyles');

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
);

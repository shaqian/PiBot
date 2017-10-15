import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducers from './reducers';
import RootContainer from './components/RootContainer';

const App = () => {
  return (
    <Provider store={createStore(reducers)}>
      <RootContainer />
    </Provider>
  );
};

export default App;

import React, { Component} from 'react';
import { AsyncStorage, Text, ScrollView, View, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import uuid from 'uuid';

import * as actions from '../actions';
import * as style from '../style';

import t from 'tcomb-form-native';
let Form = t.form.Form;
Form.stylesheet.controlLabel.normal.color = style.darkGrey;
Form.stylesheet.controlLabel.normal.fontSize = 16;
Form.stylesheet.controlLabel.normal.fontFamily = style.font;
Form.stylesheet.controlLabel.error.fontSize = 16;
Form.stylesheet.controlLabel.error.fontFamily = style.font;
Form.stylesheet.textbox.normal.fontFamily = style.font;
Form.stylesheet.textbox.error.fontFamily = style.font;

var config = t.struct({
  name: t.String,
  protocol: t.maybe(t.String),
  host:  t.String,
  port: t.maybe(t.Number),
  path: t.maybe(t.String),
});

var options = {
  fields: {
    protocol: {
      placeholder: 'http by default'
    },
    host: {
      placeholder: 'Do not use localhost in Android'
    },
    port: {
      placeholder: '80 by default'
    },
    path: {
      placeholder: '/hls/index.m3u8 by default'
    }
  }
};

class Config extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    if (navigation.state.params.name === 'Edit') {
      this.state = {
        value: {
          name: navigation.state.params.config.value.name,
          host: navigation.state.params.config.value.host,
          protocol: navigation.state.params.config.value.protocol,
          port: navigation.state.params.config.value.port,
          path: navigation.state.params.config.value.path
        }
      }
    } else {
      this.state = { value: null };
    }
  }

  _onSave() {
    const { navigation, addConfig, updateConfig } = this.props;
    const value = this.refs.form.getValue();
    if (navigation.state.params.name === 'Edit') {
      var id = navigation.state.params.config.id;
    } else {
      var id = uuid();
    }
    if (value && id) {
      const config = JSON.parse(JSON.stringify(value));
      if (!config.protocol) {
        config.protocol = 'http';
      } else {
        config.protocol = config.protocol.trim().toLowerCase();
      }
      config.host = config.host.trim().toLowerCase();
      if (!config.port) {
        config.port = 80;
      }
      if (!config.path) {
        config.path = '/hls/index.m3u8';
      } else {
        config.path = config.path.trim().toLowerCase();
      }
      if (navigation.state.params.name === 'Edit') {
        updateConfig({[id]: config});
      } else {
        addConfig({[id]: config});
      }
      AsyncStorage.setItem(id, JSON.stringify(config));
      navigation.goBack(null);
    }
  }

  _onDelete() {
    const { navigation, deleteConfig } = this.props;
    const id = navigation.state.params.config.id;
    if (id) {
      deleteConfig(id);
      AsyncStorage.removeItem(id);
      navigation.goBack(null);
    }
  }

  onChange(data) {
    this.setState({value: data});
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View style={styles.container}>
            <Form
              ref="form"
              type={config}
              options={options}
              value={this.state.value}
              onChange={this.onChange.bind(this)}
            />
            <TouchableOpacity style={styles.button} onPress={this._onSave.bind(this)}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            {
              navigation.state.params.name === 'Edit' ?
              <TouchableOpacity style={{...styles.button, backgroundColor: 'white'}} onPress={this._onDelete.bind(this)}>
                <Text style={{...styles.buttonText, color: style.blue}}>Delete</Text>
              </TouchableOpacity> : undefined
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

var styles = {
  container: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
    fontFamily: style.font
  },
  button: {
    height: 36,
    backgroundColor: style.blue,
    borderColor: style.blue,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
}

export default connect(null, actions)(Config);

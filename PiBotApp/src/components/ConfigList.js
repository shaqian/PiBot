import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, AsyncStorage, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import * as actions from '../actions';
import * as style from '../style';

class ConfigList extends Component {
  componentWillMount() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
       stores.map((result, i, store) => {
         let key = store[i][0];
         let value = store[i][1];
         this.props.addConfig({[key]: JSON.parse(value)});
        });
      });
    });
  }

  _onPress(id, value, host, uri, recordingsPath) {
    const {
      navigation, socket, video,
      setVideoUri, setRecordingsPath, setVideoSize, setHost,
      clearRecordings,
    } = this.props;
    if (uri.trim() !== video.uri) {
      setVideoUri(uri.trim());
      setRecordingsPath(recordingsPath.trim());
      setVideoSize({
        height: 0,
        width: 0
      });
      setHost(host);
      clearRecordings();
    }
    navigation.navigate('Main', { name: value.name });
  }

  render() {
    const { navigation, configs} = this.props;
    var _renderConfig = () => {
      if (configs.length > 0) {
        return configs.map((config, index) => {
          var id = Object.keys(config)[0];
          var value = config[id];
          var host = value.protocol + '://' + value.host + ':' + value.port;
          var uri = host + value.path;
          var recordingsPath = host + '/videos/';
          return (
            <View key={index} style={styles.configContainer}>
              <View>
                <TouchableOpacity onPress={() => this._onPress(id, value, host, uri, recordingsPath)}>
                  <Text style={styles.name} >{value.name}</Text>
                  <Text style={styles.url} >{uri}</Text>
                </TouchableOpacity>
              </View>
              <View style={{alignSelf: 'center'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Config', {name: 'Edit', config: { id, value }})}>
                  <MaterialIcons name={'edit'} size={27} color={style.blue} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        );
      }
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          {_renderConfig()}
          <View style={styles.bottom} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style.lightGrey,
  },
  bottom: {
    paddingTop: 10
  },
  name: {
    fontSize: 18,
    margin: 3,
    color: '#333',
    fontFamily: style.font,
  },
  url: {
    fontSize: 16,
    margin: 3,
    color: style.darkGrey,
    fontFamily: style.font,
  },
  configContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 3,
    // shadowOpacity: 0.15,
    // shadowRadius: 1,
    // shadowColor: 'black',
    // shadowOffset: { height: 1, width: 0 },
  },
});

const mapStateToProps = state => {
  return {
    configs: state.configs,
    video: state.video,
    socket: state.socket.socket
  };
};

export default connect(mapStateToProps, actions)(ConfigList);

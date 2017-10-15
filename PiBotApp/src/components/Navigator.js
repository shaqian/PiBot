import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StackNavigator, Header } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import Main from './Main';
import Config from './Config';
import ConfigList from './ConfigList';
import VideoList from './VideoList';

const font = {
  fontSize: 20,
  fontFamily: 'Lato-Bold',
};

const GradientHeader = props => {
  return (
    <LinearGradient
        colors={['#acb6e5', '#86fde8']}
        start={{x:0, y:1}} end={{x:1.3, y:0}} >
      <Header {...props} style={{ backgroundColor: 'transparent' }} />
    </LinearGradient>
  );
};

const HomeScreen = ({ navigation }) => (
  <ConfigList navigation={navigation} />
);

HomeScreen.navigationOptions = props => {
  const { navigation } = props;
  return {
    title: 'PiBot',
    headerRight: (
      <View style={{margin: 10}}>
        <TouchableOpacity onPress={() => navigation.navigate('Config', { name: 'Add a new connection' })}>
          <MaterialIcons name={'playlist-add'} size={30} color="white" />
        </TouchableOpacity>
      </View>
    ),
    headerTintColor: 'white',
    header: (props) => <GradientHeader {...props} />,
    headerTitleStyle: Platform.OS === 'ios' ? font: {...font, alignSelf: 'center'},
    headerBackTitle: null,
    headerLeft: (<View></View>)
  }
};

const ConfigScreen = ({ navigation }) => (
  <Config navigation={navigation} />
);

ConfigScreen.navigationOptions = props => {
  const { navigation } = props;
  return {
    headerTitle: `${navigation.state.params.name}`,
    headerTintColor: 'white',
    header: (props) => <GradientHeader {...props} />,
    headerTitleStyle: Platform.OS === 'ios' ? font: {...font, alignSelf: 'center'},
    headerRight: (<View></View>)
  };
};

const MainScreen = ({ navigation } ) => (
  <Main navigation={navigation} />
);

MainScreen.navigationOptions = props => {
  const { navigation } = props;
  return {
    headerTitle: `${navigation.state.params.name}`,
    headerRight: (
      <View style={{margin: 10}}>
        <TouchableOpacity onPress={() => navigation.navigate('VideoList')}>
          <MaterialIcons name={'video-library'} size={27} color="white" />
        </TouchableOpacity>
      </View>
    ),
    headerTintColor: 'white',
    header: props.screenProps === "portrait"? (props) => <GradientHeader {...props} />: null,
    headerTitleStyle: Platform.OS === 'ios' ? font: {...font, alignSelf: 'center'},
    headerBackTitle: null
  };
};

const VideoListScreen = ({ navigation } ) => (
  <VideoList navigation={navigation} />
);

VideoListScreen.navigationOptions = props => {
  const { navigation } = props;
  return {
    headerTitle: 'Video Recordings',
    headerTintColor: 'white',
    header: (props) => <GradientHeader {...props} />,
    headerTitleStyle: Platform.OS === 'ios' ? font: {...font, alignSelf: 'center'},
    headerRight: (<View></View>)
  };
};

var styles = StyleSheet.create({
  linearGradient: {
  },
});

export default Navigator = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Config: {
    screen: ConfigScreen
  },
  Main: {
    screen: MainScreen
  },
  VideoList: {
    screen: VideoListScreen
  }
});

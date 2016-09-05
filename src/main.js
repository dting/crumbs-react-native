import React, { Component } from 'react';
import {
  StyleSheet,
  Navigator,
} from 'react-native';

import Login from './login/login';
import Map from './map/map';
import Chatroom from './chat/chatroom';
import Signup from './login/signup';

window.navigator.userAgent = 'react-native';

const io = require('socket.io-client/socket.io');

const ioConfig = {
  jsonp: false,
  transports: ['websocket'],
};

const ROUTES = {
  login: Login,
  map: Map,
  chatroom: Chatroom,
  signup: Signup,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default class Crumbs extends Component {
  constructor(props) {
    super(props);
    this.socket = io('http://localhost:3000', ioConfig);
    this.renderScene = this.renderScene.bind(this);
    this.STORAGE_KEY = '@CrumbsAsyncStorage_1234';
  }

  renderScene(route, navigator) {
    const Scene = ROUTES[route.name];
    return (<Scene
      route={route}
      navigator={navigator}
      socket={this.socket}
      storage_key={this.STORAGE_KEY}
    />);
  }

  render() {
    return (<Navigator
      style={styles.container}
      initialRoute={{ name: 'login' }}
      renderScene={this.renderScene}
      configureScene={() => Navigator.SceneConfigs.FloatFromRight}
    />);
  }
}

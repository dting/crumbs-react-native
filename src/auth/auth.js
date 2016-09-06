import React, { Component } from 'react';
import {
  StyleSheet,
  Navigator,
} from 'react-native';
import store from 'react-native-simple-store';
import Login from './login';
import SignUp from './sign-up';
import s from './auth.styles';

const ROUTES = {
  login: Login,
  'sign-up': SignUp,
};

export default class Auth extends Component {
  componentWillMount() {
    store.get('token').then(token => {
      if (token) {
        this.props.navigator.push({ name: 'home' });
      }
    });
    this.renderScene = this.renderScene.bind(this);
  }

  renderScene(route, navigator) {
    const Scene = ROUTES[route.name];
    return <Scene route={route} navigator={navigator} onav={this.props.navigator} />;
  }

  render() {
    return (<Navigator
      style={s.navContainer}
      initialRoute={{ name: 'login' }}
      renderScene={this.renderScene}
      configureScene={() => ({
        ...Navigator.SceneConfigs.FloatFromRight,
        gestures: null,
      })}
    />);
  }
}

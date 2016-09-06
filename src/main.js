import React, { Component } from 'react';
import {
  StyleSheet,
  Navigator,
} from 'react-native';

import Auth from './auth/auth';
import Home from './home/home';

const ROUTES = {
  auth: Auth,
  home: Home,
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

    this.renderScene = this.renderScene.bind(this);
  }

  renderScene(route, navigator) {
    const Scene = ROUTES[route.name];
    return <Scene route={route} navigator={navigator} />;
  }

  render() {
    return (<Navigator
      style={styles.container}
      initialRoute={{ name: 'auth' }}
      renderScene={this.renderScene}
      configureScene={() => Navigator.SceneConfigs.FloatFromRight}
    />);
  }
}

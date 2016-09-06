import React from 'react';
import {
  View,
  StyleSheet,
  MapView,
  TouchableHighlight,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonText: {
    fontSize: 20,
  },
});

export default ({ exists, joinRoom, createRoom }) => (
  <View style={styles.container}>
    <MapView style={styles.map} showsUserLocation followUserLocation/>
    <TouchableHighlight style={styles.button} onPress={exists ? joinRoom : createRoom}>
      <Text style={styles.buttonText}>{`${exists ? 'Join' : 'Create'} Room!`}</Text>
    </TouchableHighlight>
  </View>
);

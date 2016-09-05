import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Alert,
  Image,
  AsyncStorage,
} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import styles from './login.styles';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };
    this.props.socket.on('Authentication', username => {
      if (username) {
        try {
          AsyncStorage.setItem(this.props.storage_key, username).then(() => {
            this.props.navigator.push({ name: 'map' });
          });
        } catch (err) {
          // console.log(`AsyncStorage Error - ${err}`);
        }
      } else {
        this.setState({ password: '' });
        Alert.alert(
          'Incorrect Username or Password',
          'Please try again. If you are a new user, please create a profile.');
      }
    });
    this.validateUser = this.validateUser.bind(this);
    this.onLinkPress = this.onLinkPress.bind(this);
  }

  onLinkPress() {
    this.props.socket.off('Authentication');
    this.props.navigator.push({ name: 'signup' });
  }

  validateUser() {
    this.props.socket.emit('user:login', {
      username: this.state.username,
      password: this.state.password,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Image source={require('./cookie.jpg')} />
          <Text style={styles.header}> Crumbs </Text>
          <TextInput
            style={styles.input}
            value={this.state.username}
            onChangeText={(text) => this.setState({ username: text })}
            placeholder={'Enter Username'}
            maxLength={12}
            multiline={false}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })}
            placeholder={'Enter Password'}
            maxLength={12}
            multiline={false}
          />
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#328FE6'}
            onPress={this.validateUser}
          >
            <Text style={styles.label}>LOGIN</Text>
          </TouchableHighlight>
          <Hyperlink>
            <View>
              <Text style={{ fontSize: 15 }}>
                Not a member?
                <Text onPress={this.onLinkPress} style={{ color: 'blue', fontSize: 15 }}>
                  Create a Profile
                </Text>
              </Text>
            </View>
          </Hyperlink>
        </View>
      </View>
    );
  }
}

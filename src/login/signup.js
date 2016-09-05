import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Alert,
  Image,
} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import store from 'react-native-simple-store';
import styles from './login.styles';

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.props.socket.on('Authentication', username => {
      if (username) {
        store.save(this.props.storage_key, username)
          .then(() => {
            this.props.navigator.push({ name: 'map' });
          })
          .catch((/* err */) => {
            // console.log(`AsyncStorage Error - ${err}`);
          });
      } else {
        this.setState({ password: '' });
        Alert.alert(
          'Incorrect Username or Password',
          'Please try again. If you are already a member, please login.');
      }
    });

    this.validateUser = this.validateUser.bind(this);
    this.onLinkPress = this.onLinkPress.bind(this);
  }

  onLinkPress() {
    this.props.socket.off('Authentication');
    this.props.navigator.push({ name: 'login' });
  }

  validateUser() {
    this.props.socket.emit('user:signUp', {
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
          <Text style={styles.subheader}> Create a Profile </Text>
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
            onPress={() => this.validateUser()}
          >
            <Text style={styles.label}>SIGN UP</Text>
          </TouchableHighlight>
          <Hyperlink>
            <View>
              <Text style={{ fontSize: 15 }}>
                Already a member?
                <Text onPress={this.onLinkPress} style={{ color: 'blue', fontSize: 15 }}>
                  Login
                </Text>
              </Text>
            </View>
          </Hyperlink>
        </View>
      </View>
    );
  }

}

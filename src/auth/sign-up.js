import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import store from 'react-native-simple-store';
import AuthForm from './auth-form';
import s from './auth.styles';

function statusCheck(res) {
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res;
}

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.signUp = this.signUp.bind(this);
    this.toLogin = this.toLogin.bind(this);
    this.handlers = {
      updateUsername: this.updateUsername.bind(this),
      updatePassword: this.updatePassword.bind(this),
    };
  }

  toLogin() {
    this.props.navigator.resetTo({ name: 'login' });
  }

  signUp() {
    if (this.state.pending) {
      return;
    }
    this.setState({ pending: true, message: null });
    const { username, password } = this.state;
    const promise = fetch('http://localhost:3000/api/users/sign-up', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    promise
      .then(statusCheck)
      .then(res => res.json())
      .then(res => {
        if (!res.token) {
          throw new Error('Missing token.');
        }
        store.save('token', res.token).then(() => {
          this.setState({ pending: false });
          this.props.onav.push({ name: 'home' });
        });
      })
      .catch(() => this.setState({ pending: false, message: 'Sign up error. Try again!' }));
  }

  updateUsername(username) {
    this.setState({ username });
  }

  updatePassword(password) {
    this.setState({ password });
  }

  render() {
    return (
      <View style={s.container}>
        <AuthForm {...this.state} {...this.handlers}>
          <TouchableHighlight
            style={s.button}
            underlayColor={'#328FE6'}
            onPress={this.signUp}
          >
            <Text style={s.label}>SIGN UP</Text>
          </TouchableHighlight>
          <Hyperlink>
            <Text style={{ fontSize: 15 }}>
              Already a member?
              <Text onPress={this.toLogin} style={{ color: 'blue', fontSize: 15 }}>
                Login
              </Text>
            </Text>
          </Hyperlink>
        </AuthForm>
      </View>
    );
  }

}

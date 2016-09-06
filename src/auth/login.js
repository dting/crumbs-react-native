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

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.login = this.login.bind(this);
    this.toSignUp = this.toSignUp.bind(this);
    this.handlers = {
      updateUsername: this.updateUsername.bind(this),
      updatePassword: this.updatePassword.bind(this),
    }
  }

  toSignUp() {
    this.props.navigator.push({ name: 'sign-up' });
  }

  login() {
    if (this.state.pending) {
      return;
    }
    this.setState({ pending: true, message: null });
    const { username, password } = this.state;
    const promise = fetch('http://localhost:3000/auth/local', {
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
          this.props.onav.push({ name: 'home' })
        });
      })
      .catch(() => this.setState({ pending: false, message: 'Login error. Try again!' }));
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
          {this.state.message && <Text>{this.state.message}</Text>}
          <TouchableHighlight
            style={s.button}
            underlayColor={'#328FE6'}
            onPress={this.login}
          >
            <Text style={s.label}>LOGIN</Text>
          </TouchableHighlight>
          <Hyperlink>
            <Text style={{ fontSize: 15 }}>
              Not a member?
              <Text onPress={this.toSignUp} style={{ color: 'blue', fontSize: 15 }}>
                Create a Profile
              </Text>
            </Text>
          </Hyperlink>
        </AuthForm>
      </View>
    );
  }
}

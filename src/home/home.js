import React, { Component } from 'react';
import {
  StyleSheet,
  Navigator,
} from 'react-native';
import store from 'react-native-simple-store';
import ChatRoom from './chat-room';
import Map from './map';
import s from './chat-room.styles';

window.navigator.userAgent = 'react-native';

const io = require('socket.io-client/socket.io');

const ROUTES = {
  'chat-room': ChatRoom,
  map: Map,
};

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exists: false,
      location: '',
      message: '',
    };

    this.renderScene = this.renderScene.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.handlers = {
      joinRoom: this.joinRoom.bind(this),
      createRoom: this.createRoom.bind(this),
      sendMessage: this.sendMessage.bind(this),
      logout: this.logout.bind(this),
    };

    store.get('token').then(token => {
      if (!token) {
        return this.props.navigator.resetTo({ name: 'auth' });
      }

      const socket = io('http://localhost:3000', {
        query: `token=${token}`,
        jsonp: false,
        transports: ['websocket'],
      });

      socket.on('unauthorized', err => {
        if (err.data.type === 'UnauthorizedError' || err.data.code === 'invalid_token') {
          store.delete('token').then(() => this.props.navigator.resetTo({ name: 'auth' }));
        }
      });

      socket.on('room:checked', ({ location, exists }) => {
        if (location === this.state.location) {
          this.setState({ exists });
        } else {
          this.checkForRoom();
        }
      });

      socket.on('room:created', ({ room }) => {
        if (room) {
          this.checkForRoom();
        }
      });

      socket.on('room:joined', ({ room }) => {
        this.setState({ room });
      });

      socket.on('message:added', result => {
        const messageList = this.state.messageList;
        messageList.push(result.message);
        this.setState({ messageList });
      });

      this.socket = socket;
    });
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(this.setPosition);
    this.watchID = navigator.geolocation.watchPosition(this.setPosition);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  setPosition(position) {
    const latRound = position.coords.latitude.toFixed(3);
    const lonRound = position.coords.longitude.toFixed(3);
    const location = latRound.toString() + lonRound.toString();
    if (this.state.location !== location) {
      this.setState({ location, room: null }, () => this.checkForRoom());
      this._navigator.popToTop();
    }
  }

  checkForRoom() {
    this.socket.emit('check:room', this.state.location);
  }

  createRoom() {
    this.socket.emit('create:room', this.state.location);
  }

  joinRoom() {
    this._navigator.push({ name: 'chat-room' });
    this.socket.emit('join:room', { location: this.state.location });
  }

  sendMessage() {
    const { location, message } = this.state;
    this.socket.emit('add:message', { location, message });
  }

  logout() {
    store.delete('token').then(() => {
      this.props.navigator.resetTo({ name: 'auth' });
    });
  }

  renderScene(route, navigator) {
    const Scene = ROUTES[route.name];
    return <Scene
      route={route}
      navigator={navigator}
      onav={this.props.navigator}
      {...this.state}
      {...this.handlers}
    />;
  }

  render() {
    return (<Navigator
      style={s.navContainer}
      ref={component => this._navigator = component}
      initialRoute={{ name: 'map' }}
      renderScene={this.renderScene}
      configureScene={() => ({
        ...Navigator.SceneConfigs.FloatFromRight,
        gestures: null,
      })}
    />);
  }
}

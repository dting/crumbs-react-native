import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableHighlight,
  Alert,
  AsyncStorage,
} from 'react-native';
import moment from 'moment';
import styles from './chatroom.styles';
import imgUrlDefault from './profileIcon.png';

// TODO: Make repeat functions with map.js more DRY
// TODO: Update all socket messages to reflect changes to server (TBD)

/* eslint-disable no-console */
const log = (...args) => console.log(...args);
/* eslint-enable no-console */

export default class Chatroom extends Component {
  constructor(props) {
    super(props); // provides access to props.socket
    // TODO: Refactor location and messagelist to be part of a Room
    this.state = {
      message: '',
      messageList: [],
      location: null,
      username: 'default_user',
    };

    this.props.socket.on('room:joined', result => {
      const messages = result.room ? result.room.messages : [];
      this.setState({ messageList: messages });
    });

    this.props.socket.on('message:added', result => {
      log('message added');
      const messageList = this.state.messageList;
      messageList.push(result.message);
      this.setState({ messageList });
    });
  }

  componentWillMount() {
    this.onBackPress = this.onBackPress.bind(this);
    this.onLogoutPress = this.onLogoutPress.bind(this);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = this.createChatRoomId(position.coords);
        this.setState({ location: loc });
        AsyncStorage.getItem(this.props.storage_key)
          .then(username => {
            this.state.username = username;
            this.props.socket.emit('join:room', {
              location: this.state.location,
              username: this.state.username,
            });
            this.listenForGeoChange();
          });
      });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onSendPress() {
    if (this.state.message) {
      this.emitAddMessageToChatRoom();
      this.setState({ message: '' });
      this.msgInput.setNativeProps({ text: '' });
    }
  }

  onBackPress() {
    this.myUnmount();
    this.props.navigator.push({
      name: 'map',
    });
  }

  onLogoutPress() {
    this.myUnmount();
    this.props.navigator.push({
      name: 'login',
    });
  }

  myUnmount() {
    this.props.socket.off('room:joined');
    this.props.socket.off('message:added');
    navigator.geolocation.clearWatch(this.watchID);
  }

  listenForGeoChange() {
    this.watchID = navigator.geolocation.watchPosition(position => {
      const coordStr = this.createChatRoomId(position.coords);
      if (coordStr !== this.state.location) {
        log('location changed, return to map');
        log(' state:', this.state.location);
        log('   new:', coordStr);
        this.onBackPress();
      }
    });
  }

  createChatRoomId(coordObj) {
    const latStr = (Math.trunc(coordObj.latitude * 1000) / 1000).toFixed(3).toString();
    const lngStr = (Math.trunc(coordObj.longitude * 1000) / 1000).toFixed(3).toString();
    return latStr + lngStr;
  }

  emitAddMessageToChatRoom() {
    log(this.state.message);
    this.props.socket.emit('add:message', {
      location: this.state.location,
      message: this.state.message,
      username: this.state.username,
    });
  }

  // TODO: Turn list into separate component
  // TODO: Change key to equal item._id
  render() {
    const list = this.state.messageList.map((item, index) => (
      <View
        style={styles.listItem}
        key={index}
      >
        <View style={styles.listIcon}>
          <Image
            style={styles.channelIcon}
            defaultSource={imgUrlDefault}
            source={imgUrlDefault}
          />
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.titleLabel}>{item.message}</Text>
          <Text style={styles.memberLabel}>{item.username}</Text>
          <Text style={styles.memberLabel}>{moment(item.createdAt).fromNow()}</Text>
        </View>
      </View>
      )
    );

    list.reverse(); // display most recent messages first

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.topContainerLeft}>
            <TouchableHighlight
              style={styles.touchable}
              underlayColor={'#dcf4ff'}
              onPress={this.onBackPress}
            >
              <Text style={{ color: 'black' }}>&lt; Back</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.topContainerRight}>
            <TouchableHighlight
              style={styles.touchable}
              underlayColor={'#dcf4ff'}
              onPress={() => Alert.alert(
                  'LOGOUT',
                    'Exit chatroom and return to login page?',
                [
                  { text: 'CANCEL', onPress: () => log('cancel pressed') },
                  { text: 'OK', onPress: this.onLogoutPress },
                ]
                  )}
            >
              <Text>Logout &gt;</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.chatContainer}>
          <ScrollView
            scrollEventThrottle={16}
          >
          {list}
          </ScrollView>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.input}
              value={this.message}
              ref={component => (this.msgInput = component)}
              onChangeText={(text) => this.setState({ message: text })}
            />
          </View>
          <View style={styles.sendContainer}>
            <TouchableHighlight
              underlayColor={'#dcf4ff'}
              onPress={() => this.onSendPress()}
            >
              <Text style={styles.sendLabel}>SEND</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

Chatroom.propTypes = {
  navigator: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  storage_key: PropTypes.string,
};

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableHighlight,
  Alert,
} from 'react-native';
import moment from 'moment';
import styles from './chat-room.styles';
import imgUrlDefault from './profileIcon.png';

// TODO: Make repeat functions with map.js more DRY
// TODO: Update all socket messages to reflect changes to server (TBD)

export default class Chatroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageList: [],
    };
  }

  onSendPress() {
    this.props.sendMesage();
    this.setState({ message: '' });
  }

  // TODO: Turn list into separate component
  // TODO: Change key to equal item._id
  render() {
    const list = ((this.props.room || {}).messages || []).map((item, index) => (
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
    ));

    list.reverse(); // display most recent messages first

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.topContainerLeft}>
            <TouchableHighlight
              style={styles.touchable}
              underlayColor={'#dcf4ff'}
              onPress={this.props.navigator.pop}
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
                  { text: 'CANCEL', onPress: () => {} },
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
              onChangeText={message => this.setState({ message })}
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

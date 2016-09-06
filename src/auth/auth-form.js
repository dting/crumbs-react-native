import React from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
} from 'react-native';
import s from './auth.styles';

export default props => (
  <View style={s.loginContainer}>
    <Image source={require('./cookie.jpg')}/>
    <Text style={s.header}>Crumbs</Text>
    <TextInput
      style={s.input}
      value={props.username}
      onChangeText={props.updateUsername}
      placeholder={'Enter Username'}
      maxLength={12}
      multiline={false}
    />
    <TextInput
      style={s.input}
      secureTextEntry
      value={props.password}
      onChangeText={props.updatePassword}
      placeholder={'Enter Password'}
      maxLength={12}
      multiline={false}
    />
    {props.children}
  </View>
);

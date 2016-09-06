import {
  StyleSheet,
  Dimensions,
} from 'react-native';

const windowSize = Dimensions.get('window');

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#c2edff',
    paddingTop: 20,
  },
  topContainerLeft: {
    justifyContent: 'flex-start',
    width: windowSize.width / 2,
  },
  topContainerRight: {
    justifyContent: 'flex-end',
    width: windowSize.width / 2,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  chatContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#a9e5ff',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sendContainer: {
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  sendLabel: {
    color: 'black',
    fontSize: 15,
  },
  input: {
    width: windowSize.width - 70,
    color: '#555555',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fc',
    borderBottomWidth: 0.5,
    borderColor: '#D0DBE4',
    padding: 5,
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15,
  },
  channelIcon: {
    width: 40,
    height: 40,
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60768b',
  },
  memberLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#abb8c4',
  },
  touchable: {
    marginLeft: 15,
  },
});

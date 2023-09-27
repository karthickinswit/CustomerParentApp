import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {timeConversion} from '../utils/utilities';
import {closeChat} from '../services/api';

let flatList = React.useRef(null);

const ClosedChatView = route => {
  let chat = route.route.params.item;

  let ChatHeader = () => {
    const navigation = useNavigation();

    return (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../../assets/chevron-left-solid.png')}
              style={{width: 30, height: 30, borderRadius: 30}}
            />
          </TouchableOpacity>
          <View style={styles.leftContainer}>
            {chat.customerIconUrl ? (
              <Image
                source={{uri: chat.customerIconUrl}}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={require('../../assets/boy_dummy.png')}
                style={styles.avatar}
              />
            )}

            <View style={styles.textContainer}>
              <Text style={styles.title}>{chat.customerName}</Text>
              <Text style={styles.subtitle}>Offline</Text>
            </View>
          </View>
          <View></View>
          <TouchableOpacity
            onPress={() => {
              closeChat(chat.chatId);
              navigation.replace('ChatListPage');
            }}></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  let ChatBody = () => {
    let renderMessage = ({item, index}) => {
      return (
        <>
          <ScrollView>
            {item.actionType == 0 || item.actionType == 1 ? (
              <View style={styles.messageSent}>
                <Text style={styles.messageText} key={index}>
                  {item.message}
                </Text>
                <Text style={styles.timestampText}>
                  {timeConversion(item.actedOn)}
                </Text>
              </View>
            ) : item.actionType == 2 ? (
              <View style={styles.messageHeader}>
                <Text style={styles.messageText} key={index}>
                  {item.messager ? 'You' : item.message} joined chat
                </Text>
              </View>
            ) : item.actionType == 4 ? (
              <View style={styles.messageHeader}>
                <Text style={styles.messageText} key={index}>
                  {item.message ? 'You' : item.message} transferred chat To You
                </Text>
              </View>
            ) : item.actionType == 8 ? (
              <View style={styles.messageHeader}>
                <Text style={styles.messageText} key={index}>
                  {item.message ? 'You' : item.message} left this chat
                </Text>
              </View>
            ) : item.actionType == 9 ? (
              <View style={styles.messageHeader}>
                <Text style={styles.messageText} key={index}>
                  {item.message ? 'You' : item.message} left this chat
                </Text>
              </View>
            ) : item.actionType == 3 ? (
              <View style={styles.messageReceived}>
                <Text style={styles.messageText} key={index}>
                  {item.message}
                </Text>
                <Text style={styles.timestampText}>
                  {timeConversion(item.actedOn)}
                </Text>
              </View>
            ) : (
              <View></View>
            )}
          </ScrollView>
        </>
      );
    };
    if (chat.messages) {
      return (
        <FlatList
          data={chat.messages}
          renderItem={renderMessage}
          keyExtractor={item => item.actionId.toString()}
          contentContainerStyle={styles.contentContainer}
          legacyImplementation={true}
          extraData={true}
          ref={flatList}
          onContentSizeChange={() => flatList.current.scrollToEnd()}
        />
      );
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#217eac" />
        </View>
      );
    }
  };

  return (
    <>
      <ChatHeader />
      <ChatBody />
    </>
  );
};

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 24,
    height: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  menuButton: {
    padding: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    padding: 40,
  },
  messageSent: {
    backgroundColor: '#ecf6fd',
    alignSelf: 'flex-end',
    maxWidth: '80%',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  messageHeader: {
    backgroundColor: '#ecf6fd',
    alignSelf: 'center',
    maxWidth: '80%',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  messageReceived: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  // footerContainer: {
  //   position: 'absolute',
  //   width : "100%",
  //   flexDirection: 'row',
  //   alignItems: 'stretch',
  //   backgroundColor: '#FFFFFF',
  //   paddingVertical: 8,
  //   paddingHorizontal: 16,
  // },
  // attachmentButton: {
  //   marginRight: 16,
  // },
  // attachmentIcon: {
  //   width: 24,
  //   height: 24,
  // },
  // input: {
  //   flex: 1,
  //   backgroundColor: '#F2F2F2',
  //   borderRadius: 16,
  //   paddingHorizontal: 16,
  //   paddingVertical: 8,
  //   maxHeight: 150,
  // },
  // sendButton: {
  //   marginLeft: 16,
  // },
  // sendIcon: {
  //   width: 24,
  //   height: 24,
  // },
  // statusText: {
  //   fontSize: 12,
  //   fontWeight: '600',
  //   color: '#555555',
  //   marginTop: 8,
  // },
  footercontainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  attachmentButton: {
    marginRight: 16,
  },
  attachmentIcon: {
    width: 24,
    height: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 150,
  },
  sendButton: {
    marginLeft: 16,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
});

export default ClosedChatView;

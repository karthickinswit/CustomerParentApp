import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Modal,
  Dimensions,
  PermissionsAndroid
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import ImagePicker from 'react-native-image-picker';
import { messageService } from '../services/websocket';
import { GlobalContext } from '../utils/globalupdate';
import { timeConversion } from '../utils/utilities';
import { MenuProvider } from 'react-native-popup-menu';
import { closeChat } from '../services/api';

let { height } = Dimensions.get('window');
let flatList = React.useRef(null);

const IndividualChat = route => {
  const value = React.useContext(GlobalContext);
  let chatId = route.route.params.chatId;
  let chat = value.activeChatList.current.chats.find(response => {
    return response.chatId == chatId;
  });
  const [imageSource, setImageSource] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);


  const launchImagePicker = () => {
    let options = {
      title: 'You can choose one image',
      maxWidth: 256,
      maxHeight: 256,
      noData: true,
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
      },
    };

    // ImagePicker.launchImageLibrary(options, response => {
    //   if (response.didCancel) {
    //     console.log('User cancelled photo picker');
    //     Alert.alert('You did not select any image');
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    //   } else {
    //     let source = { uri: response.uri };
    //     // ADD THIS
    //     setImageSource(source.uri);
    //   }
    // });
  }

  const openCamera = () => {
    // ImagePicker.launchCamera({}, (response) => {
    //   if (!response.didCancel) {
    //     //setImageUri(response.uri);
    //     setImageSource(source.uri);
    //   }
    // });
  };

  const requestCameraPermission = async () => {
    try {
      setModalVisible(false);
      const grantedCamera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const grantedStorage = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      if (
        grantedCamera === PermissionsAndroid.RESULTS.GRANTED &&
        grantedStorage[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED &&
        grantedStorage[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the camera and access the gallery');
        setModalVisible(!modalVisible)
        setTimeout(() => {
          openCamera()
        }, 100);
      } else {
        console.log('Camera or gallery permission denied');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const requestGalleryPermission = async () => {
    try {
      setModalVisible(false);
      const grantedCamera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const grantedStorage = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      if (
        grantedCamera === PermissionsAndroid.RESULTS.GRANTED &&
        grantedStorage[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED &&
        grantedStorage[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the camera and access the gallery');
        setModalVisible(!modalVisible)
        setTimeout(() => {
          launchImagePicker()
        }, 100);
      } else {
        console.log('Camera or gallery permission denied');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const ChatHeader = () => {
    const navigation = useNavigation();

    if (!chat) {
      return <ActivityIndicator />;
    } else {
      return (
        <>
          <SafeAreaView style={{ backgroundColor: 'white' }}>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  navigation.goBack();
                }}>
                <Image
                  source={require('../../assets/chevron-left-solid.png')}
                  style={styles.logo}
                />
              </TouchableOpacity>
              <View style={styles.leftContainer}>
                {chat.customerIconUrl ? (
                  <Image
                    source={{ uri: chat.customerIconUrl }}
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
                  <Text style={styles.subtitle}>Online</Text>
                </View>
              </View>
              <View style={styles.rightContainer}>
                <TouchableOpacity
                  onPress={() => {
                    closeChat(chat.chatId).then(() => {
                      navigation.goBack();
                    });
                  }}>
                  <View style={[styles.buttonCnf]}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: 'white',
                        alignItems: 'center',
                      }}>
                      Close Chat
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </>
      );
    }
  };

  const ChatBody = () => {
    let renderMessage = ({ item, index }) => {
      return (
        <View style={{ flex: 1 }}>
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
                  {item.messager ? 'You' : item.message} You joined chat
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
                  {item.message ? 'You' : item.message} You left this chat
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
        </View>
      );
    };
    if (chat) {
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#217eac" />
        </View>
      );
    }
  };

  const ChatFooter = () => {

    const [message, setMessage] = React.useState('');

    const openModal = () => {
      setModalVisible(true);
    };

    const closeModal = () => {
      setModalVisible(false);
    };

    const handleSendMessage = () => {
      console.log(message);
      const sendObject = {
        action: 'agentReplyChat',
        eId: chat.eId,
        message: message,
        contentType: 'TEXT',
        chatId: chat.chatId,
        attachment: {},
        pickup: false,
      };
      console.log('send Object', sendObject);
      messageService.sendMessage(sendObject);
      setMessage('');
    };

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={{ backgroundColor: 'white' }}>
            <View style={styles.footercontainer}>
              {message.length > 0 ? null : (
                <TouchableOpacity
                  style={styles.attachmentButton}
                  onPress={openModal}>
                  <Image
                    source={require('../../assets/add_128.png')}
                    style={styles.attachmentIcon}
                  />
                </TouchableOpacity>
              )}
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
                multiline
              />
              {message.length > 0 ? (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}>
                  <Image
                    source={require('../../assets/send_128.png')}
                    style={styles.sendIcon}
                  />
                </TouchableOpacity>
              ) : null}
              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity
                      style={styles.buttonModal}
                      onPress={requestGalleryPermission}>
                      <Text style={styles.buttonTextModal}>Photo/Video Library</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonModal}
                      onPress={requestCameraPermission}>
                      <Text style={styles.buttonTextModal}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonModal}
                      onPress={closeModal}>
                      <Text style={styles.buttonTextModal}>Location</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };

  return (
    <MenuProvider>
      <ChatHeader />
      <ChatBody />
      <ChatFooter />
    </MenuProvider>
  );
};

let styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height: height / 3,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  buttonModal: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#217eac',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonTextModal: {
    color: 'white',
    fontSize: 16,
  },
  containerCnf: {
    alignItems: 'center',
    marginVertical: 10,
  },
  lineCnf: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
  },
  buttonContainerCnf: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  textCnf: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonCnf: {
    backgroundColor: '#217eac',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  selectedButtonCnf: {
    backgroundColor: '#6bbf59',
  },
  buttonTextCnf: {
    color: '#fff',
    fontWeight: 'bold',
  },
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
    alignSelf: 'flex-start',
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
    alignSelf: 'flex-end',
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

export default IndividualChat;

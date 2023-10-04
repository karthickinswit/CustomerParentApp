import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Dimensions,
  PermissionsAndroid,
  ImageBackground,
  ToastAndroid,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { messageService } from '../services/websocket';
import { GlobalContext } from '../utils/globalupdate';
import { timeConversion } from '../utils/utilities';
import { MenuProvider } from 'react-native-popup-menu';
import { chatCreationApi, getChatInfo } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Variables from '../utils/variables';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import ImagePicker from 'react-native-image-picker';
const { height } = Dimensions.get('window');

let flatList = React.useRef(null);

const IndividualChat = () => {
  const value = useContext(GlobalContext);

  const [chatId, setChatId] = useState('');
  const [isValidchat, setIsValidChat] = useState(false);
  const [chat, setChat] = useState(value.chat)
  console.log("Indivdiual Chat--> ", value)
  //let chat = value.chat.current;
  //let chatId = route.route.params.chatId;
  // let chat = value.activeChatList.current.chats.find(response => {
  //   return response.chatId == chatId;
  // });
  const [imageSource, setImageSource] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);
  useEffect(() => {
    chatIdValidation();
  }, [])

  useEffect(() => {
    setChat(value.chat);
    console.log("Afet Chat -->", chat)
  }, [value.chat])


  newChatCreation = () => {
    chatCreationApi(Variables.EID)
      .then(async data => {
        console.log('Chat Creation data-->', data);
        if (data.status) {
          let newChatId = data.response.chatId;

          setChatId(newChatId);
          await AsyncStorage.setItem('chatId', newChatId);
          await chatIdValidation();
        }
        else { console.log(data); }

      })
      .catch(error => console.error('Error:', error));
  }

  const chatIdValidation = async () => {
    let storedChatId = await AsyncStorage.getItem('chatId');
    if (!storedChatId) {
      await newChatCreation();
    }
    else {
      getChatInfo(Variables.EID, storedChatId)
        .then(async data => {
          console.log('Chat checking data-->', data);
          if (data.chat) {
            let res = data.chat;
            if (res.state != 3) {
              setIsValidChat(true);
              //  setChat(res);
              setChat(res);
              console.log("value.chat.current ", value.chat)
              console.log("chat res--> ", res);
            }
            else {
              setIsValidChat(false);
              await newChatCreation();

            }

          }
          else { console.log(data); }

        })
        .catch(error => console.error('Error:', error));
    }
  }

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

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        ToastAndroid.showWithGravityAndOffset(
          'You Did Not Select Any Image / Documents',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          25,
          50,
        )
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        ToastAndroid.showWithGravityAndOffset(
          'Cannot Browse the Gallery',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          25,
          50,
        )
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };
        setImageSource(source.uri);
      }
    });
  }

  const openCamera = () => {
    ImagePicker.launchCamera({}, (response) => {
      if (!response.didCancel) {
        setImageUri(response.uri);
      }
    });
  };

  const requestCameraPermission = async () => {
    try {
      setModalVisible(!modalVisible);
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
      setModalVisible(!modalVisible);
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

  const triggerMenu = () =>
    Alert.alert('Chat Options', 'Select Any one to Proceed', [
      {
        text: 'Close Chat',
        onPress: () => console.log('Close Chat pressed'),
      },
      {
        text: 'Chat History',
        onPress: () => {
          datePicker();
        },
      },
      {
        text: 'My Profile',
        onPress: () => console.log('Profile pressed'),
      },
    ]);

  const refreshPage = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2500);
  }, []);

  const changeFromDate = (event, newDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (newDate !== undefined && newDate !== null && newDate !== '') {
      setFromDate(newDate);
    }
  };

  const changeToDate = (event, newDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (newDate !== undefined && newDate !== null && newDate !== '') {
      setToDate(newDate);
    }
  };

  const datePicker = () => {
    setShowPicker(!showPicker);
  };

  const DateUI = () => {
    return (
      <>
        {showPicker && (
          <View style={styles.datepickeraligned}>
            <DateTimePicker
              value={fromDate}
              mode="date"
              is24Hour={false}
              display="default"
              maximumDate={new Date()}
              onChange={changeFromDate}
            />
            <DateTimePicker
              value={toDate}
              mode="date"
              is24Hour={false}
              display="default"
              maximumDate={new Date()}
              onChange={changeToDate}
            />
          </View>
        )}
      </>
    );
  };

  const ChatHeader = () => {
    const navigation = useNavigation();
    console.log("Chat header", chat);
    useEffect(() => {
      console.log("Chat header", chat);
    }, [isValidchat]);
    return (
      <>
        <SafeAreaView style={{ backgroundColor: 'white' }}>
          <View style={styles.container}>
            {/* <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../assets/chevron-left-solid.png')}
                style={styles.logo}
              />
            </TouchableOpacity> */}
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
                {/* <Text style={styles.subtitle}>Online</Text> */}
              </View>
            </View>
            {/* <View style={styles.rightContainer}>
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
            </View> */}
          </View>
        </SafeAreaView>
      </>
    );

  };

  const ChatBody = () => {

    const scrollViewRef = React.useRef();

    React.useEffect(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, [chat.messages]);

    let renderMessage = ({ item, index }) => {
      return (
        <View style={{ flex: 1 }}>
          <ScrollView ref={scrollViewRef}
            onContentSizeChange={() => {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }}
            contentContainerStyle={styles.contentContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshPage} />}>
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

    return (
      <ImageBackground
        source={require('../../assets/twixor_chat_bg.png')}
        style={{ flex: 1 }}>
        <FlatList
          data={chat.messages}
          key={chat.messages.id.toString()}
          renderItem={chat.messages.length > 0 ? renderMessage() : (
            <View style={[styles.loadercontainer, styles.loaderhorizontal]}>
              <ActivityIndicator size="large" color="#217eac" text="Loading Data" />
            </View>
          )}
          keyExtractor={item => item.actionId.toString()}
          contentContainerStyle={styles.contentContainer}
          legacyImplementation={true}
          extraData={true}
          ref={flatList}
          onContentSizeChange={() => flatList.current.scrollToEnd()}
        />
      </ImageBackground>
    );
  };

  const ChatFooter = () => {

    const [message, setMessage] = React.useState('');
    const [recordAudio, setRecordAudio] = React.useState(false);
    const [switchRecord, setswitchRecord] = React.useState(true);

    const handleSendMessage = () => {
      console.log(message);

      const sendObject1 = {
        "eId": chat.eId,
        "action": "customerStartChat",
        "message": message,
        "chatId": chat.chatId,
        "contentType": "TEXT",
        "service": ""
      }
      const sendObject2 = {
        "eId": chat.eId,
        "action": "customerReplyChat",
        "message": message,
        "chatId": chat.chatId,
        "contentType": "TEXT",
        "service": ""
      }
      const sendObject = {
        action: 'agentReplyChat',
        eId: chat.eId,
        message: message,
        contentType: 'TEXT',
        chatId: chat.chatId,
        attachment: {},
        pickup: false,
      };
      console.log('send Object', chat['messages'] ? sendObject2 : sendObject1);
      messageService.sendMessage(chat['messages'] ? sendObject2 : sendObject1);
      setMessage('');
      setImageSource(null);
    };

    const BottomModalForIndividualChat = () => {
      return (
        <>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View style={[styles.centeredView, { height: height / 2 }]}>
                  <View style={styles.modalView}>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={requestGalleryPermission}>
                      <Image
                        source={require('../../assets/gallery.png')}
                        style={styles.imageIcon}
                      />
                      <Text style={styles.submitButtonText}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={requestCameraPermission}>
                      <Image
                        source={require('../../assets/camera.png')}
                        style={styles.imageIcon}
                      />
                      <Text style={styles.submitButtonText}>
                        Camera
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={requestGalleryPermission}>
                      <Image
                        source={require('../../assets/documents.png')}
                        style={styles.imageIcon}
                      />
                      <Text style={styles.submitButtonText}>Documents</Text>
                    </TouchableOpacity>
                  </View>
                </View></TouchableOpacity>
            </Modal>
          </View>
        </>
      );
    };

    const startAudio = () => {
      setRecordAudio(!recordAudio);
      recordAudio ? ToastAndroid.showWithGravityAndOffset(
        'Recording Stopped',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        25,
        50,
      ) : null;
      setswitchRecord(!switchRecord)
    };

    const recordAlert = () => {
      ToastAndroid.showWithGravityAndOffset(
        'Do a Long Press to Record / Stop an Audio',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    };

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={{ backgroundColor: 'white' }}>
            <View style={styles.footercontainer}>
              <>
                {switchRecord ?
                  <>
                    <View >
                      <TouchableOpacity style={styles.attachmentButton} onPress={() => setModalVisible(true)}>
                        <Image source={require('../../assets/attach_file.png')} style={styles.attachmentIcon} />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.input}
                      value={message}
                      onChangeText={setMessage}
                      placeholder="Type a message"
                      multiline
                    /></> : <Text style={styles.recordingOnProgress}>Recording Initiated, Do a Long Press to Stop Audio.....</Text>}
              </>
              {message.trim().length > 0 ? (
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <Image source={require('../../assets/send_128.png')} style={styles.sendIcon} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={recordAlert} onLongPress={startAudio}>
                  <Image
                    source={require('../../assets/mic.png')}
                    style={{ tintColor: recordAudio ? 'red' : '#406c74', ...styles.attachmentButton1 }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <BottomModalForIndividualChat />
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };

  return (
    isValidchat ? (
      <MenuProvider>
        <ChatHeader />
        <ChatBody />
        <ChatFooter />
      </MenuProvider>
    ) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator
        hidesWhenStopped={isValidchat}
        size="large"
        color="#217eac"></ActivityIndicator>
      <Text style={{ marginTop: 10 }}>Loading Chat</Text>
    </View>
  );
};

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 60,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
    backgroundColor: '#3c6e71'
  },
  backButton: {
    padding: 8,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  logo: {
    width: 24,
    height: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 8,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    paddingVertical: "2.5%",
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'inherit'
  },
  menuButton: {
    padding: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: "3%",
    paddingBottom: "17%"
  },
  messageSent: {
    backgroundColor: '#d7ebec',
    alignSelf: 'flex-end',
    maxWidth: '80%',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderTopRightRadius: 0,
    fontFamily: 'inherit'
  },
  messageReceived: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderTopLeftRadius: 0
  },
  messageText: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'inherit'
  },
  messageText1: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'inherit'
  },
  timestampText: {
    fontSize: 10,
    color: 'gray',
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily: 'inherit'
  },
  timestampText1: {
    fontSize: 10,
    color: 'gray',
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily: 'inherit'
  },
  footercontainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'whitesmoke'
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
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 150,
    marginRight: '5%',
    fontFamily: 'inherit'
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
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  loadercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderhorizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderhorizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  datepickeraligned: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: height / 2,
  },
  modalView: {
    backgroundColor: '#22343e',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '95%',
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  submitButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    marginTop: 10,
    width: "30%",
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#8599a2',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 7
  },
  imageIcon: {
    width: 40,
    height: 40,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  recordingOnProgress: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    borderRadius: 16,
    paddingHorizontal: 1,
    paddingVertical: 12,
    maxHeight: 150,
    marginRight: '5%',
    color: 'black'
  },
  alertcontainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 5,
    textAlign: 'center',
    alignItems: 'center',
    width: '45%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10
  },
  alerttext: {
    color: 'gray',
    fontSize: 15,
  },
});

export default IndividualChat;

import React from 'react';
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
} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-picker';
const { height } = Dimensions.get('window');

let data = [
  {
    id: 1,
    name: 'Twixor Chat Bot',
    avatar: 'https://img.freepik.com/free-photo/portrait-wise-person_52683-100915.jpg?t=st=1696402043~exp=1696402643~hmac=c6beb01eec2fac15ffdd7ec6cf99f0ef1898d4157ec1d3813cf7a6235557ff69',
    lastMessage: 'Hi, Good Morning',
    time: 'Sep 12th 2023 10:30 AM',
    unreadCount: 3,
    status: 'online',
    messages: [
      { id: 1, sender: 'john', text: 'Hi there', timestamp: 'Sep 12th 2023 10:00 AM' },
      { id: 2, sender: 'me', text: 'Hi, Good Morning', timestamp: 'Sep 12th 2023 11:00 AM' },
      { id: 3, sender: 'john', text: 'How are your relatives?', timestamp: 'Sep 12th 2023 11:30 AM' },
      { id: 4, sender: 'me', text: 'They are doing well, thanks for asking!', timestamp: 'Sep 12th 2023 11:45 AM' },
      { id: 5, sender: 'john', text: 'Thats great to hear. By the way, have you heard about the testing messages issue?', timestamp: 'Sep 12th 2023 12:00 PM' },
      { id: 6, sender: 'me', text: 'Yes, Ive heard about it. It happened due to a server glitch.', timestamp: 'Sep 12th 2023 12:15 PM' },
      { id: 7, sender: 'john', text: 'Do you know when it will be fixed?', timestamp: 'Sep 12th 2023 12:30 PM' },
      { id: 8, sender: 'me', text: 'The development team is actively working on it. Hopefully, it will be resolved soon.', timestamp: 'Sep 12th 2023 12:45 PM' },
      { id: 9, sender: 'john', text: 'Alright, thanks for the update.', timestamp: ' Sep 12th 2023 1:00 PM' },
    ],
  },
];

function IndividualChat() {
  const [chatData, setChatData] = React.useState(data[0]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [imageSource, setImageSource] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);

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
    // const navigation = useNavigation();
    return (
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <View style={styles.container}>
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.navigate('ChatScreen');
            }}>
            <Image
              source={require('../../assets/chevron-left-solid.png')}
              style={styles.logo}
            />
          </TouchableOpacity> */}
          <View style={styles.leftContainer}>
            <Image source={require('../../assets/potratit.png')} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{chatData.name}</Text>
              {/* <Text style={styles.subtitle}>{chatData.status}</Text> */}
            </View>
          </View>
          {/* <View style={styles.rightContainer}>
            <TouchableOpacity onPress={triggerMenu}>
              <Image
                source={require('../../assets/inside_menu_64.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View> */}
        </View>
      </SafeAreaView>
    );
  };

  const ChatBody = () => {
    const scrollViewRef = React.useRef();

    React.useEffect(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, [chatData.messages]);

    const renderMessages = () => {
      return chatData.messages.map(item => (
        <ScrollView
          key={item.id.toString()}
          style={item.sender === 'me' ? styles.messageSent : styles.messageReceived}>
          <Text style={item.sender === 'me' ? styles.messageText : styles.messageText1}>{item.text.trim()}</Text>
          <Text style={item.sender === 'me' ? styles.timestampText : styles.timestampText1}>{item.timestamp}</Text>
          {item.imageSource ? (
            <Image source={{ uri: item.imageSource }} style={{ width: 150, height: 150 }} />
          ) : null}
        </ScrollView>
      ));
    };

    return (
      <ImageBackground
        source={require('../../assets/twixor_chat_bg.png')}
        style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshPage} />}>
          {chatData.messages.length > 0 ? renderMessages() : (
            <View style={[styles.loadercontainer, styles.loaderhorizontal]}>
              <ActivityIndicator size="large" color="#217eac" text="Loading Data" />
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    );
  };

  const ChatFooter = () => {
    const [message, setMessage] = React.useState('');
    const [recordAudio, setRecordAudio] = React.useState(false);
    const [switchRecord, setswitchRecord] = React.useState(true);

    let handleSendMessage = () => {
      const newMessage = {
        id: chatData.messages.length + 1,
        sender: 'me',
        text: message,
        timestamp: '9:00 AM',
        imageSource: imageSource,
      };
      const updatedChatData = {
        ...chatData,
        messages: [...chatData.messages, newMessage],
      };
      setChatData(updatedChatData);
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
      </KeyboardAvoidingView>
    );
  };

  return (
    <>
      <ChatHeader />
      {/* <View style={styles.alertcontainer}>
        <Text style={styles.alerttext}>You Started a Chat</Text>
      </View> */}
      <DateUI />
      <ChatBody />
      <ChatFooter />
    </>
  );
}

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
    fontFamily : 'inherit'
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
    fontFamily : 'inherit'
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
    fontFamily : 'inherit'
  },
  messageText1: {
    fontSize: 14,
    color: 'black',
    fontFamily : 'inherit'
  },
  timestampText: {
    fontSize: 10,
    color: 'gray',
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily : 'inherit'
  },
  timestampText1: {
    fontSize: 10,
    color: 'gray',
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily : 'inherit'
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
    fontFamily : 'inherit'
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
    marginTop : 7
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
    marginTop : 10,
    marginBottom : 10
  },
  alerttext: {
    color: 'gray',
    fontSize: 15,
  },
});

export default IndividualChat;

import React, {
  useEffect,
  useState,
  useRef
} from 'react';
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
  BackHandler,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { timeConversion } from '../utils/utilities';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { messageService } from '../services/websocket';
import Variables from '../utils/variables';
import websocket from '../services/websocket';

import { registerApi, checkTokenApi, chatCreationApi, getChatInfo } from '../services/api';

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

export const IndividualChat = ({ route }) => {
  const navigation = useNavigation();
  const [chatData, setChatData] = React.useState(data[0]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [imageSource, setImageSource] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);
  const [isSocketConnected, setSocketConnection] = useState(false);
  const socketListener = React.useRef();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [socketResponse, setSocketResponse] = useState({});
  const [chatId, setChatId] = useState('');
  const [isValidchat, setIsValidChat] = useState(false);
  const [chat, setChat] = useState({});
  const scrollViewRef = useRef();
  const [users, setUsers] = useState([]);
  const [heartbeatIntervalTimer, setHeartbeatIntervalTimer] = useState(null);
  const [MISSED_HEARTBEATS, setMissedHeartbeats] = useState(0);

  const MAX_MISSED_HEARTBEATS = 2; // Replace with your actual value
  const HEARTBEAT_INTERVAL_TIME = 30000; // Replace with your actual value
  const heartbeat_msg = { "action": "ping" };; // Replace with your actual message


  Variables.API_URL = route.params.userDetails.baseUrl;
  Variables.EID = route.params.userDetails.eId;
  Variables.MobileNum = route.params.userDetails.customerId;
  Variables.cCode = route.params.userDetails.countryCode;
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      const scrollViewHeight = 1000; // Replace with the actual height of your ScrollView
      scrollViewRef.current.scrollTo({ y: scrollViewHeight, animated: true });
    }
  };
  const setupPingPong = () => {
    if (heartbeatIntervalTimer !== null) {
      clearInterval(heartbeatIntervalTimer);
    }
    setMissedHeartbeats(0);

    const pingInterval = setInterval(() => {
      try {
        if (MISSED_HEARTBEATS >= MAX_MISSED_HEARTBEATS) {
          console.log("Too many missed heartbeats. Reconnecting websocket");
          clearInterval(pingInterval);
          // Implement your close and connect logic here
          return;
        }
        setMissedHeartbeats((prevMissed) => prevMissed + 1);
        if(websocket.isConnected){
          websocket.sendingMessage({"action": "ping"});
        }
        // Implement your sendMessage logic here
      } catch (e) {
        clearInterval(pingInterval);
        console.log("Closing connection while heartbeat. Reason: " + e.message);
        // Implement your close and connect logic here
        websocket.close();
        websocket.connect();
      }
    }, HEARTBEAT_INTERVAL_TIME);

    setHeartbeatIntervalTimer(pingInterval);
  };
  
  useEffect(() => {
    setupPingPong(); // Initialize the ping-pong mechanism when the component mounts
    return () => {
      // Cleanup: clear the interval when the component unmounts
      if (heartbeatIntervalTimer !== null) {
        clearInterval(heartbeatIntervalTimer);
      }
    };
  }, []);
  // useEffect(() => {
  //   // Scroll to the bottom whenever content size changes (e.g., when a new item is added)
  //   scrollToBottom();
  // }, [chat]);
  function chatMessageUpdate(obj) {
    var res = obj.content[0].response;
    var chatId = res.chat.chatId;
    var messages = res.chat.messages;
    var concatMesssgaes = [];
    var newChatMessages = [];
    console.log("chat.current ", chat);
    if (chat['messages']) {
      concatMesssgaes = [...chat.messages, ...messages];
      console.log("concatMessages", concatMesssgaes);
      newChatMessages = [...chat.messages, ...messages]
    }
    else {
      concatMesssgaes = [...messages];
      newChatMessages = [
        ...new Map(concatMesssgaes.map(item => [item.actionId, item])).values(),
      ];
    }
    chat['messages'] = concatMesssgaes //newChatMessages;
    console.log(
      'After Updating current',
      JSON.stringify(chat.messages),
    );

  }
  const customerValidation = async () => {
    const getOldEid = await AsyncStorage.getItem('eId');
    const getOldCustomerId = await AsyncStorage.getItem('customerId');
    if (getOldEid && getOldCustomerId) {
      if (route.params.userDetails.eId == parseFloat(getOldEid)) {
        if (route.params.userDetails.customerId == getOldCustomerId) {
          return true;
        }
      }
      else {
        await AsyncStorage.setItem('eId', route.params.userDetails.eId.toString());
        await AsyncStorage.setItem('customerId', route.params.userDetails.customerId);
        await AsyncStorage.setItem('auth-token', '');
        return true;
      }
    }
    else {
      await AsyncStorage.setItem('eId', route.params.userDetails.eId.toString());
      await AsyncStorage.setItem('customerId', route.params.userDetails.customerId);
      await AsyncStorage.setItem('auth-token', '');
      return true;
    }
  }
  const setToken = async () => {

    console.log("register token call 2");
    registerApi(Variables.MobileNum, Variables.cCode, Variables.EID)
      .then(async data => {
        console.log("register token api--> ", data);
        var token = data.response.token;
        if (token) {
          await AsyncStorage.setItem('auth-token', token);
          Variables.TOKEN = token;
          checkToken();
        }
      })
      .catch(error => console.error('Error:', error));

  };
  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem('auth-token');

    console.log("Token -->", storedToken);
    if (storedToken && storedToken != '') {
      Variables.TOKEN = storedToken;
      checkTokenApi()
        .then(async data => {
          console.log("Check token api--> ", data);
          if (data == true) {
            setIsTokenValid(true);
            console.log(websocket);

            // console.log('socket Instance', websocket.checkInstance());
            // console.log('socket Instance2', websocket.checkConnection());
            console.log(websocket.isConnected);
            if (!websocket.isConnected) {
              websocket.connect();
              websocket.waitForSocketConnection(() => { });
            }
            else {
              console.log("Alive Connetion");
              websocket.connect();
              websocket.waitForSocketConnection(() => { });
            }

          }
          else if (data == false) {
            await setToken();
          }
          else {
            console.log("Check Toke False", data);
          }
        })
        .catch(error => console.error('Error:', error));
    }
    else {
      console.log("register token call 1");
      setToken();
    }
  };
  function handleBackButtonClick() {
    console.log('Navigation back button clicked');
    console.log(websocket)
    // socketListener.current.unsubscribe();
    // socketListener.current = null;
    //websocket.socketRef = null;
    websocket.closeSocket();
    // WebSocketClient.instance = null;
    setSocketConnection(false);

    console.log(websocket);


    return false;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);
  useEffect(() => {
    customerValidation().then(data => {
      console.log("customerValidation --> ", data);
      checkToken();
    });

  }, []);

  useEffect(() => {
    chatIdValidation();
  }, [isTokenValid])
  useEffect(() => {

    socketListener.current = messageService.getMessage().subscribe(data => {
      console.log("Chatonm Socket", chat);
      var obj = JSON.parse(data);
      console.log('socket Instance2', websocket.checkConnection());
      console.log('globListen', obj.action);
      if (obj.action === 'onOpen') {
        var content = obj.content[0];
        if (content.response && content.response.customer) {
          setSocketConnection(true);
          console.log("Connection is true");
        }

      } else if (obj.action === 'customerStartChat') {
        chatMessageUpdate(obj);
        setSocketResponse(obj);
      } else if (obj.action === 'agentPickupChat') {
        if (obj.content) {
          var newChat = obj.content[0].response.chat;
          var users = obj.content[0].response.users;
          setUsers(users);
          chatMessageUpdate(obj);
          setSocketResponse(obj);
        }
      } else if (obj.action === 'agentEndChat') {
        var res = obj.content[0].response;
        var chatId = res.chat.chatId;
        chatMessageUpdate(obj);
        setSocketResponse(obj);
      } else if (obj.action === 'customerReplyChat') {
        chatMessageUpdate(obj);
        setSocketResponse(obj);
      } else if (obj.action === 'agentReplyChat') {
        chatMessageUpdate(obj);
        setSocketResponse(obj);
      } else {
      }
    });
    return () => {
      socketListener.current.unsubscribe();
      setSocketConnection(false);
    };
  }, [chat, isValidchat]);
  useEffect(() => {
    // setIsTokenValid(false);


  }, [users]);
  useEffect(() => {
    //setSocketConnection(isSocketConnected);
    setIsValidChat(isValidchat);
  }, [isValidchat, isSocketConnected])

  newChatCreation = () => {
    chatCreationApi(Variables.EID)
      .then(async data => {
        console.log('Chat Creation data-->', data);
        if (data.status) {
          let newChatId = data.response.chatId;

          setChatId(newChatId);
          await AsyncStorage.setItem('chatId', newChatId);
          // setIsValidChat(false);
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
            let users = data.users;
            if (res.state != 3) {

              //  setChat(res);
              setChat(res);
              setIsValidChat(true);
              setUsers(users);
              if(websocket.isConnected){
                setSocketConnection(true);
              }
              console.log("chat ", chat)
              //  console.log("chat res--> ",res);
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

  //   const DateUI = () => {
  //     return (
  //       <>
  //         {showPicker && (
  //           <View style={styles.datepickeraligned}>
  //             <DateTimePicker
  //               value={fromDate}
  //               mode="date"
  //               is24Hour={false}
  //               display="default"
  //               maximumDate={new Date()}
  //               onChange={changeFromDate}
  //             />
  //             <DateTimePicker
  //               value={toDate}
  //               mode="date"
  //               is24Hour={false}
  //               display="default"
  //               maximumDate={new Date()}
  //               onChange={changeToDate}
  //             />
  //           </View>
  //         )}
  //       </>
  //     );
  //   };

  const ChatHeader = () => {
    // const navigation = useNavigation();
    console.log("header -- > ", chat)
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
            {chat.customerIconUrl && chat.customerIconUrl == "" ? (
              <Image source={{ uri: chat.customerIconUrl }} style={styles.avatar} />
            ) : (
              <Image
                source={require('../../assets/boy_dummy.png')}
                style={styles.avatar}
              />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{chat.customerName}</Text>
              {/* <Text style={styles.subtitle}>{c.status}</Text> */}
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
    // const renderMessage = ({ item }) => {
    //   return (
    //     <ScrollView
    //       style={
    //         item.sender === 'me' ? styles.messageSent : styles.messageReceived
    //       }>
    //       {console.log(user)}
    //       <Text style={styles.messageText}>{item.text.trim()}</Text>
    //       <Text style={styles.timestampText}>{item.timestamp}</Text>
    //       {item.imageSource ? <Image source={{ uri: item.imageSource }} style={{ width: 150, height: 150 }} /> : null}
    //     </ScrollView>
    //   );
    // };

    // return (
    //   <FlatList
    //     data={
    //       chatData.messages.length > 0 ? (
    //         chatData.messages.map(res => res)
    //       ) : (
    //         <View style={[styles.loadercontainer, styles.loaderhorizontal]}>
    //           <ActivityIndicator
    //             size="large"
    //             color="#217eac"
    //             text="Loading Data"
    //           />
    //         </View>
    //       )
    //     }
    //     renderItem={renderMessage}
    //     keyExtractor={item => user.id.toString()}
    //     contentContainerStyle={styles.contentContainer}
    //     refreshControl={
    //       <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
    //     }
    //   />
    // );

    const scrollViewRef = React.useRef();

    React.useEffect(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, [chat.messages]);

    const renderMessages = () => {
      console.log("Messages-->", chat.messages)
      return chat.messages ? chat.messages.map((item, index) => (
       
        <View>
          {item.actionType == 0 ? (
            <View style={styles.alertcontainer} key={0}>
              <Text style={styles.alerttext}>You Started a Chat</Text>
            </View>
          ) : <></>}
          {item.actionType == 1 ? (
            <View style={styles.messageSent} key={item.actionId}>
              <Text style={styles.messageText} >
                {item.message.trim()}
              </Text>
              <Text style={styles.timestampText1}>
                {timeConversion(item.actedOn)}
              </Text>
            </View>
          ) : item.actionType == 0 ? (
            <View style={styles.messageSent} key={item.actionId}>
              <Text style={styles.messageText} >
                {item.message}
              </Text>
              <Text style={styles.timestampText}>
                {timeConversion(item.actedOn)}
              </Text>
            </View>
          ) : item.actionType == 2 ? (
            <View style={styles.alertcontainer} key={item.actionId}>
              <Text style={styles.alerttext}>{users.filter((user) => user.id == item.actionBy)[0].name + ' '}
                picked up the chat</Text>
            </View>
          ) : item.actionType == 4 ? (
            <View style={styles.alertcontainer} key={item.actionId}>
              <Text style={styles.alerttext}>
                {users.filter((user) => user.id == item.actionBy)[0].name} transferred chat To You
              </Text>
            </View>
          ) : item.actionType == 5 ? (
            <View style={styles.alertcontainer} key={item.actionId}>
              <Text style={styles.alerttext}>
                {users.filter((user) => user.id == item.actionBy)[0].name}  invited
              </Text>
            </View>
          ) :
            item.actionType == 6 ? (
              <View style={styles.alertcontainer} key={item.actionId}>
                <Text style={styles.alerttext}>
                  {users.filter((user) => user.id == item.actionBy)[0].name}  accepted chat invitation
                </Text>
              </View>
            ) : item.actionType == 8 ? (
              <View style={styles.alertcontainer} key={item.actionId}>
                <Text style={styles.alerttext}>
                  {users.filter((user) => user.id == item.actionBy)[0].name} Closed this chat
                </Text>
              </View>
            ) : item.actionType == 9 ? (
              <View style={styles.alertcontainer} key={item.actionId}>
                <Text style={styles.alerttext}>
                  {users.filter((user) => user.id == item.actionBy)[0].name}  left this chat
                </Text>
              </View>
            ) : item.actionType == 3 ? (
              <View style={styles.messageReceived} key={item.actionId}>
                <Text style={styles.messageText} >
                  {item.message.trim()}
                </Text>
                <Text style={styles.timestampText}>
                  {timeConversion(item.actedOn)}
                </Text>
              </View>
            ) : (
              <View></View>
            )}

          {/* {item.imageSource ? (
            <Image source={{ uri: item.imageSource }} style={{ width: 150, height: 150 }} />
          ) : null} */}
        </View>
      )
      ) :
        <ScrollView
        >
          <View style={styles.messageReceived}>
            <Text style={styles.messageText}>Please say hi to agent</Text>
          </View>

        </ScrollView>
    };

    return (
      <ImageBackground
        source={require('../../assets/twixor_chat_bg.png')} // Replace with your actual image path
        style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshPage} />}>
          {chat.messages.length > 0 ? renderMessages() : (
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
      websocket.sendingMessage(chat['messages'] ? sendObject2 : sendObject1);
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

  return isSocketConnected ? (

    isValidchat ? (
      <>
        <StatusBar backgroundColor="#3c6e71" />
        <ChatHeader />
        {/* <DateUI /> */}
        <ChatBody />
        <ChatFooter />
      </>
    ) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator
        hidesWhenStopped={isValidchat}
        size="large"
        color="#217eac"></ActivityIndicator>
      <Text style={{ marginTop: 10 }}>Loading Chat</Text>
    </View>
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator
        hidesWhenStopped={isSocketConnected}
        size="large"
        color="#217eac"></ActivityIndicator>
      <Text style={{ marginTop: 10 }}>Loading Connection</Text>
    </View>
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
    fontFamily: 'inherit'
  },
  menuButton: {
    padding: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: "2%",
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
    backgroundColor: 'white',
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
    borderColor: 'gray',
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
    backgroundColor: 'whitesmoke',
    borderRadius: 15,
    paddingVertical: 2,
    textAlign: 'center',
    alignItems: 'center',
    width: 'auto',
    paddingHorizontal: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
    marginBottom: 5
  },
  alerttext: {
    color: 'black',
    fontSize: 12,
  },
});

export default IndividualChat;

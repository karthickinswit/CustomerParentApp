/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
// rimport { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated
} from 'react-native';
import Variables from './src/utils/variables';

import {ChatScreen} from './src/utils/globalupdate';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {FAB} from 'react-native-elements';
import { LogBox } from 'react-native';


export const ThemeContext = React.createContext({});
export default function ChatParent() {
  const Stack = createStackNavigator();
  //NativeModules.ExceptionsManager = null;
  //console.error = {};
   
   LogBox.ignoreAllLogs();
  //  YellowBox.ignoreWarnings([
  //   'Require cycle:'
  // ])
  return (
    // <ChatApp />
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="BlankPage" component={BlankPage} options={{headerShown: false}}/>
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen name="Conversation" component={Conversation} options={{headerShown: false}} /> */}
        
      </Stack.Navigator>
    </NavigationContainer>
  
    
  );
}
 LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [emailerror, setemailerror] = useState('');
  // const [passowrderror, setpassworderror] = useState('');
  const navigation = useNavigation();
  // onClickListener = viewId => {
  //   // Alert.alert('Alert', 'Button pressed ' + viewId);
  // };

  const HandleForgotPassword = () => {
    // forgot password function here
  };
  const ValidateEmail = username => {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(username.toLowerCase());
  };

  const HandleLogin = async () => {
    if ((!ValidateEmail(username) && password.length < 8) || username == '') {
      // setemailerror('Please Provide a Valid Email Address');
      // setpassworderror('Password Should not be Empty');
    } else if (password.length < 8) {
      // setpassworderror('Password Should not be Empty');
    } else {
      let res = await LoginApi();
      console.log('res', res);
      Alert.alert(JSON.stringify(res));
      if (res.status) {
        Alert.alert('Attempt Successful');
        console.log(res.response.token);
        navigation.navigate('BlankPage', {
          username: username,
          token: res.response.token,
          uId: res.response.uId,
        });
      } else {
        Alert.alert(res.message.message);
        // navigation.navigate('BlankPage', {
        //   username: username,
        //   token:
        //     'xr1wg9dAst8FByFeyO2yQSnMy414C0QGed6u/3rXdU0fXZJCEMLuKFgxM9RtZPcl',
        // });
      }
    }
  };
  async function LoginApi() {
    let payload = {};
    payload.email = username;
    payload.password = password;
    payload.removeExistingSession = true;
    payload.routePath = '';
    payload.appId = 'MOC';

    const LoginUri = await fetch(
      `https://qa.twixor.digital/moc/account/enterprise/login/twoFactorAuth?email=${encodeURIComponent(
        payload.email,
      )}&&password=${encodeURIComponent(
        payload.password,
      )}&removeExistingSession=${encodeURIComponent(
        payload.removeExistingSession,
      )}&routePath=&appId=${encodeURIComponent(payload.appId)}`,
      {
        crossDomain: true,
        method: 'POST',
        // headers: myHeaders,
        // body:formdata,//'email=mailkarthi001%40gmail.com&password=karthi5596&removeExistingSession=false&routePath=&appId=MOC'
      },
    );
    const LoginResponse = await LoginUri.json();

    return LoginResponse;
  }
  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="User Id"
        onChangeText={setUsername}
        value={username}
      />
      {/* {emailerror && <p>{emailerror}</p>} */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      {/* {passowrderror && <p>{passowrderror}</p>} */}
      <TouchableOpacity style={styles.button} onPress={HandleLogin}>
        <Text style={styles.buttonText}> Login </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={HandleForgotPassword}>
        <Text style={styles.forgotPasswordText}> Forgot Password? </Text>
      </TouchableOpacity>
    </View>
  );
};
const BlankPage = ({route}) => {
  const navigation = useNavigation();
  let chat={};

    chat['messages']=[
        {
            "id": "0",
            "sender": "me",
            "text": " yErLtR",
            "timestamp": "9:00 AM"
        },
        {
            "id": "1",
            "sender": "me",
            "text": " tnQCG6",
            "timestamp": "9:00 AM"
        },
        {
            "id": "2",
            "sender": "me",
            "text": " 2s0roJ",
            "timestamp": "9:00 AM"
        },
        {
            "id": "3",
            "sender": "me",
            "text": " 8t45cX",
            "timestamp": "9:00 AM"
        },
        {
            "id": "4",
            "sender": "me",
            "text": " YfOW49",
            "timestamp": "9:00 AM"
        },
        {
            "id": "5",
            "sender": "me",
            "text": " Svaypi",
            "timestamp": "9:00 AM"
        },
        {
            "id": "6",
            "sender": "me",
            "text": " IDetTs",
            "timestamp": "9:00 AM"
        },
        {
            "id": "7",
            "sender": "me",
            "text": " 6JOXfg",
            "timestamp": "9:00 AM"
        },
        {
            "id": "8",
            "sender": "me",
            "text": " o7qY03",
            "timestamp": "9:00 AM"
        },
        {
            "id": "9",
            "sender": "me",
            "text": " zCA9oJ",
            "timestamp": "9:00 AM"
        }
    ];

  const [chatData, setChatData] = useState(chat);
  const [message, setMessage] = React.useState('');

  const propDetails = {
    name: route.params.username,
    token: route.params.token,
    userId: route.params.uId,
    baseUrl: 'https://qa.twixor.digital/moc',
  };

  let handleSendMessage = () => {
    const newMessage = {
      id: chatData.messages.length + 1,
      sender: 'me',
      text: message,
      timestamp: '9:00 AM',
    };
    const updatedChatData = {
      ...chatData,
      messages: [...chatData.messages, newMessage],
    };
    //const that = this;
    
      setChatData(updatedChatData);
      console.log("Timesup");

    console.log(chatData);
    setMessage('');
  };

  const HandleClick = async () => {
    Variables.API_URL = propDetails.baseUrl;
    Variables.TOKEN = propDetails.token;
    console.log('Button Clicked');
    var context=ThemeContext;
    
    //  navigation.navigate('Conversation',{context});

    navigation.navigate('ChatScreen', {
      userDetails: propDetails,
    });
    // // <ChatListPage test={'data received from parent'} />;
  };
  const renderMessage = ({item}) => {
    return (
      <Animated.ScrollView style={{marginTop: 0}}
        >
        <View style={
          item.sender === 'me' ? styles.messageSent : styles.messageReceived
        }>
            
          
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestampText}>{item.timestamp}</Text>
        </View>
      </Animated.ScrollView>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {/* <Text style={{marginBottom: 20}}> Hello {route.params.username} </Text>
        <ActivityIndicator size="large" color="#217eac" />
        <View>
        <Menu>
      <MenuTrigger text='Select action' />
      <MenuOptions>
        <MenuOption onSelect={() => alert(`Save`)} text='Save' />
        <MenuOption onSelect={() => alert(`Delete`)} >
          <Text style={{color: 'red'}}>Delete</Text>
        </MenuOption>
        <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
      </MenuOptions>
    </Menu>
        </View> */}
        {/* <Button title="Click Here" onPress={handleclick}></Button> */}
        <View style={{height: 300}}>
  
  {/* <Animated.FlatList
    data={chatData.messages}                 
    renderItem={renderMessage}
    keyExtractor={item => item.id.toString()}
    contentContainerStyle={styles.contentContainer}
    // refreshControl={
    //   <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
    // }
  /> */}
  </View>
  {/* <View>
  <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}>
                <Image
                  source={require('./assets/send_128.png')}
                  style={styles.sendIcon}
                />
              </TouchableOpacity>
  </View> */}
        <FAB
          title="start Messaging"
          style={styles.floatinBtn}
          onPress={HandleClick}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 100,
  },
  input: {
    width: '75%',
    height: 60,
    padding: 10,
    marginBottom: 30,
    borderColor: '#ccc',
    borderRadius: 0,
    // borderBottomWidth: "2px",
    borderBottomColor: 'gray',
    fontSize: 22,
  },
  button: {
    width: '75%',
    height: 60,
    backgroundColor: '#217eac',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  forgotPassword: {
    marginTop: 10,
    marginBottom: '20%',
  },
  forgotPasswordText: {
    color: '#00bcd4',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  floatinBtn: {
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  messageSent: {
    backgroundColor: '#ecf6fd',
    alignSelf: 'flex-end',
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
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

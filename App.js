import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Button,
    PermissionsAndroid,
    Alert
  } from 'react-native';
  import { IndividualChat } from 'chatcustomersdk/src/screens/ChatPage';
  import { NavigationContainer, useNavigation } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import AudioRecorderPlayer from 'react-native-audio-recorder-player';
  import RNFS from 'react-native-fs';
  import SoundRecorder from 'react-native-sound-recorder';
  const Stack = createNativeStackNavigator();
  export default function CustomerParent(){

    return (
        <>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
             {/* <Stack.Screen
                name="BlankPage"
                component={BlankPage}
                options={{ headerShown: false }}
              /> */}
              <Stack.Screen
                name="IndividualChat"
                component={IndividualChat}
                options={{ headerShown: false }}
              />
             {/* <Stack.Screen
                name="JustInTime"
                component={JustInTime}
                options={{ headerShown: false }}
              /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </>
      );
    
  }
  LoginScreen = () => {
  const [customerId, setCustomerId] = useState('');
  const [eId, setEId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const navigation = useNavigation();
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const [state,setState]=useState({});

  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');



  const ValidateEmail = customerId => {
    const regex =
    /^[0]?[789]\d{9}$/;
    return regex.test(customerId.toLowerCase());
  };

//  const onStartRecord = async () => {
   const recordingPath = RNFS.DocumentDirectoryPath + '/newfile.mp3';
//   console.log(recordingPath);
//     //const result = await audioRecorderPlayer.startRecorder();
//     // audioRecorderPlayer.addRecordBackListener((e) => {
   
//     //     recordSecs= e.currentPosition;
//     //     recordTim= audioRecorderPlayer.mmssss(
//     //       Math.floor(e.currentPosition),
//     //     );
      
      
//     // });
//     audioRecorderPlayer.startRecorder(recordingPath).then((result) => {
//       console.log(result);
//     });
   // console.log(result);
  //   return;
  // };
  // onStopRecord = async () => {
  // //   const result = await audioRecorderPlayer.stopRecorder();
  // // audioRecorderPlayer.removeRecordBackListener();
    
  // //     recordSecs= 0;
    
  // //   console.log(result);
  // audioRecorderPlayer.stopRecorder().then((result) => {
  //   console.log(result);
  // });
 
  // };

////////////////////////////////////////////////////////


// program to generate random strings

// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
const onStartRecord = async () => {
  // const result = await audioRecorderPlayer.startRecorder(SoundRecorder.PATH_DOCUMENT +'/'+generateString(7)+'.mp3',)
  //   audioRecorderPlayer.addRecordBackListener((e) => {
  //     console.log(e);
  //     setRecordSecs(e.current_position);
  //     setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
  //   });
  //   console.log(result);
  // const result = await audioRecorderPlayer.startRecorder();
  // console.log(result);
  SoundRecorder.start(RNFS.DownloadDirectoryPath +'/'+generateString(7)+'.mp3')
    .then(function() {
        console.log('started recording');
    });
};

const onStopRecord = async () => {
  
  // const result = await audioRecorderPlayer.stopRecorder();
  // audioRecorderPlayer.removeRecordBackListener();
  
  // setRecordSecs(0);
  // console.log(result);
  // const result = await audioRecorderPlayer.stopRecorder();
  // setRecordSecs(0);
  // console.log(result);
  SoundRecorder.stop()
    .then(function(result) {
        console.log('stopped recording, audio file saved at: ' + result.path);
    });
};

const onStartPlay = async () => {
  console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      setCurrentPositionSec(e.current_position);
      setCurrentDurationSec(e.duration);
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
    });
};

const onPausePlay = async () => {
  await audioRecorderPlayer.pausePlayer();
};

const onStopPlay = () => {
  console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
};
///////////////////////////////////////////////////////

  const HandleLogin = async () => {
  console.log("Handl Login");
 //   setIsLoading(true);
   // setIsError(false);
   const propDetails = {
    customerId: '8190083902',
    countryCode : '+91',
    eId: 100,
    baseUrl: 'https://qa.twixor.digital/moc',
    customerInfo : {}
  };
  console.log("Handl Login",propDetails);
navigation.navigate('IndividualChat', {
    userDetails: propDetails,
  });
  };

  const handleRetry = () => {
    setIsError(false);
  };

  async function LoginApi() {
    let payload = {};
    payload.email = customerId;
    payload.eId = eId;
    payload.removeExistingSession = true;
    payload.routePath = '';
    payload.appId = 'MOC';

    const LoginUri = await fetch(
      `https://qa.twixor.digital/moc/account/enterprise/login/twoFactorAuth?email=${encodeURIComponent(
        payload.email,
      )}&&eId=${encodeURIComponent(
        payload.eId,
      )}&removeExistingSession=${encodeURIComponent(
        payload.removeExistingSession,
      )}&routePath=&appId=${encodeURIComponent(payload.appId)}`,
      {
        crossDomain: true,
        method: 'POST',
      },
    );

    const LoginResponse = await LoginUri.json();

    AsyncStorage.setItem('loginToken', LoginResponse.response.token)
      .then(() => {
        //console.log('Login token stored successfully');
      })
      .catch(error => {
        console.log('Error storing login token:', error);
      });

    return LoginResponse;
  }
    return (
        <>
          <View style={styles.container}>
            <Image source={require('./assets/logo.png')} style={styles.logo} />
            <TextInput
              style={styles.input}
              placeholder="Customer Id"
              onChangeText={setCustomerId}
              value={customerId}
            />
            <TextInput
              style={styles.input}
              placeholder="eId"
              secureTextEntry={true}
              onChangeText={setEId}
              value={eId}
            />
            {isError ? (
              <TouchableOpacity style={styles.submitButton2} onPress={handleRetry}>
                <Text style={styles.submitButtonText}>
                  Invalid Credentials. Try Again!
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={isSuccess ? styles.submitButton1 : styles.submitButton}
                onPress={HandleLogin}>
                <Text style={styles.submitButtonText}>
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : isSuccess ? (
                    'Login Successful'
                  ) : isError ? (
                    'Error'
                  ) : (
                    'Start Chat'
                  )}
                </Text>
              </TouchableOpacity>
              
            )}
             
    
              
             {/* <TouchableOpacity onPress={onStartRecord} style={styles.submitButton}> <Text style={styles.submitButtonText}> Start Record </Text></TouchableOpacity> 
      <TouchableOpacity onPress={onStopRecord} style={styles.submitButton}><Text style={styles.submitButtonText}>  Stop Record</Text></TouchableOpacity> 
      <TouchableOpacity onPress={onStartPlay} style={styles.submitButton}><Text style={styles.submitButtonText}>  Start Play</Text></TouchableOpacity> 
      <TouchableOpacity onPress={onPausePlay} style={styles.submitButton}><Text style={styles.submitButtonText}>  Pause Play</Text></TouchableOpacity> 
      <TouchableOpacity onPress={onStopPlay} style={styles.submitButton}><Text style={styles.submitButtonText}>  Stop Play</Text></TouchableOpacity> 
      <Text>Record Time: {recordTime}</Text>
      <Text>Play Time: {playTime}</Text>
      <Text>Duration: {duration}</Text> */}
            
          </View>
         
        </>
      );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFF',
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 40,
    },
    form: {
      width: '80%',
    },
    input: {
      backgroundColor: '#F2F2F2',
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      width: '80%',
    },
    submitButton: {
      backgroundColor: '#217eac',
      padding: 10,
      borderRadius: 10,
      marginTop: 10,
      width: '80%',
    },
    submitButton1: {
      backgroundColor: 'green',
      padding: 10,
      borderRadius: 10,
      marginTop: 10,
      width: '80%',
    },
    submitButton2: {
      backgroundColor: '#cc0000',
      padding: 10,
      borderRadius: 10,
      marginTop: 10,
      width: '80%',
    },
    submitButtonText: {
      color: '#FFF',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
    },
    floatinBtn: {
      backgroundColor: 'blue',
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    floatinRightBtn: {
      backgroundColor: 'blue',
      position: 'absolute',
      bottom: 10,
      left: 10,
    },
  });
  
  const styles1 = StyleSheet.create({
    containerNewFab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      alignItems: 'center',
    },
    buttonNewFab: {
      backgroundColor: '#2196F3',
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    secondaryNewFab: {
      backgroundColor: '#FFC107',
    },
    textNewFab: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    helloText: {
      position: 'absolute',
      top: 20,
      bottom: 0,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
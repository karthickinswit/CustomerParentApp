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
  import { ChatScreen } from 'chatcustomersdk/src/utils/globalupdate';
  import { NavigationContainer, useNavigation } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
                name="ChatScreen"
                component={ChatScreen}
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

  const ValidateEmail = customerId => {
    const regex =
    /^[0]?[789]\d{9}$/;
    return regex.test(customerId.toLowerCase());
  };

  const HandleLogin = async () => {
  console.log("Handl Login");
    setIsLoading(true);
    setIsError(false);
    if ((!ValidateEmail(customerId)) || customerId == '') {
      setIsLoading(false);
    } else if (eId.length < 2) {
      setIsLoading(false);
    } else {
        if(customerId){
            const propDetails = {
                customerId: '8190083902',
                countryCode : '+91',
                eId: '103',
                baseUrl: 'https://qa.twixor.digital/moc',
              };
              console.log("Handl Login",propDetails);
            navigation.navigate('ChatScreen', {
                userDetails: propDetails,
              });

        
    //   let res = await LoginApi();
    //   if (res.status && res.response.token) {
    //     setIsLoading(false);
    //     setIsSuccess(true);
    //     setAuthToken(res.response.token);
        // setTimeout(() => {
        // //   navigation.navigate('BlankPage', {
        // //     customerId: customerId,
        // //     token: authToken,
        // //     uId: res.response.uId,
        // //   });
        // }, 10);
      } else {
        setIsError(true);
        setIsLoading(false);
      }
    }
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
                    'Login'
                  )}
                </Text>
              </TouchableOpacity>
            )}
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
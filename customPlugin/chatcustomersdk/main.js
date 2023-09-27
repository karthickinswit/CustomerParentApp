// /* eslint-disable prettier/prettier */
// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// //import {SafeAreaProvider} from 'react-native-safe-area-context';
// import LoginScreen from './src/screens/LoginScreen';
// import ChatListPage from './src/screens/ChatScreen';
// import IndividualChat from './src/screens/IndividualChat';
// import MyContext from './src/components/globalcontext';
// import {activeChats} from './src/services/api';
// import Variables from './src/utils/variables';

// const Stack = createStackNavigator();

// let SK = async ({route}) => {
//   const [myData, setMyData] = React.useState('Initials');
//   const [chatList,setChatList] = React.useState();
//   Variables.API_URL = route.params.userDetails.baseUrl;
//   Variables.ACTIVE_CHATS = '/e/enterprise/chat/summary';
//   Variables.CLOSED_CHATS = '/e/enterprise/chat/history?state=3';
//   Variables.TOKEN = route.params.userDetails.token;

//   React.useEffect( () => {
//     // route.params.useApi().then((res)=>{
//     //     console.log("a-->",res);
//     // });
//     // fetch('https://jsonplaceholder.typicode.com/photos')
//     // .then(res => res.json())
//     // .then(result => {
//     //     console.log(result);
//     //     setChatList(result)
//     // //   setData(data.albums)
//     // })
//     // .catch(error => console.log("error"))

//     // activeChats().then((jsonData) => {
//     //     console.log(jsonData);
//     //     setChatList(jsonData);
//     // });
//   },);

//   console.log('main.js', myData);
//   console.log('main.js-->chatList', chatList);
//   return (

//       <MyContext.Provider value={{chatList, setChatList}}>
//       <ChatListPage value={{chatList, setChatList}}/>
//         {/* <NavigationContainer independent={true}>
//           <Stack.Navigator >
//             <Stack.Screen
//               name="ChatListPage"
//               component={ChatListPage}
//               options={{headerShown: false}}
//             />
//             <Stack.Screen
//               name="IndividualChat"
//               component={IndividualChat}
//               options={{headerShown: false}}
//             />
//           </Stack.Navigator>
//         </NavigationContainer> */}
//       </MyContext.Provider>

//   );
// };

// // export  ChatScreen;

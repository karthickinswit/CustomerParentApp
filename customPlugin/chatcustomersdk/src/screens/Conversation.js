// import React, { useEffect,useState } from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   ScrollView,
//   Alert,
//   RefreshControl,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   ActivityIndicator,
//   Button,
//   Modal,
//   Dimensions,
//   Animated,
//   UIManager,
//   LayoutAnimation,
  
  
// } from 'react-native';
// //import {} from 'react-native-reanimated'
// import {useNavigation} from '@react-navigation/native';
// import AnimatedLoader from "react-native-animated-loader";
// //import DateTimePicker from '@react-native-community/datetimepicker';

// const {height} = Dimensions.get('window');

// function Conversation({route}) {
 
//     let chat={};

//     chat['messages']=[
//         {
//             "id": "0",
//             "sender": "me",
//             "text": " yErLtR",
//             "timestamp": "9:00 AM"
//         },
//         {
//             "id": "1",
//             "sender": "me",
//             "text": " tnQCG6",
//             "timestamp": "9:00 AM"
//         },
//         {
//             "id": "2",
//             "sender": "me",
//             "text": " 2s0roJ",
//             "timestamp": "9:00 AM"
//         },
//         {
//             "id": "3",
//             "sender": "me",
//             "text": " 8t45cX",
//             "timestamp": "9:00 AM"
//         },
//         {
//             "id": "4",
//             "sender": "me",
//             "text": " YfOW49",
//             "timestamp": "9:00 AM"
//         },
//         {
//             "id": "5",
//             "sender": "me",
//             "text": " Svaypi",
//             "timestamp": "9:00 AM"
//         },
//         {
//             "id": "6",
//             "sender": "me",
//             "text": " IDetTs",
//             "timestamp": "9:00 AM"
//         },
//         {
//             "id": "7",
//             "sender": "me",
//             "text": " 6JOXfg",
//             "timestamp": "9:00 AM"
//         },
//         {
//             "id": "8",
//             "sender": "me",
//             "text": " o7qY03",
//             "timestamp": "9:00 AM"
//         },
//         {
//             "id": "9",
//             "sender": "me",
//             "text": " zCA9oJ",
//             "timestamp": "9:00 AM"
//         }
//     ];
//     const fadeAnim= React.useRef(new Animated.Value(0)).current;

//   const [chatData, setChatData] = useState(chat);
//   const [refreshing, setRefreshing] = React.useState(false);
//   const [fromDate, setFromDate] = React.useState(new Date());
//   const [toDate, setToDate] = React.useState(new Date());
//   const [showPicker, setShowPicker] = React.useState(false);
//   useEffect(()=>{
//     // setTimeout(()=>{
//     // setChatData(chat);
//     // },5000);
//     setChatData(chatData);
    
//   },[chatData])

//   const triggerMenu = () =>
//     Alert.alert('Chat Options', 'Select Any one to Proceed', [
//       {
//         text: 'Customer Detail',
//         onPress: () => console.log('Customer Detail pressed'),
//       },
//       {
//         text: 'Invite Agent',
//         onPress: () => console.log('Invite Agent pressed'),
//       },
//       {
//         text: 'Transfer Chat',
//         onPress: () => console.log('Transfer Chat pressed'),
//       },
//       {
//         text: 'Close Chat',
//         onPress: () => console.log('Close Chat pressed'),
//       },
//       {
//         text: 'Chat History',
//         onPress: () => {
//           datePicker();
//         },
//       },
//     ]);

//   const refreshPage = React.useCallback(() => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 5000);
//   }, []);

//   const changeFromDate = (event, newDate) => {
//     if (Platform.OS === 'android') {
//       setShowPicker(false);
//     }
//     if (newDate !== undefined && newDate !== null && newDate !== '') {
//       setFromDate(newDate);
//     }
//   };

//   const changeToDate = (event, newDate) => {
//     if (Platform.OS === 'android') {
//       setShowPicker(false);
//     }
//     if (newDate !== undefined && newDate !== null && newDate !== '') {
//       setToDate(newDate);
//     }
//   };

//   const datePicker = () => {
//     setShowPicker(!showPicker);
//   };

//   const DateUI = () => {
//     return (
//       <View>
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
//             <Button
//               title="View"
//               color="#217eac"
//               onPress={() => {
//                 console.log('From date:', fromDate, 'To date:', toDate);
//               }}
//             />
//           </View>
//         )}
//       </View>
//     );
//   };

//   const ChatHeader = () => {
//     const navigation = useNavigation();
//     return (
//       <SafeAreaView style={{backgroundColor: 'white'}}>
//         <View style={styles.container}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => {
//               navigation.navigate('ChatScreen');
//             }}>
//             <Image
//               source={require('../../assets/chevron-left-solid.png')}
//               style={styles.logo}
//             />
//           </TouchableOpacity>
//           <View style={styles.leftContainer}>
//             <Image source={{uri: chatData.avatar}} style={styles.avatar} />
//             <View style={styles.textContainer}>
//               <Text style={styles.title}>{chatData.name}</Text>
//               <Text style={styles.subtitle}>{chatData.status}</Text>
//             </View>
//           </View>
//           <View style={styles.rightContainer}>
//             <TouchableOpacity onPress={triggerMenu}>
//               <Image
//                 source={require('../../assets/inside_menu_64.png')}
//                 style={styles.icon}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   };

//   const ChatBody = () => {
    
//     console.log(JSON.stringify(fadeAnim))
//     if (Platform.OS === 'android') {
//       console.log("UIMana");
//       if (UIManager.setLayoutAnimationEnabledExperimental) {
//         UIManager.setLayoutAnimationEnabledExperimental(true);
//       }
//       //UIManager.setLayoutAnimationEnabledExperimental(true);
//     }
//     const renderMessage = ({item}) => {
//       console.log("Error2");
//       return (
//         <Animated.ScrollView style={{marginTop: 0}}
//           >
//           <View style={
//             item.sender === 'me' ? styles.messageSent : styles.messageReceived
//           }>
              
            
//           <Text style={styles.messageText}>{item.text}</Text>
//           <Text style={styles.timestampText}>{item.timestamp}</Text>
//           </View>
//         </Animated.ScrollView>
//       );
//     };


//     if(chatData.messages)
//     {
//       console.log("Error1");
//     return (
    
//       <View style={{height: 300}}>
  
//       <Animated.FlatList
//         data={chatData.messages}                 
//         renderItem={renderMessage}
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={styles.contentContainer}
//         // refreshControl={
//         //   <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
//         // }
//       />
//       </View>
//     );
//     }
//     else{
//       return(
//         <View style={[styles.loadercontainer, styles.loaderhorizontal]}>
//         <Text>Loading ...............</Text>

        
//           <ActivityIndicator size="large" color="#217eac" />
//         </View>
//       );
//     }
//   };

//   const ChatFooter = () => {
//     const [message, setMessage] = React.useState('');
//     const [modalVisible, setModalVisible] = React.useState(false);

//     let handleSendMessage = () => {
//       const newMessage = {
//         id: chatData.messages.length + 1,
//         sender: 'me',
//         text: message,
//         timestamp: '9:00 AM',
//       };
//       const updatedChatData = {
//         ...chatData,
//         messages: [...chatData.messages, newMessage],
//       };
//       //const that = this;
//       console.log("-->",JSON.stringify(fadeAnim))
//         setChatData(updatedChatData);
//         LayoutAnimation.configureNext({duration: 500});
//         console.log("Timesup");

//       console.log(chatData);
//       setMessage('');
//     };

//     const BottomModalForIndividualChat = () => {
//       return (
//         <>
//           <View style={styles.centeredView}>
//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={modalVisible}
//               onRequestClose={() => {
//                 Alert.alert('Modal has been closed.');
//                 setModalVisible(!modalVisible);
//               }}>
//               <View style={[styles.centeredView, {height: height / 2}]}>
//                 <View style={styles.modalView}>
//                   <TouchableOpacity
//                     style={styles.submitButton}
//                     onPress={() => setModalVisible(!modalVisible)}>
//                     <Text style={styles.submitButtonText}>Camera</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.submitButton}
//                     onPress={() => setModalVisible(!modalVisible)}>
//                     <Text style={styles.submitButtonText}>
//                       Photo & Video library
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.submitButton}
//                     onPress={() => setModalVisible(!modalVisible)}>
//                     <Text style={styles.submitButtonText}>Documents</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Modal>
//           </View>
//         </>
//       );
//     };

//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <SafeAreaView style={{backgroundColor: 'white'}}>
//             <View style={styles.footercontainer}>
//               <TouchableOpacity
//                 style={styles.attachmentButton}
//                 onPress={() => setModalVisible(true)}>
//                 <Image
//                   source={require('../../assets/add_128.png')}
//                   style={styles.attachmentIcon}
//                 />
//               </TouchableOpacity>
//               <TextInput
//                 style={styles.input}
//                 value={message}
//                 onChangeText={setMessage}
//                 placeholder="Type a message"
//                 multiline
//               />
//               <TouchableOpacity
//                 style={styles.sendButton}
//                 onPress={handleSendMessage}>
//                 <Image
//                   source={require('../../assets/send_128.png')}
//                   style={styles.sendIcon}
//                 />
//               </TouchableOpacity>
//             </View>
//             <BottomModalForIndividualChat />
//           </SafeAreaView>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     );
//   };

//   return (
//     <>
//    {/*   <ChatHeader /> */}
//     {/*  <DateUI /> */}
//       <ChatBody />
//       <ChatFooter />
//     </>
//   );
// }

// let styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     height: 56,
//     backgroundColor: 'white',
//     paddingHorizontal: 16,
//     borderBottomColor: '#DDDDDD',
//     borderBottomWidth: 1,
//   },
//   backButton: {
//     padding: 8,
//   },
//   leftContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'flex-end',
//   },
//   logo: {
//     width: 24,
//     height: 24,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   textContainer: {
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   menuButton: {
//     padding: 8,
//   },
//   contentContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   messageSent: {
//     backgroundColor: '#ecf6fd',
//     alignSelf: 'flex-end',
//     maxWidth: '80%',
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 8,
//   },
//   messageReceived: {
//     backgroundColor: '#FFFFFF',
//     alignSelf: 'flex-start',
//     maxWidth: '80%',
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 8,
//   },
//   messageText: {
//     fontSize: 16,
//   },
//   timestampText: {
//     fontSize: 12,
//     color: 'gray',
//     marginTop: 4,
//     alignSelf: 'flex-end',
//   },
//   footercontainer: {
//     position: 'absolute',
//     bottom: 25,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
//   attachmentButton: {
//     marginRight: 16,
//   },
//   attachmentIcon: {
//     width: 24,
//     height: 24,
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#F2F2F2',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     maxHeight: 150,
//   },
//   sendButton: {
//     marginLeft: 16,
//   },
//   sendIcon: {
//     width: 24,
//     height: 24,
//   },
//   rightContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     flexGrow: 1,
//   },
//   icon: {
//     width: 24,
//     height: 24,
//     marginHorizontal: 10,
//   },
//   loadercontainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderhorizontal: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//   },
//   loadercontainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderhorizontal: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//   },
//   datepickeraligned: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 10,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     height: height / 2,
//   },
//   modalView: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: '100%',
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//     width: '95%',
//     marginBottom: 20,
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   submitButton: {
//     backgroundColor: '#217eac',
//     padding: 10,
//     borderRadius: 10,
//     marginTop: 10,
//     width: '95%',
//     marginBottom: 10,
//   },
//   submitButtonText: {
//     color: '#FFF',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
// });

// export default Conversation;
import React,{useState,useContext, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Animated,Image
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TestRenderer from 'react-test-renderer';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider
 } from 'react-native-popup-menu';
const Mem=React.createContext();



const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145591e29d72',
    title: 'Fourth Item',
  },
  {
    id: '58694b0f-3da1-471f-bd96-145591e29d72',
    title: 'Fifth Item',
  },
  {
    id: '58695b0f-3da1-471f-bd96-145591e29d72',
    title: 'Sixth Item',
  },
  {
    id: '58696b0f-3da1-471f-bd96-145591e29d72',
    title: 'Seventh Item',
  },
  {
    id: '58695b1f-3da1-471f-bd96-145591e29d72',
    title: 'Eighth Item',
  },
  {
    id: '58695b1f-3da1-472f-bd96-145591e29d72',
    title: 'Ninth Item',
  },
];

 

const Item = ({title}) => (
  <Animated.View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </Animated.View>
);
const renderMessage  = ({item, index})=>{
  return(
    <Animated.View style={styles.item}>
    <Text style={styles.title}>{item.message}</Text>
  </Animated.View>
  )
}

const Conversation = (props) => {
  const [listItem, setListItem] = useState(props.route.params.chat.messages);
  
  
  // const { value } = useContext(props.route.params.context);
 
   console.log("Conversation-->",JSON.stringify(props.route.params.chat.messages));
   let a=props.route.params.chat.messages;
   useEffect(()=>{
    // console.log("Value changed");
    // console.log(JSON.stringify(props.route.params.chat.messages[(props.route.params.chat.messages).length-1]));
    // let a=props.route.params.chat.messages;
    // setListItem(a)
    setListItem(props.route.params.chat.messages);
  },[])

  const onPress = () => {
    var len = 20,
    str = '';

while( len-- ) {
    str += String.fromCharCode( 48 + ~~(Math.random() * 42) );
}
console.log( str );
var a={};
a['id']=str
a['title']=str
try{
    setListItem([...listItem,a])
}
catch(e){
  console.log(JSON.stringify(e))
}
  };

 
  return (
    
    
   
    <SafeAreaView style={styles.container}>
    
    
    <Animated.ScrollView>
      <Animated.FlatList
        data={props.route.params.chat.messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        legacyImplementation={true}
        extraData={true}
        
      />
      </Animated.ScrollView>
      <TouchableOpacity style={styles.menu}>
      <MenuProvider>
      
        <Menu style={{position:'absolute',top:10,right:0}}>
     <MenuTrigger style={{top:10}} >
     <Text>Press Menu</Text>
           </MenuTrigger>
     <MenuOptions  optionsContainerStyle=
   {{paddingLeft:40,height:10,width:20}}>

       <MenuOption onSelect={() => alert('No New chats')} text="New Chats - {0}" /><MenuOption onSelect={() => alert('No Transferred Chats')} disabled={true}>
       <Text style={{ color: 'red' }}>Transferred Chat</Text>
     </MenuOption>
     <MenuOption onSelect={() => alert('Invited Chat')} disabled={true} text="Invited Chat" />
     </MenuOptions>
     </Menu>
     </MenuProvider>
     </TouchableOpacity>

        
        
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text>Press Here</Text>
      </TouchableOpacity>
    </SafeAreaView>
    
    
    
   
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  menu: {
    //alignItems: 'right',
    backgroundColor: '#D0DDDD',
    padding: 30,
  },
});

export default Conversation;
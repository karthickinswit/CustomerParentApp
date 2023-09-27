import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Tab, TabView} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {messageService} from '../services/websocket';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import {GlobalContext} from '../utils/globalupdate';
import {activeChats, closedChats, suspendedChats} from '../services/api';

let elementRef = React.createRef();

let ChatHeader = () => {
  const [blink, setBlink] = useState(true);
  const [isConnected, setIsConnected] = useState();
  const value = useContext(GlobalContext);
  useEffect(() => {
    checkConnectivity();
    let interval = new setInterval(() => {
      // setBlink(blink => !blink);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const navigation = useNavigation();

  const checkConnectivity = async () => {
    try {
      const response = await fetch('https://www.google.com');
      if (response.status === 200) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected('Connecting...');
    }
  };

  return (
    <View style={[styles.header]} ref={elementRef}>
      <View style={styles.left}>
        <Image
          source={require('../../assets/twixor_hd_icon.png')}
          style={styles.logo}
        />
        {isConnected === true ? (
          <View style={styles.status}>
            <Text style={styles.logotext}>Chats</Text>

            <View
              style={[styles.statusIndicator, {backgroundColor: '#5ED430'}]}
            />
            <Text style={styles.statusText}>Online</Text>
          </View>
        ) : (
          <View style={styles.status}>
            <Text style={styles.logotext}>Chats</Text>
            <Text style={styles.statusText1}>Connecting...</Text>
          </View>
        )}
      </View>
      <View style={[styles.right]}>
        <TouchableOpacity>
          <Menu
            style={{backfaceVisibility: 'visible'}}
            name="notifyMenu"
            onBackdropPress={console.log('on close menu')}>
            <MenuTrigger onPress={console.log('Bell icon pressed')}>
              <View style={styles.badgeSetup}>
                <Image
                  source={require('../../assets/notification_64.png')}
                  style={styles.icon}
                />
                {value.newChatCount.current > 0 ? (
                  <View
                    style={[
                      {
                        position: 'absolute',
                        backgroundColor: 'red',
                        width: 12,
                        height: 12,
                        borderRadius: 15 / 2,
                        right: 10,
                        top: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      {display: blink ? 'flex' : 'none'},
                    ]}>
                    <Text
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontSize: 8,
                      }}>
                      {value.newChatCount.current}
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
              </View>
            </MenuTrigger>
            <MenuOptions
              ref={elementRef}
              optionsContainerStyle={{
                paddingLeft: 10,
                height: 200,
                width: 150,
                flexDirection: 'column',
                borderRadius: 15,
                opacity: 5,
                alignContent: 'flex-start',
                backgroundColor: '#217eac',
                borderStyle: 'solid',
              }}>
              <MenuOption
                style={{borderColor: 'red'}}
                onSelect={() => {
                  if (value.newChatCount.current == 0) {
                    alert('No New chats');
                  } else {
                    const sendObject = {action: 'agentPickupChat', chatId: ''};
                    console.log('send Object', sendObject);
                    messageService.sendMessage(sendObject);
                  }
                }}>
                <Text style={styles.menuOptionText}>
                  Live Chats - {value.newChatCount.current.toString()}{' '}
                </Text>
              </MenuOption>
              <MenuOption
                onSelect={() => alert('No Transferred Chats')}
                disabled={true}>
                <Text style={styles.menuOptionText}>
                  Transferred Chat -{' '}
                  {value.transferredChatCount.current.toString()}{' '}
                </Text>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  //navigation.replace('JustInTime');
                }}>
                <Text style={styles.menuOptionText}>
                  Invite Chats - {value.invitedChatCount.current.toString()}{' '}
                </Text>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  //navigation.replace('JustInTime');
                }}>
                <Text style={styles.menuOptionText}>
                  Assigned Chats - {value.newChatCount.current.toString()}{' '}
                </Text>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  //navigation.replace('JustInTime');
                }}>
                <Text style={styles.menuOptionText}>
                  Missed Chats - {value.missedChatCount.current.toString()}{' '}
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </TouchableOpacity>
        {/* <Menu
          name="SideMenu"
          style={{
            paddingTop: 8,
            paddingRight: 10,
          }}>
          <MenuTrigger>
            <Image
              source={require('../../assets/inside_menu_64.png')}
              style={styles.icon1}
            />
          </MenuTrigger>
          <MenuOptions
            optionsContainerStyle={{
              height: 60,
              width: 130,
              flexDirection: 'column',
              borderRadius: 15,
            }}>
            <MenuOption style={{}} onSelect={() => alert('No New chats')}>
          <Text style={styles.statusText}>New Chats - 0</Text>
        </MenuOption>
        <MenuOption
          onSelect={() => alert('No Transferred Chats')}
          disabled={true}>
          <Text style={styles.statusText}>Transferred Chat</Text>
        </MenuOption>
            <MenuOption
              onSelect={() => {
               // navigation.replace('JustInTime');
              }}>
              <View
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.leftMenuOptionText}>Just In Time</Text>
                <Image
                  source={require('../../assets/linkicon.png')}
                  style={{height: 20, width: 16, paddingRight: 10}}
                />
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu> */}
      </View>
    </View>
  );
};

const ActiveChats = () => {
  const value = useContext(GlobalContext);
  const [activeChatList, setActiveChatList] = useState(() => {
    activeChats()
      .then(data => {
        console.log('active data-->', data);

        var users = data.users;
        var chats = data.chats;

        value.activeChatList.current = {users, chats};
        setActiveChatList({users, chats});

        console.log('Chats in Global update2', value.activeChatList.current);
      })
      .catch(error => console.error('Error:', error));
  });

  const tempList = React.useMemo(() => {
    return value.activeChatList;
  }, [tempList]);
  if ('chats' in tempList.current) {
    const navigation = useNavigation();
    return tempList.current.chats.length != 0 ? (
      <ScrollView>
        {tempList.current.chats.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate('IndividualChat', {chatId: item.chatId});
              }}>
              <View style={styles.item}>
                {item.customerIconUrl ? (
                  <Image
                    source={{uri: item.customerIconUrl}}
                    style={styles.avatar}
                  />
                ) : (
                  <Image
                    source={require('../../assets/boy_dummy.png')}
                    style={styles.avatar}
                  />
                )}
                <View style={styles.details}>
                  <Text style={styles.name}>{item.customerName}</Text>
                  <Text style={styles.lastMessage} key={index}>
                    {item.messages[item.messages.length - 1].message}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.time}>{item.time}</Text>
                  {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
          }}>
          No Active Chats Found
        </Text>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
          }}>
          <ActivityIndicator size="large" color="#217eac" />
        </Text>
      </View>
    );
  }
};

const SuspendedChats = () => {
  const [tempList1, setTempList1] = useState(() => {
    suspendedChats()
      .then(data => {
        console.log('suspended data-->', data);
        setTempList1(data.chats);
      })
      .catch(error => console.error('Error:', error));
  });
  useEffect(() => {}, [tempList1]);

  if (tempList1) {
    return tempList1.chats == [] ? (
      <ScrollView>
        {tempList1.map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => {}}>
              <View style={styles.item}>
                {item.customerIconUrl ? (
                  <Image
                    source={{uri: item.customerIconUrl}}
                    style={styles.avatar}
                  />
                ) : (
                  <Image
                    source={require('../../assets/boy_dummy.png')}
                    style={styles.avatar}
                  />
                )}
                <View style={styles.details}>
                  <Text style={styles.name}>{item.customerName}</Text>
                  <Text style={styles.lastMessage} key={index}>
                    {item.messages[item.messages.length - 1].message}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
          }}>
          No Suspended Chats Found
        </Text>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
          }}>
          <ActivityIndicator size="large" color="#217eac" />
        </Text>
      </View>
    );
  }
};

const ClosedChats = () => {
  const navigation = useNavigation();
  // setTimeout(() => {
  // const value = useContext(GlobalContext);
  //const [activeChatList, setActiveChatList] = useState([]);
  console.log('close chat tab-->');
  // const tempList1;
  const [tempList1, setTempList1] = useState(() => {
    closedChats()
      .then(data => {
        console.log('close data-->', data);
        setTempList1(data.chats);

        //value.closedChatList.current = data.chats;

        //console.log('closed Chats in Global update2', value.closedChatList.current);
      })
      .catch(error => console.error('Error:', error));
  });
  useEffect(() => {}, [tempList1]);
  // useEffect(() => {
  //   if (value.closedChatList.current.length <= 0) {
  //     closedChats()
  //       .then(data => {
  //         console.log('close data-->', data);

  //         //value.closedChatList.current = data.chats;

  //         console.log('closed Chats in Global update2', value.closedChatList.current);
  //       })
  //       .catch(error => console.error('Error:', error));
  //   }
  // });

  // const tempList = React.useMemo(() => {
  //   return value.closedChatList;
  // }, [tempList]);

  if (tempList1) {
    return tempList1 ? (
      <ScrollView>
        {tempList1.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate('ClosedChatView', {item});
              }}>
              <View style={styles.item}>
                {item.customerIconUrl ? (
                  <Image
                    source={{uri: item.customerIconUrl}}
                    style={styles.avatar}
                  />
                ) : (
                  <Image
                    source={require('../../assets/boy_dummy.png')}
                    style={styles.avatar}
                  />
                )}
                <View style={styles.details}>
                  <Text style={styles.name}>{item.customerName}</Text>
                  <Text style={styles.lastMessage} key={index}>
                    {item.messages[item.messages.length - 1].message}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
          }}>
          No Closed Chats Found
        </Text>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
          }}>
          <ActivityIndicator size="large" color="#217eac" />
        </Text>
      </View>
    );
  }
};

let Tabs = () => {
  const [index, setIndex] = React.useState(0);
  //   let chats=props.value;
  const data = [
    {
      customerIconUrl:
        'https://qa.twixor.digital/moc/drive/docs/6324796f6d959c3eda71eff3',
      customerName: '8190083902',
      chatId: '65675656565',
    },
    {
      customerIconUrl:
        'https://qa.twixor.digital/moc/drive/docs/6324796f6d959c3eda71eff3',
      customerName: '8190083903',
      chatId: '65675656575',
    },
  ];
  useEffect(() => {
    //console.log('tabs called everytime',JSON.stringify(props));
  }, [index]);

  //console.log('chats in tab ',JSON.stringify (props));

  return (
    <>
      <Tab
        value={index}
        onChange={e => {
          setIndex(e);
          console.log(e);
        }}
        scrollable={true}
        indicatorStyle={{
          backgroundColor: 'white',
          height: 3,
          borderBottomWidth: 2,
          borderBottomColor: '#2f81ad',
        }}
        variant="transparent">
        <Tab.Item
          title="Active Chats"
          titleStyle={{fontSize: 15, color: '#2f81ad'}}
          onPress={() => {
            console.log('Active Clicked');
          }}
          delayPressIn={200}
        />
        <Tab.Item
          title="Suspended Chats"
          titleStyle={{fontSize: 15, color: 'gray'}}
          onPress={() => {
            console.log('suspended Clicked');
          }}
        />
        <Tab.Item
          title="Closed Chats"
          titleStyle={{fontSize: 15, color: 'gray'}}
          onPress={() => {
            console.log('Close Clicked');
          }}
        />
      </Tab>
      <TabView value={index} onChange={setIndex}>
        <TabView.Item style={{backgroundColor: 'white', width: '100%'}}>
          <ActiveChats />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'white', width: '100%'}}>
          {/* <ActiveChats />   */}
          <SuspendedChats />
          {/* <Text>Loading..</Text> */}
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'white', width: '100%'}}>
          {/* <ActiveChats />   */}
          <ClosedChats />
          {/* <Text>Loading..</Text> */}
        </TabView.Item>
      </TabView>
    </>
  );
};

const ChatListPage = () => {
  MenuTrigger.debug = true;
  return (
    <MenuProvider>
      <ChatHeader />
      <Tabs />
    </MenuProvider>
  );
};

let styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatBodyContainer: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 16,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    marginTop: 10,
    marginLeft: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginTop: 8,
  },
  statusText1: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginTop: 8,
    left: 5,
  },
  menuOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
  },
  leftMenuOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  logotext: {
    fontSize: 22,
    fontWeight: '600',
    color: '#555555',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeSetup: {
    // flexDirection: 'row',
    // alignItems: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
  icon1: {
    width: 24,
    height: 27,
    marginHorizontal: 8,
    top: -2.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777777',
  },
  info: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 4,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  item1: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
};

export default ChatListPage;

import {Subject} from 'rxjs';

// import GlobalConfig from './constants/constants';
// import userInfo from './constants/constants';
import Variables from '../utils/variables';

export let subUser = new Subject();

export let messageService = {
  sendMessage: message => {
    WebSocketClient.getInstance().sendingMessage(message);
  },
  clearMessages: () => subUser.next(),
  getMessage: () => subUser.asObservable(),
};

class WebSocketClient {
  static instance = null;
  isConnected = false;
  callbacks = {};

  static getInstance() {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  addCallbacks = (...callbacks) => (this.callbacks = {...callbacks});

  connect = () => {
    let headers = {};
    let authToken = Variables.TOKEN; //      'FwEv84wcc9qhtj20l8nOR2rzax8E28DdBqM/TZffOH8fXZJCEMLuKFgxM9RtZPcl';
    headers['authentication-token'] = authToken;
    console.log('WebUrl', Variables.API_URL);
    let url = Variables.API_URL.replace('http', 'ws') + '/actions';
    // 'https://qa.twixor.digital/moc'.replace('http', 'ws') + '/actions';
    console.log(url);
    this.socketRef = new WebSocket(url, null, {
      headers,
    });

    this.socketRef.onopen = () => {
      this.socketRef.isConnected = true;
      this.isConnected=true;
      console.log('WebSocket open');
    };

    this.socketRef.onmessage = e => {
      this.isConnected=true;
      subUser.next(e.data);
    };

    this.socketRef.onerror = e => {
      console.log(e.message);
      // this.socketRef.isConnected = false;
      this.isConnected=false;
    };

    this.socketRef.onclose = e => {
      this.isConnected=false;
      console.log(
        "WebSocket closed let's reopen--> " + Variables.TOKEN,
        JSON.stringify(e),
      );
      this.connect();
    };
  };
  checkState(){
    return this.socketRef.readyState;
  }
  checkConnection(){
   return this.socketRef.isConnected;
  }

  checkInstance(){
    return this.socketRef;
  }

  sendingMessage(message) {
    this.socketRef.send(JSON.stringify(message));
  }

  state = () => this.socketRef.readyState;

  waitForSocketConnection = callback => {
    let socket = this.socketRef;
    let recursion = this.waitForSocketConnection;
    setTimeout(() => {
      if (socket.readyState === 1) {
        console.log('Connection is made');
        if (callback != null) {
          callback();
        }
        return;
      } else {
        console.log('wait for connection...');
        recursion(callback);
      }
    }, 4000);
  };
}

export default WebSocketClient.getInstance();

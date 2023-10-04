import {Subject} from 'rxjs';
import {share} from 'rxjs/operators'
import Variables from '../utils/variables';

export let subUser = new Subject();

export let messageService = {
  status : false,
  sendMessage: message => {
    WebSocketClient.getInstance().sendingMessage(message);
  },
  clearMessages: () => subUser.next(),
  getMessage: () => subUser.asObservable().pipe(share()),
};

class WebSocketClient {
  static instance = null;
  isConnected = false;
  callbacks = {};
  messageHandlers = [];

  static getInstance() {
    //WebSocketClient.instance = null
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }
// closeSocket(){
//   WebSocketClient.instance = null;
// }
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
    this.socketRef = null;
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
      console.log("From websocket",this.socketRef);
      subUser.next(e.data);
    };

    this.socketRef.onerror = e => {
      console.log(e.message);
       this.socketRef.isConnected = false;
      this.isConnected=false;
    };

    this.socketRef.onclose = e => {
      this.isConnected=false;
      this.socketRef.isConnected = false;
      console.log(
        "WebSocket closed let's reopen--> " + Variables.TOKEN,
        JSON.stringify(e),
      );
      console.log(e);
      if(e.code!=1000){
        this.connect();
      }
      
    };
  };
  checkState(){
    return this.socketRef.readyState;
  }
  closeSocket() {
    // Close the WebSocket connection if it's open
    if (this.socketRef && this.socketRef.readyState === WebSocket.OPEN) {
      this.socketRef.close();
    }
   // this.socketRef.close(100,"jkdskdjsk");

    // Set the instance to null
    WebSocketClient.instance = null;
    //subUser = null;
  }
  closeConnection(){
    this.instance = null;
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

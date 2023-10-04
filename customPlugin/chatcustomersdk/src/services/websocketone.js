import WebSocket from 'react-native-websocket';

const socket = new WebSocket('your_websocket_endpoint_here');

socket.onopen = () => {
  console.log('WebSocket connection opened');
};

socket.onmessage = (e) => {
  console.log('Received message:', e.data);
};

socket.onclose = (e) => {
  console.log('WebSocket connection closed:', e.code, e.reason);
};

socket.onerror = (e) => {
  console.error('WebSocket error:', e.message);
};

export default socket;
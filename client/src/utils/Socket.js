import {io} from 'socket.io-client';

const socket = io("http://10.2.2.21:8080", {
  transports: ["websocket"]
});

export default socket;
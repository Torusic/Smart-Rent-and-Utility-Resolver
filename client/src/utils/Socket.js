import {io} from 'socket.io-client';

const socket = io("wss://smart-rent-and-utility-resolver.onrender.com", {
  transports: ["websocket"]
});

export default socket;
import { io } from 'socket.io-client'

const { VITE_SERVER_URL } = import.meta.env;

console.log(VITE_SERVER_URL)

const socket = io(
    VITE_SERVER_URL,
    {
        autoConnect:false,
        reconnectionAttempts:5,
        transports:['websocket']
    }
) 

export default socket; 
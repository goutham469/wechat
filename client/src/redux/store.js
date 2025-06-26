import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../redux/slices/userSlice'
import chatReducer from '../redux/slices/chatSlice'
import messageReducer from '../redux/slices/messageSlice'

export const store = configureStore({
    reducer : {
        user:userReducer,
        chat:chatReducer,
        message:messageReducer
    }
})
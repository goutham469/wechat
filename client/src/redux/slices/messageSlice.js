import { createSlice } from "@reduxjs/toolkit";
import { getInitialState } from "../getInitialState";



const messageSlice = createSlice({
    name: 'message',
    initialState: getInitialState("messages") || [] ,
    reducers:{
        message_slice_setMessages : (state,action) => {
            console.log(action.payload)
            return action.payload
        }
    }
})

export const { message_slice_setMessages } = messageSlice.actions;
export default messageSlice.reducer; 
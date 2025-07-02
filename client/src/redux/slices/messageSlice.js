import { createSlice } from "@reduxjs/toolkit";
import { getInitialState } from "../getInitialState";



const messageSlice = createSlice({
    name: 'message',
    initialState: getInitialState("messages") || [] ,
    reducers:{
        message_slice_setMessages : (state,action) => {
            console.log(action.payload)
            return action.payload
        },
        message_slice_append_message : (state,action) => {
            console.log(action.payload)
            return [ ...state , action.payload ]
        }
    }
})

export const { message_slice_setMessages , message_slice_append_message } = messageSlice.actions;
export default messageSlice.reducer; 
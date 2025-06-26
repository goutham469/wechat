import { createSlice } from "@reduxjs/toolkit";
import { getInitialState } from "../getInitialState";

const chatSlice = createSlice({
    name:"chat",
    initialState: getInitialState("chat") || {
        chatId:null,
        username:null,
        profile_pic:null,
        page:null,
        receiver:null
    },
    reducers:{
        chat_slice_setChat: (state,action) => {
            console.log(action.payload)
            return action.payload
        }
    }
})

export const { chat_slice_setChat } = chatSlice.actions;
export default chatSlice.reducer; 
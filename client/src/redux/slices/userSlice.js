import { createSlice } from "@reduxjs/toolkit";
import { getInitialState } from "../getInitialState";

// Provide a proper fallback when no user is stored
const initialState = getInitialState("user") || {
    id: null,
    email: null,
    // add other default user properties as needed
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        user_slice_login: (state, action) => {
            return action.payload.user || action.payload; // Handle both payload structures
        },
        user_slice_logout: (state, action) => {
            return {
                id: null,
                email: null,
                // reset to default state
            };
        }
    }
})

export const { user_slice_login, user_slice_logout } = userSlice.actions
export default userSlice.reducer
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isExpanded: false
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isExpanded = !state.isExpanded;
        }
    }
})

export const { toggleSidebar } = uiSlice.actions;

export default uiSlice.reducer;

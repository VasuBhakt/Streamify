import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import uiReducer from "../features/uiSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
    }
})

export default store;
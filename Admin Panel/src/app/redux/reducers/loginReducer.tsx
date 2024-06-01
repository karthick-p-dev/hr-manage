import { createSlice } from "@reduxjs/toolkit";
// import { onLogin } from "../actions/action";

const userInfo:any = {
  entities: [],
  loading: false,
};

export const loginReducer = createSlice({
  name: "login",
  initialState: { entities: userInfo },
  reducers: {
    loginSuccess: (state, action) => {
      state.entities = action.payload;
      if (action && action.payload) localStorage.setItem("UserToken", action.payload.token);
    },
    signout: (state) => {
      state.entities = [];
    },

  },
  extraReducers: {
    // [onLogin.pending]: (state:any, { meta }) => {
    //   state.currentRequestId = meta;
    //   state.loading = true;
    // },
    // [onLogin.fulfilled]: (state:any, { meta, payload }) => {
    //   if (payload && payload.token) localStorage.setItem("UserToken", payload.token);
    //   state.currentRequestId = meta;
    //   state.loading = false;
    //   state.entities = payload;
    // },
    // [onLogin.rejected]: (state:any, { meta, payload, error }) => {
    //   state.entities = payload;
    //   state.currentRequestId = meta;
    //   state.loading = false;
    //   state.error = error;
    // },

  },
});
export const { loginSuccess, signout } = loginReducer.actions;
export const signReducer = loginReducer.reducer;
export default signReducer;

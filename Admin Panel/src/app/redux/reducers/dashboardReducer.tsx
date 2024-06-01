import { createSlice } from "@reduxjs/toolkit";

const userInfo:any = {
  entities: [],
  loading: false,
};

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState: { entities: userInfo },
  reducers: {
    UserSuccess: (state, action) => {
      state.entities = action.payload;
    },

  },
  extraReducers: {
    // [getAllUser.pending]: (state:any, { meta }) => {
    //   state.currentRequestId = meta;
    //   state.loading = true;
    // },
    // [getAllUser.fulfilled]: (state:any, { meta, payload }) => {
    //   state.currentRequestId = meta;
    //   state.loading = false;
    //   state.entities = payload;
    // },
    // [getAllUser.rejected]: (state:any, { meta, payload, error }) => {
    //   state.currentRequestId = meta;
    //   state.entities = payload;
    //   state.loading = false;
    //   state.error = error;
    // },

  },
});
export const { UserSuccess } = dashboardReducer.actions;
export const dashReducer = dashboardReducer.reducer;
export default dashReducer;

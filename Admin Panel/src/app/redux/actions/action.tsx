import { post } from "../../../helpers/fetch-Service-Methods";
import { BASE_URL } from "../../../config/config";
import { loginSuccess, signout } from "../reducers/loginReducer";
import { UserSuccess } from "../reducers/dashboardReducer";
import ENDPOINT from "../../../helpers/Api";

let userInfo:any = {
  entities: [],
  loading: false,
};
export const onLogin:any = (user:any) => async (dispatch:any) => {
  try {
    const { email } = user;
    const { password } = user;
    const { devicetype } = user;

    const response = await post(`${BASE_URL}${ENDPOINT.USER_SIGNIN}`, { email, password, devicetype });
    if(!response.status){
      console.log(response.message);
      return response.message;
    }
    if (response.data) {
      userInfo = response.data;
      console.log("userInfo",userInfo);
      localStorage.setItem("userInfoemail", userInfo.email);
    }
    return dispatch(loginSuccess(userInfo));
  } catch (e: any) {
    return console.error(e.message);
  }
};

export const onSignout:any = () => async (dispatch:any) => {
  try {
    return dispatch(signout());
  } catch (e:any) {
    return console.error(e.message);
  }
};

export const getAllUser:any = (usercompID:any) => async (dispatch:any) => {
  try {
    const comID = usercompID.companyId;
        const response = await post(BASE_URL + ENDPOINT.TOTAL_USERS, { companyId: comID });
        if (response.status) {
          userInfo = response.data;
        }
    return dispatch(UserSuccess(userInfo));
  } catch (e:any) {
    return console.error(e.message);
  }
};

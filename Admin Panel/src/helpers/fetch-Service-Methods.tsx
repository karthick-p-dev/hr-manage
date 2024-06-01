import axios from "axios";
// import { useNavigate } from "react-router-dom";

const headers = {
  Accept: "application/json",
  contentType: "application/json",
};
// const token  = useSelector((state:any) => state.signReducer.entities).token;

// Add a request interceptor
axios.interceptors.request.use((config:any) => {
  if (localStorage.getItem("UserToken")) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("UserToken")}`;
  }
  return config;
});

export default function HandleResponse(response: any) {
  // const navigate = useNavigate();
  const contentType = response.headers["content-type"];
  if (contentType && contentType.indexOf("application/json") !== -1) {
    if (response.status === 200) {
      if (response.data.response_status === 1) {
        const getMsg = response.data.response_content.message;
        if (getMsg === "REQUIRED_LOGIN" || getMsg === "SESSION_EXPIRED") {
          // navigate("/dashboard");
        }
      }
      return response.data;
    }
    if (response.status === 401) {
        // navigate("/dashboard");
    }
    // if (response.status === 503) {
    // }
    // if (response.status === 200) {
    // }
    const error = response.data;

    return error;
  } if (contentType && contentType.indexOf("text/html") !== -1) {
    return response.data;
  }
}

export function get(url: any) {
  return axios
    .get(url, { headers })
    .then((resp:any) => HandleResponse(resp))
    .catch((error:any) => {
      console.log(error.response);
      return HandleResponse(error.response);
    });
}

export function post(url: any, postdata: any) {
  return axios
    .post(url, postdata, { headers })
    .then((resp:any) => HandleResponse(resp))
    .catch((error:any) => {
      console.log(error.response);
      return HandleResponse(error.response);
    });
}

export function postFormData(url: any, postdata: any) {
  return axios
    .post(url, postdata, { headers: { "Content-Type": "multipart/form-data" } })
    .then((resp:any) => HandleResponse(resp))
    .catch((error:any) => {
      console.log(error.response);
      return HandleResponse(error.response);
    });
}

export function put(url: any, updatedata: any) {
  return axios
    .put(url, updatedata, { headers })
    .then((resp:any) => HandleResponse(resp))
    .catch((error:any) => HandleResponse(error.response));
}

export function putFormData(url: any, postdata: any) {
  return axios
    .put(url, postdata, { headers: { "Content-Type": "multipart/form-data" } })
    .then((resp:any) => HandleResponse(resp))
    .catch((error:any) => HandleResponse(error.response));
}

export function deleteService(url: any) {
  return axios
    .delete(url, { headers })
    .then((resp:any) => HandleResponse(resp))
    .catch((error:any) => HandleResponse(error.response));
}

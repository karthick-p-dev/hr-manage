import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function getLeaveByUser(userinfo:any):Promise<any> {
  const url = `${BASE_URL + ENDPOINT.GET_LEAVE_BY_USERID}/${userinfo.id}`;
  try {
    return await get(url)
      .then((response:any) => response)
      .catch((error:any) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
  return true;
}
async function createLeave(postData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_LEAVE;
    try {
      return await post(url, postData)
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }
  async function deleteleave(values:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.DELETE_LEAVE;
    try {
      return await post(url, { id: values })
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
    }
    async function getrequestleave(userinfo:any):Promise<any> {
      const url = `${BASE_URL + ENDPOINT.GET_REQUEST_LEAVE_BYID}/${userinfo.id}`;
      try {
        return await get(url)
          .then((response:any) => response)
          .catch((error:any) => {
            console.log("error::", error);
          });
      } catch (error) {
        console.error(error);
      }
      return true;
    }
    async function getByLeaveId(id:any):Promise<any> {
      const url = `${BASE_URL + ENDPOINT.GET_LEAVE_BY_LEAVEID}/${id}`;
      try {
        return await get(url)
          .then((response:any) => response)
          .catch((error:any) => {
            console.log("error::", error);
          });
      } catch (error) {
        console.error(error);
      }
      return true;
    }
    async function approveleave(postData:any):Promise<any> {
      const url = BASE_URL + ENDPOINT.APPROVE_LEAVE;
      try {
        return await post(url, postData)
          .then((response:any) => response)
          .catch((error:any) => {
            console.log("error::", error);
          });
      } catch (error) {
        console.error(error);
      }
      return true;
    }

    async function rejectleave(postData:any):Promise<any> {
      const url = BASE_URL + ENDPOINT.REJECT_LEAVE;
      try {
        return await post(url, postData)
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }

    async function getRequestLeaveByDate(id:any, fromDate:any, toDate:any):Promise<any> {
      const url = `${BASE_URL + ENDPOINT.GET_REQUESTED_LEAVE}/${fromDate}/${toDate}/${id}`;
      try {
        return await get(url)
          .then((response:any) => response)
          .catch((error:any) => {
            console.log("error::", error);
          });
      } catch (error) {
        console.error(error);
      }
      return true;
    }
const leaveService = {
  getLeaveByUser,
  createLeave,
  deleteleave,
  getrequestleave,
  getByLeaveId,
  approveleave,
  rejectleave,
  getRequestLeaveByDate,
};

export default leaveService;

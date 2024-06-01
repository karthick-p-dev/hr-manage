import { post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function createTimesheet(values:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_TIMESHEET;
    try {
      return await post(url, values)
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }

  async function getTimesheetByDate(userinfo:any):Promise<any> {
    console.log("userinfo", userinfo);
    const url = BASE_URL + ENDPOINT.GET_TIMESHEET;
    try {
      return await post(url, userinfo)
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }

  async function updateTimesheet(values:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.UPDATE_TIMESHEET;
    try {
      return await post(url, values)
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }

  // async function userEditTimeSheet( userinfo:any,choosedDate:any ):Promise<any> {
  //   console.log("choosedDate-->",choosedDate)
  //   console.log("userinfo-->",userinfo)
  //   const url = `${BASE_URL + ENDPOINT.GET_TIMESHEET}/${choosedDate}/${userinfo.companyId}`;
  //   try {
  //     return await post(url,choosedDate)
  //       .then((response:any) => response)
  //       .catch((error:any) => {
  //         console.log("error::", error);
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   return true;
  // }

const timesheetservice = {
    createTimesheet,
    getTimesheetByDate,
    updateTimesheet,
    // userEditTimeSheet,
};

export default timesheetservice;

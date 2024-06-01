import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

 async function getAttendanceSummaryByDate(userinfo:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.GET_ATTENDANCEREPORT;
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

  async function getEmployeeSummaryById(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GET_EMPLOYEEREPORT}/${userinfo}`;
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

  async function getEmployeeSummaryByDate(userinfo:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.GET_SINGLEEMPLOYEEREPORT;
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

const attendancereportservice = {
    getAttendanceSummaryByDate,
    getEmployeeSummaryById,
    getEmployeeSummaryByDate,
};

export default attendancereportservice;

import { get } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

const current = new Date();
const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()}`;
async function getAppliedLeaves(userinfo:any):Promise<any> {
  const url = `${BASE_URL + ENDPOINT.TOTAL_LEAVE_APPLIED}/${userinfo}`;
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
async function getTotalAttendance( date:any ,id:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.TODAY_ATTENDANCE}/${date}/${id}`;
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

  async function getLeaveByStatus(userinfo:any, status:String):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.LEAVE_STATUS}/${userinfo.companyId}/${status}`;
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
const dashboardService = {
  getAppliedLeaves,
  getTotalAttendance,
  getLeaveByStatus,
};

export default dashboardService;

import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function getAllAttendance(userinfo:any, date:any):Promise<any> {
  const url = `${BASE_URL + ENDPOINT.TODAY_ATTENDANCE}/${date}/${userinfo.companyId}`;
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
async function searchAttendance(searchData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.ATTEN_SEARCH;
    try {
      return await post(url, searchData)
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }

  async function filterAttendance(userinfo:any, choosedDate:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.TODAY_ATTENDANCE}/${choosedDate}/${userinfo.companyId}`;
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
  async function getAttendanceById(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.ATTEN_GET_ID}/${userinfo}`;
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

  async function getAttendanceByDateId(id:any,chooseDate:any):Promise<any>{
    const url = `${BASE_URL + ENDPOINT.ATTEN_GET_ID_DATE}/${id}/${chooseDate}`;
    try{
      return await get(url)
      .then((response:any) => response)
      .catch((error:any) => {
        console.log("error::", error);
      });
    }catch (error){
      console.error(error);
    }
    return true;
  }

const attandanceService = {
  getAllAttendance,
  searchAttendance,
  filterAttendance,
  getAttendanceById,
  getAttendanceByDateId,
};

export default attandanceService;

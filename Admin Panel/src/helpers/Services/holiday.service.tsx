import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function getallHoliday(userinfo:any):Promise<any> {
  const url = `${BASE_URL + ENDPOINT.GETALL_HOLIDAYS}/${userinfo.companyId}`;
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
async function createHoliday(searchData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_HOLIDAYS;
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

  async function deleteHoliday(choosedData:any):Promise<any> {
    const url: any = BASE_URL + ENDPOINT.DELETE_HOLIDAY;
    try {
      return await post(url, choosedData)
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }
  async function updateHoliday(searchData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.UPDATE_HOLIDAYS;
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

  async function getHolidaybyID(id:any, userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_HOLIDAYSBYID}/${id}/${userinfo.companyId}`;
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

const holidayService = {
  getallHoliday,
  createHoliday,
  deleteHoliday,
  updateHoliday,
  getHolidaybyID,
};

export default holidayService;

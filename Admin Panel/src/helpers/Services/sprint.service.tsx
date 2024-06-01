import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function getallSprint(userinfo:any):Promise<any> {
  const url = `${BASE_URL + ENDPOINT.GETALL_SPRINT}/${userinfo.companyId}`;
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
 async function getSprintId(id:any) {
  const url = `${BASE_URL + ENDPOINT.GETALL_SPRINTBYID}/${id}`;
  try {
    return await get(url)
    .then((res:any) => res)
    .catch((error:any) => error);
  } catch (error) {
    console.log(error);
  }
  return true;
 }
async function createSprint(searchData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_SPRINT;
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

  async function deleteSprint(choosedData:any):Promise<any> {
    const url: any = BASE_URL + ENDPOINT.DELETE_SPRINT;
    try {
      return await post(url, choosedData)
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }
  async function updateSprint(searchData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.UPDATE_SPRINT;
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

  async function getSprintbyID(id:any, userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_SPRINTBYID}/${id}/${userinfo.companyId}`;
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
  const sprintService = {
  getallSprint,
  createSprint,
  deleteSprint,
  updateSprint,
  getSprintbyID,
  getSprintId,
};

export default sprintService;

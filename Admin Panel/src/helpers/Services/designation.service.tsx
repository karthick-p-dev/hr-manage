import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function getPositions(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GET_ALLPOSITIONS}/${userinfo}`;
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

  async function deleteDesignation(choosedData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.DELETE_POSITIONS;
    try {
      return await post(url, { id: choosedData })
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }

  async function getPositionDetailsById(id:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GET_POSITION}/${id}`;
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

  async function createDesignation(searchData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_POSITION;
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

  async function updateDesignation(searchData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.UPDATE_POSITION;
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

const designationservice = {
    getPositions,
    deleteDesignation,
    getPositionDetailsById,
    createDesignation,
    updateDesignation,
};

export default designationservice;

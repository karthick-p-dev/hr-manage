import { get } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function getProjects(userinfo:any):Promise<any> {
  const url = `${BASE_URL}/${ENDPOINT.GETUSER_PROJECT}/${userinfo.id}/${userinfo.companyId}`;
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
async function getTeams(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.ACCOUNT_TEAMS}/${userinfo.companyId}`;
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

  async function getUserById(id:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GET_USER_BY_ID}/${id}`;
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

const accountService = {
  getProjects,
  getUserById,
  getTeams
};

export default accountService;

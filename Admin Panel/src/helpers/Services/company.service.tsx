import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function getCompany():Promise<any> {
  const url = BASE_URL + ENDPOINT.GET_COMPANY;
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
async function editCompany(values:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.UPDATE_COMPANY;
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

const companyService = {
  getCompany,
  editCompany,
};

export default companyService;

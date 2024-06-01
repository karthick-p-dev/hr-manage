import { get, postFormData } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function getInformation(userinfo :any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GET_INFORMATION}/${userinfo.companyId}`;
    try {
return await get(url)
.then((res) => res)
.catch((error) => console.log(error));
} catch (error) {
    console.log(error);
}
return true;
 }

 async function createInfo(postData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_INFORMATION;
    try {
      return await postFormData(url, postData)
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }

 const informationService = {
    getInformation,
    createInfo,
};

export default informationService;

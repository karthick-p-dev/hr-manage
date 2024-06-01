import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function createTasktype(values:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_TASKTYPE;
    try {
        return await post(url, values)
        .then((res) => res)
        .catch((error) => console.log(error));
    } catch (error) {
        console.log(error);
    }
    return true;
}

// async function getAllTaskType(values:any):Promise<any> {
//     const url = BASE_URL + ENDPOINT.GETALL_TASKTYPE;
//     try {
//         return await get(url)
//         .then((res) => res)
//         .catch((error) => console.log(error));
//     } catch (error) {
//         console.log(error);
//     }
//     return true;
// }

async function getAllTaskType(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_TASKTYPE}/${userinfo.companyId}`;
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
async function getOneTasktype(id:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETONE_TASKTYPE}/${id}`;
    try {
return await get(url)
.then((res) => res)
.catch((error) => console.log(error));
    } catch (error) {
        console.log(error);
    }
    return true;
}

async function updateTasktype(values:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.UPDATE_TASKTYPE}`;
    try {
        return await post(url, values)
        .then((res) => res)
        .catch((error) => console.log(error));
    } catch (error) {
            console.log(error);
    }
    return true;
}
async function deleteTasktype(values:any) {
    const url = `${BASE_URL + ENDPOINT.DELETE_TASKTYPE}`;
    try {
        return await post(url, values)
        .then((res) => res)
        .catch((error) => console.log(error));
    } catch (error) {
            console.log(error);
    }
    return true;
}
const tasktype = {
    createTasktype,
    getOneTasktype,
    updateTasktype,
    deleteTasktype,
    getAllTaskType,

};
export default tasktype;

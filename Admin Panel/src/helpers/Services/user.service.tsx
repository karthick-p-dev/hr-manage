import { post, put,postFormData, deleteService, get } from "../fetch-Service-Methods";
import { BASE_URL } from "../../config/config";
import ENDPOINT from "../Api";

async function postUser(data:any): Promise<any> {
  const url = BASE_URL + ENDPOINT.CREATE_USER;
  try {
    console.log("data--->",data);
    return await postFormData(url, data)
      .then((response:any) => response)
      .catch((error:any) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
  return true;
}

async function createUser(data:any): Promise<any> {
  const url = BASE_URL + ENDPOINT.CREATE_USER;
  try {
    return await post(url, data)
      .then((response:any) => response)
      .catch((error:any) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
  return true;
}

async function getAllUsers(userinfo:any):Promise<any> {
  const url = BASE_URL + ENDPOINT.TOTAL_USERS;
  try {
    return await post(url, { companyId: userinfo.companyId })
      .then((response:any) => response)
      .catch((error:any) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
  return true;
}

async function deleteUser(id:any):Promise<any> {
  const url = `${BASE_URL + ENDPOINT.DELETE_USER}/?id=${id}`;
  try {
    return await deleteService(url)
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

async function getUserRoles():Promise<any> {
  const url = BASE_URL + ENDPOINT.GETALL_ROLE;
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

async function getUserPositions(userInfo:any):Promise<any> {
  const url = `${BASE_URL + ENDPOINT.GETALL_POSITION}/${userInfo.companyId}`;
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

async function getAllInactiveUsers(userInfo:any):Promise<any> {
  const url = `${BASE_URL + ENDPOINT.INACTIVE_USERS}/${userInfo.companyId}`;
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

async function updateAllUser(data:any):Promise<any> {
  const url = BASE_URL + ENDPOINT.UPDATEALL_USER;
  try {
    return await post(url, data)
      .then((response:any) => response)
      .catch((error:any) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
  return true;
}

async function updateUser(data:any):Promise<any> {
  const url = `${BASE_URL + ENDPOINT.UPDATE_USER}`;
  try {
    return await postFormData(url, data)
      .then((response:any) => response)
      .catch((error:any) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
  return true;
}

const userService = {
  postUser,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  updateAllUser,
  getUserPositions,
  getUserRoles,
  createUser,
  getAllInactiveUsers,
};

export default userService;

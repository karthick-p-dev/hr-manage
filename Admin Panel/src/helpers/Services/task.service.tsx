import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function deletetask(values:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.DELETE_TASK;
    try {
      return await post(url, { id: values })
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }
  async function createTask(postData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_TASK;
    try {
      return await post(url, postData)
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }
  async function getallTasktype(userinfo:any):Promise<any> {
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
  async function getallTaskStatus(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_TASKSTATUS}/${userinfo.companyId}`;
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
  async function getallTasKget(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_TASKGET}/${userinfo.companyId}`;
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
  async function getTaskbyid(id:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_TASKGET}/${id}`;
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
  async function deletetaskstatus(values:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.DELETE_TASKSTATUS;
    try {
      return await post(url, { id: values })
        .then((response:any) => response)
        .catch((error:any) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
    return true;
  }
  async function getTaskstatusbyid(id:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_TASKSTATUSBYID}/${id}`;
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
  const taskService = {
    deletetask,
    createTask,
    getallTaskStatus,
    getallTasktype,
    getallTasKget,
    getTaskbyid,
    deletetaskstatus,
    getTaskstatusbyid,
  };

  export default taskService;

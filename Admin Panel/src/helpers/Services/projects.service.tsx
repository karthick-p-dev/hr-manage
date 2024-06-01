import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function getAllProject(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_PROJECT}/${userinfo.companyId}`;
    try {
        return await get(url)
        .then((response:any) => response)
        .catch((error:any) => console.log(error));
    } catch (error) {
        console.log(error);
    }
    return true;
}

async function getProjectManager(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_PROJECTMANAGER}/${userinfo.companyId}`;
    try {
        return await get(url)
        .then((res:any) => res)
        .catch((error:any) => console.log(error));
    } catch (error) {
        console.log(error);
    }
return true;
 }
 async function getProject(userinfo :any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_PROJECT}/${userinfo.companyId}`;
    try {
return await get(url)
.then((res) => res)
.catch((error) => console.log(error));
} catch (error) {
    console.log(error);
}
return true;
 }

 async function getUser(userinfo : any):Promise<any> {
    const url = BASE_URL + ENDPOINT.TOTAL_USERS;
    try {
    return await post(url, { companyId: userinfo.companyId })
    .then((res:any) => res)
    .catch((error:any) => console.log(error));
 } catch (error) {
console.log(error);
 }
return true;
 }

async function getTeamLeader(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_TEAMLEADER}/${userinfo.companyId}`;
    try {
        return await get(url)
        .then((res) => res)
        .catch((error) => console.log("error-->", error));
    } catch (error) {
console.log(error);
    }
    return true;
}
 async function getFullTeamList(userinfo:any, id:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_PROJECTMEMBER}/${userinfo.companyId}/${id}`;
    try {
        return await get(url)
        .then((res) => res)
        .catch((error) => console.log(error));
    } catch (error) {
        console.log(error);
    }
    return true;
 }

 async function getProjectDetails(userinfo:any, id:any):Promise<any> {
const url = `${`${BASE_URL}/projects/getbyid`}/${id}`;
try {
    return await get(url)
    .then((res) => res)
    .catch((error) => console.log(error));
} catch (error) {
    console.log(error);
}
return true;
 }
 async function createProjectuser(userinfo : any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_PROJECTUSER;
    try {
    return await post(url, userinfo)
    .then((res:any) => res)
    .catch((error:any) => console.log(error));
 } catch (error) {
console.log(error);
 }
return true;
 }

 async function deleteProjectMember(userinfo : any):Promise<any> {
    const url = BASE_URL + ENDPOINT.DELETE_PROJECTMEMBER;
    try {
        return await post(url, userinfo)
        .then((res:any) => res)
        .catch((error:any) => console.log(error));
    } catch (error) {
        console.log(error);
    }
return true;
 }
const projectService = {
    getAllProject,
    getProject,
    getUser,
    getProjectManager,
    getTeamLeader,
    getFullTeamList,
    getProjectDetails,
    createProjectuser,
    deleteProjectMember,
};

export default projectService;

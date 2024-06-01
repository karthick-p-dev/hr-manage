import { get, post } from "../fetch-Service-Methods";
import ENDPOINT from "../Api";
import { BASE_URL } from "../../config/config";

async function getAllTeams(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.ACCOUNT_TEAMS}/${userinfo.companyId}`;
    try {
        return await get(url)
        .then((response:any) => response)
        .catch((error:any) => console.log(error));
    } catch (error) {
        console.log(error);
    }
    return true;
}

async function getTeamValue(id:any):Promise<any> {
const url = `${BASE_URL + ENDPOINT.GET_TEAMVALUE}/${id}`;
try {
    return await get(url)
    .then((res:any) => res)
    .catch((error:any) => console.log(error));
} catch (error) {
    console.log(error);
}
return true;
}

async function getTeamManager(userinfo:any):Promise<any> {
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

async function getTeamLeader(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.CREATE_TEAMS}/${userinfo.companyId}`;
    try {
        return await get(url)
        .then((res:any) => res)
        .catch((error:any) => console.log("error-->", error));
    } catch (error) {
console.log(error);
    }
    return true;
}
 async function getFullTeamList(userinfo:any, id:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.LISTTEAMUSER}/${userinfo.companyId}/${id}`;
    try {
        return await get(url)
        .then((res) => res)
        .catch((error) => console.log(error));
    } catch (error) {
        console.log(error);
    }
    return true;
 }

 async function getTeamsDetails(userinfo:any, id:any):Promise<any> {
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

   async function getUser(userinfo:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GETALL_TEAMLEADER}/${userinfo.companyId}`;
    try {
        return await get(url)
        .then((res) => res)
        .catch((error) => console.log(error));
    } catch (error) {
        console.log(error);
    }
 return true;
   }

   async function createTeam(searchData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_TEAMS;
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
  async function updateTeam(searchData:any):Promise<any> {
    const url = BASE_URL + ENDPOINT.UPDATE_TEAMS;
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
  async function getTeamUser(companyId:any, userId:any):Promise<any> {
    const url = `${BASE_URL + ENDPOINT.GET_TEAM_USERS}/${companyId}/${userId}`;
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
  async function deleteteam(choosedData:any):Promise<any> {
    const url: any = BASE_URL + ENDPOINT.DELETE_TEAM;
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
  async function createteamuser(userinfo : any):Promise<any> {
    const url = BASE_URL + ENDPOINT.CREATE_TEAMUSER;
    try {
    return await post(url, userinfo)
    .then((res:any) => res)
    .catch((error:any) => console.log(error));
 } catch (error) {
console.log(error);
 }
return true;
 }

const teamService = {
    getFullTeamList,
    getTeamLeader,
    getTeamManager,
    getTeamsDetails,
    getTeamValue,
    getAllTeams,
    getUser,
    createTeam,
    updateTeam,
    deleteteam,
    createteamuser,
    getTeamUser,
};

export default teamService;

const USER_LOGIN = "/websitecontent-news/list";
const CREATE_USER = "/users/create";
const USER_SIGNIN = "/auth/login";
const GETALL_USER = "";
const DELETE_USER = "";
const GET_USER_BY_ID = "/users/getbyid";
const GET_USER_ROLE_SCREEN_ACTIVITIES = "";
const UPDATE_USER = "/users/update";
const UPDATEALL_USER = "/users/inactiveUser";
const INACTIVE_USERS = "/users/getInactiveUsers";
const TOTAL_LEAVE_APPLIED = "/leave/getleave/list";
const TODAY_ATTENDANCE = "/attendance/gettodayattendance";
const TOTAL_USERS = "/users/getall";
const GET_COMPANY = "/company/getcompany";
const UPDATE_COMPANY = "/company/update";
const LEAVE_STATUS = "/leave/getLeaveByStatus";
const ATTEN_SEARCH = "/attendance/attendanceSearch";
const ATTEN_GET_ID = "/attendance/getallattenddancebyid";
const ATTEN_GET_ID_DATE = "/attendance/getallattenddancebyidanddate";
const ACCOUNT_PROJECT = "/projects/listproject";
const DELETE_PROJECTMEMBER = "/projectuser/deleteprojectuser";
const ACCOUNT_TEAMS = "/teams/listteam";
const CREATE_TEAMS = "/teams/createteam";
const GET_TEAMVALUE = "/teams/getbyid";
const UPDATE_TEAMS = "/teams/updateTeam";
const GET_TEAM_USERS = "/teamuser/listteamuser";
const GET_LEAVE_BY_USERID = "/leave/getbyid";
const GET_LEAVE_BY_LEAVEID = "/leave/getByLeaveId";
const CREATE_LEAVE = "/leave/create";
const DELETE_LEAVE = "/leave/deleteleave";
const APPROVE_LEAVE = "/leave/approveRequest";
const GET_REQUESTED_LEAVE = "/leave/getallLeavebyFromdateAndToDate";
const GET_REQUEST_LEAVE_BYID = "/requestedLeaves/getbyid";
const GETALL_ROLE = "/roles/getall";
const GETALL_POSITION = "/position/listPositions";
const GETALL_PROJECT = "/projects/listproject";
const CREATE_PROJECTUSER = "/projectuser/createprojectuser";
const GETALL_TEAMLEADER = "/users/getPositionUser/leader";
const CREATE_TEAMUSER = "/teamuser/createteamuser";
const GET_TEAMLIST = "/projects/getbyid";
const GETALL_PROJECTMANAGER = "/users/getPositionUser/manager";
const CREATE_PROJECT = "/projects/createproject";
const UPDATE_PROJECT = "/projects/updateproject";
const GETUSER_PROJECT = "projectuser/getprojectforuserid";
const GETALL_TASKLIST = "/task/listtask";
const CREATE_TASK = "/task/createtask";
const DELETE_TASK = "/task/deletetask";
const CREATE_TASKTYPE = "/tasktype/createtasktype";
const GETALL_TASKSTATUS = "/taskStatus/listAllTaskStatus";
const TODAY_BIRTHDAY = "/users/getTodayBirthday";
const GETALL_HOLIDAYS = "/holiday/getall";
const CREATE_HOLIDAYS = "/holiday/create";
const GETALL_PROJECTMEMBER = "/projectuser/listprojectuser";
const UPDATE_HOLIDAYS = "/holiday/update";
const DELETE_HOLIDAY = "/holiday/delete";
const GETALL_HOLIDAYSBYID = "/holiday/getone";
const GETALL_SPRINT = "/sprints/listsprints";
const CREATE_SPRINT = "/sprints/createsprints";
const DELETE_SPRINT = "/sprints/deletesprints";
const UPDATE_SPRINT = "/sprints/updatesprints";
const GETALL_SPRINTBYID = "/sprints/getbyid";
// const GETALL_SPRINTBYID="/sprints/getbyid";
const GETALL_TASKTYPE = "/tasktype/listtasktype";
const GETONE_TASKTYPE = "/tasktype/getbyid";
const UPDATE_TASKTYPE = "/tasktype/updatetasktype";
const DELETE_TASKTYPE = "/tasktype/deletetasktype";
const GETALL_TASKGET = "/task/getbyid";
const CREATE_TASKSTATUS = "/taskStatus/createTaskStatus";
const UPDATE_TASKSTATUS = "/taskStatus/updateTaskStatus";
const DELETE_TASKSTATUS = "/taskStatus/deleteTaskStatus";
const GETALL_TASKSTATUSBYID = "/taskStatus/getbyid";
const CREATE_TIMESHEET = "/timesheet/createtimesheet";
const GET_TIMESHEET = "/timesheet/getTimesheetByDate";
const GET_TEAMCODE = "/teamuser/getTeamId";
const GET_TASK = "/task/listtask";
const GET_TASKLIST = "/tasktype/listallactivetask";
const GET_TASKSTATUS = "/taskStatus/listAllTaskStatus";
const GET_TIMESHEETBYID = "/tasktype/listallactivetask";
const UPDATE_TIMESHEET = "/timesheetDetails/update";
const GET_TASK_BYID = "/task/listtaskBasedOnProject";
const GET_SPRINT_BYID = "/sprints/listsprintsByProjectId";
const GET_INFORMATION = "/information/getinfo";
const CREATE_INFORMATION = "/information/infocontent";
const GET_ALLPOSITIONS = "/position/listPositions";
const DELETE_POSITIONS = "/position/deletePosition";
const GET_POSITION = "/position/getPosition";
const CREATE_POSITION = "/position/createPosition";
const UPDATE_POSITION = "/position/updatePosition";
const GET_SUMMARY = "/attendance/getOverallTotalHrs";
const FORGET_PASSWORD = "/auth/forgetpassword";
const VERIFY_OTP = "/auth/verifyotp";
const LISTTEAMUSER = "/teamuser/listteamuser";
const DELETE_TEAM = "/teams/deleteteam";
const GET_ATTENDANCEREPORT = "/attendance/attendanceSummaryBetweenDate";
const GET_EMPLOYEEREPORT = "/users/getbyid";
const GET_SINGLEEMPLOYEEREPORT = "/attendance/singleUserBetweenDates";
const REJECT_LEAVE = "/leave/reject";
const EXCEL_ALL = "/leave/download";
const EXCEL_ATTENDANCE = "/attendance/download";
const ENDPOINT = {
  USER_LOGIN,
  GETALL_USER,
  CREATE_USER,
  DELETE_USER,
  GET_TASK_BYID,
  GET_SPRINT_BYID,
  GET_USER_BY_ID,
  GET_USER_ROLE_SCREEN_ACTIVITIES,
  UPDATE_USER,
  UPDATEALL_USER,
  TOTAL_USERS,
  INACTIVE_USERS,
  TOTAL_LEAVE_APPLIED,
  TODAY_ATTENDANCE,
  LEAVE_STATUS,
  ATTEN_SEARCH,
  ATTEN_GET_ID,
  ATTEN_GET_ID_DATE,
  GET_COMPANY,
  GET_LEAVE_BY_USERID,
  CREATE_LEAVE,
  GET_REQUEST_LEAVE_BYID,
  DELETE_LEAVE,
  GET_LEAVE_BY_LEAVEID,
  APPROVE_LEAVE,
  REJECT_LEAVE,
  GETALL_ROLE,
  GETALL_POSITION,
  UPDATE_COMPANY,
  GETALL_PROJECT,
  DELETE_PROJECTMEMBER,
  CREATE_PROJECTUSER,
  GETALL_PROJECTMANAGER,
  GETALL_TEAMLEADER,
  CREATE_TEAMUSER,
  CREATE_PROJECT,
  ACCOUNT_PROJECT,
  ACCOUNT_TEAMS,
  CREATE_TEAMS,
  UPDATE_TEAMS,
  GET_TEAMVALUE,
  GET_TEAMLIST,
  GETUSER_PROJECT,
  UPDATE_PROJECT,
  GETALL_TASKLIST,
  CREATE_TASK,
  DELETE_TASK,
  TODAY_BIRTHDAY,
  GETALL_HOLIDAYS,
  CREATE_HOLIDAYS,
  GETALL_PROJECTMEMBER,
  UPDATE_HOLIDAYS,
  DELETE_HOLIDAY,
  USER_SIGNIN,
  GETALL_HOLIDAYSBYID,
  GETALL_SPRINT,
  CREATE_SPRINT,
  DELETE_SPRINT,
  UPDATE_SPRINT,
  GETALL_SPRINTBYID,
  CREATE_TIMESHEET,
  GET_TIMESHEET,
  GETALL_TASKTYPE,
  CREATE_TASKTYPE,
  GETONE_TASKTYPE,
  UPDATE_TASKTYPE,
  DELETE_TASKTYPE,
  GETALL_TASKSTATUS,
  GETALL_TASKGET,
  CREATE_TASKSTATUS,
  DELETE_TASKSTATUS,
  UPDATE_TASKSTATUS,
  GETALL_TASKSTATUSBYID,
  GET_ALLPOSITIONS,
  DELETE_POSITIONS,
  GET_POSITION,
  CREATE_POSITION,
  UPDATE_POSITION,
  GET_SUMMARY,
  FORGET_PASSWORD,
  VERIFY_OTP,
  LISTTEAMUSER,
  DELETE_TEAM,
  GET_ATTENDANCEREPORT,
  GET_EMPLOYEEREPORT,
  GET_SINGLEEMPLOYEEREPORT,
  GET_TEAMCODE,
  GET_TASKLIST,
  GET_TASKSTATUS,
  GET_TASK,
  GET_TEAM_USERS,
  GET_REQUESTED_LEAVE,
  GET_TIMESHEETBYID,
  UPDATE_TIMESHEET,
  CREATE_INFORMATION,
  GET_INFORMATION,
  EXCEL_ALL,
  EXCEL_ATTENDANCE,
};
export default ENDPOINT;

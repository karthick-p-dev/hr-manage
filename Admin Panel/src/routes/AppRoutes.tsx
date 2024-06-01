import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import Account from "../feature/account/Account";
import Dashboard from "../feature/dashboard/Dashboard";
import Alluser from "../feature/user/Alluser";
import Allattendance from "../feature/attendance/Allattendance";
import Myattendance from "../feature/attendance/Myattendance";
import Adduser from "../feature/user/Adduser";
import EditUser from "../feature/user/EditUser";
import AuthRoute from "./AuthRoute";
import Projects from "../feature/control_menu/project/Projects";
import Assignproject from "../feature/control_menu/project/Assignproject";
import Addproject from "../feature/control_menu/project/Addproject"
import Viewproject from "../feature/control_menu/project/Viewproject";
import CompanyView from "../feature/company/CompanyView";
import CompanyEdit from "../feature/company/CompanyEdit";
import AddLeave from "../feature/leave/AddLeave";
import MyLeave from "../feature/leave/MyLeave";
import TeamLeave from "../feature/leave/TeamLeave";
import RequestedLeaves from "../feature/leave/RequestedLeaves";
import Views from "../feature/leave/View";
import Tasktype from "../feature/mastermenu/Tasktype";
import Birthday from "../feature/birthday/Birthday";
import Holiday from "../feature/Holiday/Holiday";
import AddHoliday from "../feature/Holiday/AddHoliday";
// import Editholiday from "../feature/Holiday/Editholiday";
import Sprint from "../feature/control_menu/Sprint/Sprint";
import Teams from "../feature/control_menu/Teams/Teams";
// import Assignteam from "../feature/control_menu/Teams/Assignteam";
import Addsprint from "../feature/control_menu/Sprint/Addsprint";
import MyTimesheet from "../feature/timesheet/MyTimesheet";
import Tasks from "../feature/control_menu/Task/Tasks";
import Addtask from "../feature/control_menu/Task/Addtask";
import Taskstatus from "../feature/control_menu/Task/Taskstatus";
import Addstatus from "../feature/control_menu/Task/Addstatus";
import DesignationList from "../feature/control_menu/designation/DesignationList";
import AddDesignation from "../feature/control_menu/designation/AddDesignation";
import EditDesignation from "../feature/control_menu/designation/EditDesignation";
import Addteam from "../feature/control_menu/Teams/Addteam";
import Monthsummary from "../feature/Summary/Monthsummary";
import Addtasktype from "../feature/mastermenu/Addtasktype";
import Info from "../feature/Information/Info";
import AttendanceReport from "../feature/Summary/attendancesummary/AttendanceSummary";
import EmployeeReport from "../feature/Summary/attendancesummary/EmployeeReport";
import AddTimeSheet from "../feature/timesheet/AddTimesheet";
import TimesheetView from "../feature/timesheet/TimesheetView";
import EditTimesheet from "../feature/timesheet/EditTimesheet";
import Addinformation from "../feature/Information/Addinformation";
import Assignteam from "../feature/control_menu/Teams/Assignteam";
import Userview from "../feature/user/Userview";
import Timesheet from "../feature/user/Timesheet";
import ManualAttendance from "../feature/user/ManualAttendance";
import AttView from "../feature/attendance/MyattendanceView";
import CandidateOnboarding from "../feature/candidateOnboarding/candidateOnboarding";
import CandidateOnboardingstep1 from "../feature/candidateOnboarding/Step1";

const AppRoutes = () => (
    <>
      <div className="App" id="wrapper">

          <Fragment>
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
              <div className="body flex-grow-1 px-3">
                <Routes>

                  <Route path='/dashboard' element={<AuthRoute />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                  </Route>

                  <Route path='/Account' element={<AuthRoute />}>
                    <Route path='/Account' element={<Account />} />
                  </Route>
                  <Route path='/user' element={<AuthRoute />}>
                    <Route path='/user' element={<Alluser />}></Route>
                  </Route>
                  <Route path='/user/:valuess' element={<AuthRoute />}>
                    <Route path='/user/:valuess' element={<Alluser />}></Route>
                  </Route>
                  <Route path='/leaves/myleaves' element={<AuthRoute />}>
                    <Route path="/leaves/myleaves" element={<MyLeave />}></Route>
                  </Route>
                  <Route path='/leaves/add' element={<AuthRoute />}>
                    <Route path="/leaves/add" element={<AddLeave />}></Route>
                  </Route>
                  <Route path='/leaves/teamleave' element={<AuthRoute />}>
                    <Route path="/leaves/teamleave" element={<TeamLeave />}></Route>
                  </Route>
                  <Route path='/leaves/myleaves/view/:id' element={<AuthRoute />}>
                    <Route path="/leaves/myleaves/view/:id" element={<Views />}></Route>
                  </Route>

                  <Route path='/leaves/teamleave/view/:id' element={<AuthRoute />}>
                    <Route path="/leaves/teamleave/view/:id" element={<Views />}></Route>
                  </Route>

                  <Route path='/leaves/list/view/:id' element={<AuthRoute />}>
                    <Route path="/leaves/list/view/:id" element={<Views />}></Route>
                  </Route>

                  <Route path='/leaves/list' element={<AuthRoute />}>
                    <Route path="/leaves/list" element={<RequestedLeaves />}></Route>
                  </Route>

                  <Route path='/attendance' element={<AuthRoute />}>
                    <Route path="/attendance" element={<Allattendance />}></Route>
                  </Route>

                  <Route path='/attendance/:status' element={<AuthRoute />}>
                    <Route path="/attendance/:status" element={<Allattendance />}></Route>
                  </Route>

                  <Route path='/myattendance/view' element={<AuthRoute />}>
                    <Route path="/myattendance/view" element={<AttView/>}></Route>
                  </Route>

                  <Route path='/attendance/view/:id/:viewDate' element={<AuthRoute />}>
                    <Route path="/attendance/view/:id/:viewDate" element={<Myattendance/>}></Route>
                  </Route>

                  <Route path='/companies' element={<AuthRoute />}>
                    <Route path="/companies" element={<CompanyView />}></Route>
                  </Route>
                  <Route path='/companies' element={<AuthRoute />}>
                    <Route path="/companies/edit" element={<CompanyEdit />}></Route>
                  </Route>

                   <Route path='/user/edit/:id' element={<AuthRoute />}>
                    <Route path="/user/edit/:id" element={<Adduser/>}></Route>
                  </Route>

                  <Route path='/user/timesheet/:id' element={<AuthRoute />}>
                    <Route path="/user/timesheet/:id" element={<Timesheet/>}></Route>
                  </Route>

                  <Route path='/adduser'element={<AuthRoute />}>
                    <Route path='/adduser' element={<Adduser />}></Route>
                  </Route>

                  <Route path='/account' element={<AuthRoute />}>
                  <Route path='/account' element={<Account />}></Route>
                  </Route>

                  <Route path='/tasktype' element={<AuthRoute />}>
                  <Route path='/tasktype' element={<Tasktype />}></Route>
                  </Route>

                  <Route path='/tasktype/add' element={<AuthRoute />}>
                  <Route path='/tasktype/add' element={<Addtasktype />}></Route>
                  </Route>

                  <Route path='/tasktype/edit/:id' element={<AuthRoute />}>
                  <Route path='/tasktype/edit/:id' element={<Addtasktype />}></Route>
                  </Route>

                  <Route path='/birthdays' element={<AuthRoute />}>
                  <Route path='/birthdays' element={<Birthday />}></Route>
                  </Route>

                  <Route path='/holidays' element={<AuthRoute />}>
                  <Route path='/holidays' element={<Holiday />}></Route>
                  </Route>

                  <Route path='/add-holiday' element={<AuthRoute />}>
                  <Route path='/add-holiday' element={<AddHoliday />}></Route>
                  </Route>

                  <Route path='/projects' element={<AuthRoute />}>
                  <Route path='/projects' element={<Projects />}></Route>
                  </Route>

                  <Route path='/tasks' element={<AuthRoute />}>
                  <Route path='/tasks' element={<Tasks />}></Route>
                  </Route>

                  <Route path='/tasks/add' element={<AuthRoute />}>
                  <Route path='/tasks/add' element={<Addtask />}></Route>
                  </Route>

                  <Route path='/tasks/edit/:id' element={<AuthRoute />}>
                  <Route path='/tasks/edit/:id' element={<Addtask />}></Route>
                  </Route>

                  <Route path='/task/status' element={<AuthRoute />}>
                  <Route path='/task/status' element={<Taskstatus />}></Route>
                  </Route>

                  <Route path='/task/status/add' element={<AuthRoute />}>
                  <Route path='/task/status/add' element={<Addstatus />}></Route>
                  </Route>

                  <Route path='/task/status/edit/:id' element={<AuthRoute />}>
                  <Route path='/task/status/edit/:id' element={<Addstatus />}></Route>
                  </Route>

                  <Route path='/projects/assign' element={<AuthRoute />}>
                  <Route path='/projects/assign' element={<Assignproject />}></Route>
                  </Route>

                  <Route path='/projects/add' element={<AuthRoute />}>
                  <Route path='/projects/add' element={<Addproject />}></Route>
                  </Route>

                  <Route path='/projects/edit/:id' element={<AuthRoute />}>
                  <Route path='/projects/edit/:id' element={<Addproject />}></Route>
                  </Route>

                  <Route path='/projects/view/:id' element={<AuthRoute />}>
                  <Route path='/projects/view/:id' element={<Viewproject />}></Route>
                  </Route>

                  {/* <Route path='/edit-holiday/:id' element={<AuthRoute />}>
                  <Route path='/edit-holiday/:id' element={<EditHoliday />}></Route>
                  </Route> */}

                  <Route path='/teams' element={<AuthRoute />}>
                  <Route path='/teams' element={<Teams />}></Route>
                  </Route>

                  <Route path='/teams/add' element={<AuthRoute />}>
                  <Route path='/teams/add' element={<Addteam />}></Route>
                  </Route>

                  <Route path='/teams/assign' element={<AuthRoute />}>
                  <Route path='/teams/assign' element={<Assignteam />}></Route>
                  </Route>

                  {/* <Route path='/teams/add' element={<AuthRoute />}>
                  <Route path='/teams/add' element={<AddTeam />}></Route>
                  </Route> */}

                  <Route path='/sprint' element={<AuthRoute />}>
                  <Route path='/sprint' element={<Sprint />}></Route>
                  </Route>

                  <Route path='/sprint/add' element={<AuthRoute />}>
                  <Route path='/sprint/add' element={<Addsprint />}></Route>
                  </Route>

                  <Route path='/teams/edit/:id' element={<AuthRoute />}>
                  <Route path='/teams/edit/:id' element={<Addteam />}></Route>
                  </Route>

                  <Route path='/sprint/edit/:id' element={<AuthRoute />}>
                  <Route path='/sprint/edit/:id' element={<Addsprint />}></Route>
                  </Route>

                  <Route path='/timesheet/add' element={<AuthRoute />}>
                  <Route path='/timesheet/add' element={<AddTimeSheet />}></Route>
                  </Route>

                  <Route path='/timesheet/myList' element={<AuthRoute />}>
                  <Route path='/timesheet/myList' element={<MyTimesheet />}></Route>
                  </Route>

                  <Route path='/timesheet/edit/:id' element={<AuthRoute />}>
                  <Route path='/timesheet/edit/:id' element={<EditTimesheet />}></Route>
                  </Route>

                  <Route path='/timesheet/view/:date' element={<AuthRoute />}>
                  <Route path='/timesheet/view/:date' element={<TimesheetView />}></Route>
                  </Route>

                  <Route path='/positions' element={<AuthRoute />}>
                  <Route path='/positions' element={<DesignationList />}></Route>
                  </Route>

                  <Route path='/positions/add' element={<AuthRoute />}>
                  <Route path='/positions/add' element={<AddDesignation />}></Route>
                  </Route>

                  <Route path='/positions/edit/:id' element={<AuthRoute />}>
                    <Route path="/positions/edit/:id" element={<EditDesignation/>}></Route>
                  </Route>

                  <Route path='/monthly-summary' element={<AuthRoute />}>
                  <Route path='/monthly-summary' element={<Monthsummary />}></Route>
                  </Route>

                  <Route path='/summary/attendanceReport' element={<AuthRoute />}>
                    <Route path="/summary/attendanceReport" element={<AttendanceReport/>}></Route>
                  </Route>

                  <Route path='/information/add' element={<AuthRoute />}>
                    <Route path="/information/add" element={<Addinformation/>}></Route>
                  </Route>

                  <Route path='/info' element={<AuthRoute />}>
                    <Route path="/info" element={<Info />}></Route>
                  </Route>

                  <Route path='/summary/employeeReport/:id/:startDate/:endDate' element={<AuthRoute />}>
                    <Route path="/summary/employeeReport/:id/:startDate/:endDate" element={<EmployeeReport/>}></Route>
                  </Route>

                  <Route path='/userview/:value/:id' element={<AuthRoute />}>
                    <Route path="/userview/:value/:id" element={<Userview />}></Route>
                  </Route>

                  <Route path='/user/manualattendance/:id' element={<AuthRoute />}>
                    <Route path="/user/manualattendance/:id" element={<ManualAttendance/>}></Route>
                  </Route>

                  <Route path='/candidate' element={<AuthRoute />}>
                    <Route path="/candidate" element={<CandidateOnboarding />}></Route>
                  </Route>

                  <Route path='/candidate/step1' element={<AuthRoute />}>
                    <Route path="/candidate/step1" element={<CandidateOnboardingstep1 />}></Route>
                  </Route>

                </Routes>
              </div>
            </div>
          </Fragment>
      </div>
    </>
  );
export default AppRoutes;

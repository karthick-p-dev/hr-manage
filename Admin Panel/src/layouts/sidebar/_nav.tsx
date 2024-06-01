import React from "react";
import Dashboard from "@mui/icons-material/Dashboard";
import LocationCity from "@mui/icons-material/LocationCity";
import EventBusy from "@mui/icons-material/EventBusy";
import MenuBook from "@mui/icons-material/MenuBook";
import Event from "@mui/icons-material/Event";
import Add from "@mui/icons-material/Add";
import Assignment from "@mui/icons-material/Assignment";
import EventNote from "@mui/icons-material/EventNote";
import People from "@mui/icons-material/People";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import ViewModule from "@mui/icons-material/ViewModule";
import Summarize from "@mui/icons-material/Summarize";
import Info from "@mui/icons-material/Info";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import Cake from "@mui/icons-material/Cake";
import HolidayVillage from "@mui/icons-material/HolidayVillage";
import List from "@mui/icons-material/List";
import Person from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const _nav = [
  {
    component: "",
    name: "Dashboard",
    to: "/dashboard",
    icon: <Dashboard />,
  },
  {
    component: "",
    name: "Company Details",
    checkname: "Add user",
    to: "/companies",
    icon: <LocationCity />,
  },
  {
    component: "",
    name: "Leaves",
    checkname: "My Leaves",
   // to: "/leave",
    icon: <EventBusy />,
    children: [
      {
        component: "",
        name: "My Leaves",
        checkname: "My Leaves",
        to: "/leaves/myleaves",
        icon: <Event />,
      },
      {
        component: "",
        name: "Apply Leaves",
        checkname: "My Leaves",
        to: "/leaves/add",
        icon: <Add />,
      },
      {
        component: "",
        name: "Team Leaves",
        checkname: "Team Leaves",
        to: "/leaves/teamleave",
        icon: <AssignmentLateIcon />,
      },
      {
        component: "",
        name: "Requested Leaves",
        checkname: "Requested Leaves",
        to: "/leaves/list",
        icon: <EventBusy />,
      },
    ],
  },
  {
    component: "",
    name: "Attendance",
    checkname: "My Attendance",
   // to: "/attendance",
    icon: <EventNote />,
    children: [
      {
        component: "",
        name: "All Attendance",
        checkname: "Add user",
        to: "/attendance",
        attendanceabsent: "/attendance/false",
        icon: <EventNote />,
      },
      {
        component: "",
        name: "My Attendance",
        checkname: "My Attendance",
        to: "/myattendance/view",
        icon: <Event />,
       // to: { userid },

      },
    ],
  },
  {
    component: "",
    name: "Users",
    checkname: "All user",
   // to: "/user",
    icon: <People />,
    children: [
      {
        component: "",
        name: "All Users",
        checkname: "All user",
        to: "/user",
        icon: <People />,
      },
      {
        component: "",
        name: "Add User",
        checkname: "Add user",
        to: "/adduser",
        icon: <Add />,
      },
    ],
  },
  {
    component: "",
    name: "Master Menu",
    checkname: "Master Menu",
   // to: "/dashboard",
    icon: <MenuBook />,
    children: [
      {
        component: "",
        name: "Task Type",
        to: "/tasktype",
        icon: <MenuBook />,
      },
      {
        component: "",
        name: "Task Status",
        to: "/task/status",
        icon: <MenuBook />,
      },
    ],
  },
  {
    component: "",
    name: "Project Management",
    checkname: "Project Management",
    icon: <People />,
    children: [
      {
        component: "",
        name: "Projects",
        to: "/projects",
        icon: <Assignment />,
      },
      {
        component: "",
        name: "Sprint",
        to: "/sprint",
        icon: <CategoryIcon />,
      },
      {
        component: "",
        name: "Tasks",
        to: "/tasks",
        icon: <AssignmentTurnedInIcon />,
      },
      {
        component: "",
        name: "Teams",
        to: "/teams",
        icon: <PeopleAlt />,
      },
      {
        component: "",
        name: "Designation",
        to: "/positions",
        icon: <ViewModule />,
      },
    ],
  },
  {
    component: "",
    name: " Timesheet ",
    icon: <AccessTimeIcon />,
    children: [
      {
        component: "",
        name: " Add Timesheet ",
        checkname: "Create Timesheet",
        to: "/timesheet/add",
        icon: <Add />,
      },
      {
        component: "",
        name: " My Timesheet ",
        checkname: "My timesheet",
        to: "/timesheet/myList",
        icon: <FormatListBulletedIcon />,
      },
    ],
  },
  {
    component: "",
    name: "Information",
    checkname: "Official Info",
    to: "/info",
    icon: <Info/>,
  },
  {
    component: "",
    name: "Summary",
    checkname: "Summary",
    icon: <Summarize />,
    children: [
      {
        component: "",
        name: "Month Summary",
        to: "/monthly-summary",
        icon: <CalendarMonth />,
      },
      {
        component: "",
        name: "Attendance Report",
        to: "/summary/attendanceReport",
        icon: <EventNote />,

      },
    ],
  },
  {
    component: "",
    name: "Holidays",
    checkname: "Holidays",
  //  to: "/holiday",
    icon: <HolidayVillage />,
    children: [
      {
        component: "",
        name: "Holiday List",
        checkname: "Holiday List",
        to: "/holidays",
        icon: <List />,
      },
      {
        component: "",
        name: "Add Holiday",
        checkname: "Add Holiday",
        to: "/add-holiday",
        icon: <Add />,
      },
    ],
  },
  {
    component: "",
    name: "Birthday",
    checkname: "Birthday",
    to: "/birthdays",
    icon: <Cake />,
  },
  {
    component: "",
    name: "Account",
    to: "/account",
    icon: <Person />,
  },
  {
    component: "",
    name: "On Boarding",
    icon: <AssignmentIndIcon />,
    children: [
      {
        component: "",
        name: "Step 1",
        to: "/candidate/step1",
        icon: <Person />,
      },
    ],
  },
];

export default _nav;

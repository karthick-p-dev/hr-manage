import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import People from "@mui/icons-material/People";
import EventBusy from "@mui/icons-material/EventBusy";
import EventNote from "@mui/icons-material/EventNote";
import { ReactGoogleChartEvent, Chart } from "react-google-charts";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import Applicationlabel from "../../common/en.json";
import { getAllUser } from "../../app/redux/actions/action";
import SimpleSnackbar from "../../common/toaster/toast";
import dashboardService from "../../helpers/Services/dashboard.service";
import leaveService from "../../helpers/Services/leave.service";
import attandanceService from "../../helpers/Services/attendance.service";
import { useParams } from "react-router-dom";

const Item = styled(Paper)(({ theme }: any) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [usersList, setUsersList] = useState(0);
  const [leaveList, setLeaveList] = useState(0);
  const [presentList, SetPresentList] = useState(0);
  const [absentList, setAbsentList] = useState(0);
  const [leaveapproved, setLeaveapproved] = useState(0);
  const [leaverejected, setLeaverejected] = useState(0);
  const [leavewaiting, setLeavewaiting] = useState(0);
  const [userdata, setUserdata] = useState<any>([]);
  const [teamleave, setTeamLeave] = useState();
  const [userposition] = useState(JSON.parse(userinfo.position.permissionJson));
  const current = new Date();
  const [dateStart] = useState<any>(current);

  const pieChartdata = [
    ["Pizza", "Popularity"],
    // ["Total", usersList],
    ["Present", presentList],
    ["Absent", absentList],
  ];
  
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");

  const options = {
    title: "Today Attendance Status",
    is3D: true,
    colors: ['#57A027','#8f1820']
  };

  const chartEvents: ReactGoogleChartEvent[] = [
    {
      eventName: "select",
      callback: ({ chartWrapper }) => {
        const chart = chartWrapper.getChart();
        const selection = chart.getSelection();
        const dataTable = chartWrapper.getDataTable();
        const [selectedItem] = selection;
        const { row, column } = selectedItem;
        const total = dataTable?.getValue(row, 0)
        if (total === "Total") {
          // alert("Total Number of Employees:"+usersList)
          setToast(true);
          setMessage(Applicationlabel.toast.totNoOfEmp+usersList);
          }
        else if(total === "Absent") {
          navigate("/attendance/false");
        }
        else{
          navigate("/attendance");
        }
      }
    }
  ];
 
  async function getAllDatas(val: any) {
    const resp: any = await dispatch(getAllUser(val));
    if (resp.payload) {
      setUsersList(resp.payload.length);
    }

    const resp1 = await dashboardService.getTotalAttendance( 
       moment(dateStart).format("DD-MM-YYYY"),
       userinfo.companyId);
    if (resp1.status) {
      SetPresentList(resp1.data.present.length);
      setAbsentList(resp1.data.absent.length);
    }

    let today: any = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    today = `${dd}-${mm}-${yyyy}`;

    const resp2 = await leaveService.getRequestLeaveByDate(userinfo.companyId, today, today);
    if (resp2.status) {
      setLeaveList(resp2.data.length);
    }

    const resp3 = await dashboardService.getLeaveByStatus(userinfo, "approved");
    if (resp3.status) {
      setLeaveapproved(resp3.data.length);
    }
    const resp4 = await dashboardService.getLeaveByStatus(userinfo, "rejected");
    if (resp4.status) {
      setLeaverejected(resp4.data.length);
    }
    const resp5 = await dashboardService.getLeaveByStatus(userinfo, "waiting");
    if (resp5.status) {
      setLeavewaiting(resp5.data.length);
    }

    const resp6 = await leaveService.getrequestleave(userinfo);
    if (resp6.status && resp6.data) {
      const teamleav: any = [...resp6.data];
      var filteredArray = teamleav.filter((data : any) =>{
      
        // var todayDate = moment(dateStart).format('DD-MM-YYYY')
        // var startDate = moment(data.leave.fromDate).format("DD-MM-YYYY")
        // var endDate = moment(data.leave.toDate).format('DD-MM-YYYY')
        // console.log("todaydatee",todayDate)
        // console.log("startDate",startDate)
        // console.log("endDate",endDate)
        // var foundDateInRange = moment(todayDate).isBetween(startDate,endDate)
        // console.log("foundDateInRange",foundDateInRange)
        return moment(dateStart).format('DD-MM-YYYY') == data.leave.fromDate;
      });
      setTeamLeave(filteredArray.length);
    }
  }

  async function getInOut() {
    const attendanceInfos = await attandanceService.getAttendanceByDateId(userinfo.id ,moment(dateStart).format("DD-MM-YYYY")
    );
    if(attendanceInfos.status){
      setUserdata(attendanceInfos.data);
    }
    }
 
  useEffect(() => {
    getAllDatas(userinfo);
    getInOut();
  }, []);

  useEffect(() => {
    setToast(true);
    setMessage(Applicationlabel.toast.welcome);
  }, []);

  return (
    <>
    {userinfo.roleId== 2 ? <><SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
    <div className="heading"><h3>{Applicationlabel.dashboard.heading}, {userinfo.userName}!</h3></div>
  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="custom-card-wrapper">
   <Grid item xs={12} sm={6} md={6} lg={3} className="custom-card">
   <Item>
     <CardActionArea onClick= { () => { navigate("/user/active"); }}>
     <People />
      <h3>{Applicationlabel.dashboard.users}</h3>
      <p>{Applicationlabel.dashboard.totUsers}</p>
      <div className="countno">{usersList}</div>
    </CardActionArea>
    </Item>
   </Grid>

          {(userposition[6].name == "Requested Leaves") && (userposition[6].isVisible == true) ? <>
            <Grid item xs={12} sm={6} md={6} lg={3} className="custom-card">
              <Item>
                <CardActionArea onClick={() => { navigate("/leaves/list"); }}>
                  <EventBusy />
                  <h3>{Applicationlabel.dashboard.leave}</h3>
                  <p>{Applicationlabel.dashboard.leaveApply}</p>
                  <div className="countno">{leaveList}</div>
                </CardActionArea>
              </Item>
            </Grid>
          </>
            : <>
              <Grid item xs={12} sm={6} md={6} lg={3} className="custom-card">
                <Item>
                  <CardActionArea onClick={() => { navigate("/leaves/teamleave"); }}>
                    <EventBusy />
                    <h3>{Applicationlabel.dashboard.teamLeaves}</h3>
                    <p>{Applicationlabel.dashboard.leaveApply}</p>
                    <div className="countno">{teamleave}</div>
                  </CardActionArea>
                </Item>
              </Grid>
            </>
          }

  <Grid item xs={12} sm={6} md={6} lg={3} className="custom-card">
    <Item>
    <CardActionArea onClick={() => { navigate("/attendance"); }}>
    <EventNote />
      <h3>{Applicationlabel.dashboard.attendance}</h3>
      <p>{Applicationlabel.dashboard.totPresent}</p>
      <div className="countno">{presentList}</div>
    </CardActionArea>
    </Item>
  </Grid>
  <Grid item xs={12} sm={6} md={6} lg={3} className="custom-card">
    <Item>
    <CardActionArea onClick={() => { navigate("/attendance/false"); }}>
    <EventNote />
      <h3>{Applicationlabel.dashboard.attendance}</h3>
      <p>{Applicationlabel.dashboard.totAbsent}</p>
      <div className="countno">{absentList}</div>
    </CardActionArea>
    </Item>
  </Grid>
</Grid>

      <br />
      {
        (absentList || presentList)
          ? <>
            { }
            <Card sx={{ display: "flex" }} className="das-chart">
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Chart
                    chartType="PieChart"
                    data={pieChartdata}
                    options={options}
                    width={"200"}
                    height={"400px"}
                    chartEvents={chartEvents}
                  />
                </CardContent>
              </Box>
            </Card>
          </>
          : ""
      }
        <br /> </> : <><div className="dashboard-others"><div className="heading"><h3>{Applicationlabel.dashboard.heading}, {userinfo.userName}!</h3></div>
          <div className="flex">
            <Grid className="custom-card  custom-card1">
              <Item>
                <CardActionArea >
                  <EventNote />
                  <span>{userdata.length != 0 && userdata[0].attendances.length != 0 && userdata[0].attendances[0].totalBreakHours}</span>
                  <div className="countno">{Applicationlabel.dashboard.totalBreakHours}</div>

                </CardActionArea>
              </Item>
            </Grid>
            <Grid className="custom-card  custom-card1">
              <Item>
                <CardActionArea >
                  <EventNote />
                  <span>{userdata.length != 0 && userdata[0].attendances.length != 0 && userdata[0].attendances[0].totalHours}</span>
                  <div className="countno">{Applicationlabel.dashboard.totalHours}</div>
                </CardActionArea>
              </Item>
            </Grid>
          </div>
        </div></>


      }

    </>
  );
};

export default Dashboard;

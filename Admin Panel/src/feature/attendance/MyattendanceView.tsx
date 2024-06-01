import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { GridColumns, GridRowsProp } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config/config";
import { TextField } from "@mui/material";
import Applicationlabel from "../../common/en.json";
import SimpleSnackbar from "../../common/toaster/toast";
import attandanceService from "../../helpers/Services/attendance.service";
import DataGridComponent from "../../common/datatable/DataGrid";

const AttView = () => {
  const { id } = useParams();
  const [userdetails, setUserdetails] = useState<any>([]);
  const [userdata, setUserdata] = useState<GridRowsProp>([]);
  const [newprofile,setNewprofile] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);

  async function getAttandances() {
    let passdata = userinfo.id;
    if (id) { passdata = id; }
    const attendanceInfos = await attandanceService.getAttendanceById(passdata);
    setNewprofile(attendanceInfos.data[0].profile)
    if (attendanceInfos.status) {
      const alldata = attendanceInfos.data[0];
      const setvalue:any = [];
      setUserdetails(alldata);
      alldata.attendances.map((data:any, index:any) => {
          const newdata = {
            id: index + 1,
            dateOfAttendance: data.dateOfAttendance,
            attendanceType: data.attendanceType,
            userName: attendanceInfos.data[0].userName,
            inTime: data.inTime,
            outTime: data.outTime,
            totalHours: data.totalHours,
            totalBreakHours: data.totalBreakHours,
          };
          setvalue.push(newdata);
          return setvalue;

      });
      setUserdata(setvalue.reverse());
      setToast(true);
      setMessage(Applicationlabel.toast.myAttendance);
    }
  }

 
  const inputHandler = (e:any) => {
    const lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };
  const filteredData = userdata.filter((el:any) => {
    if (searchText === "") {
        return el;
    }
     return (String(el.dateOfAttendance).toLowerCase().includes(searchText) || el.attendanceType.toLowerCase().includes(searchText) || (el.inTime).toLowerCase().includes(searchText)
     || (el.outTime).toLowerCase().includes(searchText) || (el.totalBreakHours).toLowerCase().includes(searchText) || (el.totalHours).toLowerCase().includes(searchText))
});

  const gridColumns: GridColumns = [
    {
      field: "dateOfAttendance", headerName: "Date of Attendance",width:130,
    },
    {
      field: "attendanceType", headerName: "Attendance Type",width:130
    },
    {
      field: "inTime", headerName: "In Time", width: 340,
    },
    {
      field: "outTime", headerName: "Out Time",width: 300,
    },
    {
      field: "totalHours", headerName: "Total Hours",
    },
    {
      field: "totalBreakHours", headerName: "Total Breaks",
    },
  ];

  useEffect(() => {
    getAttandances();
  }, []);

  return (
    <>
      <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      {/* <Card sx={{ display: "flex" }}> */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <div className="flex  al-s">
          <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.myAttendance.heading}</p>
          <div>
            <CardContent sx={{ flex: "1 0 auto" }}>

              <Grid container spacing={1} className="ml0">
                <Grid container xs={4} className="jc-center">
                  <div className="userprofile">
                    <img src={BASE_URL + "/" + newprofile} />
                  </div>
                </Grid>
                <Grid container xs={8}>
                  <Grid container xs={12} className="left-content-around">
                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendance.name}</Grid>
                    <Grid item xs={1} className="p-1">:</Grid>
                    <Grid item xs={3} className="p-1 tl">{userdetails.userName}</Grid>
                  </Grid>
                  <Grid container xs={12} className="left-content-around">
                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendance.email}</Grid>
                    <Grid item xs={1} className="p-1">:</Grid>
                    <Grid item xs={3} className="p-1 tl">{userdetails.email}</Grid>
                  </Grid>
                  <Grid container xs={12} className="left-content-around">
                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendance.employeeId}</Grid>
                    <Grid item xs={1} className="p-1">:</Grid>
                    <Grid item xs={3} className="p-1 tl">{userdetails.employeeId}</Grid>
                  </Grid>
                </Grid>

              </Grid>
            </CardContent>
          </div>
        </div>

        <div className="search  searchCus">
          <TextField
            className="btn-fill pull-right update-profile"
            id="outlined-basic"
            onChange={inputHandler}
            variant="outlined"
            label={Applicationlabel.myAttendance.searchBar}

          />
        </div>

        <div className="pad16">
          <DataGridComponent columns={gridColumns} disableColumnFilter={true}  items={filteredData}  />
        </div>
      </Box>
      {/* </Card> */}

    </>
  );
};
export default AttView;

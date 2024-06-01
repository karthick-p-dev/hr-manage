import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { GridColumns, GridRowsProp, GridCellParams } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config/config";
import clsx from 'clsx';
// import Avatar from '@mui/material/Avatar';
import { TextField } from "@mui/material";
import Applicationlabel from "../../common/en.json";
import SimpleSnackbar from '../../common/toaster/toast';
import attandanceService from "../../helpers/Services/attendance.service";
import DataGridComponent from "../../common/datatable/DataGrid";

const Myattendance = () => {
  const { id, viewDate } = useParams();
  const [userdetails, setUserdetails] = useState<any>([]);
  const [userdata, setUserdata] = useState<any>([]);
  const [attendanceData, setAttendanceData] = useState<any>([]);
  const [newprofile, setNewprofile] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);

  async function getAttandances() {
    let passdata = userinfo.id;
    //let chooseDate = userinfo.choosedDate;

    if (id) {
      passdata = id;
      const attendancedata = await attandanceService.getAttendanceById(passdata);
      const resultData = attendancedata.data[0].attendances.reverse().map((elements: any) => {
          // if(elements != Applicationlabel.myAttendance.Undefined && elements.attendanceStatus == Applicationlabel.myAttendance.Absent){
          //   elements.inTime= Applicationlabel.myAttendance.Hyphen;
          //   elements.outTime= Applicationlabel.myAttendance.Hyphen;
          //   elements.totalBreakHours=Applicationlabel.myAttendance.Hyphen;
          //   elements.totalHours=Applicationlabel.myAttendance.Hyphen;
          // }
          return elements;
      })
      setAttendanceData(resultData);

      const attendanceInfos = await attandanceService.getAttendanceByDateId(id, viewDate);
      setUserdata(attendanceInfos.data[0].attendances[0])
      setNewprofile(attendanceInfos.data[0].profile)
      if (attendanceInfos.status) {
        const alldata = attendanceInfos.data[0];
        const setvalue: any = [];
        setUserdetails(alldata);
        alldata.attendances.map((data: any, index: any) => {
          const newdata = {
            id: index + 1,
            dateOfAttendance: data.dateOfAttendance,
            attendanceType: data.attendanceType,
            attendanceStatus: data.attendanceStatus,
            userName: attendanceInfos.data[0].userName,
            inTime:   data.inTime,
            outTime:  data.outTime  ,
            totalHours: data.totalHours  ,
            totalBreakHours: data.totalBreakHours ,
          };
          setvalue.push(newdata);
          return setvalue;
        });
        setUserdata(setvalue)
        // setUserdata(attendanceInfos.data.attendances);
        setToast(true);
        setMessage(Applicationlabel.toast.AttendanceView);
      }
    }
  }

  const navigate = useNavigate();

  const inputHandler = (e: any) => {
    const lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };
  
  //   const filteredData = userdata.filter((el:any) => {
  //     if (searchText === "") {
  //         return el;
  //     }
  //     return (String(el.dateOfAttendance).toLowerCase().includes(searchText) || el.attendanceType.toLowerCase().includes(searchText) || (el.inTime).toLowerCase().includes(searchText)
  //     || (el.outTime).toLowerCase().includes(searchText) || (el.totalBreakHours).toLowerCase().includes(searchText) || (el.totalHours).toLowerCase().includes(searchText))
  // });

  const gridColumns = [
    {
      field: "dateOfAttendance", headerName:  Object.values(Applicationlabel.gridHeader.dateofAttendance), width: 130,
    },
    {
      field: "attendanceType", headerName: Object.values(Applicationlabel.gridHeader.attendanceType), width: 150,
    },
    {
      field: "attendanceStatus", headerName: Object.values(Applicationlabel.gridHeader.status), width: 150,
      cellClassName: (params: GridCellParams<any>) => {
        return clsx('super-app', {
          Absent: params.value == "Absent",
          Present: params.value == "Present",
          Halfday: params.value == "Half day"
        });
      },
    },
    {
      field: "inTime", headerName: Object.values(Applicationlabel.gridHeader.inTime), width: 150,
    },
    {
      field: "outTime", headerName: Object.values(Applicationlabel.gridHeader.outTime), width: 150,
    },
    {
      field: "totalHours", headerName: Object.values(Applicationlabel.gridHeader.totalHours),
    },
    {
      field: "totalBreakHours", headerName: Object.values(Applicationlabel.gridHeader.totalBreak),
    },
  ];

  useEffect(() => {
    getAttandances();
  }, []);

  return (
    <>
      <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      {/* <Card sx={{ display: "flex" }}> */
      }
      <Box sx={{ display: "flex", flexDirection: "column",
      '& .super-app.Absent': {
        color: '#a10202',
        fontWeight: '600',
        },
        '& .super-app.Present': {
          color: '#2c7001',
          fontWeight: '600',
        }, 
        '& .super-app.Halfday': {
          color: '#ED7014',
          fontWeight: '600',
        }, }}>
        <div className="flex jc-sb al-s">
          <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.myAttendanceView.heading}</p>

          <Button
            className="btn-fill pull-right update-profile"
            variant="contained"
            style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
            onClick={() => {
              navigate(-1)
            }}>
            {Applicationlabel.button.back}
          </Button>
        </div>

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
                  <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendanceView.name}</Grid>
                  <Grid item xs={1} className="p-1">:</Grid>
                  <Grid item xs={3} className="p-1 tl">{userdetails.userName}</Grid>
                </Grid>
                <Grid container xs={12} className="left-content-around">
                  <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendanceView.email}</Grid>
                  <Grid item xs={1} className="p-1">:</Grid>
                  <Grid item xs={3} className="p-1 tl">{userdetails.email}</Grid>
                </Grid>
                <Grid container xs={12} className="left-content-around">
                  <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendanceView.employeeId}</Grid>
                  <Grid item xs={1} className="p-1">:</Grid>
                  <Grid item xs={3} className="p-1 tl">{userdetails.employeeId}</Grid>
                </Grid>
                {userdata && userdata.length == 0 ? "" : <>
                <Grid container xs={12} className="left-content-around">
                  <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendanceView.attendanceStatus}</Grid>
                  <Grid item xs={1} className="p-1">:</Grid>
                  <Grid item xs={3} className="p-1 tl">{userdata && userdata[0].attendanceStatus}</Grid>
                </Grid>
                <Grid container xs={12} className="left-content-around">
                  <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendanceView.dateOfAttendance}</Grid>
                  <Grid item xs={1} className="p-1">:</Grid>
                  <Grid item xs={3} className="p-1 tl">{userdata && userdata[0].dateOfAttendance }</Grid>
                </Grid>
                  <Grid container xs={12} className="left-content-around">
                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendanceView.attendanceType}</Grid>
                    <Grid item xs={1} className="p-1">:</Grid>
                    <Grid item xs={3} className="p-1 tl">{userdata && userdata[0].attendanceType}</Grid>
                  </Grid>
                  <Grid container xs={12} className="left-content-around">
                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendanceView.inTime}</Grid>
                    <Grid item xs={1} className="p-1">:</Grid>
                    <Grid item xs={3} className="p-1 tl">{userdata && userdata[0].inTime}</Grid>
                  </Grid>
                  <Grid container xs={12} className="left-content-around">
                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendanceView.outTime}</Grid>
                    <Grid item xs={1} className="p-1">:</Grid>
                    <Grid item xs={3} className="p-1 tl">{userdata && userdata[0].outTime}</Grid>
                  </Grid>
                  <Grid container xs={12} className="left-content-around">
                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendanceView.totalHours}</Grid>
                    <Grid item xs={1} className="p-1">:</Grid>
                    <Grid item xs={3} className="p-1 tl">{userdata && userdata[0].totalHours}</Grid>
                  </Grid>
                  <Grid container xs={12} className="left-content-around">
                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.myAttendanceView.totalBreakHours}</Grid>
                    <Grid item xs={1} className="p-1">:</Grid>
                    <Grid item xs={3} className="p-1 tl">{userdata && userdata[0].totalBreakHours}</Grid>
                  </Grid>
                </>}
              </Grid>
            </Grid>
          </CardContent>

        </div>
        {/* <div className="search  searchCus">
          <TextField
            className="btn-fill pull-right update-profile"
            id="outlined-basic"
            onChange={inputHandler}
            variant="outlined"
            label={Applicationlabel.myAttendanceView.searchBar}

          />
        </div> */}

        <div className="pad16">
          <DataGridComponent columns={gridColumns} items={attendanceData} />
        </div>
      </Box>
      {/* </Card> */}

    </>
  );
};
export default Myattendance;

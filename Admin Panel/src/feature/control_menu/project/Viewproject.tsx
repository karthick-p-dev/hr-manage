import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import moment from "moment";
import { GridColumns, GridRowsProp } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
// import { BASE_URL } from "../../config/config";
// import Avatar from '@mui/material/Avatar';
import { TextField } from "@mui/material";
import Applicationlabel from "../../../common/en.json";
import SimpleSnackbar from '../../../common/toaster/toast';
import DataGridComponent from "../../../common/datatable/DataGrid";
import projectService from "../../../helpers/Services/projects.service";

const Viewproject = () => {
    const { id } = useParams();
    const [projectView, setProjectView] = useState<any>([]);
    const [searchText, setSearchText] = useState("");
    const [viewDate, setViewdate] = useState("");
    const [toast, setToast] = useState(false);
    const [message, setMessage] = useState("");
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);

    async function getProjectDetails() {
        let passdata = userinfo.id;
        if (id) {
            passdata = id;
            const project = await projectService.getProjectDetails(userinfo, passdata);
            console.log("project", project.data)

            project.data.startdate = changeDateFormat(project.data.start_date);
            project.data.enddate = changeDateFormat(project.data.end_date);
            console.log("project", project.data)
            // moment(startDate).format("DD-MM-YYYY"),
            // console.log("startDate", startdate)

            // if (projectView.data && projectView.data.start_date) {
            //     console.log("splittting",projectView.start_date)
            //     projectView.start_date = `${String(projectView.start_date.getDate()).padStart(2, "0")}-${String(projectView.start_date.getMonth() + 1).padStart(2, "0")}-${String(projectView.start_date.getFullYear())}`;
            // setViewdate(projectView.start_date)
            setProjectView(project.data);
            setToast(true);
            setMessage(Applicationlabel.toast.viewProject);
        }
    }
    function changeDateFormat(value1:any){
        const splitdate = value1.split("T");
       return splitdate[0].split("-").reverse().join("-")
    }

    //       const attendanceInfos = await attandanceService.getAttendanceByDateId(id, viewDate);
    //       setUserdata(attendanceInfos.data[0].attendances[0])
    //       setNewprofile(attendanceInfos.data[0].profile)
    //       if (attendanceInfos.status) {
    //         const alldata = attendanceInfos.data[0];
    //         const setvalue: any = [];
    //         setUserdetails(alldata);
    //         alldata.attendances.map((data: any, index: any) => {
    //           const newdata = {
    //             id: index + 1,
    //             dateOfAttendance: data.dateOfAttendance,
    //             attendanceType: data.attendanceType,
    //             attendanceStatus: attendanceInfos.attendances.attendanceStatus == Applicationlabel.myAttendance.Absent || attendanceInfos.attendances.attendanceStatus == Applicationlabel.myAttendance.Present ? Applicationlabel.myAttendance.Present : attendanceInfos.attendances.attendanceStatus.length == 0 ? Applicationlabel.myAttendance.Absent : Applicationlabel.myAttendance.Absent,
    //             userName: attendanceInfos.data[0].userName,
    //             inTime:  attendanceInfos.data[0].attendances[0].attendanceStatus == Applicationlabel.myAttendance.Absent ? data.inTime : attendanceInfos.data[0].attendances[0].attendanceStatus == Applicationlabel.myAttendance.Hyphen ,
    //             outTime:  data.outTime  ,
    //             totalHours: data.totalHours  ,
    //             totalBreakHours: data.totalBreakHours ,
    //           };
    //           setvalue.push(newdata);
    //           return setvalue;
    //         });
    //         setUserdata(setvalue)
    //         // setUserdata(attendanceInfos.data.attendances);
    //         setToast(true);
    //         setMessage(Applicationlabel.toast.AttendanceView);
    //       }
    //     }
    //   }

    const navigate = useNavigate();

    // const inputHandler = (e: any) => {
    //     const lowerCase = e.target.value.toLowerCase();
    //     setSearchText(lowerCase);
    // };
    //   const filteredData = userdata.filter((el:any) => {
    //     if (searchText === "") {
    //         return el;
    //     }
    //     return (String(el.dateOfAttendance).toLowerCase().includes(searchText) || el.attendanceType.toLowerCase().includes(searchText) || (el.inTime).toLowerCase().includes(searchText)
    //     || (el.outTime).toLowerCase().includes(searchText) || (el.totalBreakHours).toLowerCase().includes(searchText) || (el.totalHours).toLowerCase().includes(searchText))
    // });

    //   const gridColumns = [
    //     {
    //       field: "dateOfAttendance", headerName:  Object.values(Applicationlabel.gridHeader.dateofAttendance), width: 130,
    //     },
    //     {
    //       field: "attendanceType", headerName: Object.values(Applicationlabel.gridHeader.attendanceType), width: 150,
    //     },
    //     {
    //       field: "attendanceStatus", headerName: Object.values(Applicationlabel.gridHeader.status), width: 150,
    //     },
    //     {
    //       field: "inTime", headerName: Object.values(Applicationlabel.gridHeader.inTime), width: 150,
    //     },
    //     {
    //       field: "outTime", headerName: Object.values(Applicationlabel.gridHeader.outTime), width: 150,
    //     },
    //     {
    //       field: "totalHours", headerName: Object.values(Applicationlabel.gridHeader.totalHours),
    //     },
    //     {
    //       field: "totalBreakHours", headerName: Object.values(Applicationlabel.gridHeader.totalBreak),
    //     },
    //   ];

    useEffect(() => {
        getProjectDetails();
    }, []);

    return (
        <>
            <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
             <Card sx={{ display: "flex" }}>            
            <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 autoe" }}>
                <div className="flex jc-sb al-s">
                    <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.viewProject.viewProjectTitle}</p>

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
                        <Grid container spacing={1} className="jc-center">
                            {/* <Grid container xs={4} className="jc-center">
                <div className="userprofile">
                  <img src={BASE_URL + "/" + newprofile} />
                </div>
              </Grid> */}

                            <Grid container xs={8}>
                                <Grid container xs={12} className="left-content-around">
                                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.viewProject.viewProjectName}</Grid>
                                    <Grid item xs={1} className="p-1">:</Grid>
                                    <Grid item xs={3} className="p-1 tl">{projectView.name}</Grid>
                                </Grid>
                                <Grid container xs={12} className="left-content-around">
                                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.viewProject.viewProjectCode}</Grid>
                                    <Grid item xs={1} className="p-1">:</Grid>
                                    <Grid item xs={3} className="p-1 tl">{projectView.code}</Grid>
                                </Grid>
                                <Grid container xs={12} className="left-content-around">
                                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.viewProject.viewProjectStartDate}</Grid>
                                    <Grid item xs={1} className="p-1">:</Grid>
                                    <Grid item xs={3} className="p-1 tl">{projectView.startdate}</Grid>
                                </Grid>
                                <Grid container xs={12} className="left-content-around">
                                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.viewProject.viewProjectEndDate}</Grid>
                                    <Grid item xs={1} className="p-1">:</Grid>
                                    <Grid item xs={3} className="p-1 tl">{projectView.enddate}</Grid>
                                </Grid>
                                <Grid container xs={12} className="left-content-around">
                                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.viewProject.viewProjectManager}</Grid>
                                    <Grid item xs={1} className="p-1">:</Grid>
                                    <Grid item xs={3} className="p-1 tl">{projectView.manager && projectView.manager.email}</Grid>
                                </Grid>
                                <Grid container xs={12} className="left-content-around">
                                    <Grid item xs={2} className="p-1 text-bold tl">{Applicationlabel.viewProject.viewProjectLeader}</Grid>
                                    <Grid item xs={1} className="p-1">:</Grid>
                                    <Grid item xs={3} className="p-1 tl">{projectView.teamleader && projectView.teamleader.email}</Grid>
                                </Grid>
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

                {/* <div className="pad16">
          <DataGridComponent columns={gridColumns} items={attendanceData} />
        </div> */}
         </CardContent>
            </Box>
            </Card>

        </>
    );
};

export default Viewproject;

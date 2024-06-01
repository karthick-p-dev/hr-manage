import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@mui/material/Button";
import { GridColumns } from "@mui/x-data-grid";
import DataGridComponent from "../../../common/datatable/DataGrid";
import attendancereportservice from "../../../helpers/Services/attendancereport.service";

const EmployeeReport = () => {
    const { id, startDate, endDate } = useParams();
  const [employeeList, setEmployeeList] = useState<any>([]);
  const navigate = useNavigate();
  async function getAttendanceList() {
    const response = await attendancereportservice.getEmployeeSummaryById(id);
    // setEmployeeList(response.data);
    console.log("response", response);
  }

 async function getEmployeeAttendanceDetails() {
    const senddata = {
        userId: id,
        start: startDate,
        end: endDate,
    };
    const response = await attendancereportservice.getEmployeeSummaryByDate(senddata);
    for (let i = 0; i < response.data.attendance.length; i += 1) {
      response.data.attendance[i].id = i + 1;
    }
    setEmployeeList(response.data.attendance);
 }
  const gridColumns: GridColumns = [
    {
      field: "id", headerName: "No",
    },
    {
      field: "date", headerName: "Date", width: 150,
    },
    {
      field: "workHours", headerName: "Working Hours", width: 300,
    },
    {
        field: "breakHours", headerName: "Break Hours", width: 300,
      },
      {
        field: "status", headerName: "Status", width: 300,
      },

  ];
  useEffect(() => {
    getAttendanceList();
    getEmployeeAttendanceDetails();
  }, []);
  return (
    <>
    <div className="App">
        <Card>
        <div className="justify-content-left">
          <Grid container spacing={3}>
        <Grid item xs={10} md={10} >
        <p style={{ float: "left", margin: 20, fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Attendance of from {startDate} - {endDate} </p>
        </Grid>
        <Grid item xs={2} md={2}>
            <Button style={{ float: "right", margin: 10, backgroundColor: "#673ab7", color: "#ffffff" }} variant="text" onClick={() => { navigate("/summary/attendanceReport"); }} className="mb-3">
                Back
            </Button>
        </Grid>
        <br/>
        <br />
        </Grid>
        </div>
        <br />
        <DataGridComponent columns={gridColumns} items={employeeList} />
        <br/>
        </Card>

    </div>
 </>
  );
};

export default EmployeeReport;

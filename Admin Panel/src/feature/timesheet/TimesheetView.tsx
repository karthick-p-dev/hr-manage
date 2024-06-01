import React, { useEffect, useState } from "react";
import { GridColumns } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@mui/material/Button";
import DataGridComponent from "../../common/datatable/DataGrid";

import timesheetservice from "../../helpers/Services/timesheet.service";

const TimesheetView = () => {
    const { date } = useParams();
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const navigate = useNavigate();
  const [timesheetlist, setTimesheetList] = useState<any>([]);

  async function getTimesheetDetails() {
    const data = {
      companyId: userinfo.companyId,
      timesheet_date: "2022-10-31",
      userId: 68,
    };
    const response = await timesheetservice.getTimesheetByDate(data);
    for (let i = 0; i < response.data.length; i += 1) {
        response.data[i].id = i + 1;
    }
    setTimesheetList(response.data);
  }
  const gridColumns: GridColumns = [
    {
      field: "id", headerName: "S.No",
    },
    {
        field: "projecttitle", headerName: "Project Title", valueGetter: (params:any) => params.row?.project.name,
    },
    {
        field: "sprinttitle", headerName: "Sprint Title", valueGetter: (params:any) => params.row?.project.name,
    },
    {
        field: "title", headerName: "Task Title",
    },
    {
        field: "tasktype", headerName: "Task type", valueGetter: (params:any) => params.row?.task_type.name,
    },
    {
        field: "task_code", headerName: "Task Code",
    },
    {
        field: "story_points", headerName: "Story Points",
    },
    {
        field: "actual_hours", headerName: "Hours",
    },
    {
        field: "status", headerName: "Status", valueGetter: (params:any) => params.row?.taskStatus.name,
    },
    {
        field: "comments", headerName: "Comments",
    },
  ];
  useEffect(() => {
    getTimesheetDetails();
  }, []);
  return (
    <>
    <div className="App">
        <Card>
        <div className="justify-content-left">
        <Grid container spacing={3}>
        <Grid item xs={10} md={10} >
        <p style={{ float: "left", margin: 20, fontSize: "22px", fontWeight: 500 }} className="fw-bolder">View Timesheet Date {date} </p>
        </Grid>
        <Grid item xs={2} md={2}>
            <Button style={{ float: "right", margin: 10, backgroundColor: "#673ab7", color: "#ffffff" }} variant="text" onClick={() => { navigate("/timesheet/myList"); }} className="mb-3">
                Back
            </Button>
        </Grid>
        </Grid>
        </div>
        <DataGridComponent columns={gridColumns} items={timesheetlist} />
        <br/>
        </Card>
    </div>
 </>
  );
};

export default TimesheetView;

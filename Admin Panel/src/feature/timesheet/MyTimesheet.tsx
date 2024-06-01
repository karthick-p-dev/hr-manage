import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import DataGridComponent from "../../common/datatable/DataGrid";
import timesheetservice from "../../helpers/Services/timesheet.service";

const MyTimesheet = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const navigate = useNavigate();
  const [timesheetdate, setTimesheetdate] = useState<any>(new Date());
  const [timesheetlist, setTimesheetList] = useState<any>([]);

  async function getTimesheetDetails() {
    const data = {
      companyId: userinfo.companyId,
      timesheetdate: "2022-10-31",
      userId: 68,
    };
    const response = await timesheetservice.getTimesheetByDate(data);
    response.data[0].id = 1;
    const tempValue :any = [];
    response.data[0].id = 1;
    tempValue.push(response.data[0]);
    setTimesheetList(tempValue);
  }
  const gridColumns: GridColumns = [
    {
      field: "id", headerName: "S.No",
    },
    {
      field: "Date", headerName: "Date", width: 150, valueGetter: (params:any) => moment(params.row?.timesheet?.timesheetdate).format("YYYY-MM-DD"),
    },
    {
      field: "email", headerName: "Project Title", width: 300, valueGetter: (params:any) => params.row?.project?.name,
    },
    {
      field: "title", headerName: "Task Title",
    },
    {
      field: "totalbreaks", headerName: "Task Status", valueGetter: (params:any) => params.row?.taskStatus?.name,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 100,
      getActions: (params: any) => [
        <GridActionsCellItem key={params.id} icon={<EditIcon />} onClick={() => { navigate(`/timesheet/edit/${timesheetdate}`); }} label="Edit" />,
        <GridActionsCellItem key={params.id} icon={<VisibilityIcon />} onClick={() => { navigate(`/timesheet/view/${timesheetdate}`); }} label="View" />,
      ],
    },
  ];
  const handleDateSelect = async (values: any) => {
    const valueDate = values.target.value;
    setTimesheetdate(valueDate);
    if (valueDate) {
      getTimesheetDetails();
    }
  };
  useEffect(() => {
    getTimesheetDetails();
  }, []);
  return (
    <>
    <div className="App">
        <Card>
        <div className="justify-content-left">
        <Grid item xs={10} md={10} >
        <p style={{ float: "left", margin: 20, fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Timesheet </p>
        </Grid>
        <Grid item xs={4} >
            <TextField type="date" variant="standard" sx={{ width: 350 }} id="fromDate" value={timesheetdate} className="form-control" autoComplete="off" onChange={handleDateSelect}/>
          </Grid>
        <br/>
        <br />
        </div>
        <DataGridComponent columns={gridColumns} items={timesheetlist} />
        <br/>
        </Card>
    </div>
 </>
  );
};

export default MyTimesheet;

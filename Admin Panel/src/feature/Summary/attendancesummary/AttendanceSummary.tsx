import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import Tooltip from "@mui/material/Tooltip";
import { GridColumns } from "@mui/x-data-grid";
import moment from "moment";
import writeXlsxFile from "write-excel-file";
import DataGridComponent from "../../../common/datatable/DataGrid";
import attendancereportservice from "../../../helpers/Services/attendancereport.service";

const AttendanceReport = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [attendancelist, setAttendancelist] = useState<any>([]);
  const [startDate, setFromDate] = useState(new Date());
  const [endDate, setToDate] = useState(new Date());
  const navigate = useNavigate();
  async function getAttendanceListByDate() {
    const senddata = {
        companyId: userinfo.companyId,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
    };
    const response = await attendancereportservice.getAttendanceSummaryByDate(senddata);
    for (let i = 0; i < response.data.length; i += 1) {
      response.data[i].index = i + 1;
    }
    setAttendancelist(response.data);
  }

  const gridColumns: GridColumns = [
    {
      field: "index", headerName: "No",
    },
    {
      field: "userName", headerName: "User Name", width: 150,
    },
    {
      field: "email", headerName: "Email", width: 300,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params: any) => [
        <Tooltip title="Visibility">
        <Visibility key={params.id} onClick={() => { navigate(`/summary/employeeReport/${params.id}/${moment(startDate).format("YYYY-MM-DD")}/${moment(endDate).format("YYYY-MM-DD")}`); }}/>
        </Tooltip>,
      ],
    },
  ];

  const handleEvent = (event: any, picker: any) => {
    setFromDate(picker.startDate._d.toISOString());
    setToDate(picker.endDate._d.toISOString());
    if (startDate && endDate) {
        getAttendanceListByDate();
    }
  };
  // const handleCallback = (start: any, end: any, label: any) => {

  // };
  const ExcelData : any = [];
  for (let i = 0; i < attendancelist.length; i += 1) {
    ExcelData.push({
      email: attendancelist[i].email,
      isActive: attendancelist[i].isActive,
      status: "Absent",
    });
  }
  async function checkDownload(ExcelInfo:any, schema:any) {
    await writeXlsxFile(ExcelInfo, {
      schema,
      fileName: `attendance_${moment(startDate).format("YYYY-MM-DD")}.xlsx`,
    });
   }
  const handleDownload = async () => {
    const schema = [
      {
        column: "Name",
        type: String,
        width: 30,
        value: (attendance: { email: any; }) => attendance.email,
      },
      {
        column: "Active Employee",
        type: String,
        width: 30,
        value: (attendance: { isActive: any; }) => (attendance.isActive ? "Active" : ""),
      },
      {
        column: moment(startDate).format("YYYY-MM-DD"),
        type: String,
        width: 30,
        value: (attendance: { status: any; }) => attendance.status,
      },
    ];
   checkDownload(ExcelData, schema);
  };

  useEffect(() => {
    getAttendanceListByDate();
  }, []);

  return (
    <>
    <div className="App">
        <Card>
        <div className="justify-content-left">
        <Grid container spacing={3}>
        <Grid item xs={10} md={10} >
        <p style={{ float: "left", margin: 20, fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Summary </p>
        </Grid>
        <Grid item xs={2} md={2}>
            <Button style={{ float: "right", margin: 10, backgroundColor: "#049FD9", color: "#ffffff" }} variant="text" onClick={handleDownload} className="mb-3">
                Export
            </Button>
        </Grid>
        <br/>
            <Grid item xs={10} md={10}>
            <DateRangePicker onEvent={handleEvent} >
            <input type="text" className="form-control" data-testid="datelimit" />
            </DateRangePicker>
            </Grid>
         <br />
        <br />
          <p style={{ margin: 20, marginLeft: 40, fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Attendance Summary </p>
          </Grid>
        </div>
        <div style={{ height: 700, width: "100%" }}>
        <DataGridComponent columns={gridColumns} items={attendancelist} />
        </div>
        <br/>
        </Card>
    </div>
 </>
  );
};

export default AttendanceReport;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import moment from "moment";
import { GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Applicationlabel from "../../common/en.json";
import DataGridComponent from "../../common/datatable/DataGrid";
import timesheetservice from "../../helpers/Services/timesheet.service";

const Timesheet = () => {
    const userinfo: any = useSelector(
        (state: any) => state && state.signReducer && state.signReducer.entities,
    );

    const [startDate, setStartDate] = useState(new Date());
    const [userTimeSheet, setUserTimeSheet] = useState<any>([]);
    const navigate = useNavigate();
    const { id } = useParams();
    async function getUserTimesheetDetails(valueDate: any) {
        const data = { timesheet_date: valueDate, companyId: userinfo.companyId, userId: id };
        const response = await timesheetservice.getTimesheetByDate(data);
        setUserTimeSheet(response.data);
        console.log("response--->", response);
    }
    const gridColumns: GridColumns = [
        {
          field: "id", headerName: "S.No",
        },
        {
          field: "Date", headerName: "Date", width: 150, valueGetter: (params:any) => moment(params.row?.timesheet?.timesheet_date).format("YYYY-MM-DD"),
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
            <GridActionsCellItem key={params.id} icon={<VisibilityIcon />} onClick={() => { navigate(`/timesheet/view/${startDate}`); }} label="View" />,
          ],
        },
      ];
    const handleDateSelect = async (values: any) => {
        console.log("values-->", values.target.value);
        const valueDate = values.target.value;
        setStartDate(valueDate);
        if (valueDate) {
            getUserTimesheetDetails(valueDate);
        }
    };
    // useEffect(() => {
    //     getUserTimesheetDetails();
    // }, []);

    return (
        <>
         <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <p
              style={{ float: "left", fontSize: "22px", fontWeight: 500 }}
              className="fw-bolder"
            >
            Timesheet
            </p>
                    <Grid item xs={4} >
                        <TextField type="date" variant="standard" sx={{ width: 150 }} id="fromDate" value={startDate} label="Choose a date" InputLabelProps={{ shrink: true, required: false }} className="form-control" autoComplete="off" onChange={handleDateSelect} />
                    </Grid>

                    <Grid item xs={4} >
                        <Button style={{ float: "right", margin: 10, backgroundColor: "#673ab7", color: "#ffffff" }} variant="text" onClick={() => { navigate("/user"); }} className="mb-3">
                        {Applicationlabel.button.back}
                        </Button>
                    </Grid>
                    <br />
                    <br />
                    <br />
                    <br />
                <DataGridComponent columns={gridColumns} items={userTimeSheet} />
                </CardContent>
                </Box>
      </Card>

        </>
    );
};
export default Timesheet;

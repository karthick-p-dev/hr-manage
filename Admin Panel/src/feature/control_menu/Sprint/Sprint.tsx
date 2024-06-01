import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Delete from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import { GridActionsCellItem } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DataGridComponent from "../../../common/datatable/DataGrid";
import sprintService from "../../../helpers/Services/sprint.service";
import ENDPOINT from "../../../helpers/Api";
import { BASE_URL } from "../../../config/config";
import { get } from "../../../helpers/fetch-Service-Methods";

const Sprint = () => {
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
    const [sprint, setSprint] = useState<any>([]);
console.log("sprint--->",sprint)
    const navigate = useNavigate();
     async function getSprintDetails() {
        const sprintDetails = await get(`${BASE_URL + ENDPOINT.GETALL_SPRINT}/${userinfo.companyId}`);
        console.log("dataa--->",sprintDetails)
       if (sprintDetails.data && sprintDetails.data) setSprint(sprintDetails.data);
      }

      async function deletefunction(e:any) {
        const senddata:any = {
          id: e.id,
          companyId: e.companyId,
        };
        const deleteSprint = await sprintService.deleteSprint(senddata);
        if (deleteSprint.status) {
          getSprintDetails();
        }
      }
      useEffect(() => {
        getSprintDetails();
      }, []);

    const columns: any = [
        {
          headerName: "No.",
          field: "id",

        },
        {
          headerName: "Sprint Code",
          field: "code",
          editable: false,
          width: 150,
        },
        {
          headerName: "Sprint Name",
          field: "sprint_name",
          editable: false,
          width: 150,
        },
        {
          headerName: "Project Title",
          field: "project",
          valueGetter: (params: any) => params.row?.project?.name,
          editable: false,
          width: 150,
        },
        {
          headerName: "Start Date",
          field: "start_dates",
          valueGetter: (params: any) => params.row?.start_dates.split("T")[0],
          editable: false,
          width: 110,
        },
        {
          headerName: "End Date",
          field: "end_date",
          valueGetter: (params: any) => params.row?.end_date.split("T")[0],
          editable: false,
          width: 110,
        },
        {
          headerName: " Spill over count",
          field: "spill_over_count",
          valueGetter: (params: any) => params.row?.spill_over_count,
          editable: false,
          width: 100,
        },
        {
          headerName: "Actions",

          renderCell: (row: any) => (row.id ? (
            <>
            <Tooltip title="Edit">
             <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => navigate(`/sprint/edit/${row.id}`)}
              color="primary"
            />
            </Tooltip>
            {/* <Edit onClick = {()=>{return(<><Addproject /></>)}}/> */}
            <Tooltip title="Delete">
            <Delete onClick={() => deletefunction(row)} color="error"/>
            </Tooltip>
            </>
          ) : null),
          width: 100,
        },
      ];

      return (
        <>
            {/* <h1>projects displayed</h1> */}
          <Card sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                  <div style= {{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Sprint</p></div>
                <div>
                {/* <Button variant="contained" onClick={() => { navigate("/projects/assign"); }}>Assign Project</Button> */}
                <Button variant="contained" style={{ marginLeft: "-5px" }} onClick={() => { navigate("/sprint/add"); }}>Add Sprint</Button>
                </div>
                </div>
                <br />
                <br />
                <br />
                <DataGridComponent columns={columns} items={sprint}/>
                {/* <DataTable
                  columns={columns}
                  data={sprint}
                  highlightOnHover
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                  paginationComponentOptions={{
                    rowsPerPageText: "Records per page:",
                    rangeSeparatorText: "out of",
                  }}
                /> */}
              </CardContent>
            </Box>
            </Card>
        </>
      );
};

export default Sprint;

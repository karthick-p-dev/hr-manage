import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import DataTable from "react-data-table-component";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Delete from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import { GridActionsCellItem } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DataGridComponent from "../../../common/datatable/DataGrid";
import ENDPOINT from "../../../helpers/Api";
import { BASE_URL } from "../../../config/config";
import { get } from "../../../helpers/fetch-Service-Methods";
import teamService from "../../../helpers/Services/teams.service";

const Teams = () => {
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
    const [teams, setTeams] = useState<any>([]);

    const navigate = useNavigate();
     async function getTeamsDetails() {
        const teamsdetails = await get(`${BASE_URL + ENDPOINT.ACCOUNT_TEAMS}/${userinfo.companyId}`);
       if (teamsdetails.data && teamsdetails.data) setTeams(teamsdetails.data);
      }

      async function deletefunction(e:any) {
        const senddata:any = {
          id: e.id,
          companyId: e.companyId,
        };
        const deleteSprint = await teamService.deleteteam(senddata);
        if (deleteSprint.status) {
          getTeamsDetails();
        }
      }
      useEffect(() => {
        getTeamsDetails();
      }, []);

    const columns: any = [
        {
          headerName: "No.",
          field: "id",
          editable: false,
          // width: 150
        },
        {
          headerName: "Team Code",
          field: "code",
          valueGetter: (params: any) => params.row?.code,
          editable: false,
          // width: 150
        },
        {
          headerName: "Team Name",
          field: "name",
          valueGetter: (params: any) => params.row?.name,
          editable: false,
        },
        {
          headerName: "Team Manager",
          field: "manager",
          valueGetter: (params: any) => params.row?.manager?.email,
          editable: false,
        },
        {
          headerName: "Team Leader",
          field: "teamleader",
          valueGetter: (params: any) => params.row?.teamleader?.email,
          editable: false,
        },
        {
          headerName: "Actions",
          renderCell: (row: any) => (row.id ? (
            <>
            <Tooltip title="Edit">
             <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => navigate(`/teams/edit/${row.id}`)}
              color="primary"
            />
            </Tooltip>
            {/* <Edit onClick = {()=>{return(<><Addproject /></>)}}/> */}
            <Tooltip title="Delete">
            <Delete onClick={() => deletefunction(row)} color="error"/>
            </Tooltip>
            </>
          ) : null),
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
                <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Teams</p></div>
                <div>
                <Button variant="contained" onClick={() => { navigate("/teams/assign"); }}>Assign Team</Button>
                <Button variant="contained" style={{ marginLeft: "-5px" }} onClick={() => { navigate("/teams/add"); }}>Add Team</Button>
                </div>
                </div>
                <br />
                <br />
                <br />
                <DataGridComponent columns={columns} items={teams}/>

                {/* <DataTable
                  columns={columns}
                  data={teams}
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

export default Teams;

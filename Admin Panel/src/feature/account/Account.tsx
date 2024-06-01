import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { GridColumns, GridRowsProp } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import accountService from "../../helpers/Services/account.service";
import DataGridComponent from "../../common/datatable/DataGrid";
import { BASE_URL } from "../../config/config";
import Applicationlabel from "../../common/en.json";


const Account = () => {
  const [project, setProject] = useState<GridRowsProp>([]);
  const [teams, setTeams] = useState<GridRowsProp>([]);
  const [newprofile,setNewprofile] = useState<any>([]);
  const navigate = useNavigate();

  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);

  async function getProject() {
    const response = await accountService.getProjects(userinfo);
    if (response.status){ setProject(response.data.projectdata);
      setTeams(response.data.teamData)
    }
  }

  const gridProjectColumns: any = [
    {
      headerName: Object.values(Applicationlabel.account.no),
      field: "id",
      editable: false,
      width:100,
    },
    {
      headerName: Object.values(Applicationlabel.account.projectname),
      field: "name",
      editable: false,
      width:300,
    },
    {
      headerName: Object.values(Applicationlabel.account.projectmanager),
      field: "manager",
      editable: false,
      valueGetter: (params: any) => params.row.manager.userName,
      width:300,
    },
    {
      headerName: Object.values(Applicationlabel.account.projectleader),
      field: "teamleader",
      editable: false,
      valueGetter: (params: any) => params.row.teamleader.email,
      width:300,
    },
  ];

  async function getTeam() {
    const res = await accountService.getUserById(userinfo.id);
    if (res.status) setTeams(res.data);
    setNewprofile(res.data.profile)
  }

  const gridTeamColumns: any = [
    {
      headerName: Object.values(Applicationlabel.account.no),
      field: "id",
      editable: false,
      width:100
    },
    {
      headerName: Object.values(Applicationlabel.account.teamname),
      field: "name",
      editable: false,
      width:200
    },
    {
      headerName: Object.values(Applicationlabel.account.teammanager),
      field: "manager",
      editable: false,
      valueGetter: (params: any) => params.row.manager.email,
       width:300
    },
    {
      headerName: Object.values(Applicationlabel.account.teamleader),
      field: "teamleader",
      editable: false,
      valueGetter: (params: any) => params.row.teamleader.email,
     width:300
    },
  ];

  useEffect(() => {
    getProject();
    getTeam();
  }, []);

  return (
    <>

      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.account.heading}</p>
            <br />
            <br />
            <br />

            <Grid container spacing={1}>
            <Grid container item={true} xs={6} className="justify-content-left">
            <Grid container item={true} xs={12} className="justify-content-left">
                <div className="userprofile">
                    <img src={BASE_URL + "/" + newprofile} />
                  </div>
                </Grid>
                <Grid container xs={12} className="left-content-around">
                <Grid item xs={3} className="p-1 text-bold">{Applicationlabel.account.name}</Grid>
                <Grid item xs={0} className="p-1">:</Grid>
                <Grid item xs={3} className="p-1">{userinfo.userName}</Grid>
              </Grid>
              <Grid container xs={12} className="left-content-around">
                <Grid item xs={3} className="p-1 text-bold">{Applicationlabel.account.email}</Grid>
                <Grid item xs={0} className="p-1">:</Grid>
                <Grid item xs={3} className="p-1">{userinfo.email}</Grid>
              </Grid>
              <Grid container xs={12} className="left-content-around">
                <Grid item xs={3} className="p-1 text-bold">{Applicationlabel.account.empid}</Grid>
                <Grid item xs={0} className="p-1">:</Grid>
                <Grid item xs={3} className="p-1">{userinfo.employeeId}</Grid>
              </Grid>

              </Grid>
              <Grid container item={true} xs={6} className="justify-content-left">

              <Grid item xs={12} className="right-content-around">
              <span>{Applicationlabel.account.one}</span><Grid item xs={7} className="p-1 text-bold">{Applicationlabel.account.changePass}</Grid>
              <Grid item xs={6} className="accountheading">
                <TextField variant="standard" sx={{ width: 350 }}
                  type="text" id="name" name="name" label="Email*"
                  className="form-control" autoComplete="off" />
                
              </Grid>

              <Grid item xs={9} className="right-content-around">
              <span>{Applicationlabel.account.two}</span><br /><Grid item xs={7} className="p-1 text-bold">{Applicationlabel.account.fillOut}</Grid>
              </Grid>
            </Grid>
            <div className="action-btn">
                  <Button
                    className="btn-fill pull-right update-profile"
                    type="submit"
                    onClick={() => {
                      navigate("#");
                    }}
                  >
                  {Applicationlabel.account.next}
                  </Button>
                </div>
            </Grid>

            </Grid>
            {/* <Grid container spacing={2}>
             
           
            </Grid> */}
            <Grid >
          
            </Grid>

            <Card sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.account.heading2}</p>
                  <br />
                  <br />
                  <br />
                  <DataGridComponent disableColumnFilter={true} columns={gridProjectColumns} disableColumnMenu items={project} />
                    </CardContent>
                    </Box>
                    </Card>

            <Card sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.account.heading1}</p>
                  <br />
                  <br />
                  <br />
                  <DataGridComponent disableColumnFilter={true} columns={gridTeamColumns} disableColumnMenu items={teams} />
                    </CardContent>
                    </Box>
                    </Card>
          </CardContent>
        </Box>
      </Card>
    </>
  );
};

export default Account;

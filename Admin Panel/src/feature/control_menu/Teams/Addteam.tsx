import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DataGridComponent from "../../../common/datatable/DataGrid";
import { post } from "../../../helpers/fetch-Service-Methods";
import { BASE_URL } from "../../../config/config";
import ENDPOINT from "../../../helpers/Api";
// import "../../App.css";
// import DataPick   er from "../../../common/date-picker/DataPicker";
import teamService from "../../../helpers/Services/teams.service";

const Addteam = () => {
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
  );
  const initialValues: any = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    name: "",
    code: "",
    teamManagerId: "",
    teamLeaderId: "",
    customer_id: "1",

  };
  const [teamLeader, setTeamleader] = useState<any>([]);
  const [team, setTeam] = useState<any>(initialValues);
  const [teamuser, setTeamuser] = useState<any>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  async function getTeamLeader() {
    // const listteamleader = await get(`${BASE_URL + ENDPOINT.GETALL_TEAMLEADER}/${userinfo.companyId}`);
    const teamleader = await teamService.getUser(userinfo);
    if (teamleader.status && teamleader.data) setTeamleader(teamleader.data);
  }

  async function getTeamValue() {
    if (id) {
     const teamvalue = await teamService.getTeamValue(id);
    if (teamvalue.status && teamvalue.data) setTeam(teamvalue.data);
    }
  }

  async function getTeamUser() {
    let response;
    if (id) {
    response = await teamService.getTeamUser(userinfo.companyId, id);
    if (response.status && response.data) setTeamuser(response.data);
    }
  }

  const handleSubmit = async (values: any) => {
    if (id) {
      const response = await post(BASE_URL + ENDPOINT.UPDATE_TEAMS, values);
      if (response.status && response.data) {
        navigate("/teams");
      }
  } else {
    const response = await post(BASE_URL + ENDPOINT.CREATE_TEAMS, values);
    if (response.status && response.data) {
      navigate("/teams");
    }
  }
const response = await teamService.createTeam(values);
if (response.data) {
  navigate("/teams");
}
};

  const handleChange = (newValue: any) => {
    console.log("newValue", newValue);
  };

  useEffect(() => {
    getTeamLeader();
    getTeamValue();
    getTeamUser();
  }, []);
  const columns: any = [
    {
      headerName: "No.",
      field: "id",
      editable: false,
      // width: 150
    },
    {
      headerName: "Email",
      field: "email",
      valueGetter: (params: any) => params.row?.user?.email,
      editable: false,
    },
    {
      headerName: "UserName",
      field: "userName",
      valueGetter: (params: any) => params.row?.user?.userName,
      editable: false,
    },
    {
      headerName: "Employee ID",
      field: "employeeId",
      valueGetter: (params: any) => params.row?.user?.employeeId,
editable: false,
    },
    {
      headerName: "Actions",
      renderCell: (row: any) => (row.id ? (
        <>
        <Delete />
        </>
      ) : null),
    },
  ];

  const SignInSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .required("Project Name is required"),

    code: Yup.string()
      .required("Project Code is required"),

    teamManagerId: Yup.string().required("Select the Team Manager"),

    teamLeaderId: Yup.string().required("Select the Team Leader"),
  });

  return (
    <>
       <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Teams</p>
            <div className="action-btn">
                          <Button
                            className="btn-fill pull-right update-profile"
                            // type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              navigate("/teams");
                            }}
                          >
                            Back
                          </Button>
                          </div>
            <br />
            <br />
            <br />
            <Formik
              initialValues={team}
              onSubmit={handleSubmit}
              validationSchema={SignInSchema}
              enableReinitialize
            >
              {(formik: any) => {
                const { errors, touched } = formik;
                return (

                  <form className="row g-3" onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }} noValidate>

                  <Grid container spacing={3}>
                     <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} value={ formik.values.name ? formik.values.name : "" }
                           onChange={formik.handleChange} type="text" id="name" name="name" label="Team Name*"
                           className="form-control" autoComplete="off" />
                          {/* <ErrorMessage
                            name="name"
                            component="span"
                            className="error"
                          />{" "} */}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} value={formik.values.code ? formik.values.code : ""}
                          onChange={formik.handleChange} type="text" id="code" name="code" label="Team Code*" className="form-control" autoComplete="off" />
                          <ErrorMessage
                            name="code"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>

                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} id="teamManagerId"
                            select onChange={
                            (e: any) => {
                              handleChange(e.target.value);
                              formik.setFieldValue("teamManagerId", e.target.value);
                            }}
                            name="teamManagerId" value={ formik.values.teamManagerId }
                            label="Team Manager" className={
                              errors.teamManagerId && touched.teamManagerId
                                ? "form-control input-error mt-1"
                                : "form-control"
                            } autoComplete="off">
                            <MenuItem value="">Choose Team Manager</MenuItem>

                            {teamLeader.map((name: any, i: any) => <MenuItem value={name.id} key={i}>{name.email}</MenuItem>)}</TextField>
                          <ErrorMessage
                            name="teamManagerId"
                            component="span"
                            className="error"
                          />{" "}

                        </Grid>

                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} id="teamLeaderId"
                            select onChange={
                            (e: any) => {
                              handleChange(e.target.value);
                              formik.setFieldValue("teamLeaderId", e.target.value);
                            }}
                            name="teamLeaderId" value={ formik.values.teamLeaderId }
                            label="Team Leader" className={
                              errors.teamleaderId && touched.teamleaderId
                                ? "form-control input-error mt-1"
                                : "form-control"
                            } autoComplete="off">
                            <MenuItem value="">Choose Team Leader</MenuItem>

                            {teamLeader.map((name: any, i: any) => <MenuItem value={name.id} key={i}>{name.email}</MenuItem>)}</TextField>
                          <ErrorMessage
                            name="teamleaderId"
                            component="span"
                            className="error"
                          />{" "}

                        </Grid>
                        <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <Grid item xs={12} className="p-1">
                        <div className="action-btn">
                          <Button
                            className="btn-fill pull-right"
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                              navigate("/teams");
                            }}
                          >
                            cancel
                          </Button>&nbsp;&nbsp;

                          <Button
                            className="btn-fill pull-right update-profile"
                            type="submit"
                            variant="contained"
                            color="secondary"
                          >
                            submit
                          </Button>
                        </div>
                      </Grid>

                  </Grid>

                  </form>
                );
              }}
            </Formik>
          </CardContent>
        </Box>
      </Card>

     {id && <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Team Members</p>
            <br />
            <br />
            <DataGridComponent columns={columns} items={teamuser}/>

           {/* <DataTable
              columns={columns}
              data={teamDetails}
              highlightOnHover
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
 }}/> */}
          </CardContent>
      </Box>
      </Card>}
    </>
  );
};
export default Addteam;

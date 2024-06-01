import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import teamService from "../../../helpers/Services/teams.service";
import projectService from "../../../helpers/Services/projects.service";

const selectlist:any = [];
const Assignteam = () => {
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
  );
  const initialValues: any = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    teams: "",
    user: "",

  };
  const [teams, setTeam] = useState<any>([]);
  const [assignuser, setAssignuser] = useState<any>([]);
  const [personName, setPersonName] = React.useState<string[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  async function getTeams() {
    const team = await teamService.getAllTeams(userinfo);
    if (team.status && team.data) setTeam(team.data);
  }

  async function getUser() {
    const user = await projectService.getUser(userinfo);
    if (user.status && user.data) setAssignuser(user.data);
  }
  const handleSubmit = async (values: any) => {
    const teamuser = {
        companyId: values.companyId,
        teamId: values.teams,
        userId: selectlist,
    };
    let i;
    let response;
    for (i = 0; i < (selectlist).length; i += 1) {
        teamuser.userId = selectlist[i];
      response = await teamService.createteamuser(teamuser);
    }
    if (response.status && response.data) {
      navigate("/teams");
    }
  };

  const handleChange = (newValue: any) => {
    console.log("newValue", newValue);
  };

  useEffect(() => {
    getTeams();
    getUser();
  }, []);

  const handleChange1 = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === "string" ? value.split(",") : value,
    );
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const SignInSchema = Yup.object().shape({
    // name: Yup.string()
    //   .min(2, "Too Short!")
    //   .required("Project Name is required"),

    // code: Yup.string()
    //   .required("Project Code is required"),

    // team: Yup.string().required("Select the Team "),

    // teamLeaderId: Yup.string().required("Select the Team Leader"),
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
              initialValues={initialValues}
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
                          <TextField variant="standard" sx={{ width: 350 }} id="teams"
                            select onChange={
                            (e: any) => {
                              handleChange(e.target.value);
                              formik.setFieldValue("teams", e.target.value);
                            }}
                            name="teams" value={ formik.values.teams }
                            label="Teams" className={
                              errors.teams && touched.teams
                                ? "form-control input-error mt-1"
                                : "form-control"
                            } autoComplete="off">
                            <MenuItem value="">Choose Teams</MenuItem>

                            {teams.map((val: any, i: any) => <MenuItem value={val.id} key={i}>{val.name}</MenuItem>)}</TextField>
                          <ErrorMessage
                            name="teams"
                            component="span"
                            className="error"
                          />{" "}

                        </Grid>
                         <div>
                         <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">User</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="user"
          multiple
          value={personName}
          name="user"
         // id="user"
          onChange={(e) => {
            handleChange1(e);
            formik.setFieldValue("user", typeof e.target.value === "string" ? (e.target.value).split(",") : e.target.value);
          }}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected:any) => selected.join(",")}
          MenuProps={MenuProps}
        >
          {assignuser.map((name:any) => (
            <MenuItem id={name.id} key={name.id} value={name.email} onClick={() => {
              selectlist.indexOf(name.id) === -1 ? selectlist.push(name.id) : selectlist.splice(selectlist.indexOf(name.id), 1);
            }}>
              <Checkbox checked={personName.indexOf(name.email) > -1} />
              <ListItemText primary={name.email} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
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
          </CardContent>
      </Box>
      </Card>}
    </>
  );
};
export default Assignteam;

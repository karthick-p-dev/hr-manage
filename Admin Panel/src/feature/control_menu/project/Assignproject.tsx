import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Applicationlabel from "../../../common/en.json";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import projectService from "../../../helpers/Services/projects.service";

const selectlist: any = [];
const Assignproject = () => {
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
  );
  const [assignProject, setAssignproject] = useState<any>([]);
  const [assignuser, setAssignuser] = useState<any>([]);
  const [personName, setPersonName] = React.useState<string[]>([]);
  const navigate = useNavigate();
  const initialValues: any = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    project: "",
    user: "",
  };
  async function getProject() {
    // const projectDetails = await get(`${BASE_URL + ENDPOINT.GETALL_PROJECT}/${userinfo.companyId}`);
    const project = await projectService.getProject(userinfo);
    if (project.status && project.data) setAssignproject(project.data);
  }

  async function getUser() {
    // const user = await post(BASE_URL + ENDPOINT.TOTAL_USERS, { companyId: userinfo.companyId });
    const user = await projectService.getUser(userinfo);
    if (user.status && user.data) setAssignuser(user.data);
  }

  const handleSubmit = async (values: any) => {
    const projectuser = {
      companyId: values.companyId,
      projectId: values.project,
      userId: selectlist,
    };
    let i;
    let response;
    for (i = 0; i < (selectlist).length; i += 1) {
      projectuser.userId = selectlist[i];
      response = await projectService.createProjectuser(projectuser);
    }
    if (response.status && response.data) {
      navigate("/projects");
    }
  };

  const handleChange = (newValue: any) => {
    console.log("newValue", newValue);
  };

  useEffect(() => {
    getProject();
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

    // project: Yup.string().trim().required("Select Project Manager"),

    // user: Yup.string().trim().required("Select Team Leader"),
  });
  return (
    <>
      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <div className="flex jc-b al-c">
              <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.assignProject.assignProjectTitle}</p>
              <div className="action-btn">
                <Button
                  className="btn-fill pull-right update-profile"
                  style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    navigate("/projects");
                  }}
                >
                 {Applicationlabel.button.back}
                </Button>
              </div>
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

                        <TextField variant="standard" sx={{ width: 350 }} id="project"
                          select onChange={
                            (e: any) => {
                              handleChange(e.target.value);
                              formik.setFieldValue("project", e.target.value);
                            }}
                          name="project"
                          // value={ formik.values.Projects }
                          label={Applicationlabel.assignProject.assignProjects} className={
                            errors.project && touched.project
                              ? "form-control input-error mt-1"
                              : "form-control"
                          } autoComplete="off">
                          {/* <MenuItem value="">Choose Team Leader</MenuItem> */}

                          {assignProject.map((val: any, i: any) => <MenuItem value={val.id} key={i}>{val.name}</MenuItem>)}
                        </TextField>
                        <ErrorMessage
                          name="teamleaderId"
                          component="span"
                          className="error"
                        />{" "}
                      </Grid>
                      <Grid item xs={6} className="p-1">
                        <FormControl sx={{ m: 1, width: 300 }}>
                          <InputLabel id="demo-multiple-checkbox-label">{Applicationlabel.assignProject.user}</InputLabel>
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
                            renderValue={(selected: any) => selected.join(",")}
                            MenuProps={MenuProps}
                          >
                            {assignuser.map((name: any) => (
                              <MenuItem id={name.id} key={name.id} value={name.email} onClick={() => {
                                selectlist.indexOf(name.id) === -1 ? selectlist.push(name.id) : selectlist.splice(selectlist.indexOf(name.id), 1);
                              }}>
                                <Checkbox checked={personName.indexOf(name.email) > -1} />
                                <ListItemText primary={name.email} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />

                    <Grid item xs={12} className="p-1">
                      <div className="action-btn">
                        <Button
                          className="btn-fill pull-right update-profile"
                          style={{ backgroundColor: "#049FD9", color: "#ffffff" }} 
                          type="submit"
                          variant="contained"
                          color="secondary"
                        >
                          {Applicationlabel.button.submit}
                        </Button>&nbsp;&nbsp;

                        <Button
                          className="btn-fill pull-right"
                          style={{ backgroundColor: "white", border: "1px solid #049FD9" , color: "#049FD9"}}
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            navigate("/projects");
                          }}
                        >
                          {Applicationlabel.button.cancel}
                        </Button>

                      </div>
                    </Grid>
                  </form>
                );
              }}
            </Formik>
          </CardContent>
        </Box>
      </Card>
    </>
  );
};

export default Assignproject;

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
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { post } from "../../../helpers/fetch-Service-Methods";
import { BASE_URL } from "../../../config/config";
import taskService from "../../../helpers/Services/task.service";
import ENDPOINT from "../../../helpers/Api";
import projectService from "../../../helpers/Services/projects.service";
import "../../../App.css";
import sprintService from "../../../helpers/Services/sprint.service";

const Addtask = () => {
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
);
  const navigate = useNavigate();
  const initialValues = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    project_id: "",
    sprint_id: "",
    task_type_id: "",
    title: "",
    story_points: "",
    estimated_hours: "",
    actual_hours: "",
    task_code: "",
    comments: "",
    task_status_id: "",
  };
  const [task, setTask] = useState<any>(initialValues);
  const [projectList, setProjectList] = useState<any>([]);
  const [sprintList, setSprintList] = useState<any>([]);
  const [tasktypeList, setTasktypeList] = useState<any>([]);
  const [taskstatusList, setTaskstatusList] = useState<any>([]);
  const { id } = useParams();

  async function getProject() {
  const projectDetails = await projectService.getProject(userinfo);
      if (projectDetails.status && projectDetails.data) setProjectList(projectDetails.data);
    }
  async function getallSprint() {
  const sprintDetails = await sprintService.getallSprint(userinfo);
  if (sprintDetails.status && sprintDetails.data) setSprintList(sprintDetails.data);
  }
  async function getallTasktype() {
    const tasktypeDetails = await taskService.getallTasktype(userinfo);
    if (tasktypeDetails.status && tasktypeDetails.data) setTasktypeList(tasktypeDetails.data);
  }
  async function getallTaskStatus() {
    const taskstatusDetails = await taskService.getallTaskStatus(userinfo);
    if (taskstatusDetails.status && taskstatusDetails.data) setTaskstatusList(taskstatusDetails.data);
  }
  async function getallTasKget() {
    if (id) {
    const tasksgetDetails = await taskService.getTaskbyid(id);
    if (tasksgetDetails.status && tasksgetDetails.data) setTask(tasksgetDetails.data);
  }
}
     const handleSubmit = async (values: any) => {
      const response = await post(BASE_URL + ENDPOINT.CREATE_TASK, values);
      if (response.status && response.data) {
        navigate("/tasks");
      }
    };
  // const response = async()=>{await taskService.createTask(values)};
  //   if (response.data) {
  //     navigate("/task");
  //   }
  const handleChange = (newValue: any) => {
    console.log("newValue", newValue);
  };
   useEffect(() => {
   getProject();
   getallSprint();
   getallTasktype();
   getallTaskStatus();
   getallTasKget();
   }, []);
   const columns: any = [
    {
      name: "No.",
      selector: (row: any, index: any) => index + 1,
      grow: 0,
    },
    {
        name: "Project",
        selector: (row: any) => <div>{row.project.name ? row.project.name : ""}</div>,
      },
      {
        name: "Sprint",
        selector: (row: any) => <div>{row.sprint ? row.sprint.sprint_name : ""}</div>,
      },
      {
        name: "Task Type",
        selector: (row: any) => <div>{row.task_type.name ? row.task_type.name : ""}</div>,
      },
      {
        name: "Task Title",
        selector: (row: any) => <div>{row.title ? row.title : ""}</div>,
      },
      // {
      //   name: "Task Code",
      //   selector: (row: any) => <div>{row.task_code ? row.task_code : ""}</div>,
      // },
      {
        name: "Story points",
        selector: (row: any) => <div>{row.story_points ? row.story_points : ""}</div>,
      },
      {
        name: "Estimated Hours",
        selector: (row: any) => <div>{row.estimated_hours ? row.estimated_hours : ""}</div>,
      },
      {
        name: "Actual Hours",
        selector: (row: any) => <div>{row.actual_hours ? row.actual_hours : ""}</div>,
      },
      {
        name: "Status",
        selector: (row: any) => <div>{row.taskStatus.name ? row.taskStatus.name : ""}</div>,
      },
      {
        name: "comments",
        selector: (row: any) => <div>{row.comments ? row.comments : ""}</div>,
      },
      {
        name: "Actions",
        button: true,
  },
];
const SignInSchema = Yup.object().shape({
  project_id: Yup.string().required("Project Name is required"),

  sprint_id: Yup.string().required("Sprint name is required"),

  task_type_id: Yup.string().required("Tasktype is required"),

  title: Yup.string().required("Title is required"),

  story_points: Yup.string().required("Story point is required"),

  estimated_hours: Yup.string().required("Estimated hours is required"),

  actual_hours: Yup.string().required("Actual hours is required"),

  task_code: Yup.string().required("Taskcode is required"),

  comments: Yup.string().required("Comments is required"),

  task_status_id: Yup.string().required("Taskstatus is required"),
});

  return (
    <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Add Task</p>
            <div className="action-btn">
                          <Button
                            className="btn-fill pull-right update-profile"
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              navigate("/tasks");
                            }}
                          >
                            Back
                          </Button>
                          </div>
            <br />
            <br />
            <br />
            <Formik
            initialValues={task}
            onSubmit={handleSubmit}
            validationSchema={SignInSchema}
            columns={columns}
            enableReinitialize>
            {(formik: any) => {
                const { errors, touched } = formik;
                return (
                  <form className="row g-3" onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }} noValidate>
            <Grid container spacing={3}>
                     <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} select onChange={ (e: any) => { handleChange(e.target.value); formik.setFieldValue("project_id", e.target.value); }} type="text" id="project_id" name="project_id" value={ formik.values.project_id } label="Select Project*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off">
                          <MenuItem value="">Choose Project</MenuItem>
                          {projectList.map((name: any, i: any) => <MenuItem value={name.id} key={i}>{name.name}</MenuItem>)}
                          </TextField>
                          <ErrorMessage
                            name="project_id"
                            component="span"
                            className="error"
                          />{""}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                        <TextField variant="standard" sx={{ width: 350 }} select onChange={ (e: any) => { handleChange(e.target.value); formik.setFieldValue("sprint_id", e.target.value); }} type="text" id="sprint_id" name="sprint_id" value={ formik.values.sprint_id } label="Select sprint*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off">
                          <MenuItem value="">Choose sprint</MenuItem>
                          {sprintList.map((name: any, i: any) => <MenuItem value={name.id} key={i}>{name.sprint_name}</MenuItem>)}
                          </TextField>
                          <ErrorMessage
                            name="sprint_id"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                        <TextField variant="standard" sx={{ width: 350 }} select onChange={ (e: any) => { handleChange(e.target.value); formik.setFieldValue("task_type_id", e.target.value); }} type="text" id="task_type_id" name="task_type_id" value={ formik.values.task_type_id } label="Select Tasktype*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off">
                          <MenuItem value="">Choose Tasktype</MenuItem>
                          {tasktypeList.map((name: any, i: any) => <MenuItem value={name.id} key={i}>{name.name}</MenuItem>)}
                          </TextField>
                          <ErrorMessage
                            name="task_type_id"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} onChange={formik.handleChange} value={formik.values.title} type="text" id=" title" name="title" label="Task Title*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off" />
                          <ErrorMessage
                            name="title"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} onChange={formik.handleChange} value={formik.values.story_points} type="number" id="story_points" name="story_points" label="Story Points*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off" />
                          <ErrorMessage
                            name="story_points"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} onChange={formik.handleChange} value={formik.values.estimated_hours} type="number" id="estimated_hours" name="estimated_hours" label="Estimated Hours*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off" />
                          <ErrorMessage
                            name="estimated_hours"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} onChange={formik.handleChange} value = {formik.values.actual_hours}type="number" id="actual_hours" name="actual_hours" label="Actual Hours*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off" />
                          <ErrorMessage
                            name="actual_hours"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                        <TextField variant="standard" sx={{ width: 350 }} select onChange={ (e: any) => { handleChange(e.target.value); formik.setFieldValue("task_status_id", e.target.value); }} type="text" id="task_status_id" name="task_status_id" value={ formik.values.task_status_id } label="Select status*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off">
                          <MenuItem value="">Choose status</MenuItem>
                          {taskstatusList.map((name: any, i: any) => <MenuItem value={name.id} key={i}>{name.name}</MenuItem>)}
                          </TextField>
                          <ErrorMessage
                            name="task_status_id"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} onChange={formik.handleChange} value = {formik.values.task_code} type="text" id="task_code" name="task_code" label="Task code*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off" />
                          <ErrorMessage
                            name="task_code"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} onChange={formik.handleChange} value = {formik.values.comments} type="text" id="comments" name="comments" label="Comments*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off" />
                          <ErrorMessage
                            name="comments"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={12} className="p-1">
                        <div className="action-btn">
                          <Button
                            className="btn-fill pull-right"
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                              navigate("/tasks");
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
  );
};
export default Addtask;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray } from "formik";

import * as yup from "yup";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import timesheetservice from "../../helpers/Services/timesheet.service";
import ENDPOINT from "../../helpers/Api";
import { BASE_URL } from "../../config/config";
import { get } from "../../helpers/fetch-Service-Methods";

const validationSchema = yup.object().shape({
  timesheet_date: yup.date().required("Timesheet Date is required"),
  timesheet: yup.array().of(
    yup.object().shape({
        project_id: yup.number().required("Project name is required"),
        sprint_id: yup.string().required("Sprint is required"),
        task_code: yup.number().required("Task ID is required"),
        title: yup.string().required("Task title is required"),
        task_type_id: yup.number().required("Task type is required"),
        story_points: yup.number().required("Story Points is required"),
        estimated_hours: yup.number().required("Estimate Hours is required"),
        actual_hours: yup.number().required("Actual Hours is required"),
        task_status_id: yup.number().required("Status In is required"),
        comments: yup.string().required("Comments is required"),
    }),
  ),
});

const AddTimesheet = () => {
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
    const initialValues :any = [{}];
    const [timesheetInfo] = useState<any>(initialValues);
    const [teamCode, setTeamcode] = useState<any>("");
    const [projects, setProjects] = useState<any>([]);
    const [taskType, setTasktype] = useState<any>([]);
    const [taskStatus, setTaskStatus] = useState<any>([]);
    const [task, setTask] = useState<any>([]);
    const navigate = useNavigate();
    async function getProjectDetails() {
      const projectDetails = await get(`${BASE_URL + ENDPOINT.GETALL_PROJECT}/${userinfo.companyId}`);
      if (projectDetails.data && projectDetails.data) setProjects(projectDetails.data);
    }

    async function getTeamCode() {
      const teamcode = await get(`${BASE_URL + ENDPOINT.GET_TEAMCODE}/${userinfo.companyId}/${userinfo.id}`);
      setTeamcode(teamcode.data.id);
    }
    async function getTaskType() {
      const tasklist = await get(`${BASE_URL + ENDPOINT.GET_TASKLIST}/${userinfo.companyId}`);
      setTasktype(tasklist.data);
    }
    async function getTaskStatus() {
      const taskstatus = await get(`${BASE_URL + ENDPOINT.GET_TASKSTATUS}/${userinfo.companyId}`);
      setTaskStatus(taskstatus.data);
    }
    async function getTask() {
      const tasks = await get(`${BASE_URL + ENDPOINT.GET_TASK}/${userinfo.companyId}`);
      setTask(tasks.data);
    }
    useEffect(() => {
      getProjectDetails();
      getTeamCode();
      getTaskType();
      getTaskStatus();
      getTask();
    }, []);
  const handleSubmitform = async (values:any) => {
      for (let i = 0; i < values.timesheet.length; i += 1) {
        const changesOccur = {
          companyId: userinfo.companyId,
          timesheet_date: values.timesheet_date,
          project_id: parseInt(values.timesheet[i].project_id, 10),
          sprint_id: parseInt(values.timesheet[i].sprint_id, 10),
          task_code: values.timesheet[i].task_code,
          title: values.timesheet[i].title,
          task_type_id: parseInt(values.timesheet[i].task_type_id, 10),
          story_points: values.timesheet[i].story_points,
          estimated_hours: values.timesheet[i].estimated_hours,
          actual_hours: values.timesheet[i].actual_hours,
          task_status_id: parseInt(values.timesheet[i].task_status_id, 10),
          comments: values.timesheet[i].comments,
          userId: userinfo.id,
          teamId: teamCode,
        };
        const response = await timesheetservice.createTimesheet(changesOccur);
        if (response.data) {
            navigate("/timesheet/myList");
        }
      }
};
  return (
    <div >
        <div className="App">
        <Card>
        <div className="justify-content-left">
        <Grid item xs={10} md={10} >
        <p style={{ float: "left", margin: 20, fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Timesheet </p>
        </Grid>
        <Grid item xs={2} md={2}>
            <Button style={{ float: "right", margin: 10, backgroundColor: "#049FD9", color: "#ffffff" }} variant="text" onClick={() => { navigate("/companies/edit"); }} className="mb-3">
                Back
            </Button>
        </Grid>
        <br/>
        <br />
        <br />
      </div>
      <Formik
        initialValues={{ timesheet: timesheetInfo }}
        onSubmit={handleSubmitform}
        validationSchema={validationSchema}
      >
        {({ values, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <FieldArray name="timesheet">
              {({ remove, push }) => (
                <div>
            <Button style={{ backgroundColor: "#0b5ed7", float: "left", color: "#ffffff" }} variant="contained" className="mb-3" onClick={() => {
                      push({
                        project_id: "1",
                        sprint_id: "sdsdsd",
                        task_code: "sdsdsds",
                        title: "dghdhg",
                        task_type_id: "dfafasf",
                        story_points: "12",
                        estimated_hours: "14",
                        actual_hours: "12",
                        task_status_id: "2",
                        comments: "fjhksagfdhsagfhagsfhksgdf",
                       });
            }}>
                Add Timesheet
            </Button>
            <br/>
            <br/>
            <Grid item xs={6} style={{ padding: 20 }}>
          <Field name="timesheet_date">
          {({ field, meta }:{ field:any, meta:any }) => (
            <div>
              <input type="date" className="form-control" autoComplete="off"{...field} placeholder="Sprint"/>
              {meta.touched && meta.error && <div className="error">{meta.error}</div>}
            </div>
          )}
          </Field>
          </Grid>
          <br/>
           {values.timesheet.map((p:any, index:number) => (
                      <div key={p.id}>
                        <Card style={{ margin: 20 }}>
                        <Grid item xs={10} md={10} >
                        <h6 style={{ float: "left", margin: 20, fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Timesheet {index + 1}</h6>
                        </Grid>
                          <Grid item xs={2} md={2}>
                            <Button style={{ float: "right", margin: 10, backgroundColor: "#dc3545", color: "#ffffff" }} variant="text" onClick={() => remove(index)} className="mb-3">
                                Remove
                            </Button>
                        </Grid>
                        <Grid container spacing={3} style={{ padding: 20 }}>
                          <Grid item xs={6} >
                         <Field name={`timesheet[${index}].project_id`}>
                        {({ field, meta }:{ field:any, meta:any }) => (
                          <div>
                         <select {...field} className="form-control" autoComplete="off">
                            <option value="">Select Project</option>
                            {projects.map((item: any, i: any) => <option value={item.id} key={i}>{item.name}</option>)}</select>
                            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                          </div>
                        )}
                        </Field>
                        </Grid>
                    <br/>
                    <br/>
                    <Grid item xs={6} >
                         <Field name={`timesheet[${index}].sprint_id`}>
                        {({ field, meta }:{ field:any, meta:any }) => (
                          <div>
                            <input type="text" className="form-control" autoComplete="off"{...field} placeholder="Sprint"/>
                            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                          </div>
                        )}
                        </Field>
                        </Grid>
                        <Grid item xs={6} >
                         <Field name={`timesheet[${index}].task_code`}>
                         {({ field, meta }:{ field:any, meta:any }) => (
                          <div>
                         <select {...field} className="form-control" autoComplete="off">
                            <option value="">Select Task Code</option>
                            {task.map((item: any, i: any) => <option value={item.id} key={i}>{item.task_code}</option>)}</select>
                            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                          </div>
                        )}
                        </Field>
                        </Grid>
                        <Grid item xs={6} >
                         <Field name={`timesheet[${index}].title`}>
                        {({ field, meta }:{ field:any, meta:any }) => (
                          <div>
                            <input type="text" className="form-control" autoComplete="off"{...field} placeholder="Task Title"/>
                            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                          </div>
                        )}
                        </Field>
                        </Grid>
                        <Grid item xs={6} >
                         <Field name={`timesheet[${index}].task_type_id`}>
                        {({ field, meta }:{ field:any, meta:any }) => (
                          <div>
                         <select {...field} className="form-control" autoComplete="off">
                            <option value="">Select Task type</option>
                            {taskType.map((item: any, i: any) => <option value={item.id} key={i}>{item.name}</option>)}</select>
                            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                          </div>
                        )}
                        </Field>
                        </Grid>
                        <Grid item xs={6} >
                         <Field name={`timesheet[${index}].story_points`}>
                        {({ field, meta }:{ field:any, meta:any }) => (
                          <div>
                            <input type="number" className="form-control" autoComplete="off"{...field} placeholder="Estimated Story Points"/>
                            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                          </div>
                        )}
                        </Field>
                        </Grid>
                        <Grid item xs={6} >
                         <Field name={`timesheet[${index}].estimated_hours`}>
                        {({ field, meta }:{ field:any, meta:any }) => (
                          <div>
                            <input type="number" className="form-control" autoComplete="off"{...field} placeholder="Estimate Hours"/>
                            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                          </div>
                        )}
                        </Field>
                        </Grid>
                        <Grid item xs={6} >
                         <Field name={`timesheet[${index}].actual_hours`}>
                        {({ field, meta }:{ field:any, meta:any }) => (
                          <div>
                            <input type="number" className="form-control" autoComplete="off"{...field} placeholder="Actual Hours"/>
                            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                          </div>
                        )}
                        </Field>
                        </Grid>
                        <Grid item xs={6} >
                         <Field name={`timesheet[${index}].task_status_id`}>
                         {({ field, meta }:{ field:any, meta:any }) => (
                          <div>
                         <select {...field} className="form-control" autoComplete="off">
                            <option value="">Select Status</option>
                            {taskStatus.map((item: any, i: any) => <option value={item.id} key={i}>{item.name}</option>)}</select>
                            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                          </div>
                        )}
                        </Field>
                        </Grid>
                        <Grid item xs={6} >
                         <Field name={`timesheet[${index}].comments`}>
                        {({ field, meta }:{ field:any, meta:any }) => (
                          <div>
                            <textarea className="form-control" autoComplete="off" {...field} placeholder="Comments"/>
                            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                          </div>
                        )}
                        </Field>
                        </Grid>
                        </Grid>
                        </Card>
                      </div>
                    ))}
                </div>
              )}
            </FieldArray>
            <Grid item xs={2} md={2}>
            <Button style={{ backgroundColor: "#198754", color: "#ffffff" }} variant="text" type="submit" className="mb-3">
                Sumbit
            </Button>
            </Grid>
          </Form>
        )}
      </Formik>
      </Card>
      </div>
    </div>
  );
};

export default AddTimesheet;

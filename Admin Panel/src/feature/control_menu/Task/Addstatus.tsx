import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { post } from "../../../helpers/fetch-Service-Methods";
import { BASE_URL } from "../../../config/config";
import taskService from "../../../helpers/Services/task.service";
import ENDPOINT from "../../../helpers/Api";
import "../../../App.css";

const Addstatus = () => {
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
);
const { id } = useParams();
  const navigate = useNavigate();
  const initialValues = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    name: "",
  };
  const [taskstatus, setTaskstatus] = useState<any>(initialValues);
  async function getTaskstausbyid() {
    if (id) {
    const taskstatusgetDetails = await taskService.getTaskstatusbyid(id);
    if (taskstatusgetDetails.status && taskstatusgetDetails.data) setTaskstatus(taskstatusgetDetails.data);
  }
}
     const handleSubmit = async (values: any) => {
    let response;
    if (id) {
     response = await post(BASE_URL + ENDPOINT.UPDATE_TASKSTATUS, values);
    } else {
       response = await post(BASE_URL + ENDPOINT.CREATE_TASKSTATUS, values);
    }
      if (response && response.status && response.data) {
        navigate("/tasks/status");
      }
    };
   useEffect(() => {
    getTaskstausbyid();
   }, []);
   const columns: any = [
    {
      name: "No.",
      selector: (row: any, index: any) => index + 1,
      grow: 0,
    },
    {
        name: "Task Status List",
        selector: (row: any) => <div>{row.name ? row.name : ""}</div>,
      },
      {

        name: "Actions",
        button: true,
  },
];
const SignInSchema = Yup.object().shape({
  name: Yup.string().required("Task Status is required"),
});

  return (
    <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Add Task Status</p>
            <div className="action-btn">
                          <Button
                            className="btn-fill pull-right update-profile"
                           //  type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              navigate("/tasks/status");
                            }}
                          >
                            Back
                          </Button>
                          </div>
            <br />
            <br />
            <br />
                <Formik
            initialValues={taskstatus}
            onSubmit={handleSubmit}
            columns={columns}
            validationSchema={SignInSchema}
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
                          <TextField variant="standard" sx={{ width: 350 }} onChange={formik.handleChange} value = {formik.values.name} type="text" id="name" name="name" label="Add Task Status List*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off" />
                          <ErrorMessage
                            name="name"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={12} className="p-1">
                        <div className="action-btn">
                          <Button
                            className="btn-fill pull-right"
                           // type="submit"
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                              navigate("/tasks/status");
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
export default Addstatus;

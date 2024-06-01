import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Formik, ErrorMessage } from "formik";
// import { useNavigate } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import tasktypeService from "../../helpers/Services/tasktype.service";

const Addtasktype:any = () => {
    const userinfo: any = useSelector(
        (state: any) => state && state.signReducer && state.signReducer.entities,
      );
    const navigate = useNavigate();
    const initialValues = {
        companyId: userinfo.companyId,
        name: "",
        code: "",
    };
    const [tasktype, setTasktype] = useState<any>(initialValues);
    const { id } = useParams();

    const getValueTasktype = async () => {
const response = await tasktypeService.getOneTasktype(id);
if (response && response.data) {
    setTasktype({ ...tasktype, ...response.data });
}
    };

    useEffect(() => {
        getValueTasktype();
    }, []);
    const handleSubmit = async (values: any) => {
       if (id) {
        const response = await tasktypeService.updateTasktype(values);
        if (response && response.data) {
          navigate("/Tasktype");
      }
       } else {
        const response = await tasktypeService.createTasktype(values);
        if (response && response.data) {
            navigate("/Tasktype");
       }
        }
      };

      const SignInSchema = Yup.object().shape({
        name: Yup.string()
          .min(2, "Too Short!")
          .required("Project Name is required"),

        code: Yup.string()
          .required("Project Code is required"),

        // start_date: Yup.date().required("Start Date is required"),

        // end_date: Yup.date().required("End Date is required"),

        // managerId: Yup.string().required("Select the Project Manager"),

        // teamleaderId: Yup.string().required("Select the Team Leader"),
      });
return (
    <>
       <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Task Type</p>
            <div className="action-btn">
                          <Button
                            className="btn-fill pull-right update-profile"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              navigate("/Tasktype");
                            }}
                          >
                            Back
                          </Button>
                          </div>
            <br />
            <br />
            <br />
            <Formik
              initialValues={tasktype}
              onSubmit={handleSubmit}
              validationSchema={SignInSchema}
              enableReinitialize
            >
              {(formik: any) => (
                  <form className="row g-3" onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }} noValidate>

                  <Grid container spacing={3}>
                     <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} value={formik.values.name ? formik.values.name : ""}
                           onChange={formik.handleChange} type="text" id="name" name="name" label="Task Type Name*"
                           className="form-control" autoComplete="off" />
                          {/* <ErrorMessage
                            name="name"
                            component="span"
                            className="error"
                          />{" "} */}
                        </Grid>
                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} value={formik.values.code ? formik.values.code : ""}
                          onChange={formik.handleChange} type="text" id="code" name="code" label="task Type Code*" className="form-control" autoComplete="off" />
                          <ErrorMessage
                            name="code"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                      {/* <Grid item xs={6} className="p-1">
                          <DataPicker formValue={formik.values.start_date} formik={formik} value={formik.values.start_date ? formik.values.start_date : ""}
                          labelName="Start Date*" inputFormat="DD-MM-YYYY" fieldName="start_date" errors={errors} touched={touched} disablePast={true} handleSubmit={false}/>
                          <ErrorMessage
                            name="start_date"
                            component="span"
                            className="error"
                          />{" "}

                        </Grid> */}

                        {/* <Grid item xs={6} className="p-1">
                             <DataPicker formValue={formik.values.end_date} formik={formik} value={formik.values.end_date ? formik.values.end_date : ""}
                             labelName="End Date*" inputFormat="DD-MM-YYYY" fieldName="end_date" errors={errors} touched={touched} disablePast={true} handleSubmit={false}/>
                             <ErrorMessage
                            name="end_date"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid> */}
                        {/* <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} id="managerId"
                            select onChange={
                             (e: any) => {
                              handleChange(e.target.value);
                              formik.setFieldValue("managerId", e.target.value);
                            }}
                            name="managerId" value={ formik.values.managerId }
                            label="Project Manager" className={
                              errors.managerId && touched.managerId
                                ? "form-control input-error mt-1"
                                : "form-control"
                            } autoComplete="off">
                            <MenuItem value="">Choose Project Manager</MenuItem>

                            {projectManager.map((name: any, i: any) => <MenuItem value={name.id} key={i}>{name.email}</MenuItem>)}
                            </TextField>
                          <ErrorMessage
                            name="managerId"
                            component="span"
                            className="error"
                          />{" "}

                        </Grid> */}
                        {/* <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 350 }} id="teamleaderId"
                            select onChange={
                            (e: any) => {
                              handleChange(e.target.value);
                              formik.setFieldValue("teamleaderId", e.target.value);
                            }}
                            name="teamleaderId" value={ formik.values.teamleaderId }
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
                      <br /> */}
                      <Grid item xs={12} className="p-1">
                        <div className="action-btn">
                          <Button
                            className="btn-fill pull-right"
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                              navigate("/Tasktype");
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
                )
              }
            </Formik>
          </CardContent>
        </Box>
      </Card>
      {/* {Object.keys(teamList).length > 0 && <Card sx={{ display: "flex" }}> */}
        {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Project Members</p>
            <br />
            <br />
            <br />
            <DataTable
              columns={columns}
              data={teamList}
              highlightOnHover
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
            />
          </CardContent>
        </Box> */}
        {/* </Card> */}
{/* } */}
    </>

);
};
export default Addtasktype;

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
import sprintService from "../../../helpers/Services/sprint.service";
import { post, get } from "../../../helpers/fetch-Service-Methods";
import { BASE_URL } from "../../../config/config";
import ENDPOINT from "../../../helpers/Api";
import "../../../App.css";
import DataPicker from "../../../common/date-picker/DataPicker";
import Applicationlable from"../../../common/en.json";

const Addsprint = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const initialValues: any = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    sprint_name: "",
    code: "",
    start_dates: "",
    end_date: "",
    project_id: "",
    spill_over_count: "",
    
  };
  const [assignProject, setAssignproject] = useState<any>([]);
  const [sprintdata, setPrintdata] = useState<any>(initialValues);
  const [open, setOpen] = useState(false);
  const [opend, setOpend] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

async function getProject() {
    const projectDetails = await get(`${BASE_URL + ENDPOINT.GETALL_PROJECT}/${userinfo.companyId}`);
    if (projectDetails.status && projectDetails.data) setAssignproject(projectDetails.data);
  }

  async function getSprintDetail() {
    if (id) {
   const sprintDetails = await sprintService.getSprintId(id);
    if (sprintDetails && sprintDetails.data) setPrintdata({ ...sprintdata, ...sprintDetails.data });
    }
  }

  const handleSubmit = async (values: any) => {
    if (values.start_dates && values.start_dates.$d)
    values.start_dates = `${values.start_dates.$d.getFullYear()}-${String(values.start_dates.$d.getMonth() + 1).padStart(2, "0")}-${String(values.start_dates.$d.getDate()).padStart(2, "0")}`;
    if (values.end_date && values.end_date.$d)
    values.end_date = `${values.end_date.$d.getFullYear()}-${String(values.end_date.$d.getMonth() + 1).padStart(2, "0")}-${String(values.end_date.$d.getDate()).padStart(2, "0")}`;
    if (id) {
      const response = await post(BASE_URL + ENDPOINT.UPDATE_SPRINT, values);
      if (response.status && response.data) {
        navigate("/sprint");
      }
    } else {
      const response = await post(BASE_URL + ENDPOINT.CREATE_SPRINT, values);
      if (response.status && response.data) {
        navigate("/sprint");
      }
    }
    // const response = await sprintService.createSprint(values);
    // if (response.data) {
    //   navigate("/sprint");
    // }
  };
 useEffect(() => {
    getProject();
    getSprintDetail();
  }, []);

  const SprintSchema = Yup.object().shape({
    sprint_name: Yup.string()
      .required(Applicationlable.Addsprintschema.sprintname),

    code: Yup.string()
      .required(Applicationlable.Addsprintschema.code),

    start_dates: Yup.date().required(Applicationlable.Addsprintschema.startdates),

    end_date: Yup.date()
    .when('start_dates',
    (start_dates, schema) => {
      if (start_dates) {
        const dayAfter = new Date(start_dates.getTime() + 86400000);
        return schema.min(dayAfter,(Applicationlable.Addsprintschema.lessthan) );
      }
      return schema;
    })
    .required(Applicationlable.Addsprintschema.enddates),

    project_id: Yup.string().required(Applicationlable.Addsprintschema.projectid),

  });
  
  return (
    <>
       <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlable.Addsprint.heading}</p>
            <br />
            <br />
            <br />
            <br />
            <Formik
              initialValues={sprintdata}
              onSubmit={handleSubmit}
              validationSchema={SprintSchema}
              enableReinitialize
            >
              {(formik: any) => {
                const { errors, touched } = formik;
                return (
                    <form className="row g-3"
                     onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }} 
                  noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={6} className="p-1">
                  <TextField variant="standard" sx={{ width: 450 }} id="project_id" select onChange={(e: any) => {formik.setFieldValue("project_id", e.target.value);}}
                             name="project_id" label={Applicationlable.Addsprint.selectproject} className={errors.reason && touched.reason
                                ? "form-control input-error mt-1 text-left"
                                : "form-control text-left"
                            } value={formik.values.project_id} autoComplete="off">
                            <MenuItem value="">{Applicationlable.Addsprint.chooseproject}</MenuItem>
                            {assignProject.map((val: any, i: any) => <MenuItem value={val.id} key={i}>{val.name}</MenuItem>)}</TextField>
                          <ErrorMessage
                            name="project_id"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>

                     <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 450 }} value={formik.values.sprint_name} onChange={formik.handleChange} 
                           type="text" id="sprint_name" name="sprint_name" label={Applicationlable.Addsprint.sprintname} className="form-control" autoComplete="off" />
                          <ErrorMessage
                            name="sprint_name"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>

                      <Grid item xs={6} className="p-1">
                          <DataPicker 
                            formValue={formik.values.start_dates ? formik.values.start_dates : null}  formik={formik} labelName={Applicationlable.Addsprint.startdate} inputFormat="DD-MM-YYYY" 
                          fieldName="start_dates"  width="80%"  disableFuture={true} handleSubmit={false} readOnly={true} 
                          open={open}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)} 
                            onClick={() => setOpen(true)}
                          />
                          <ErrorMessage
                            name="start_dates"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>

                        <Grid item xs={6} className="p-1">
                             <DataPicker formValue={formik.values.end_date ? formik.values.end_date : null} width="80%" readOnly={true} formik={formik} labelName={Applicationlable.Addsprint.enddate} inputFormat="DD-MM-YYYY" 
                             fieldName="end_date" disablePast={true} handleSubmit={false} 
                             open={opend}
                            onOpen={() => setOpend(true)}
                            onClose={() => setOpend(false)} 
                            onClick={() => setOpend(true)} />
                             <ErrorMessage
                            name="end_date"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        
                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 450 }} onChange={formik.handleChange} type="text" 
                          value={formik.values.code} id="code" name="code" label={Applicationlable.Addsprint.sprintcode} className="form-control" autoComplete="off" />
                          <ErrorMessage
                            name="code"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>

                        <Grid item xs={6} className="p-1">
                          <TextField variant="standard" sx={{ width: 450 }} onChange={formik.handleChange} type="number" value={formik.values.spill_over_count} 
                          id="spill_over_count" name="spill_over_count" label={Applicationlable.Addsprint.splitovercount} className="form-control" autoComplete="off" />
                          <ErrorMessage
                            name="code"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                      <br />
                      <br />
                      <br />
                      <br />

                      <Grid item xs={12} className="p-1">
                        <div className="action-btn">
                        <Button
                            className="btn-fill pull-right update-profile"
                            type="submit"
                            variant="contained"
                            color="secondary"
                            style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
                          >
                          {Applicationlable.button.submit}
                          </Button>&nbsp;&nbsp;
                          <Button
                            className="btn-fill pull-right"
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            style={{ backgroundColor: "white", border: "1px solid #049FD9" , color: "#049FD9"}}
                            onClick={() => {
                              navigate("/sprint");
                            }}
                          >
                            {Applicationlable.button.cancel}
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
    </>
  );
};

export default Addsprint;

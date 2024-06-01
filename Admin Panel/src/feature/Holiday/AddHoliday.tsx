import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../../App.css";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./holiday.css";
import holidayService from "../../helpers/Services/holiday.service";
import DataPicker from "../../common/date-picker/DataPicker";

const AddHoliday = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [showFields, setShowFields] = useState<any>(false);
  const navigate = useNavigate();
  const initialValues = {
    reason: "",
    userId: userinfo.id,
    companyId: userinfo.companyId,
    Date: new Date(),
    holidayreason: "",
  };

  const handleSubmit = async (values: any) => {
    const currday = new Date(values.Date);
    const Datess = `${currday.getDate()}-${currday.getMonth() + 1}-${currday.getFullYear()}`;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[currday.getDay()];
    const changesOccur = {
      date: Datess,
      day: dayName,
      reason: values.reason,
      companyId: initialValues.companyId,
      shownotification: showFields,
    };
    const response = await holidayService.createHoliday(changesOccur);
    if (response.data) {
      if (response.data) {
        navigate("/holidays");
      }
    }
  };

  const holidaySchema = Yup.object().shape({
    reason: Yup.string()
      .required("*reason is required")
      .min(4, "Reason is too short - should be 4 chars minimum"),
  });

  return (
    <>
      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder" title="Holidays">Holidays</p>
            <Button variant="contained" onClick={() => { navigate("/holidays"); }} className="mb-3" color="primary" data-testid="backButton">
              Back
            </Button>

            <br />
            <br />
            <br />
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={holidaySchema}
            >
              {(formik) => {
                const { errors, touched } = formik;
                return (

                  <form className="row g-3" onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }} noValidate>
                    <Grid container spacing={1}>
                      <div className="justify-content-around" >
                        <Grid container spacing={2} className="al-c">
                          <Grid item xs={6} className="p-1">
                            <DataPicker formValue={formik.values.Date} formik={formik} labelName="Date" inputFormat="DD-MM-YYYY" fieldName="Date" errors={errors} touched={touched} disablePast={true} handleSubmit={false} />

                          </Grid>
                          <Grid item xs={6} className="p-1">
                            <TextField variant="standard"
                              onChange={formik.handleChange}
                              value={formik.values.reason}
                              type="text" id="reason" name="reason" label="Reason" autoComplete="off" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              }>
                            </TextField>
                            <br />
                            <ErrorMessage
                              name="reason"
                              component="span"
                              className="error"
                            />{" "}
                          </Grid>
                        </Grid>
                      </div>

                      <div>
                        <FormGroup>
                          <FormControlLabel control={<Switch defaultChecked />} onChange={() => setShowFields(!showFields)} label="Send Notification" />
                        </FormGroup>
                      </div>

                    </Grid>
                    <div className="justify-content-around" >
                        <Grid item xs={12} className="justify-content-around p-1" >
                          <Button variant="text" onClick={() => { navigate("/holidays"); }} className="mb-3" data-testid="cancelButton">
                            Cancel
                          </Button>
                          <Button variant="contained" type="submit" className="mb-3" color="primary" data-testid="submitButton">
                            Submit
                          </Button>
                        </Grid>
                      </div>
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
export default AddHoliday;

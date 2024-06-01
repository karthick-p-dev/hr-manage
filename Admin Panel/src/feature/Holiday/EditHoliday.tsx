import React, { useEffect, useState } from "react";
import { Formik, ErrorMessage } from "formik";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader } from "@mui/material";
import Grid from "@mui/material/Grid";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../../style/css/base.css";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import dayjs from "dayjs";
import DataPicker from "../../common/date-picker/DataPicker";
import holidayService from "../../helpers/Services/holiday.service";

const EditHoliday = () => {
    const { id } = useParams();
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
    const initialValues = {
        reason: "",
        userId: userinfo.id,
        companyId: userinfo.companyId,
        date: "",
        holidayreason: "",
    };
    const [showFields, setShowFields] = useState<any>(initialValues);
    // const [showNotification, setShowNotification] = useState<any>(false);
    const navigate = useNavigate();

    const handleSubmit = async (values: any) => {
      const currday = new Date(values.date);
      const Datess = `${currday.getDate()}-${currday.getMonth() + 1}-${currday.getFullYear()}`;
      values.date = Datess;
      const response = await holidayService.updateHoliday(values);
      if (response.data) {
        navigate("/holidays");
      }
    };

    const holidaySchema = Yup.object().shape({
      reason: Yup.string().required("Reason is required"),
      date: Yup.string().required("Date is required"),

    });
    async function geteditholiday() {
      const response = await holidayService.getHolidaybyID(id, userinfo);

      if (response.data && response.data[0]) {
        const splitDate = response.data[0].date.split("-").reverse();
        const dateValue: any = splitDate.join("-");
        response.data[0].date = dayjs(dateValue);
        setShowFields({ ...showFields, ...response.data[0] });
      }
    }
    useEffect(() => {
        geteditholiday();
      }, []);

    return (
        <>
            <Card sx={{ display: "flex" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardHeader style={{ float: "left", textAlign: "left" }} titleTypographyProps={{ fontSize: "18px", fontWeight: 600 }} title="Edit Holiday" className="fw-bolder"></CardHeader>
                    <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
                        <Formik
                             enableReinitialize
                            initialValues={showFields}
                            onSubmit={handleSubmit}
                            validationSchema={holidaySchema}
                        >
                            {(formik) => {
                                const { errors, touched } = formik;
                                return (
                                  <form
                                    className="row g-3"
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      formik.handleSubmit(e);
                                    }}
                                    noValidate
                                  >
                                    <Grid container spacing={2}>
                                      <div className="justify-content-left">
                                        <Grid item xs={6} className="p-1">
                                          <DataPicker
                                            value={formik.values.date}
                                            formValue={formik.values.date}
                                            formik={formik}
                                            onChange={formik.handleChange}
                                            labelName="date"
                                            inputFormat="DD-MM-YYYY"
                                            fieldName="date"
                                            errors={errors}
                                            touched={touched}
                                            disablePast={true}
                                            handleSubmit={false}
                                            autoComplete="off"
                                          />
                                        </Grid>
                                        <Grid item xs={12} className="p-1">
                                          <TextField
                                            variant="standard"
                                            sx={{ width: 350 }}
                                            onChange={formik.handleChange}
                                            type="text"
                                            id="reason"
                                            name="reason"
                                            autoComplete="off"
                                            value={
                                              formik.values.reason
                                                ? formik.values.reason
                                                : ""
                                            }
                                            label="Reason*"
                                            className={
                                              errors.reason && touched.reason
                                                ? "form-control input-error  mt-1"
                                                : "form-control"
                                            }
                                          ></TextField>
                                          <ErrorMessage
                                            name="reason"
                                            component="span"
                                            className="error"
                                          />
                                        </Grid>

                                        <div>
                                          <FormGroup>
                                            <FormControlLabel
                                              control={
                                                <Switch defaultChecked />
                                              }
                                              // onChange={() => setShowNotification(!showFields)
                                              // }
                                              label="Send Notification"
                                            />
                                          </FormGroup>
                                        </div>
                                      </div>
                                      <Grid
                                        item
                                        xs={12}
                                        className="justify-content-around"
                                      >
                                        <Button
                                          variant="text"
                                          onClick={() => {
                                            navigate("/holidays");
                                          }}
                                          className="mb-3"
                                          data-testid="cancelButton"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          variant="contained"
                                          type="submit"
                                          className="mb-3"
                                          color="primary"
                                          data-testid="updateButton"
                                        >
                                          Update
                                        </Button>
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
export default EditHoliday;

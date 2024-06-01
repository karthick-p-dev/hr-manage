import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
//import DateRangePicker from "react-bootstrap-daterangepicker";
import dayjs, { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import { dateRangePickerDayClasses, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { LicenseInfo } from '@mui/x-data-grid-pro';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import "bootstrap-daterangepicker/daterangepicker.css";
import Button from "@mui/material/Button";
import "../../style/css/base.css";
import "../../App.css";
import SimpleSnackbar from '../../common/toaster/toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Applicationlabel from "../../common/en.json";
import leaveService from "../../helpers/Services/leave.service";
import userService from "../../helpers/Services/user.service";
import moment from "moment";


const AddLeave = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [showFields, setShowFields] = useState<any>(false);
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());
  const [fromDate, setFromDate] = React.useState<DateRange<Dayjs>>([null, null]);
  const [toDate, setToDate] = React.useState<DateRange<Dayjs>>([null, null]);
  const current = new Date();
  const todayDate = `${String(current.getDate()).padStart(2, "0")}-${String(current.getMonth() + 1).padStart(2, "0")}-${current.getFullYear()}`;
  const [dateStart, setDateStart] = useState(current);
  const [dateEnd, setDateEnd] = useState(current);
  let dat = moment(current).format("DD-MM-YYYY")
  const [singledateStart, setsingleDateStart] = useState(current);
  const [remainingLeave, setRemainingleave] = useState<any>([]);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const leaveType: any = [
    { label: "Full Day", value: "Full Day" },
    { label: "Half Day-FN", value: "Half Day - FN (9.30am-1.30pm)" },
    { label: "Half Day-AN", value: "Half Day - AN (1.30pm-6.30pm)" },
    { label: "Permission", value: "Permission" },
    { label: "Work From Home", value: "Work From Home" },
  ];
  const initialValues = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    feedBack: "",
    fromDate: current,
    toDate: current,
    reason: "",
    request: "", // Half Day.  Permission. Work from Home
    noOfDaysLeaveApply: 0,
    notes: "",
    fromTime: "", // from time should be send when request is permission
    toTime: "" // toTime should be send when request is permission
  };

  const handleSubmit = async (values: any) => {
    // console.log("values.request", values.request);
    if (values.request == "Full Day" || values.request == "Work From Home") {
      values.fromDate = moment(dateStart).format("DD-MM-YYYY"),
        values.toDate = moment(dateEnd).format("DD-MM-YYYY")
    }
    if (values.request == "Half Day-FN" || values.request == "Half Day-AN" || values.request == "Permission") {
      values.fromDate = moment(singledateStart).format("DD-MM-YYYY"),
        values.toDate = moment(singledateStart).format("DD-MM-YYYY")
    }
    values.noOfDaysLeaveApply = (parseInt(values.toDate) - parseInt(values.fromDate)) + 1;
    values.fromTime = new Date(fromTime)
    values.toTime = new Date(toTime)
    values.fromTime = `${values.fromTime.getHours()}:${values.fromTime.getMinutes()}`;
    values.toTime = `${values.toTime.getHours()}:${values.toTime.getMinutes()}`;

    if (values.request != "Permission"){
      values.fromTime = ""
      values.toTime = ""
    }
    //for permission
    if (values.request == "Permission") {
      values.fromTime = fromTime;
      values.toTime = toTime;
      values.fromTime = `${values.fromTime}`;
      values.toTime = `${values.toTime}`;




      const time: any = FromFormat(fromTime);
      const startTime: any = time.split(":").slice(0, 2).join(":");
      const sMinute: any = startTime.split(":").slice(1).join("");
      const finaltime: any = `${parseInt(time.split(":")) + 2}:${sMinute}`;
      const fhour: any = startTime.split(":");
      const frommin = (fhour[0] * 60) + parseInt(fhour[1])


      const time1: any = FromFormat(toTime);
      const eTime: any = time1.split(":").slice(0, 2).join(":");
      const eMinute: any = eTime.split(":").slice(1).join("");
      const thour: any = `${parseInt(eTime.split(":"))}:${eMinute}`;
      const endTime: any = eTime.split(":");
      const tomin = (endTime[0] * 60) + parseInt(endTime[1]);



      if (frommin <= tomin) {
        var totalmin = tomin - frommin;
        if (totalmin >= 121 || values.dateStart != values.dateEnd) {
          setToast(true);
          setMessage(Applicationlabel.toast.endtimemaximumhour);
          return false
        }
        else {
          const response = await leaveService.createLeave(values);
          if (response.data) {
            setToast(true);
            setMessage(Applicationlabel.toast.leaveapplysuccess);
            setTimeout(() => {
              navigate("/leaves/myleaves");
            }, 1000);
          }
          return false;
        }
      }
      else {
        setToast(true);
        setMessage(Applicationlabel.toast.endtimemaximumstarttime);
      }
      return false;

    }
    else {
      const response = await leaveService.createLeave(values);
      if (response.data) {
        setToast(true);
        setMessage(Applicationlabel.toast.leaveapplysuccess);
        setTimeout(() => {
          navigate("/leaves/myleaves");
        }, 1000);
      }

    }

  }

  let leaveSchema;
  if(!showFields){
  leaveSchema = Yup.object().shape({
    request: Yup.string().required(Applicationlabel.addleaveschema.request),

    reason: Yup.string()
      .trim().required(Applicationlabel.addleaveschema.reason)
      .min(4, Applicationlabel.addleaveschema.reasontoolong),

    notes: Yup.string()
      .trim().required(Applicationlabel.addleaveschema.notes)
      .min(4, Applicationlabel.addleaveschema.notestoolong),
  });
}
else{
 leaveSchema = Yup.object().shape({
    request: Yup.string().required(Applicationlabel.addleaveschema.request),

    reason: Yup.string()
      .trim().required(Applicationlabel.addleaveschema.reason)
      .min(4, Applicationlabel.addleaveschema.reasontoolong),

    notes: Yup.string()
      .trim().required(Applicationlabel.addleaveschema.notes)
      .min(4, Applicationlabel.addleaveschema.notestoolong),

      fromTime: Yup.string()
      .required(Applicationlabel.addleaveschema.fromTime),
      
      toTime: Yup.string()
      .required(Applicationlabel.addleaveschema.toTime)
      
  });
}
  const handleChange = (newValue: any) => {
    if (newValue === "Permission") {
      setShowFields(true);
    } else {
      setShowFields(false);
    }
  };

  async function remainingleaves() {
    const getleavebyid = await userService.getUserById(userinfo.id);
    if (getleavebyid.status && getleavebyid.data) {
      setRemainingleave(getleavebyid.data.leaveAppliedByDays);
    }
  }

  useEffect(() => {
    remainingleaves();
  }, []);


  const handleEvent = (values: any) => {
    setFromDate(values)
    setToDate(values)


  };

  const onChangeHandler = (value: any) => {
    setDateStart(value[0]);
    setDateEnd(value[1]);
  }

  const ChangeHandler = (value: any) => {
    setsingleDateStart(value);
  }

  const handleChange1 = (event: any) => {
    setFromTime(event.target.value);
  }

  function FromFormat(fromTime: any) {
    let hours: any = fromTime;
    hours = hours < 10 ? `0${hours}` : hours;
    const fromTimeN: any = `${hours}`;
    return fromTimeN;
  }

  const handleChange2 = (event: any) => {
    setToTime(event.target.value);
  };

  function Toformat(toTime: any) {
    let hours: any = toTime;
    hours = hours < 10 ? `0${hours}` : hours;
    const toTimeN: any = `${hours}`;
    return toTimeN;
  }




  return (
    <>
      <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      <Card sx={{ display: "flex" }} className="custom-datepicker">
        <Box className="marginunset" sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", margin: "0 90px" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>

            <div className="flex jc-sb al-c">
              <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder mt30">{Applicationlabel.applyLeaves.heading}</p>
            </div>
            <div className="remain-leave">
              <p>{Applicationlabel.myLeaves.remainingLeave}<span>{remainingLeave}</span></p>
            </div>
            <br />

            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={leaveSchema}
            >
              {(formik) => {
                const { errors, touched } = formik;
                return (

                  <form className="row g-3 mt20 " onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }} noValidate>
                    <Grid container spacing={3} className="ml0">
                      {/* {/ {/ <div className="p-2 flex-fill align-items-centerjustify-content-around" > /} /} */}
                      <Grid item lg={6} md={6} sm={6} xs={12} className="pl0">
                        <TextField variant="standard" id="request" data-testid="request"
                          select onChange={
                            (e: any) => {
                              handleChange(e.target.value);
                              formik.setFieldValue("request", e.target.value);
                            }}
                          name="request" label={Applicationlabel.applyLeaves.leaveType} className={
                            errors.request && touched.request
                              ? "form-control input-error mt-1 request-leavetype"
                              : "form-control request-leavetype"
                          } autoComplete="off">
                          <MenuItem value="">Choose Leave Type</MenuItem>

                          {leaveType.map((name: any, i: any) => <MenuItem value={name.label} key={i}>{name.value}</MenuItem>)}</TextField>
                        <ErrorMessage
                          name="request"
                          component="span"
                          className="error"
                        />{" "}
                      </Grid>
                      {formik.values.request == "Permission" || formik.values.request == "Half Day-FN" || formik.values.request == "Half Day-AN" ? <>
                        <Grid item lg={6} >
                          <div className='daterangepicker-control-section'>
                            <DatePicker
                              id="dateStartEnd"
                              selected={singledateStart}
                              onChange={ChangeHandler}
                              dateFormat="dd/MM/yyyy"
                              className={'form-control form-control-sm'}
                              showDisabledMonthNavigation
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>
                        </Grid>
                      </> :
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                          <div className='daterangepicker-control-section '>
                            {/* {/ {/ <LocalizationProvider dateAdapter={AdapterDayjs}> /} /} */}
                            <div>
                              {/* {/ {/ <Typography sx={{ mt: 2, mb: 1 }}></Typography> /} /} */}
                              <DatePicker
                                id="dateStartEnd"
                                selectsRange={true}
                                startDate={dateStart}
                                endDate={dateEnd}
                                onChange={onChangeHandler}
                                dateFormat="dd/MM/yyyy"
                                className={'form-control form-control-sm'}
                                showDisabledMonthNavigation
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                              />
                              {/* {/ {/ /> /} /} */}
                            </div>
                            {/* {/ {/ </LocalizationProvider> /} /} */}
                          </div>
                        </Grid>
                      }
                      {showFields && <>
                        <Grid item lg={6} md={6} sm={6} xs={12} className="pl0">

                          <TextField variant="standard" name="fromTime" data-testid="fromTime" value={fromTime} onChange={(event: any) => { setFromTime(event.target.value); formik.setFieldValue("fromTime",event.target.value)}} type="time" label={Applicationlabel.applyLeaves.fromTime} autoComplete="off" className={
                            errors.fromTime && touched.fromTime
                              ? "form-control input-error  mt-1"
                              : "form-control"
                          } InputLabelProps={{ shrink: true }}>
                          </TextField>
                          <ErrorMessage
                            name="fromTime"
                            component="span"
                            className="error" />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                          <TextField variant="standard" name="toTime" data-testid="toTime" value={toTime} onChange={(event: any) => { setToTime(event.target.value); formik.setFieldValue("toTime",event.target.value)}} type="time" label={Applicationlabel.applyLeaves.toTime} autoComplete="off" className={
                            errors.toTime && touched.toTime
                              ? "form-control input-error  mt-1"
                              : "form-control"
                          } InputLabelProps={{ shrink: true }}>
                          </TextField>
                          <ErrorMessage
                            name="toTime"
                            component="span"
                            className="error" />
                        </Grid>
                      </>}
                      <Grid item lg={6} md={6} sm={6} xs={12} className="pl0">
                        <TextField variant="standard" name="notes" onChange={formik.handleChange} type="text" label={Applicationlabel.applyLeaves.notes} autoComplete="off" data-testid="notes" className={
                          errors.reason && touched.reason
                            ? "form-control input-error  mt-1"
                            : "form-control"
                        } />
                        <ErrorMessage
                          name="notes"
                          component="span"
                          className="error"
                        />{" "}
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <TextField variant="standard" type="text" label={Applicationlabel.applyLeaves.reason} id="reason" name="reason" data-testid="reason" onChange={formik.handleChange} autoComplete="off" className={
                          errors.reason && touched.reason
                            ? "form-control input-error  mt-1"
                            : "form-control"
                        } />
                        <ErrorMessage
                          name="reason"
                          component="span"
                          className="error"
                        />{" "}
                      </Grid>
                      {/* {/ {/ </div> /} /} */}
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      {/* {/ {/ <div className="p-2 flex-fill align-items-centerjustify-content-around" > /} /} */}

                      <Grid item lg={12} className="p-1">
                        <div className="action-btn">
                          <Button data-testid="submitButton" variant="contained" type="submit"
                            className="mb-3"
                            style={{ backgroundColor: "#049FD9", color: "#ffffff" }} >
                            {Applicationlabel.button.submit}
                          </Button>&nbsp;&nbsp;
                          <Button data-testid="cancelButton"
                            className="mb-3"
                            style={{ backgroundColor: "white", border: "1px solid #049FD9" , color: "#049FD9"}}
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            onClick={() => { navigate("/leaves/myleaves"); }}
                          >
                            {Applicationlabel.button.cancel}
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

export default AddLeave;

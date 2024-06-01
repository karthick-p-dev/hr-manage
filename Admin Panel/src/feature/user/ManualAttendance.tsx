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
import "bootstrap-daterangepicker/daterangepicker.css";
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import "../../style/css/base.css";
import "../../App.css";
import Applicationlabel from "../../common/en.json";
// import leaveService from "../../helpers/Services/leave.service";
import DataPicker from "../../common/date-picker/DataPicker";



const ManualAttendance = () => {
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
    // const [showFields, setShowFields] = useState<any>(false);
    // const [fromDate, setFromDate] = useState(new Date());
    // const [toDate, setToDate] = useState(new Date());
    const [fromTime, setFromTime] = useState(new Date());
    const [toTime, setToTime] = useState(new Date());
    const [startDate, setdate] = useState<any>(new Date());
    const navigate = useNavigate();
    const [AttendanceType, setAttendanceType] = useState<any>('');

    const initialValues = {
        userId: userinfo.id,
        companyId: userinfo.companyId,
        Date: new Date(),
        fromTime: "00:00",
        toTime: "00:00",
        request: AttendanceType,
    };

    const handleSubmit = async (values: any) => {
        console.log("addvalues---", values);

    }


    // const leaveSchema = Yup.object().shape({
    //     request: Yup.string().required("Request is required"),

    //     reason: Yup.string()
    //         .required("Reason is required")
    //         .min(4, "Reason is too short - should be 4 chars minimum"),
    // });



    useEffect(() => {
    }, []);


    const handleIn = (event: any) => {
        setFromTime(event.target.value);
    }
    const handleOut = (event: any) => {
        setToTime(event.target.value);
        console.log("event", event.target.value)
    };

    const handleType = (event: SelectChangeEvent) => {
        console.log(event);
        setAttendanceType(event.target.value as string);
    };


    return (
        <>
            <Card sx={{ display: "flex" }} className="pad3090">
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                    <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }} className="ml0">
                        <div className="flex jc-sb al-c">
                            <p style={{ fontSize: "22px", fontWeight: 500 }} className="fw-bolder alignleft ">{Applicationlabel.allUsersManualAttendance.heading}</p>
                        </div>
                        <br />

                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                        // validationSchema={leaveSchema}
                        >
                            {(formik) => {
                                const { errors, touched } = formik;
                                return (

                                    <form className="row g-3 mt20 " onSubmit={(e) => {
                                        e.preventDefault();
                                        formik.handleSubmit(e);
                                    }} noValidate>
                                        <Grid container spacing={3}  className="ml0">
                                            <Grid item lg={6} md={6} sm={6} xs={12} className=" padr30 xs100">
                                                <DataPicker className="form-control mt16 mb20" formValue={formik.values.Date} formik={formik} labelName={Applicationlabel.allUsersManualAttendance.dateLabel} inputFormat="DD-MM-YYYY" 
                                                fieldName="Date" errors={errors} touched={touched} disablePast={false} handleSubmit={true} />
                                            </Grid>
                                               <br/>
                                            <Grid item lg={6} md={6} sm={6} xs={12} className=" padl30 xs100">
                                                 <FormControl variant="standard" sx={{ minWidth: 470 }}>
                                                    <InputLabel id="demo-simple-select-filled-label">{Applicationlabel.allUsersManualAttendance.attendanceType}</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-filled-label"
                                                        id="demo-simple-select-filled"
                                                        label="Attendance Type"
                                                        value={AttendanceType}
                                                        onChange={handleType}
                                                    >
                                                        <MenuItem value={"Manual Attendance"}>{Applicationlabel.allUsersManualAttendance.manualAttendance}</MenuItem>
                                                    </Select>
                                                </FormControl> 
                                            </Grid>
                                                  <br/>

                                            <Grid item lg={6} md={6} sm={6} xs={12} className=" padr30 xs100" >
                                            <TextField variant="standard"  id="time" type="time" defaultValue="12:00" value={fromTime}label={Applicationlabel.allUsersManualAttendance.inTime} className="form-control  mb20 " autoComplete="off"
                                                    onChange={handleIn} InputLabelProps={{ shrink: true }}/>
                                            </Grid>
                                                 <br/>

                                            <Grid item lg={6} md={6} sm={6} xs={12} className=" padl30 xs100">
                                            <TextField  variant="standard"  id="time" type="time" label={Applicationlabel.allUsersManualAttendance.outTime} defaultValue="12:00" value={toTime} className="form-control mb20 " autoComplete="off"
                                                 onChange={handleOut} InputLabelProps={{ shrink: true }}  />
                                            </Grid>
                                               <br/>
                                            <Grid item xs={12} className="p-1">
                                                <div className="action-btn mt30">
                                                    <Button data-testid="submitButton" variant="contained" type="submit"
                                                        className="mb-3"
                                                        style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
                                                    >
                                                        {Applicationlabel.button.submit}
                                                    </Button> &nbsp;&nbsp;
                                                    <Button data-testid="cancelButton"
                                                        className="mb-3"
                                                        style={{ backgroundColor: "white", border: "1px solid #049FD9" , color: "#049FD9"}}
                                                        type="submit"
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => { navigate(-1); }}
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

export default ManualAttendance;

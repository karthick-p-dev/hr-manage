import React, { useEffect, useState } from "react";
import { Formik, ErrorMessage } from "formik";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader } from "@mui/material";
import Grid from "@mui/material/Grid";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SimpleSnackbar from '../../common/toaster/toast';
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from '@mui/icons-material/Info';import "../../style/css/base.css";
import companyService from "../../helpers/Services/company.service";
import Applicationlabel from "../../common/en.json";

const CompanyEdit = () => {
    const initialValues = {
        companyAddress: "",
        companyName: "",
        contactNumber: "",
        fromDate: new Date(),
        toDate: new Date(),
        email: "",
        fullDayTiming: "",
        geofencing: null,
        halfDayTime: "",
        latitude: null,
        longitude: null,
        noOfEmployees: "",
        noOfLeaves: "",
        singleLogin: false,
        regularWorkIn: "",
        regularWorkOut: "",
    };
    const phoneRegExp=/^((\+[1-9\s ()-]*[-]?)|(\([0-9]*\)[ -]?)|(?!.*0{10})([0-9\s ()-])*)$/;
    const [companyInfo, setCompanyInfo] = useState<any>(initialValues);
    const [toast,setToast] = useState(false);
    const [message,setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (values: any) => {
        const response = await companyService.editCompany(values);
        if (response.data) {
            setToast(true);
            setMessage(Applicationlabel.toast.companyUpdate)
            setTimeout(() => {
                navigate("/companies");
              }, 1000); 
        }
    };

     const companySchema = Yup.object().shape({
        companyName: Yup.string().trim(Applicationlabel.companySchema.companyNameSpace).strict(true).required(Applicationlabel.companySchema.companyName),
        companyAddress: Yup.string().trim(Applicationlabel.companySchema.companyAddressSpace).strict(true).required(Applicationlabel.companySchema.companyAddress),
        contactNumber: Yup.string()
        .strict(true)
        .trim().matches(phoneRegExp, Applicationlabel.companySchema.contactNumberMat)
        .trim(Applicationlabel.companySchema.companyNumberSpace).required(Applicationlabel.companySchema.contactNumberReq),
        fullDayTiming: Yup.number().min(1,Applicationlabel.companySchema.fullDayTimingmin)
        .max(24,Applicationlabel.companySchema.fullDayTimingmax).required(Applicationlabel.companySchema.fullDayTiming),
        noOfLeaves: Yup.number().required(Applicationlabel.companySchema.noOfLeaves),
        halfDayTime: Yup.number().min(1,Applicationlabel.companySchema.halfDayTimemin)
       .required(Applicationlabel.companySchema.halfDayTime),
        email: Yup.string().trim().email(Applicationlabel.SignInSchema.emailVal)
        .required(Applicationlabel.companySchema.email),
        regularWorkIn: Yup.string().trim().required(Applicationlabel.companySchema.regularWorkIn),
        regularWorkOut: Yup.string().required(Applicationlabel.companySchema.regularWorkOut),
        noOfEmployees: Yup.number().required(Applicationlabel.companySchema.noOfEmployees),

    });

    async function getCompanyDetails() {
        const companyInfos = await companyService.getCompany();
        if (companyInfos.data && companyInfos.data[0]) setCompanyInfo({ companyInfo, ...companyInfos.data[0] });
    }

    useEffect(() => {
        getCompanyDetails();
    }, []);

    return (
        <>
        <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
            <Card sx={{ display: "flex" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardHeader style={{ float: "left", textAlign: "left" }} titleTypographyProps={{ fontSize: "18px", fontWeight: 600 }} title="Company Details" className="fw-bolder"></CardHeader>
                    <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
                        <Formik
                            enableReinitialize
                            initialValues={companyInfo}
                            onSubmit={handleSubmit}
                            validationSchema={companySchema}
                        >
                            {(formik) => {
                                const { errors, touched } = formik;
                                return (
                                    <form className="row g-3" onSubmit={(e) => {
                                        e.preventDefault();
                                        formik.handleSubmit(e);
                                    }} noValidate>
                                        <Grid container spacing={3}>

                                                <Grid item xs={6} className="p-1">
                                                    <TextField variant="standard"  onChange={(e:any) => formik.handleChange(e)} type="letters" id="companyName" name="companyName" autoComplete="off"
                                                        value={formik.values.companyName ? formik.values.companyName : ""} label={Applicationlabel.companyEdit.companyName} data-testid="companyName"
                                                        className={
                                                            errors.companyName && touched.companyName
                                                                ? "form-control input-error  mt-1"
                                                                : "form-control"
                                                        }>
                                                    </TextField>
                                                    <ErrorMessage
                                                        name="companyName"
                                                        component="span"
                                                        className="error"
                                                  />

                                                </Grid>
                                                <Grid item xs={6} className="p-1">
                                                    <TextField variant="standard" label={Applicationlabel.companyEdit.companyAddress}  onChange={formik.handleChange} value={formik.values.companyAddress ? formik.values.companyAddress : ""}
                                                        type="text" id="companyAddress" name="companyAddress" autoComplete="off" data-testid="companyAddress" className={
                                                            errors.companyAddress && touched.companyAddress
                                                                ? "form-control input-error  mt-1"
                                                                : "form-control"
                                                        }>
                                                    </TextField>
                                                    <ErrorMessage
                                                        name="companyAddress"
                                                        component="span"
                                                        className="error"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} className="p-1">
                                                    <TextField variant="standard" label={Applicationlabel.companyEdit.contactNo} onChange={formik.handleChange} value={formik.values.contactNumber ? formik.values.contactNumber : ""}
                                                        type="text" id="contactNumber" name="contactNumber" data-testid="contactNumber" autoComplete="off" className={
                                                            errors.contactNumber && touched.contactNumber
                                                                ? "form-control input-error  mt-1"
                                                                : "form-control"
                                                        }>
                                                    </TextField>
                                                    <ErrorMessage
                                                        name="contactNumber"
                                                        component="span"
                                                        className="error"
                                                    />{" "}

                                                </Grid>
                                                <Grid item xs={6} className="p-1">
                                                    <TextField variant="standard"  label = {Applicationlabel.companyEdit.email} onChange={formik.handleChange} value={formik.values.email ? formik.values.email : ""}
                                                        type="email" id="email" name="email" autoComplete="off" data-testid="email" className={
                                                            errors.email && touched.email
                                                                ? "form-control input-error  mt-1"
                                                                : "form-control"
                                                        }>
                                                    </TextField>
                                                    <ErrorMessage
                                                        name="email"
                                                        component="span"
                                                        className="error"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} className="p-1">
                                                    <TextField variant="standard" label={Applicationlabel.companyEdit.fullDayTime} onChange={formik.handleChange} value={formik.values.fullDayTiming ? formik.values.fullDayTiming : ""}
                                                        type="number"  inputProps={{ min: "1", max: "24", step: "1" }} id="fullDayTiming" name="fullDayTiming" data-testid="fullDayTiming" autoComplete="off" className={
                                                            errors.fullDayTiming && touched.fullDayTiming
                                                                ? "form-control input-error  mt-1"
                                                                : "form-control"
                                                        }>
                                                    </TextField>
                                                    <ErrorMessage
                                                        name="fullDayTiming"
                                                        component="span"
                                                        className="error"
                                                    />{" "}

                                                </Grid>
                                                <Grid item xs={6} className="p-1">
                                                    <TextField variant="standard" label={Applicationlabel.companyEdit.halfDayTime} onChange={formik.handleChange} value={formik.values.fullDayTiming ? formik.values.fullDayTiming/2 : ""}
                                                        type="number" inputProps={{ min: "1", max: "24", step: "1" }} id="halfDayTime" name="halfDayTime" data-testid="halfDayTime" autoComplete="off" disabled className={
                                                            errors.halfDayTime && touched.halfDayTime
                                                                ? "form-control input-error  mt-1"
                                                                : "form-control"
                                                        }>
                                                    </TextField>
                                                    <ErrorMessage
                                                        name="halfDayTime"
                                                        component="span"
                                                        className="error"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} className="p-1">
                                                    <TextField variant="standard"  label={Applicationlabel.companyEdit.regularWorkIn} onChange={formik.handleChange} value={formik.values.regularWorkIn.substring(0,5) }
                                                       type="time" id="regularWorkIn" name="regularWorkIn" data-testid="regularWorkIn"  autoComplete="off" className={
                                                            errors.regularWorkIn && touched.regularWorkIn
                                                                ? "form-control input-error  mt-1"
                                                                : "form-control"
                                                        }InputLabelProps={{ shrink: true }}>
                                                    </TextField>
                                                    <ErrorMessage
                                                        name="regularWorkIn"
                                                        component="span"
                                                        className="error"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} className="p-1">
                                                    <TextField variant="standard"  label = {Applicationlabel.companyEdit.regularWorkOut} onChange={formik.handleChange} value={formik.values.regularWorkOut.substring(0,5)}
                                                        type="time" id="regularWorkOut" name="regularWorkOut" data-testid="regularWorkOut" className="form-control" autoComplete="off" InputLabelProps={{ shrink: true }}/>
                                                    <ErrorMessage
                                                        name="regularWorkOut"
                                                        component="span"
                                                        className="error"
                                                    />
                                                </Grid>

                                                <Grid item xs={6} className="p-1">

                                                    <TextField variant="standard" label={Applicationlabel.companyEdit.noOfLeaves} onChange={formik.handleChange} value={formik.values.noOfLeaves ? formik.values.noOfLeaves : ""}
                                                        type="number" inputProps={{ min: "1", max: "365", step: "1" }} id="noOfLeaves" name="noOfLeaves" data-testid="noOfLeaves" autoComplete="off" className={
                                                            errors.noOfLeaves && touched.noOfLeaves
                                                                ? "form-control input-error  mt-1"
                                                                : "form-control"
                                                        }>
                                                    </TextField>
                                                    <ErrorMessage
                                                        name="noOfLeaves"
                                                        component="span"
                                                        className="error"
                                                    />

                                                </Grid>
                                                <Grid item xs={6} className="p-1 rel">

                                                    <TextField variant="standard"  label={Applicationlabel.companyEdit.noOfEmployee} onChange={formik.handleChange} value={formik.values.noOfEmployees ? formik.values.noOfEmployees : ""}
                                                        type="number" id="noOfEmployees" name="noOfEmployees" data-testid="noOfEmployees" disabled autoComplete="off" className={
                                                            errors.noOfEmployees && touched.noOfEmployees
                                                                ? "form-control input-error  mt-1"
                                                                : "form-control"
                                                        }>
                                                             </TextField>
                                                        <ErrorMessage
                                                            name="noOfEmployees"
                                                            component="span"
                                                            className="error"
                                                        />

                                                       <Tooltip arrow  title={Applicationlabel.toolTip.info}>
                                                        <InfoIcon className="notificatin-ico" />
                                                        </Tooltip>

                                                </Grid>
                                                
                                            <Grid item xs={12} className="justify-content-around" >
                                                <Button variant="outlined" data-testid="cancelButton" color="secondary" style={{ backgroundColor: "white", border: "1px solid #049FD9" , color: "#049FD9" ,marginLeft: "10px"}} onClick={() => { navigate("/companies"); }} className="mb-3">
                                                {Applicationlabel.button.cancel}
                                                </Button>&nbsp;&nbsp;
                                                <Button variant="contained" data-testid="submitButton" type="submit" className="mb-3" color="secondary"  style={{ backgroundColor: "#049FD9", color: "#ffffff" }}>
                                                {Applicationlabel.button.submit}
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
export default CompanyEdit;

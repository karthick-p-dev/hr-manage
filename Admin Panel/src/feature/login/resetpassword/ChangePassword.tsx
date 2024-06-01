import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import SimpleSnackbar from "../../../common/toaster/toast";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Applicationlabel from "../../../common/en.json";
import { post } from "../../../helpers/fetch-Service-Methods";
import { BASE_URL } from "../../../config/config";
import ENDPOINT from "../../../helpers/Api";
import Password from "../../../common/Password/Password";

const ChangePassword: React.FC = () => {
  const initialValues = { otp: "", newpassword: "", NewPasswordConfirmation: "", devicetype: "web" };
  const navigate = useNavigate();
  const [isVisible, setVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");

  const [show, setShow] = useState(false);
  const [lowerValidated, setLowerValidated]=useState(false);
  const [upperValidated, setUpperValidated]=useState(false);
  const [numberValidated, setNumberValidated]=useState(false);
  const [specialValidated, setSpecialValidated]=useState(false);
  const [lengthValidated, setLengthValidated]=useState(false);
  const [isValue,setValue]=useState(false);

  const handleSubmit = async (values: any) => {
    if( (!lowerValidated || !upperValidated || !numberValidated || !specialValidated || !lengthValidated))
    {setShow(true)
    return;}
    values.email = searchParams.get("email");
    const reset = await post(`${BASE_URL + ENDPOINT.VERIFY_OTP}`, values);
    setToast(true);
    setMessage(reset.message);
   if (reset.message === 'password updated successfully') {
    setTimeout(() => {
      setToast(true);
      setMessage(reset.message);
      navigate("/login");
    }, 1000); 
   }
  };

  const SignInSchema = Yup.object().shape({
    otp: Yup.number().test(
      "maxDigits",
      (Applicationlabel.changePassword.otpMin),
      (number) => String(number).length >= 6
    )
    .required(Applicationlabel.changePassword.otpReq),

    newpassword: Yup.string().required(Applicationlabel.changePassword.passReq)
      .min(8, (Applicationlabel.changePassword.passMin)),

      NewPasswordConfirmation: Yup.string()
      .required(Applicationlabel.changePassword.confPassreq)
      .min(8, (Applicationlabel.changePassword.passMin))
      .oneOf([Yup.ref(Applicationlabel.changePassword.new), null], (Applicationlabel.changePassword.samePass)),
  });

  const handlePasswordSubmit=(value:any)=>{
    const lower = new RegExp('(?=.*[a-z])');
    const upper = new RegExp('(?=.*[A-Z])');
    const number = new RegExp('(?=.*[0-9])');
    const special = new RegExp('(?=.*[!@#\$%\^&\*])');
    const length = new RegExp('(?=.{8,})')
    if(lower.test(value)){
      setLowerValidated(true);
    }
    else{
      setLowerValidated(false);
    }
    if(upper.test(value)){
      setUpperValidated(true);
    }
    else{
      setUpperValidated(false);
    }
    if(number.test(value)){
      setNumberValidated(true);
    }
    else{
      setNumberValidated(false);
    }
    if(special.test(value)){
      setSpecialValidated(true);
    }
    else{
      setSpecialValidated(false);
    }
    if(length.test(value)){
      setLengthValidated(true);
    }
    else{
      setLengthValidated(false);
    }
    if(lowerValidated && upperValidated && numberValidated && specialValidated && lengthValidated)
    {setShow(false)}
  }
  const passwordcheck:any = {
    lowerValidated:lowerValidated,
    upperValidated:upperValidated,
    numberValidated:numberValidated,
    specialValidated:specialValidated,
    lengthValidated:lengthValidated
  }
  const onclick= () =>{
    setShow(true);
    
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
    <SimpleSnackbar showToast={toast} message={message} setToast={setToast} /> 
      <Formik
        initialValues={initialValues}
        validationSchema={SignInSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          const { errors, touched, isValid, dirty } = formik;
          return (
            <Grid container spacing={0} className="overflowUnset">
              <Grid item xs={12} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                <Card >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardHeader>Login </CardHeader>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit(e);
                      }} noValidate>
                        <h3>{Applicationlabel.changePassword.resetPass}</h3>

                        {/* <div className="login-text" style={{
                          borderStyle: 'dotted',
                          borderWidth: 1,
                          borderRadius: 1,
                        }}>{searchParams.get("email")}</div><br /> */}
                         <div className="otp-text" style={{
                          borderStyle: 'dotted',
                          borderWidth: 1,
                          borderRadius: 1,
                        }}>{Applicationlabel.changePassword.otpLabel}</div>
                         <div className="enable-mail" 
                        >{searchParams.get("email")}</div>
                     
                       <TextField
                          inputProps={{ "data-testid": "otp" , min : "1"}}
                          sx={{ width: 350 }}
                          id="otp"
                          variant="standard"
                          name="otp"
                          label={Applicationlabel.changePassword.currOtp}
                          type="number"
                          
                          value={formik.values.otp}
                          onChange={formik.handleChange}
                          onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                          className={
                            errors.otp && touched.otp
                              ? "input-error form-control mt-1"
                              : "mb-3"
                          }
                          error={touched.otp && Boolean(errors.otp)}
                        />
                        <ErrorMessage
                          name="otp"
                          component="span"
                          className="error"
                        />
                        
                        <div className="rel">
                        <TextField
                          inputProps={{ "data-testid": "NewPassword" }}
                          sx={{ width: 350 }}
                          id="newpassword"
                          variant="standard"
                          name="newpassword"
                          label={Applicationlabel.changePassword.newPass}
                          type={!isVisible ? "password" : "text"}
                          value={formik.values.newpassword}
                          onChange={(e:any) => { handlePasswordSubmit(e.target.value);
                            formik.setFieldValue("newpassword", e.target.value);}}
                          className={
                            errors.newpassword && touched.newpassword
                              ? "input-error form-control mt-1"
                              : "mb-3"
                          }
                          error={touched.newpassword && Boolean(errors.newpassword)}
                          onClick={onclick}  onBlur={(e) => {setShow(false)}}
                        />
                         <span onClick={ () => { setVisible(!isVisible); }} className="eye-ico">
                          {isVisible ? <Visibility /> : <VisibilityOff />}
                         </span>
                         {!show ? '' : 
                             <Password {...passwordcheck} />
                                }
                        </div>
                        <ErrorMessage
                          name="newpassword"
                          component="span"
                          className="error"
                        />

                        <div className="rel">
                        <TextField
                          inputProps={{ "data-testid": "NewPasswordConfirmation" }}
                          sx={{ width: 350 }}
                          id="NewPasswordConfirmation"
                          variant="standard"
                          name="NewPasswordConfirmation"
                          label={Applicationlabel.changePassword.newPassconf}
                          type={!isValue ? "password" : "text"}
                          value={formik.values.NewPasswordConfirmation}
                          onChange={formik.handleChange}
                          className={
                            errors.NewPasswordConfirmation && touched.NewPasswordConfirmation
                              ? "input-error form-control mt-1"
                              : "mb-3"
                          }
                          error={touched.NewPasswordConfirmation && Boolean(errors.NewPasswordConfirmation)}
                         
                        />
                         <span onClick={() => { setValue(!isValue); }} className="eye-ico">
                          {isValue ? <Visibility /> : <VisibilityOff />}
                         </span>
                         </div>
                        <ErrorMessage
                          name="NewPasswordConfirmation"
                          component="span"
                          className="error"
                        />
                      <br/>
                      <div className="bottom-card-login"> 
                        <Button color="primary" variant="contained" data-testid="submitButton" style={{ width: "350" }} type="submit" className={
                          !(dirty && isValid)
                            ? "disabled-btn"
                            : " btn btn-primary"
                        }
                          >
                          {Applicationlabel.changePassword.ok}
                        </Button>
                        <Button color="primary" variant="text" style={{ width: "350" }} onClick={() => navigate("/login")} >
                        {Applicationlabel.changePassword.back}
                        </Button>
                        </div></form>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          );
        }}
      </Formik>
    </div>
  );
};

export default ChangePassword;

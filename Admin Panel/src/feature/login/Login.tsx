import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import SimpleSnackbar from "../../common/toaster/toast";
import Applicationlabel from "../../common/en.json";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { onLogin } from "../../app/redux/actions/action";


const Login: React.FC = () => {
  const initialValues = { email: "", password: "", devicetype: "web" };
  const rememberEmail = {email: localStorage.getItem("userInfoemail"), password: "", devicetype: "web"};
  const [showFields, setShowFields] = useState<any>(false);
  const [isVisible, setVisible] = useState(false);
  // const [local, setLocal] = useState(localStorage.getItem("userInfoemail"));
  const [val, setVal] = useState<any>(initialValues);
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const handleSubmit = async (values: any) => {
    const resp: any = await dispatch(onLogin(values));
    setToast(true);
    setMessage(resp);
    if (resp.payload) {
      navigate("/dashboard");
    }
    if (!showFields) {
      localStorage.removeItem("userInfoemail");
    }
  };

  const SignInSchema = Yup.object().shape({
    email: Yup.string().email(Applicationlabel.SignInSchema.emailVal).required(Applicationlabel.SignInSchema.emailReq),

    password: Yup.string()
      .required(Applicationlabel.SignInSchema.passwordReq)
      .min(8, Applicationlabel.SignInSchema.passwordMin),
  });

  const toggle = () => {
    setVisible(!isVisible);
  };

  const setRememberme = () => {
     //alert(showFields)
    setShowFields(!showFields);
    localStorage.setItem("showFields",showFields)
  };

 useEffect(()=>{
      (localStorage.getItem("userInfoemail") && localStorage.getItem("showFields")) ? setVal(rememberEmail) : setVal(initialValues)
   },[showFields])
  

  return (
    <>     
     <SimpleSnackbar showToast={toast} message={message} setToast={setToast} /> 
    {console.log("showfieds--->",showFields)}
   
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
    
      <Formik
        initialValues={val}
        validationSchema={SignInSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => {
          const { errors, touched, isValid, dirty } = formik;
          return (
            <Grid container spacing={0} >
              <Grid item xs={12} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} >
              <div className="logo-login"><b>Great Innovus</b></div>
                <Card >
               
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardHeader>Login </CardHeader>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit(e);
                      }} noValidate>
                        <h3>Log in to your account</h3>

                        <TextField
                          inputProps={{ "data-testid": "email" }}
                          sx={{ width: 350 }}
                          id="email"
                          variant="standard"
                          name="email"
                          label="Email*"
                          autoComplete="off"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          className={
                            errors.email && touched.email
                              ? "input-error form-control mt-1"
                              : "mb-3"
                          }
                          error={touched.email && Boolean(errors.email)}
                          // helperText={touched.email && errors.email}
                        />
                        <ErrorMessage
                          name="email"
                          component="span"
                          className="error"
                        />{" "}<br />
                        <div className="rel">
                        <TextField
                          inputProps={{ "data-testid": "password" }}
                          sx={{ width: 350 }}
                          id="password"
                          variant="standard"
                          name="password"
                          label="Password*"
                          type={!isVisible ? "password" : "text"}
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          className={
                            errors.password && touched.password
                              ? "input-error form-control mt-1"
                              : "mb-3"
                          }
                          error={touched.password && Boolean(errors.password)}
                          // helperText={touched.password && errors.password}
                        />
                          <span onClick={toggle} className="eye-ico">
                          {isVisible ? <Visibility /> : <VisibilityOff />}
                         </span>
                         </div>
                        <ErrorMessage
                          name="password"
                          component="span"
                          className="error"
                        /><br />

                      <div>
                        <FormGroup>
                          <FormControlLabel control={<Switch checked={showFields}/>} onClick={() => setRememberme()} label="Remember my email address" />
                        </FormGroup>
                      </div>
                      <div className="flex mt15">
                        <Button color="primary" variant="contained" data-testid="submitButton" style={{ width: "350" }} type="submit" 
                        className={
                          !(dirty && isValid)
                            ? "disabled-btn"
                            : " btn btn-primary"
                        }
                          disabled={!(dirty && isValid)}
                          >
                         {Applicationlabel.button.login}
                        </Button>
                        <Button color="primary" variant="text" style={{ width: "350" }} onClick={() => {
                          localStorage.setItem("resetemail",formik.values.email);
                          navigate("/password-reset-request")}} >
                          {Applicationlabel.button.reset}
                        </Button>
                        </div>
                        </form>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          );
        }}
      </Formik>
    </div>
    </>
  );
};

export default Login;


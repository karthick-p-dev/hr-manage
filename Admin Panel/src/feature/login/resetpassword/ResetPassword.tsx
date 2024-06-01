import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createSearchParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import SimpleSnackbar from "../../../common/toaster/toast";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { post } from "../../../helpers/fetch-Service-Methods";
import { BASE_URL } from "../../../config/config";
import ENDPOINT from "../../../helpers/Api";

const ResetPassword: React.FC = () => {
  const initialValues = { email: localStorage.getItem("resetemail"), devicetype: "web" };
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    const reset = await post(`${BASE_URL + ENDPOINT.FORGET_PASSWORD}`, values);
    setToast(true);
    setMessage(reset.message);
   if (reset.message === "OTP sent successfully") {
    // navigate("/ChangePassword");
    localStorage.removeItem("resetemail");
    setTimeout(() => {
    navigate({
      pathname: "/ChangePassword",
      search: createSearchParams({
          email: values.email,
      }).toString(),
  });
}, 1000);
   }
  };

  const SignInSchema = Yup.object().shape({
    // email: Yup.string().email().required("Email is required"),
    email: Yup.string().email('Email must be a valid ').max(255).required('Email is required'),
  });

  return (
    <>
    <SimpleSnackbar showToast={toast} message={message} setToast={setToast} /> 
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <Formik
        initialValues={initialValues}
        validationSchema={SignInSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => {
           const { errors, touched, isValid, dirty } = formik;
          return (
            <Grid container spacing={0} >
              <Grid item xs={12} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                <Card >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardHeader>Login </CardHeader>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit(e);
                      }} noValidate>
                        <h3>Reset your password</h3>

                        <TextField
                          inputProps={{ "data-testid": "email" }}
                          sx={{ width: 350 }}
                          id="email"
                          variant="standard"
                          autoComplete="off"
                          name="email"
                          label="Email*"
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
                       <br />
            <div className="bottom-card-login"> 
                        <Button color="primary" variant="contained" style={{ width: "350" }} type="submit"
                          >
                          Reset Password
                        </Button>

                        <Button color="primary" variant="text" style={{ width: "350" }} onClick={() => navigate("/login")} >
                          Cancel
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

export default ResetPassword;

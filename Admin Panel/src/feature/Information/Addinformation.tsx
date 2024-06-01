import React, { useEffect, useState } from "react";
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
import ImageIcon from "@mui/icons-material/Image";
import informationService from "../../helpers/Services/information.service";

const Addinformation = () => {
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
);
  const navigate = useNavigate();
  const initialValues = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    textContent: "",
    file: "",
  };
  const [information, setInformation] = useState<any>(initialValues);
  async function getinformation() {
    const informationDetail = await informationService.getInformation(userinfo.companyId);
    if (informationDetail.status && informationDetail.data) setInformation(informationDetail.data);
}
      const handleSubmit = async (values: any) => {
        console.log("values",values)
      const response = await informationService.createInfo(values);
      if (response && response.status && response.data) {
            navigate("/info");
     }
      };
   useEffect(() => {
    getinformation();
   }, []);
   const columns: any = [
    {
      headerName: "No.",
      field: "id",
      editable: false,
    },
    {
      headerName: "Infortmation content",
      field: "textContent",
      editable: true,
      valueGetter: (params:any) => params.row.textContent,

      },
      {
        headerName: "Image",
        field: "file",
        editable: true,
        valueGetter: (params:any) => params.row.file,
      },
      {
        headerName: "Action",
        editable: true,
  },
];
const SignInSchema = Yup.object().shape({
  textContent: Yup.string().required("information content is required"),
});

  return (
    <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Information</p>
            <div className="action-btn">
                          <Button
                            className="btn-fill pull-right update-profile"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              navigate("/info");
                            }}
                          >
                            Back
                          </Button>
                          </div>
            <br />
            <br />
            <br />
                <Formik
             initialValues={information}
             onSubmit={handleSubmit}
             columns={columns}
             validationSchema={SignInSchema}
            >
            {(formik: any) => {
                const { errors, touched } = formik;
                return (
                  <form className="row g-3" onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }} noValidate>
                     <Grid container spacing={3}>
                     <Grid item xs={6} className="p-1">
                     <ImageIcon sx={{ fontSize: 100 }}/>
                     <input id="file" name="file" type="file" onChange={(event) => {
                      if (event.currentTarget && event.currentTarget.files) {
if (event.currentTarget && event.currentTarget.files) { formik.setFieldValue("file", Object.values(event.currentTarget.files)[0]); }
}
                  }} className="form-control"
                   />
                   </Grid>
                   </Grid>
            <Grid container spacing={4}>
                     <Grid item xs={16} className="p-1">
                          <TextField variant="standard" sx={{ float: "right", width: 400 }} onChange={formik.handleChange} value = {formik.values.textContent} type="text" id="textContent" name="textContent" label="information content*" className={
                                errors.reason && touched.reason
                                  ? "form-control input-error  mt-1"
                                  : "form-control"
                              } autoComplete="off" />
                          <ErrorMessage
                            name="textContent"
                            component="span"
                            className="error"
                          />{" "}
                        </Grid>
                        <Grid item xs={12} className="p-1">
                        <div className="action-btn">
                          <Button
                            className="btn-fill pull-right"
                           // type="submit"
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                              navigate("/info");
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
                );
            }}
            </Formik>
            </CardContent>
            </Box>
            </Card>
  );
};
export default Addinformation;

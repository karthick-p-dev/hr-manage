import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import Applicationlabel from "../../common/en.json";
import SimpleSnackbar from "../../common/toaster/toast";
import { BASE_URL } from "../../config/config";
import userService from "../../helpers/Services/user.service";

const Views = () => {
   // const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
    const [View, setView] = useState<any>([]);
    const [newprofile,setNewprofile] = useState<any>([]);
    const [toast,setToast] = useState(false);
    const [message,setMessage] = useState("");

    const navigate = useNavigate();
    const { id,value } = useParams();

    async function getViews() {
      const getView = await userService.getUserById(id);
      if (getView.status && getView.data) setView(getView.data);
      console.log("view", getView);
      setNewprofile(getView.data.profile)
      setToast(true);
      setMessage(Applicationlabel.toast.userProfile);
    }

    useEffect(() => {
    getViews();
      }, []);

    return (
       <>
       <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
       <Card sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 autoe" }}>
                <div>
                  <div className="flex jc-sb al-c">
                  <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder"> {Applicationlabel.allUsersView.heading}</p>
                  <div className="action-btn">
                          <Button
                            className="btn-fill pull-right update-profile"
                            type="submit"
                            variant="contained"

                            style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
                            color="secondary"
                            onClick={() => {
                              // navigate("/user");
                              navigate(`/user/${value}`)
                            }}
                          >
                             {Applicationlabel.button.back}
                          </Button>
                          </div>
                  </div>
                  </div>
            
              <Grid container spacing={1} className="al-flx-start">
                {/* IMAGE */}
                <Grid container item={true} xs={2} className="justify-content-left">
                <div className="userprofile">
                    <img src={BASE_URL + "/" + newprofile} />
                  </div>
                </Grid>
                {/* FORM SECTION */}
                <Grid container item={true} xs={10} className="justify-content-left">
                 <Grid container item={true} xs={12} className="justify-content-left">
                    <Grid container item={true} xs={12} className="justify-content-left">
                      <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.userName}</Grid>
                      {/* <Grid item xs={1} className="p-1">:</Grid> */}
                      <Grid item xs={7} className="p-1" >: &nbsp;{View.firstName && View.lastName ? View.firstName + " " + View.lastName : ""}</Grid>
                    </Grid>
                    <Grid container item={true} xs={12} className="justify-content-left" >
                      <Grid item xs={2} className="p-1 text-bold fw-semibold" >{Applicationlabel.allUsersView.firstName}</Grid>
                      {/* <Grid item xs={1} className="p-1">:</Grid> */}
                      <Grid item xs={7} className="p-1">: &nbsp;{View.firstName}</Grid>
                    </Grid>
                    <Grid container item={true} xs={12} className="justify-content-left" >
                      <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.lastName}</Grid>
                      {/* <Grid item xs={1} className="p-1">:</Grid> */}
                      <Grid item xs={7} className="p-1" >: &nbsp;{View.lastName}</Grid>
                    </Grid>
                            <Grid container item={true} xs={12} className="justify-content-left" >
                                <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.dob}</Grid>
                                {/* <Grid item xs={1} className="p-1">:</Grid> */}
                                <Grid item xs={4} className="p-1" >: &nbsp;{View.DOB}</Grid>
                            </Grid>
                          
                            <Grid container item={true} xs={12} className="justify-content-left" >
                                <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.doj}</Grid>
                                {/* <Grid item xs={1} className="p-1">:</Grid> */}
                                <Grid item xs={4} className="p-1" >: &nbsp;{moment(View.dateOfJoining).format("DD-MM-YYYY")}</Grid>
                            </Grid>

                            <Grid container item={true} xs={12} className="justify-content-left" >
                                <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.email}</Grid>
                                {/* <Grid item xs={1} className="p-1">:</Grid> */}
                                <Grid item xs={7} className="p-1" >: &nbsp;{View.email}</Grid>
                            </Grid>
                            <Grid container item={true} xs={12} className="justify-content-left" >
                                <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.mobile}</Grid>
                                {/* <Grid item xs={1} className="p-1">:</Grid> */}
                                <Grid item xs={7} className="p-1" >: &nbsp;{View.mobileNumber}</Grid>
                            </Grid>
                            </Grid>

                            <Grid container item={true} xs={12} className="justify-content-left">
                            <Grid container item={true} xs={12} className="justify-content-left" >
                                <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.gender}</Grid>
                                {/* <Grid item xs={1} className="p-1"></Grid> */}
                                <Grid item xs={6} className="p-1" >: &nbsp;{View.gender}</Grid>
                            </Grid>
                            <Grid container item={true} xs={12} className="justify-content-left" >
                                <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.empId}</Grid>
                                {/* <Grid item xs={1} className="p-1">:</Grid> */}
                                <Grid item xs={6} className="p-1" >: &nbsp;{View.employeeId}</Grid>
                            </Grid>
                            <Grid container item={true} xs={12} className="justify-content-left" >
                                <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.designation}</Grid>
                                {/* <Grid item xs={1} className="p-1">:</Grid> */}
                                <Grid item xs={6} className="p-1" >: &nbsp;{View.designation}</Grid>
                            </Grid>
                            <Grid container item={true} xs={12} className="justify-content-left" >
                                <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.position}</Grid>
                                {/* <Grid item xs={1} className="p-1">:</Grid> */}
                                <Grid item xs={6} className="p-1" >: &nbsp;{View.position && View.position.name}</Grid>
                            </Grid>
                              {/* <>{console.log(View.position.name)}</> */}
                            <Grid container item={true} xs={12} className="justify-content-left" >
                                <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.status}</Grid>
                                {/* <Grid item xs={1} className="p-1"></Grid> */}
                                <Grid item xs={4} className="p-1" >: &nbsp;{ View.isActive == true ? "Active" : "Inactive"}</Grid>
                               {/* <>{console.log("View.isActive", View.isActive == true ? "Active" : "Inactive")}</>  */}
                            </Grid>
                            <Grid container item={true} xs={12} className="justify-content-left" >
                                <Grid item xs={2} className="p-1 fw-semibold">{Applicationlabel.allUsersView.doe}</Grid>
                                {/* <Grid item xs={1} className="p-1"></Grid> */}
                                <Grid item xs={4} className="p-1" >: &nbsp;{(View.dateOfExit) ? moment(View.dateOfExit).format("DD-MM-YYYY") : "-"}</Grid>
                            </Grid>
                            </Grid>
                </Grid>
                {/* BUTTON */}
                {/* <Grid container item={true} xs={2} className="justify-content-left">
             
                </Grid> */}
                </Grid>

                {/* <Grid container spacing={1}>

                        </Grid> */}
                </CardContent>
                </Box>
                </Card>
       </>
    );
};
    export default Views;

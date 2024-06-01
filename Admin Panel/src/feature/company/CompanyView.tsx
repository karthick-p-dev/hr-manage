import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { CardHeader } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import SimpleSnackbar from '../../common/toaster/toast';
import companyService from "../../helpers/Services/company.service";
import Applicationlabel from "../../common/en.json";
import userService from "../../helpers/Services/user.service";


const CompanyView = () => {
    const [companyInfo, setCompanyInfo] = useState<any>([]);
    const [toast,setToast] = useState(false);
    const [message,setMessage] = useState("");
    const [userCount, setUsersCount] = useState();

    const userinfo: any = useSelector(
        (state: any) => state && state.signReducer && state.signReducer.entities,
      );    

    const navigate = useNavigate();
    
    async function getCompanyDetails() {
        const companyInfos = await companyService.getCompany();
        if (companyInfos.data && companyInfos.data[0]) { setCompanyInfo(companyInfos.data[0]);
         }
    }
    function simplifyTime (x:any) {
        if(x){
        var hours = x.split(":")[0];        
        var minutes = x.split(":")[1].split(" ")[0];
        var value= x.split(":")[1].split(" ")[1];
        var ampm:any = hours >= 12 || (hours<10 && value == "pm") ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        var strTime = (hours < 10 ? '0'+ hours : hours) + ':' + minutes + ' ' + ampm;
         return strTime;
     }
    }

    async function getAllUser() {
        const response = await userService.getAllUsers(userinfo);
        if (response.status && response.data) {
            const user: any = [...response.data];
            const count = user.length;
            setUsersCount(count);
        }
    }

    useEffect(() => {
        getCompanyDetails();
    }, []);

    useEffect(() => {
        getAllUser();
    }, []);
    
    // useEffect(() => {
    //     setToast(true);
    //     setMessage("Company View");
    //   }, []);

    return (
        <>
         <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
            <Card sx={{ display: "flex" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <div className="card-title-w-b flex jc-sb">
                                <div>
                                <CardHeader style={{ float: "left" }} titleTypographyProps={{ fontSize: "18px", fontWeight: 600 }} title={Applicationlabel.companyDetails.heading} className="fw-bolder">
                                </CardHeader>
                                </div>
                                <div>
                                <Button style={{ backgroundColor: "#049FD9", color: "#ffffff", marginLeft: "-5px" }} variant="contained" onClick={() => { navigate("/companies/edit"); }} data-testid="editButton">
                                {Applicationlabel.button.edit}
                                </Button>
                                </div>
                        </div>
                        <Grid container spacing={1}>
                            <Grid container item={true} xs={9} className="justify-content-left">
                                <Grid item xs={3} className="p-1 text-bold fw-semibold" >{Applicationlabel.companyDetails.companyName}</Grid>
                                <Grid item xs={1} className="p-1">:</Grid>
                                <Grid item xs={3} className="p-1">{companyInfo.companyName}</Grid>

                            </Grid>
                            <Grid container item={true} xs={9} className="justify-content-left" >
                                <Grid item xs={3} className="p-1 fw-semibold">{Applicationlabel.companyDetails.companyAddress}</Grid>
                                <Grid item xs={1} className="p-1">:</Grid>
                                <Grid item xs={3} className="p-1" >{companyInfo.companyAddress}</Grid>
                            </Grid>
                            <Grid container item={true} xs={9} className="justify-content-left" >
                                <Grid item xs={3} className="p-1 fw-semibold">{Applicationlabel.companyDetails.email}</Grid>
                                <Grid item xs={1} className="p-1">:</Grid>
                                <Grid item xs={3} className="p-1" >{companyInfo.email}</Grid>
                            </Grid>
                            <Grid container item={true} xs={9} className="justify-content-left" >
                                <Grid item xs={3} className="p-1 fw-semibold">{Applicationlabel.companyDetails.contactNo}</Grid>
                                <Grid item xs={1} className="p-1">:</Grid>
                                <Grid item xs={3} className="p-1" >{companyInfo.contactNumber}</Grid>
                            </Grid>
                            <Grid container item={true} xs={9} className="justify-content-left" >
                                <Grid item xs={3} className="p-1 fw-semibold">{Applicationlabel.companyDetails.noOfEmployee}</Grid>
                                <Grid item xs={1} className="p-1">:</Grid>
                                <Grid item xs={3} className="p-1" >{userCount}</Grid>
                            </Grid>
                            <Grid container item={true} xs={9} className="justify-content-left" >
                                <Grid item xs={3} className="p-1 fw-semibold">{Applicationlabel.companyDetails.fullDayTime}</Grid>
                                <Grid item xs={1} className="p-1">:</Grid>
                                <Grid item xs={3} className="p-1" >{companyInfo.fullDayTiming}</Grid>
                            </Grid>
                            <Grid container item={true} xs={9} className="justify-content-left" >
                                <Grid item xs={3} className="p-1 fw-semibold">{Applicationlabel.companyDetails.halfDayTime}</Grid>
                                <Grid item xs={1} className="p-1">:</Grid>
                                <Grid item xs={3} className="p-1" >{isNaN(companyInfo.fullDayTiming) ? companyInfo.halfDayTiming : companyInfo.fullDayTiming/2}</Grid>
                            </Grid>
                            <Grid container item={true} xs={9} className="justify-content-left" >
                                <Grid item xs={3} className="p-1 fw-semibold">{Applicationlabel.companyDetails.punchIn}</Grid>
                                <Grid item xs={1} className="p-1">:</Grid>
                                <Grid item xs={3} className="p-1" >{simplifyTime(companyInfo.regularWorkIn)}</Grid>
                            </Grid>
                            <Grid container item={true} xs={9} className="justify-content-left" >
                                <Grid item xs={3} className="p-1 fw-semibold">{Applicationlabel.companyDetails.punchOut}</Grid>
                                <Grid item xs={1} className="p-1">:</Grid>
                                <Grid item xs={3} className="p-1" >{ simplifyTime(companyInfo.regularWorkOut)}</Grid>
                            </Grid>
                            <Grid container item={true} xs={9} className="justify-content-left" >
                                <Grid item xs={3} className="p-1 fw-semibold">{Applicationlabel.companyDetails.noOfLeaves}</Grid>
                                <Grid item xs={1} className="p-1">:</Grid>
                                <Grid item xs={3} className="p-1" >{companyInfo.noOfLeaves}</Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Box>
            </Card>
        </>
    );
};
export default CompanyView;

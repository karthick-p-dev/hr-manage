import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import Applicationlabel from "../../common/en.json";
import leaveService from "../../helpers/Services/leave.service";

const Views = () => {
  const [View, setView] = useState<any>([]);
  console.log("View",View);
  const [noOfDays, SetNoOfDays] = useState<any>(0);
  const navigate = useNavigate();
  const { id } = useParams();

  function calcBusinessDays(dDate1: any, dDate2: any) {
    var iWeeks, iDateDiff, iAdjust = 0;
    if (dDate2 < dDate1) return -1;
    var iWeekday1 = dDate1.getDay();
    var iWeekday2 = dDate2.getDay();
    iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1;
    iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
    if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1;
    iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1;
    iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

    iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

    if (iWeekday1 <= iWeekday2) {
      iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
    } else {
      iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
    }

    iDateDiff -= iAdjust

    return (iDateDiff + 1);
  }



  async function getViews() {
    const getView = await leaveService.getByLeaveId(id);
    if (getView.status && getView.data) {

      var from = getView.data.fromDate.split("-").reverse().join("-");
      var to = getView.data.toDate.split("-").reverse().join("-");
      var date1 = new Date(from)
      var date2 = new Date(to);

      var days: any = calcBusinessDays(date1, date2)


      SetNoOfDays(days)

      setView(getView.data);
    }
  }

  useEffect(() => {
    getViews();
  }, []);

  return (
    <>
      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 autoe" }}>
            <div className="flex jc-sb al-c">
              <p
                style={{ float: "left", fontSize: "22px", fontWeight: 500 }}
                className="fw-bolder"
              >
                {Applicationlabel.leaveView.view}
              </p>
              <div className="action-btn">
                  <Button
                    className="btn-fill pull-right update-profile"
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
                    color="secondary"
                    onClick={() => navigate(-1)}
                  >
                    {Applicationlabel.button.back}
                  </Button>
                </div>

            </div>

            <Grid container spacing={2}>
              {/* image grid */}
              <Grid item md={6} lg={2}>
                <div>
                  <Box
                    component="img"
                    sx={{
                      height: 100,
                      width: 100,
                      float: "left",
                      maxHeight: { xs: 233, md: 167 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    src="/assets/images/avatars/5.jpg"
                  />
                </div>
              </Grid>
              {/* center grid */}
              <Grid item md={6} lg={10}>
                <Grid container spacing={2}>
                  {/* left data */}
                  <Grid item md={6} lg={6}>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.userName}</label>
                      <div>{View.user ? View.user.userName : ""}</div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.email}</label>
                      <div>{View.user ? View.user.email : ""}</div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.leaveType}</label>
                      <div>{View.request}</div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.fromDate}</label>
                      <div>{View.fromDate}</div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.toDate}</label>
                      <div>{View.toDate}</div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.fromTime}</label>
                      <div>{(View.request == (Applicationlabel.leaveView.fullday) || View.request == (Applicationlabel.leaveView.workFromHome) || View.request == (Applicationlabel.leaveView.halfDayFN) || View.request == (Applicationlabel.leaveView.halfdayAN)) ? "" : View.fromTime}</div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.toTime}</label>
                      <div>{(View.request == (Applicationlabel.leaveView.fullday) || View.request == (Applicationlabel.leaveView.workFromHome) || View.request == (Applicationlabel.leaveView.halfDayFN) || View.request == (Applicationlabel.leaveView.halfdayAN)) ? "" : View.toTime}</div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.feedback}</label>
                      <div>
                        {View.feedBack != null && View.feedBack != "" ? View.feedBack : "   -"}
                      </div>
                    </div>
                  </Grid>
                  {/* right data */}
                  <Grid item md={6} lg={6}>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.notes}</label>
                      <div>{View.notes != null && View.notes != "" ? View.notes : "   `-"}</div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.status}</label>
                      <div>{View.status}</div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.reason}</label>
                      <div>{View.reason}</div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.noOfDays}</label>
                      <div>{(View.request == (Applicationlabel.leaveView.fullday) || View.request == (Applicationlabel.leaveView.workFromHome) )? noOfDays : 0 || (View.request == (Applicationlabel.leaveView.halfDayFN) || View.request == (Applicationlabel.leaveView.halfdayAN) ) ? 0.5 : 0}
                      </div>
                    </div>
                    <div className="formgroup">
                      <label>{Applicationlabel.leaveView.approvedBy}</label>
                      <div>{View.approver ? View.approver.userName : ""}</div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Box>
      </Card>
    </>
  );
};
export default Views;

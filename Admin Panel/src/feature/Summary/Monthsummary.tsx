import React, { useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { GridColumns, GridRowsProp } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { Formik } from "formik";
import { Chart } from "react-google-charts";
import DataGridComponent from "../../common/datatable/DataGrid";
import MonthPicker from "../../common/date-picker/Monthpicker";
import { get } from "../../helpers/fetch-Service-Methods";
import { BASE_URL } from "../../config/config";
import ENDPOINT from "../../helpers/Api";

const Monthsummary = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [getSummary, setgetSummary] = useState<GridRowsProp>([]);
  const [Breakhours, setBreakhours] = useState(30);
  const [Workhours, setWorkhours] = useState(50);
  const data = [
    ["Task", "Hours per Day"],
    ["Break Hours", Breakhours],
    ["Work Hours", Workhours],
  ];
  const initialValues = {
    Date: new Date(),
  };
  const handleSubmit = () => {

  };

  async function handledatepicker(date: any) {
    const currday = new Date(date);
    let Dates;
    if ((currday.getMonth() + 1) < 10) {
       Dates = `0${currday.getMonth() + 1}-${currday.getFullYear()}`;
    } else {
       Dates = `${currday.getMonth() + 1}-${currday.getFullYear()}`;
    }
    const SUMMARY = await get(`${BASE_URL}${ENDPOINT.GET_SUMMARY}/${Dates}/${userinfo.companyId}`);
  if (SUMMARY.status) {
    const newvalue = SUMMARY.data;
      const alldata = newvalue.attendanceData;
      setBreakhours(parseInt(newvalue.totalBreakHoursForMonth, 10));
      setWorkhours(parseInt(newvalue.totalWorkingHoursForMonth, 10));
      const setvalue:any = [];
      alldata.map((attendance:any, index:any) => {
          const newdata:any = {
            id: index + 1,
            email: attendance.email as any,
            userName: attendance.userName,
            totalWorkingHours: attendance.totalWorkingHours,
            totalBreakHours: attendance.totalBreakHours,
          };
          setvalue.push(newdata);
          return setvalue;
      });
      setgetSummary(setvalue);
  }
}

  const columns: GridColumns = [
    {
      headerName: "No.",
      field: "id",
      editable: false,

    },
    {

      headerName: "User Name.",
      field: "userName",
      editable: false,

    },
    {
      headerName: "Email.",
      field: "email",
      editable: false,

    },
      {
        headerName: "Total work hours.",
        field: "totalWorkingHours",
        editable: false,

      },
    {
      headerName: "Total break hours.",
      field: "totalBreakHours",
      editable: false,

    },
  ];

return (
    <>
      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder" title="Holidays">MonthSummary</p>

            <br />
            <br />
            <br />
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {(formik) => {
                const { errors, touched } = formik;
                return (

                  <form className="row g-3" onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }} noValidate>
                    {/* <Grid container spacing={1}> */}
                      <div className="justify-content-around" >
                        <Grid container spacing={2}>
                          <Grid item xs={4} className="p-1">
                            <MonthPicker formValue={formik.values.Date} formik={formik} labelName="Date" inputFormat="MM-YYYY" fieldName="Date" errors={errors} touched={touched} disablePast={true} onChange={handledatepicker(formik.values.Date)} handleSubmit={false}/>

                          </Grid>
                          <Grid item xs={8} className="p-1 mtm95 8">
                          <Chart
      chartType="PieChart"
      data={data}
      // options={options}
      width={"100%"}
      height={"400px"}
    />

                          </Grid>
                        </Grid>
                      </div>
                    {/* </Grid> */}

                  </form>
                );
              }}
            </Formik>
            <DataGridComponent columns={columns} items={getSummary}/>
          </CardContent>
        </Box>
      </Card>
    </>
  );
};
export default Monthsummary;

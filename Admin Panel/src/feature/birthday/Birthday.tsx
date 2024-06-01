import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import DataTable from "react-data-table-component";
import { GridColumns, GridRowsProp } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Formik } from "formik";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DataGridComponent from "../../common/datatable/DataGrid";
import ENDPOINT from "../../helpers/Api";
import { BASE_URL } from "../../config/config";
import { get } from "../../helpers/fetch-Service-Methods";
import DataPicker from "../../common/date-picker/DataPicker";
import Applicationlabel from "../../common/en.json";

const Birthday = () => {
 // const [StartDate, setStartDate] = useState("");
  // const handleDateSelect = async (values: any) => {
  //   const current = new Date(values.target.value);
  //   const date = `${String(current.getDate()).padStart(2, "0")}-${String(current.getMonth() + 1).padStart(2, "0")}`;
  //  const getbirthday = await get(`${BASE_URL + ENDPOINT.TODAY_BIRTHDAY}/${date}/${userinfo.companyId}`);
  //   if (getbirthday.data && getbirthday.data) setgetAllBirthdays(getbirthday.data);
  // };
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [getAllBirthdays, setgetAllBirthdays] = useState<GridRowsProp>([]);
  async function getBirthdays(x:any = "") {
    // const duplicate = new Date();
    const duplicate = (x !== "") ? x : new Date();
    const date = `${String(duplicate.getDate()).padStart(2, "0")}-${String(duplicate.getMonth() + 1).padStart(2, "0")}`;
    const getbirthday = await get(`${BASE_URL + ENDPOINT.TODAY_BIRTHDAY}/${date}/${userinfo.companyId}`);
    // if (getbirthday.data && getbirthday.data) setgetAllBirthdays(getbirthday.data);
    if (getbirthday.data && getbirthday.data) {
      const birthday: any = [...getbirthday.data];
      for (let i = 0; i < getbirthday.data.length; i += 1) {
        birthday[i].index = i + 1;
      }
      setgetAllBirthdays(birthday);
    }
  }
   useEffect(() => {
    // getBirthdays();
  }, []);
  // const columns: any = [
  //   {
  //     name: "No.",
  //     selector: (row: any, index: any) => index + 1,
  //     grow: 0,
  //     // width: 150
  //   },
  //   {
  //     name: "Name",
  //     selector: (row: any) => <div>{row.userName ? row.userName : ""}</div>,
  //     // width: 150
  //   },
  //   {
  //     name: "Email",
  //     selector: (row: any) => <div>{row.email ? row.email : ""}</div>,

  //   },
  //   {
  //     name: "EmployeeId",
  //     selector: (row: any) => <div>{row.employeeId ? row.employeeId : ""}</div>,

  //   },
  //   {
  //     name: "DOB",
  //     selector: (row: any) => <div>{row.DOB ? row.DOB : ""}</div>,

  //     },
  //   {
  //     name: "Actions",
  //     button: true,
  //     cell: (row: any) => (row.id ? (
  //       <>send wishes
  //       <Send />
  //       </>
  //     ) : null),
  //   },
  // ];

  const renderDetailsButton = (e:any) => (
    <>
    {console.log("e", e)}
     <Button variant="outlined">{Applicationlabel.button.sendwishes}</Button>
    </>
  );

  const columns: GridColumns = [
    {

      headerName: "No.",
      field: "index",
      width: 100,
      editable: false,

    },
    {

      headerName: "EmployeeId.",
      field: "employeeId",
      width: 150,
      editable: false,

    },
    {

      headerName: "Email.",
      field: "email",
      width: 300,
      editable: false,

    },
    {

      headerName: "Name.",
      field: "userName",
      width: 150,
      editable: false,

    },
    {

      headerName: "DOB.",
      field: "DOB",
      width: 150,
      editable: false,

    },
    {

      headerName: "Actions.",
      field: "action",
      width: 200,
     renderCell: renderDetailsButton,
    },
  ];

  const handleSubmit = (values: any) => {
  const datenew:any = new Date(values.Date);
    getBirthdays(datenew);
  };
    const initialValues = {
    // userId: userinfo.id,
    // companyId: userinfo.companyId,
    Date: new Date(),
  };
  return (
    <>
    <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
          <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder" title="Birthdays">{Applicationlabel.birthdays.heading}</p>
          <br />
          <br />
          <br />
          {/* <div>
          <Grid container xs={4}>
            <TextField type="date" variant="standard" sx={{ width: 350 }} id="fromDate" value={StartDate} onSelect={handleDateSelect} onChange={(e: any) => setStartDate(e.target.value)} className="form-control" autoComplete="off" />
          </Grid>
          </div> */}
          <>
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
                  }}noValidate>
                        <Grid container spacing={1}>
                          <Grid item xs={6} className="p-1 w300 mb30">
                            <DataPicker formValue={formik.values.Date} formik={formik} labelName={Applicationlabel.birthdays.date} inputFormat="DD-MM-YYYY" fieldName="Date" errors={errors} touched={touched} disablePast={false} handleSubmit={true}/>
                          </Grid>
                          </Grid>
                            </form>
                            );
                          }}
                      </Formik>
                      </>
          {/* <DataTable
            columns={columns}
            data={getAllBirthdays}
            highlightOnHover
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            paginationComponentOptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
          /> */}
            <DataGridComponent columns={columns} items={getAllBirthdays}/>
          </CardContent>
          </Box>
          </Card>
        {/* </CCardBody></CCard> */}
    </>
  );
};

export default Birthday;

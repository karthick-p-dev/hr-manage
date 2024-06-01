import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import { DataGrid, GridColumns, GridRowParams, GridSelectionModel } from "@mui/x-data-grid";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import designationservice from "../../../helpers/Services/designation.service";

const AddDesignation = () => {
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
    const initialValues :any = {};

    const [positionLists, setPositionList] = useState<any>([]);
    const [roleLists, setRoleLists] = useState<any>([
      { name: "My Leaves", isVisible: true, isDisable: true, id: 1 },
      { name: "My Attendance", isVisible: true, isDisable: true, id: 2 },
      { name: "Create Timesheet", isVisible: true, isDisable: true, id: 3 },
      { name: "My timesheet", isVisible: true, isDisable: true, id: 4 },
      { name: "All user", isVisible: false, isDisable: false, id: 5 },
      { name: "Timesheet Control", isVisible: false, isDisable: false, id: 6 },
      { name: "Requested Leaves", isVisible: false, isDisable: false, id: 7 },
      { name: "Team Leaves", isVisible: false, isDisable: false, id: 8 },
      { name: "Add user", isVisible: false, isDisable: false, id: 9 },
      { name: "Holidays", isVisible: true, isDisable: true, id: 10 },
      { name: "Birthday", isVisible: true, isDisable: true, id: 11 },
      { name: "Official Info", isVisible: true, isDisable: true, id: 12 },
      { name: "Summary", isVisible: true, isDisable: true, id: 13 },
      { name: "Profile", isVisible: true, isDisable: true, id: 14 },
      { name: "Add Holiday", isVisible: false, isDisable: false, id: 15 },
    ]);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel >([]);
    const desinationSchema = yup.object().shape({
      parentId: yup.string().required("Parent Designation is required"),
      name: yup.string().required("Designation Name is required"),
    });

    const navigate = useNavigate();
    async function getPositionsDetails() {
        const response = await designationservice.getPositions(userinfo.companyId);
        const tempValue:any = roleLists?.filter((r: any) => r.isDisable).map((r:any) => r.id);
        setSelectionModel(tempValue);
        setPositionList(response.data);
      }

    useEffect(() => {
        getPositionsDetails();
    }, []);
    const gridColumns: GridColumns = [
        {
          field: "id", headerName: "No",
        },
        {
          field: "name", headerName: "Modules", width: 350,
        },
      ];

    const handleSubmit = async (values: any) => {
        const senddata = {
          companyId: userinfo.companyId,
          name: values.name,
          parentId: values.parentId,
          permissionJson: JSON.stringify(roleLists),
          topPosition: true,
        };
        const response = await designationservice.createDesignation(senddata);
        if (response.data) {
          if (response.data) {
            navigate("/positions");
        }
        }
      };
      const handleChange = (newValue: any) => {
        console.log("newValue", newValue);
      };

    const handleDataGridChange = (e:any) => {
      setSelectionModel(e);
      const temproleList = [...roleLists];
      for (let i = 0; i < temproleList.length; i += 1) {
        if (e.includes(temproleList[i].id)) {
          temproleList[i].isVisible = true;
        } else {
          temproleList[i].isVisible = false;
        }
       }
      setRoleLists(temproleList);
    };
  return (
    <div >
        <div className="App">
        <Card>
        <div className="justify-content-left">
        <Grid item xs={10} md={10} >
        <p style={{ float: "left", margin: 20, fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Add Designation </p>
        </Grid>
        <Grid item xs={2} md={2}>
            <Button style={{ float: "right", margin: 10, backgroundColor: "#673ab7", color: "#ffffff" }} variant="text" onClick={() => { navigate("/positions"); }} className="mb-3">
                Back
            </Button>
        </Grid>
        <br/>
        <br />

      </div>
      <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={desinationSchema}
            >
              {(formik) => {
                const { errors, touched } = formik;
                return (

                  <form className="row g-3" onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }} noValidate>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={12} className="p-1">
                          <TextField variant="standard" id="parentId"
                            select onChange={
                            (e: any) => {
                              handleChange(e.target.value);
                              formik.setFieldValue("parentId", e.target.value);
                            }}
                            name="parentId" label="Select Parent Designation*" className={
                              errors.request && touched.request
                                ? "form-control input-error mt-1"
                                : "form-control"
                            } autoComplete="off">
                            <MenuItem value="">Choose Leave Type</MenuItem>
                            {positionLists.map((item: any, i: any) => <MenuItem value={item.parentId} key={i}>{item.name}</MenuItem>)}
                           </TextField>
                          <ErrorMessage
                            name="parentId"
                            component="span"
                            className="error"
                          />{" "}

                        </Grid>
                          <Grid item xs={12} md={12} className="p-1">
                          <TextField variant="standard" onChange={formik.handleChange} type="text" id="name" name="name" autoComplete="off"
                            value={formik.values.name ? formik.values.name : ""} label="Designation Name*"
                            className={
                                errors.name && touched.name
                                    ? "form-control input-error  mt-1"
                                    : "form-control"
                            }>
                            </TextField>
                            <ErrorMessage
                                name="name"
                                component="span"
                                className="error"
                            />
                          </Grid>
                    </Grid>
                    <br />
                    <div style={{ height: 700, width: "100%" }}>
                    <DataGrid
                      checkboxSelection
                      rows={roleLists}
                      columns={gridColumns}
                      selectionModel={selectionModel}
                      isRowSelectable={(params: GridRowParams) => params.row.isDisable === false}
                      onSelectionModelChange={(e) => { handleDataGridChange(e); }}/>
                      </div>
                    <br/>
                    <br/>
                    <Grid item xs={12} className="p-1">
                        <div className="action-btn">
                          <Button
                            className="btn-fill pull-right"
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                              navigate("/positions");
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
                  </form>
                );
              }}
            </Formik>
        <br />
      </Card>
      </div>
    </div>
  );
};

export default AddDesignation;

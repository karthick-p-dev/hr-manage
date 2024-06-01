import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import { DataGrid, GridColumns, GridRowParams, GridSelectionModel } from "@mui/x-data-grid";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import designationservice from "../../../helpers/Services/designation.service";

const EditDesignation = () => {
    const { id } = useParams();
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
    const [initialValues, setInitialValues] = useState<any>({
        parentId: "",
        name: "",
    });
    const [positionLists, setPositionList] = useState<any>([]);
    const [roleLists, setRoleLists] = useState<any>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
    const desinationSchema = yup.object().shape({
        parentId: yup.string().required("Parent Designation is required"),
        name: yup.string().required("Designation Name is required"),
    });

    const navigate = useNavigate();
    async function getPositionsDetails() {
        const response = await designationservice.getPositions(userinfo.companyId);
        setPositionList(response.data);
      }
      async function getPositionById() {
        const response = await designationservice.getPositionDetailsById(id);
        const roles = JSON.parse(response.data.permissionJson);
        for (let i = 0; i < roles.length; i += 1) {
          // -Object.prototype.hasOwnProperty.call(roles[i], "id")
            if (!Object.prototype.hasOwnProperty.call(roles[i], "id")) {
                roles[i].id = i + 1;
            }
        }
        setInitialValues(response.data);
       const tempValue:any = roles?.filter((r: any) => r.isVisible).map((r:any) => r.id);
        setSelectionModel(tempValue);
        setRoleLists(roles);
      }

    useEffect(() => {
        getPositionsDetails();
        getPositionById();
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
          id,
          parentId: values.parentId,
          permissionJson: JSON.stringify(roleLists),
          topPosition: true,
        };
        const response = await designationservice.updateDesignation(senddata);
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
        <p style={{ float: "left", margin: 20, fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Edit Designation </p>
        </Grid>
        <Grid item xs={2} md={2}>
            <Button style={{ float: "right", margin: 10, backgroundColor: "#673ab7", color: "#ffffff" }} variant="text" onClick={() => { navigate("/positions"); }} className="mb-3">
                Back
            </Button>
        </Grid>
        <br/>
        <br />
      </div>
      {initialValues
      ? <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              enableReinitialize
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
            </Formik> : ""}
        <br />
      </Card>
      </div>
    </div>
  );
};

export default EditDesignation;

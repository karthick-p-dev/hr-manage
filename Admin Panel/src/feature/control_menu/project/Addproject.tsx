import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Delete from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import { GridActionsCellItem } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import SimpleSnackbar from '../../../common/toaster/toast';
import Applicationlabel from "../../../common/en.json";
import { post } from "../../../helpers/fetch-Service-Methods";
import DataGridComponent from "../../../common/datatable/DataGrid";
import { BASE_URL } from "../../../config/config";
import ENDPOINT from "../../../helpers/Api";
import "../../../App.css";
import DataPicker from "../../../common/date-picker/DataPicker";
import projectService from "../../../helpers/Services/projects.service";

const Addproject = () => {
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
  );
  var startdate: any, enddate: any;
  // const [open, setOpen] = useState<any>(false);
  // const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  //   props,
  //   ref
  // ) {
  //   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  // });

  const initialValues: any = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    name: "",
    code: "",
    start_date: "",
    end_date: "",
    managerId: "",
    teamleaderId: "",
    customer_id: "1",

  };
  const [projectManager, setProjectmanager] = useState<any>([]);
  const [teamLeader, setTeamleader] = useState<any>([]);
  const [teamList, setTeamlist] = useState<any>([]);
  const [project, setProject] = useState<any>(initialValues);
  const [date,setDate] = useState("");
  const [open, setOpen] = useState(false);
  const [opend, setOpend] = useState(false);
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  async function getFullTeamList() {
    // const listteammember = await get(`${BASE_URL + ENDPOINT.GETALL_PROJECTMEMBER}/${userinfo.companyId}/${id}`);
    const fullteamlist = await projectService.getFullTeamList(userinfo, id);
    if (fullteamlist.status && fullteamlist.data) setTeamlist(fullteamlist.data);
    const teamlist: any = [...fullteamlist.data]
    const b: any = [...teamlist].map((t: any, index: any) => {
      t.index = index + 1;
      return t;
    });
    setTeamlist(b);
  }
  async function getProjectDetails() {
    if (id) {
      const projectdetails = await projectService.getProjectDetails(userinfo, id);
      // var projectDetails = await get(`${BASE_URL + "/projects/getbyid"}/${id}`);
      if (projectdetails && projectdetails.data) setProject({ ...project, ...projectdetails.data });
    }
  }
  async function getTeamLeader() {
    // const listteamleader = await get(`${BASE_URL + ENDPOINT.GETALL_TEAMLEADER}/${userinfo.companyId}`);
    const teamleader = await projectService.getUser(userinfo);
    if (teamleader.status && teamleader.data) setTeamleader(teamleader.data);
  }

  async function getProjectmanager() {
    const projectManagerResult = await projectService.getProjectManager(userinfo);
    if (projectManagerResult.status && projectManagerResult.data) setProjectmanager(projectManagerResult.data);
  }

  const handleSubmit = async (values: any) => {

    // if(values.start_date && !values.start_date.$d){
    //   startdate = new Date(values.start_date.split("T")[0].split("-")[1]+"/"+values.start_date.split("T")[0].split("-")[2]+"/"+values.start_date.split("T")[0].split("-")[0])
    // }
    // else{
    //   startdate = values.start_date.$d;
    // }
    // if(values.end_date && !values.end_date.$d){
    //   enddate = new Date(values.end_date.split("T")[0].split("-")[1]+"/"+values.end_date.split("T")[0].split("-")[2]+"/"+values.end_date.split("T")[0].split("-")[0])
    // }
    // else
    // {
    //   enddate = values.end_date.$d;
    // }

    // if(enddate.getDate() > startdate.getDate()){
    //   alert('end date must be greater than start date');
    //   return true;
    // }
    // if (values.start_date && values.start_date.$d) {
    //   values.start_date = `${values.start_date.$d.getFullYear()}-${String(values.start_date.$d.getMonth() + 1).padStart(2, "0")}-${String(values.start_date.$d.getDate()).padStart(2, "0")}`;
    // }
    // if (values.end_date && values.end_date.$d) {
    //   values.end_date = `${values.end_date.$d.getFullYear()}-${String(values.end_date.$d.getMonth() + 1).padStart(2, "0")}-${String(values.end_date.$d.getDate()).padStart(2, "0")}`;

    // }
    // values.start_date = `${values.start_date.$d.getFullYear()}-${String(values.start_date.$d.getMonth() + 1).padStart(2, "0")}-${String(values.start_date.$d.getDate()).padStart(2, "0")}`;
    // values.end_date = `${values.end_date.$d.getFullYear()}-${String(values.end_date.$d.getMonth() + 1).padStart(2, "0")}-${String(values.end_date.$d.getDate()).padStart(2, "0")}`;
    // if (values.start_date > values.end_date) {
    //   alert('end date must be greater than start date');
    //   return true;
    // }
    if (id) {
      const response = await post(BASE_URL + ENDPOINT.UPDATE_PROJECT, values);
      if (response.status && response.data) {
        setToast(true);
        setMessage(Applicationlabel.toast.updateProjectSuccess);
        setTimeout(() => {
          navigate("/projects");
        }, 1000);
        // setOpen(true);
      }
      return false;
    } else {
      const response = await post(BASE_URL + ENDPOINT.CREATE_PROJECT, values);
      if (response.status && response.data) {
        setToast(true);
        setMessage(Applicationlabel.toast.addProjectSuccess);
        setTimeout(() => {
          navigate("/projects");
        }, 1000);
      }
      return false;
    }
  };

  const handleChange = (newValue: any) => {
    console.log("newValue---->", newValue);
  };

  useEffect(() => {
    getProjectmanager();
    getTeamLeader();
    getFullTeamList();
    getProjectDetails();
  }, []);

  const columns: any = [
    {
      headerName: Object.values(Applicationlabel.gridHeader.sno),
      field: "index",
      editable: false,
      hideable: false,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.email),
      field: "user",
      valueGetter: (params: any) => params.row.user?.email,
      editable: false,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.name),
      field: "userName",
      valueGetter: (params: any) => params.row.user?.userName,
      editable: false,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.empId),
      field: "employeeId",
      valueGetter: (params: any) => params.row.user?.employeeId,
      editable: false,
    },
    {
      headerName: "Actions",
      field: "actions",
      renderCell: (row: any) => (row.id ? (
        <>
          <Tooltip title="Delete">
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={() => {
                projectService.deleteProjectMember({ id: row.id })
                  .then((res) => {
                    if (res.status) getFullTeamList();
                  });
                  setToast(true);
                  setMessage(Applicationlabel.toast.DeleteProjectMember);
              }}
              color="error"
            />
          </Tooltip>
        </>
      ) : null),
    },
  ];

  const SignInSchema = Yup.object().shape({
    name: Yup.string().trim()
      .min(2, Applicationlabel.addProjectSchema.projectNameShort)
      .required(Applicationlabel.addProjectSchema["projectNameRequired "]),

    code: Yup.string()
      .trim().required(Applicationlabel.addProjectSchema.projectCode),

    // start_date: Yup.date().required("Start Date is required"),

    // end_date: Yup.date().required("End Date is required"),

    managerId: Yup.string().trim().required(Applicationlabel.addProjectSchema.projectManager),

    teamleaderId: Yup.string().trim().required(Applicationlabel.addProjectSchema.projectLeader),
  });

  // const handleClose = (
  //   event?: React.SyntheticEvent | Event,
  //   reason?: string,
  // ) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };
  return (
    <>
      <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      {project && project.teamleader && project.teamleader.email && console.log(project.teamleader.email)}
      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <div className="flex jc-b al-c">
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.Addproject.addProjectTitle}</p>
            <div className="action-btn">
              <Button
                className="btn-fill pull-right update-profile"
                style={{ backgroundColor: "#049FD9", color: "#ffffff" }} 
                type="submit"
                variant="contained"
                color="secondary"
                onClick={() => {
                  navigate("/projects");
                }}
              >
                {Applicationlabel.button.back}
              </Button>
            </div>
            </div>
            <br />
            <br />
            <br />
            <Formik
              initialValues={project}
              onSubmit={handleSubmit}
              validationSchema={SignInSchema}
              enableReinitialize
            >
              {(formik: any) => {
                const { errors, touched } = formik;

                return (

                  <form className="row g-3" onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }} noValidate>
                    <Grid container spacing={3}>
                      <Grid item xs={6} className="p-1 ">
                        <TextField variant="standard" sx={{ width: 350 }} value={formik.values.name ? formik.values.name : ""}
                          onChange={formik.handleChange}
                          // {(e: any) => {
                          //   let flag = true;
                          //   for (let i = 0; i < e.target.value.length; i += 1) {
                          //     if (!(new RegExp(/[a-zA-Z]/).test(e.target.value[i]))) {
                          //       flag = false;
                          //     }
                          //   }
                          //   if (flag) { formik.setFieldValue("name", e.target.value); } else { e.preventDefault(); }
                          // }}
                          type="text" id="name" name="name" label={Applicationlabel.Addproject.ProjectName}
                          className="form-control" autoComplete="off" />
                        <ErrorMessage
                            name="name"
                            component="span"
                            className="error"
                          />{" "}
                      </Grid>
                      <Grid item xs={6} className="p-1">
                        <TextField variant="standard" sx={{ width: 350 }} value={formik.values.code ? formik.values.code : ""}
                          onChange={formik.handleChange} type="text" id="code" name="code" label={Applicationlabel.Addproject.projectCode} className="form-control" autoComplete="off" />
                        <ErrorMessage
                          name="code"
                          component="span"
                          className="error"
                        />{" "}
                      </Grid>
                      <Grid item xs={6} className="p-1 mw350c">
                        <DataPicker  formik={formik} formValue={formik.values.start_date ? formik.values.start_date : null}
                          labelName={Applicationlabel.Addproject.startDate} inputFormat="DD-MM-YYYY"  fieldName="start_date" errors={errors} 
                          touched={touched} disablePast={false} readOnly={true} 
                          open={open}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)} 
                            onClick={() => setOpen(true)} handleSubmit={false} />
                        <ErrorMessage
                          name="start_date"
                          component="span"
                          className="error"
                        />{" "}

                      </Grid>

                      <Grid item xs={6} className="p-1 mw350c">
                        <DataPicker  formik={formik} formValue={formik.values.end_date ? formik.values.end_date : null}
                          labelName={Applicationlabel.Addproject.endDate} inputFormat="DD-MM-YYYY" fieldName="end_date" 
                          errors={errors} touched={touched} minDate={formik.values.start_date} handleSubmit={false} 
                          readOnly={true} 
                          open={opend}
                            onOpen={() => setOpend(true)}
                            onClose={() => setOpend(false)} 
                            onClick={() => setOpend(true)} />
                        <ErrorMessage
                          name="end_date"
                          component="span"
                          className="error"
                        />{" "}
                      </Grid>
                      <Grid item xs={6} className="p-1">
                        <TextField variant="standard" sx={{ width: 350 }} id="managerId" 
                          select onChange={
                            (e: any) => {
                              handleChange(e.target.value);
                              formik.setFieldValue("managerId", e.target.value);
                            }}
                          name="managerId" value={formik.values.managerId}
                          label="Project Manager" className={
                            errors.managerId && touched.managerId
                              ? "form-control input-error mt-1"
                              : "form-control"
                          } autoComplete="off">
                          <MenuItem value="">{Applicationlabel.Addproject.SelectProjectManager}</MenuItem>

                          {projectManager.map((name: any, i: any) => <MenuItem value={name.id} key={i}>{name.email}</MenuItem>)}
                        </TextField>
                        <ErrorMessage
                          name="managerId"
                          component="span"
                          className="error"
                        />{" "}

                      </Grid>
                      <Grid item xs={6} className="p-1">
                        <TextField variant="standard" sx={{ width: 350 }} id="teamleaderId"
                          select onChange={
                            (e: any) => {
                              handleChange(e.target.value);
                              formik.setFieldValue("teamleaderId", e.target.value);
                            }}
                          name="teamleaderId" value={formik.values.teamleaderId}
                          label="Team Leader" className={
                            errors.teamleaderId && touched.teamleaderId
                              ? "form-control input-error mt-1"
                              : "form-control"
                          } autoComplete="off">
                          <MenuItem value="">{Applicationlabel.Addproject.SelectProjectLeader}</MenuItem>

                          {teamLeader.map((name: any, i: any) => <MenuItem value={name.id} key={i}>{name.email}</MenuItem>)}</TextField>
                        <ErrorMessage
                          name="teamleaderId"
                          component="span"
                          className="error"
                        />{" "}

                      </Grid>
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <Grid item xs={12} className="p-1">
                        <div className="action-btn">
                          <Button
                            className="btn-fill pull-right update-profile"
                            style={{ backgroundColor: "#049FD9", color: "#ffffff" }} 
                            type="submit"
                            variant="contained"
                            color="secondary"
                          >
                            {Applicationlabel.button.submit}
                          </Button>&nbsp;&nbsp;

                          <Button
                            className="btn-fill pull-right"
                            style={{ backgroundColor: "white", border: "1px solid #049FD9" , color: "#049FD9"}}
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                              navigate("/projects");
                            }}
                          >
                            {Applicationlabel.button.cancel}
                          </Button>
                          {/* <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                              This is a success message!
                            </Alert>
                          </Snackbar> */}
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
      {id
        && <Card sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.Addproject.projectMemberTitle}</p>
              <br />
              <br />
              <br />
              {(teamList.length !== 0)
                && <DataGridComponent columns={columns} items={teamList} />
              }

              {/* <DataTable
              columns={columns}
              data={teamList}
              highlightOnHover
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
            /> */}
            </CardContent>
          </Box>
        </Card>
      }
    </>
  );
};
export default Addproject;

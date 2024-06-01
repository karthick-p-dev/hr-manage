import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import DataTable from "react-data-table-component";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Delete from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
// import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import SimpleSnackbar from '../../../common/toaster/toast';
import Applicationlabel from "../../../common/en.json";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
// import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { GridActionsCellItem } from "@mui/x-data-grid";
import DataGridComponent from "../../../common/datatable/DataGrid";
import { BASE_URL } from "../../../config/config";
import { post } from "../../../helpers/fetch-Service-Methods";
import projectService from "../../../helpers/Services/projects.service";

const Projects = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [projects, setProjects] = useState<any>([]);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const inputHandler = (e: any) => {
    const lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };
  const filteredData = projects.filter((el: any) => {
    if (searchText === "") {
      return el;
    }

    return (el.code.toLowerCase().includes(searchText) || el.name.toLowerCase().includes(searchText));
  });
  const navigate = useNavigate();
  async function getProjectDetails() {
    // const projectDetails = await get(`${BASE_URL + ENDPOINT.GETALL_PROJECT}/${userinfo.companyId}`);
    const projectDetails = await projectService.getAllProject(userinfo);
    console.log("projectDetails",projectDetails)
    if (projectDetails.status && projectDetails.data) {
      (projectDetails.data).reverse().map((item: any, index: any) => {
        item.index = index + 1;
        item.startdate = changeDateFormat(item.start_date);
        item.enddate = changeDateFormat(item.end_date);
       
        return item;
      });
      setProjects(projectDetails.data);
    }
  }
  function changeDateFormat(value:any){
    const splitdate = value.split("T");
   return splitdate[0].split("-").reverse().join("-")
}
  useEffect(() => {
    getProjectDetails();
  }, []);
  const columns: any = [
    {
      headerName: Object.values(Applicationlabel.gridHeader.sno),
      field: "index",
      editable: false,
      width: 110,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.projectCode),
      field: "code",
      editable: false,
      width: 130,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.projectTitle),
      field: "name",
      editable: false,
      width: 150,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.startDate),
      field: "startdate",
      editable: false,
      width: 150,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.endDate),
      field: "enddate",
      editable: false,
      width: 150,  
     },
    {
      headerName: Object.values(Applicationlabel.gridHeader.ProjectManager),
      field: "manager",
      valueGetter: (params: any) => params.row?.manager?.email,
      editable: false,
      width: 250,  
     },
    {
      headerName: "Project Leader",
      field: "teamleader",
      valueGetter: (params: any) => params.row?.teamleader?.email,
      editable: false,
      width: 250,  
    },
    {
      headerName: "Actions",
      field: "actions",
      sortable: false,
      renderCell: (row: any) => (row.id ? (
        <>
          <Tooltip title="Edit">
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => navigate(`/projects/edit/${row.id}`)}
              color="primary"
            />
          </Tooltip>
          <Visibility
            onClick={() => {
              navigate(`/projects/view/${row.id}`);
            }}
            color="success"
          />
          <Tooltip title="Delete">
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={async () => {
                const response = await post(`${`${BASE_URL}/projects/deleteproject`}`, { id: row.id });
                if (response.status) {
                  getProjectDetails();
                }
                setToast(true);
                setMessage(Applicationlabel.toast.deleteProjectSuccess);
              }}
              color="error"
            />
          </Tooltip>
        </>
      ) : null),
    },
  ];
  return (
    <>
      <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder" title="Projects">{Applicationlabel.Project.Projects}</p></div>
              <div className="search">
                <TextField
                  id="standard-basic"
                  onChange={inputHandler}
                  variant="standard"
                  fullWidth
                  label="Search"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div>

                <Button variant="contained" style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
                  data-testid="assignProject" onClick={() => { navigate("/projects/assign"); }}>{Applicationlabel.button.assignProject}</Button>&nbsp;&nbsp;&nbsp;
                <Button variant="contained" data-testid="addProject" style={{ marginLeft: "-5px" ,backgroundColor: "#049FD9", color: "#ffffff" }} onClick={() => { navigate("/projects/add"); }}>{Applicationlabel.button.addProject}</Button>
              </div>

            </div>
            <br />
            <br />
            <br />
            <DataGridComponent columns={columns} items={filteredData} />

            {/* <DataTable
                  columns={columns}
                  data={filteredData}
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
    </>
  );
};

export default Projects;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import DataTable from "react-data-table-component";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Delete from "@mui/icons-material/Delete";
// import Edit from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
// import FormGroup from "@mui/material/FormGroup";
import { GridActionsCellItem } from "@mui/x-data-grid";
// import { responsiveFontSizes } from "@mui/material";
import DataGridComponent from "../../common/datatable/DataGrid";
// import FormControl from "@mui/material/FormControl";
// import Visibility from "@mui/icons-material/Visibility";
import { BASE_URL } from "../../config/config";
import { post } from "../../helpers/fetch-Service-Methods";
import tasktypeService from "../../helpers/Services/tasktype.service";

const Tasktype = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [alltasktypes, setAlltasktypes] = useState<any>([]);
const navigate = useNavigate();
  async function getTasks() {
    const gettasks = await tasktypeService.getAllTaskType(userinfo.companyId);
    // get(`${BASE_URL + ENDPOINT. GETALL_TASKTYPE}/${userinfo.companyId}`);
    if (gettasks.data && gettasks.data) setAlltasktypes(gettasks.data);
  }
  useEffect(() => {
    getTasks();
  }, []);

  const columns: any = [
    {
      headerName: "No.",
      field: "id",
      editable: false,
      // grow: 0,
      // width: 150
    },
    {
      headerName: "Task Type Code",
      field: "Task Type Code",
      valueGetter: (params: any) => params.row?.code,
      editable: false,
      // width: 150
    },
    {
      headerName: "Task Type",
      field: "Task Type",
      valueGetter: (params: any) => params.row?.name,
      editable: false,
    },
    {
      headerName: "Status",
      field: "status",
      renderCell: () => (<Switch defaultChecked color="warning" />),
    },
    {
      headerName: "Actions",
      renderCell: (row: any) => (row.id ? (
        <>
        <Tooltip title="Edit">
         <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => navigate(`/tasktype/edit/${row.id}`)}
          color="primary"
        />
        </Tooltip>
        <GridActionsCellItem
                icon={ <Delete />}
                label="Delete"
                onClick={async () => {
                 const response = await post(`${`${BASE_URL}/tasktype/deletetasktype`}`, { id: row.id });
                 if (response.status) {
                  getTasks();
                //   setOpen(true);
                 }
                }}
                color="error"
              />
        </>
      ) : null),

    },
  ];
  return (
    <>
      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Task Type</p>
            <br />
            <br />
            <br />
            <Button variant="contained" data-testid="assignProject" onClick={() => { navigate("/tasktype/add"); }}>Add Task Type</Button>

            <DataGridComponent columns={columns} items={alltasktypes}/>

            {/* <DataTable
              columns={columns}
              data={alltasktypes}
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
export default Tasktype;

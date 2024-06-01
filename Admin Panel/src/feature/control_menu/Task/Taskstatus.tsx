import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Search from "@mui/icons-material/Search";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Delete from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
// import DataTable from "react-data-table-component";
import { GridActionsCellItem } from "@mui/x-data-grid";
import DataGridComponent from "../../../common/datatable/DataGrid";
import taskService from "../../../helpers/Services/task.service";
import ENDPOINT from "../../../helpers/Api";
import { BASE_URL } from "../../../config/config";
import { get } from "../../../helpers/fetch-Service-Methods";

const Taskstatus = () => {
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
    const [taskstatus, setTaskstatus] = useState<any>([]);
    const [search, setSearch] = useState<any>("");
    const navigate = useNavigate();
    async function getTaskstatusDetails() {
        const TaskstatusDetail = await get(`${BASE_URL + ENDPOINT.GETALL_TASKSTATUS}/${userinfo.companyId}`);
        if (TaskstatusDetail.status && TaskstatusDetail.data) {
          (TaskstatusDetail.data).map((item:any, index:any) => {
              item.index = index + 1;
              return item;
          });
          setTaskstatus(TaskstatusDetail.data);
        }
      }
      useEffect(() => {
        getTaskstatusDetails();
      }, []);
    //   const columns: any = [
    //     {
    //       name: "ID.",
    //       selector: (row: any, index: any) => index + 1,
    //       grow: 0,
    //     },
    //     {
    //         name: "Task Status Name",
    //         selector: (row: any) => <div>{row.name ? row.name : ""}</div>,
    //       },
    //       {
    //         name: "Actions",
    //         button: true,
    //         cell: (row: any) => (row.id ? (
    //           <>
    //            <GridActionsCellItem
    //             icon={<EditIcon />}
    //             label="Edit"
    //             onClick={() => navigate(`/tasks/status/edit/${row.id}`)}
    //             color="primary"
    //           />
    //            <Delete onClick={() => {
    //            taskService.deletetaskstatus(row.id);// navigate("/leaves/myleaves")
    //            getTaskstatusDetails();
    //         }} />
    //           </>
    //         ) : null),
    //       },
    // ];

    const columns: any = [
      {
        headerName: "ID.",
        field: "index",
        editable: false,
      },
      {
        headerName: "Task Status Name",
        field: "name",
        editable: false,
        // width: 150
      },

      {
        headerName: "Actions",
        renderCell: (row: any) => (row.id ? (
          <>
           <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => navigate(`/tasks/status/edit/${row.id}`)}
            color="primary"
          />
          <GridActionsCellItem
            icon={ <Delete />}
            label="Delete"
            onClick={async () => {
              await taskService.deletetaskstatus(row.id);// navigate("/leaves/myleaves")
              getTaskstatusDetails();
            }}
            color="error"
          />
          </>
        ) : null),
      },
    ];

    const [showenties, setShowenties] = React.useState("10");

  const handleChange = (event:any) => {
    setShowenties(event.target.value as string);
  };
    const searchIn = (e:any) => {
        const a = e.target.value.toLowerCase();
   // e.target.value
   setSearch(a);
    };
   const searched = taskstatus
   .filter((searchitem:any, index:any) => {
    if (index < Number(showenties) && search === "") {
        return searchitem;
    }
     if (search !== "") {
        return (searchitem.name.toLowerCase().includes(search));
    }
    return null;
});

    return (
       <>
       <Card sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 autoe" }}>
                  <div style= {{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Task Status List</p></div>
                <div>
                <InputLabel id="demo-simple-select-label"style= {{ marginRight: "900px" }}>showenties</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          style= {{ marginRight: "400px" }}
          value={showenties}
          label="show enties"
          onChange={handleChange}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
        </Select>
                <TextField className="me-sm-2" variant="standard"sx={{ width: 350 }} name="username" id="userid" placeholder="" label="Search "
                aria-describedby="basic-addon2" onChange={searchIn}/>
                <Search/>
                <Button variant="contained" style={{ marginLeft: "-5px" }} onClick={() => { navigate("/task/status/add"); }}>Add Status</Button>
                </div>
                </div>
                <br />
                <br />
                <br />

                <DataGridComponent columns={columns} items={searched}/>
                {/* <DataTable
                  columns={columns}
                  data={searched}
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
    export default Taskstatus;

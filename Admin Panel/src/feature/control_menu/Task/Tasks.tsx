import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
 import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Search from "@mui/icons-material/Search";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Delete from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import { GridColumns, GridRowsProp, GridActionsCellItem } from "@mui/x-data-grid";
import DataGridComponent from "../../../common/datatable/DataGrid";
import taskService from "../../../helpers/Services/task.service";
import ENDPOINT from "../../../helpers/Api";
import { BASE_URL } from "../../../config/config";
import { get } from "../../../helpers/fetch-Service-Methods";
import Applicationlabel from "../../../common/en.json";

const Tasks = () => {
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
    const [task, setTask] = useState<GridRowsProp>([]);
    const [search, setSearch] = useState<any>("");
    const [showenties, setShowenties] = React.useState("10");
    const navigate = useNavigate();
    async function getTasksDetails() {
        const TaskDetail = await get(`${BASE_URL + ENDPOINT.GETALL_TASKLIST}/${userinfo.companyId}`);
        if (TaskDetail.data && TaskDetail.data)setTask(TaskDetail.data);
      }
      const renderDetailsButton = (e:any) => (
          <>
           <Tooltip title="Edit">
           <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => navigate(`/tasks/edit/${e.row.id}`)}
            color="primary"
          />
          </Tooltip>

          <Tooltip title="Delete">
           <Delete onClick={() => {
           taskService.deletetask(e.row.id);
           getTasksDetails();
        }}
        color="error"/>
        </Tooltip>
          </>
        );
      useEffect(() => {
        getTasksDetails();
      }, []);
      const columns: GridColumns = [
        {
          headerName: "No.",
          field: "id",
          editable: false,
          width: 60,
        },
        {
          headerName: "Project",
          field: "project.name",
          editable: false,
          valueGetter: (params:any) => params.row.project.name,
          width: 150,
          },
          {
            headerName: "Sprint",
            field: "sprint.sprint_name",
            editable: false,
            valueGetter: (params:any) => (params.row.sprint != null ? params.row.sprint.sprint_name : ""),
            width: 150,
          },
          {
            headerName: "Task Type",
            field: "task_type.name",
            editable: false,
            valueGetter: (params:any) => params.row.task_type.name,
            width: 120,
          },
          {
            headerName: "Task Title",
            field: "title",
            editable: false,
            valueGetter: (params:any) => params.row.title,
            width: 150,
          },
          {
            headerName: "Task Code",
            field: "task_code",
            editable: false,
            valueGetter: (params:any) => params.row.task_code,
            width: 100,
          },
          {
            headerName: "Story Points",
            field: "story_points",
            editable: false,
            valueGetter: (params:any) => params.row.story_points,
            width: 100,
          },
          {
            headerName: "Estimated Hours",
            field: "estimated_hours",
            editable: false,
            valueGetter: (params:any) => params.row.estimated_hours,
            width: 120,
          },
          {
            headerName: "Actual Hours",
            field: "actual_hours ",
            editable: false,
            valueGetter: (params:any) => params.row.actual_hours,
            width: 100,
          },
          {
            headerName: "Status",
            field: "name",
            editable: false,
            valueGetter: (params:any) => params.row.taskStatus.name,
            width: 100,
          },
          {
            headerName: "Comments",
            field: "comments ",
            editable: false,
            valueGetter: (params:any) => params.row.actual_hours,
            width: 100,
          },
          {
            headerName: "Actions.",
            field: "action",
            renderCell: renderDetailsButton,
            width: 100,
        },
          // {
          //   name: "Actions",
          //   button: true,
          //   cell: (row: any) => (row.id ? (
          //     <>
          //      <GridActionsCellItem
          //       icon={<EditIcon />}
          //       label="Edit"
          //       onClick={() => navigate(`/tasks/edit/${row.id}`)}
          //       color="primary"
          //     />
          //      <Delete onClick={() => {
          //      taskService.deletetask(row.id);// navigate("/leaves/myleaves")
          //      getTasksDetails();
          //   }} />
          //     </>
          //   ) : null),
          // },
    ];
    const handleChange = (event:any) => {
      setShowenties(event.target.value as string);
    };
    const searchIn = (e:any) => {
        const a = e.target.value.toLowerCase();
   // e.target.value
   setSearch(a);
    };
   const searched = task
   .filter((searchitem:any, index:any) => {
    if (index < parseInt(showenties, 10) && search === "") { return searchitem; }
   // if (search === "") { return searchitem; }
    if (search !== "") { return (searchitem.project.name.toLowerCase().includes(search) || (searchitem.sprint && searchitem.sprint.sprint_name.toLowerCase().includes(search)) || searchitem.task_type.name.toLowerCase().includes(search) || (searchitem.title && searchitem.title.toLowerCase().includes(search)) || searchitem.task_code.toLowerCase().includes(search) || searchitem.taskStatus.name.toLowerCase().includes(search) || searchitem.comments.toLowerCase().includes(search)); }
    return null;
});

    return (
       <>
       <Card sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 autoe" }}>
                  <div style= {{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.projectmanagementTask.heading}</p></div>
                <div>

                <Button  className="mr10"
                  variant="contained"
                  data-testid="assignProject"
                  style={{ backgroundColor: "#049FD9", color: "#ffffff" }} onClick={() => { navigate("/task/status"); }}>{Applicationlabel.projectmanagementTask.taskstatus}</Button>
                <Button className="mr10"
                  variant="contained"
                  data-testid="assignProject"
                  style={{ backgroundColor: "#049FD9", color: "#ffffff" }} onClick={() => { navigate("/tasks/add"); }}>{Applicationlabel.projectmanagementTask.addtask}</Button>
                  <div className="search"></div>
                  <div className="search  searchCus">
                <TextField
                  className="btn-fill pull-right update-profile"
                  id="outlined-basic"
                  onChange={searchIn}
                  variant="outlined"
                  label={Applicationlabel.projectmanagementTask.searchBar}
                />
              </div>
                </div>
                </div>
                <br />
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
                 <DataGridComponent columns={columns} items={searched}/>
                </CardContent>
                </Box>
                </Card>
       </>
    );
};
    export default Tasks;

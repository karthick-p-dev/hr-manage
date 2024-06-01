import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@mui/material/Button";
import DataGridComponent from "../../../common/datatable/DataGrid";
import designationservice from "../../../helpers/Services/designation.service";

const DesignationList = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [positionLists, setPositionList] = useState<any>([]);
  const navigate = useNavigate();
  async function getPositionsDetails() {
    const response = await designationservice.getPositions(userinfo.companyId);
    setPositionList(response.data);
  }

  async function deletefunction(e:any) {
    const reponse = await designationservice.deleteDesignation(e);
    if (reponse.message === "Deleted successfully") {
      getPositionsDetails();
    }
  }

  const gridColumns: GridColumns = [
    {
      field: "id", headerName: "No",
    },
    {
      field: "position", headerName: "Parent Designation", width: 150, valueGetter: (params:any) => params.row?.position?.name,
    },
    {
      field: "name", headerName: "Designation Name", width: 300,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 100,
      getActions: (params: any) => [
        <>
        <Tooltip title="Edit">
        <GridActionsCellItem key={params.id} icon={<EditIcon />} onClick={() => { navigate(`/positions/edit/${params.id}`); }} label="Edit" color="primary"/>
        </Tooltip>
        <Tooltip title="Delete">
        <GridActionsCellItem key={params.id} icon={<DeleteIcon />} onClick={() => { deletefunction(params.id); }} label="Delete" color="error" />
        </Tooltip>
        </>,
      ],
    },
  ];
  useEffect(() => {
    getPositionsDetails();
  }, []);

  return (
    <>
    <div className="App">
        <Card>
        <div className="justify-content-left">
        <Grid item xs={10} md={10} >
        <p style={{ float: "left", margin: 20, fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Designation List </p>
        </Grid>
        <Grid item xs={2} md={2}>
            <Button style={{ float: "right", margin: 10, backgroundColor: "#673ab7", color: "#ffffff" }} variant="text" onClick={() => { navigate("/positions/add"); }} className="mb-3">
                Add Designation
            </Button>
        </Grid>
        </div>
        <br/>
        <br />
        <br />
        <DataGridComponent columns={gridColumns} items={positionLists} />
        <br/>
        </Card>
    </div>
 </>
  );
};

export default DesignationList;

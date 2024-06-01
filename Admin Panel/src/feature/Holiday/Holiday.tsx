import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { GridColumns, GridRowsProp } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Visibility from "@mui/icons-material/Visibility";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import holidayService from "../../helpers/Services/holiday.service";
import DataGridComponent from "../../common/datatable/DataGrid";
import "./holiday.css";

const Holiday = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [getAllHoliday, setgetAllHoliday] = useState<GridRowsProp>([]);
  const navigate = useNavigate();
  async function getHolidays() {
    const getHoliday = await holidayService.getallHoliday(userinfo);
    if (getHoliday.data && getHoliday.data) {
      const holiday: any = [...getHoliday.data];
      for (let i = 0; i < getHoliday.data.length; i += 1) {
        holiday[i].index = i + 1;
      }
      setgetAllHoliday(holiday);
    }
  }

  const renderDetailsButton = (e:any) => (
    <>
    <Tooltip title="Visibility">
    <Visibility />
    </Tooltip>

    <Tooltip title="Edit">
    <Edit onClick={() => { navigate(`/edit-holiday/${e.id}`); }} />
    </Tooltip>

    <Tooltip title="Delete">
    <Delete onClick = { async () => {
       const senddata:any = {
        id: e.id,
        companyId: e.companyId,
      };
      const delHoliday = await holidayService.deleteHoliday(senddata);
      if (delHoliday.status) {
        getHolidays();
      }
    }} />
     </Tooltip>

    </>
  );
  useEffect(() => {
    getHolidays();
  }, []);
  const columns: GridColumns = [
    {

      headerName: "No.",
      field: "index",
      editable: false,

    },
    {

      headerName: "Date.",
      field: "date",
      editable: false,

    },
    {

      headerName: "Holiday.",
      field: "reason",
      editable: false,

    },
    {

      headerName: "Actions.",
      field: "action",
      renderCell: renderDetailsButton,
    },
  ];
  return (
    <>
    {/* <>load Holiday</> */}
      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">Holidays</p>
            <br />
            <br />
            <br />
              <DataGridComponent columns={columns} items={getAllHoliday}/>
          </CardContent>
        </Box>
        </Card>
    </>
  );
};
export default Holiday;

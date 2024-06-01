import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, GridColumns, GridRowsProp } from "@mui/x-data-grid";
// import CardContent from "@mui/material/CardContent";
import Visibility from "@mui/icons-material/Visibility";
import { green } from "@mui/material/colors";
import { TextField } from "@mui/material";
import Applicationlabel from "../../common/en.json";
import SimpleSnackbar from '../../common/toaster/toast';
import leaveService from "../../helpers/Services/leave.service";
import userService from "../../helpers/Services/user.service";

const MyLeave = () => {
  const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [getAllLeaves, setgetAllLeaves] = useState<GridRowsProp>([]);
  const [searchText, setSearchText] = useState("");
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");
  const [remainingLeave,setRemainingleave] = useState<any>([]);

  const inputHandler = (e: any) => {
    const lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };

  const filteredData = getAllLeaves.filter((el: any) => {
    if (searchText === "") {
      return el;
    }
    return (String(el.id).toLowerCase().includes(searchText) || el.user.userName.toLowerCase().includes(searchText)
      || el.request.toLowerCase().includes(searchText) || el.fromDate.toLowerCase().includes(searchText) || el.toDate.toLowerCase().includes(searchText)
      || el.status.toLowerCase().includes(searchText) || el.toDate.toLowerCase().includes(searchText) || el.status.toLowerCase().includes(searchText));
  });

  const navigate = useNavigate();

  async function getLeaves() {
    const getleaves = await leaveService.getLeaveByUser(userinfo);
    if (getleaves.status && getleaves.data) {
      const leav: any = [...getleaves.data];
      const b = [...leav].reverse().map((l: any, ind: any) => {
        l.index = ind + 1;
        return l;
      });
      setgetAllLeaves(b);
      setToast(true);
      setMessage(Applicationlabel.toast.myLeaves);
    }
  }
  
  async function remainingleaves()
  {
    const getleavebyid = await userService.getUserById(userinfo.id);
    if(getleavebyid.status && getleavebyid.data){
      setRemainingleave(getleavebyid.data.leaveAppliedByDays);
    }
  }

  const renderDetailsButton = (params: any) => (
    <>
      <Tooltip title="view">
        <IconButton sx={{ color: green.A400 }}>
          <Visibility onClick={() => { navigate(`/leaves/myleaves/view/${params.id}`); }} />
        </IconButton>
      </Tooltip>

      {/* <Tooltip title="Delete">
        <IconButton sx={{ color: red.A700 }}>
          <DeleteIcon onClick={() => {
            leaveService.deleteleave(params.row.id);
            getLeaves();
          }} />
        </IconButton>
      </Tooltip>
     */}
    </>
  );

  useEffect(() => {
    getLeaves();
  }, []);

  useEffect(() => {
    remainingleaves();
  }, []);

  const columns: any = [
    {
      headerName: Object.values(Applicationlabel.gridHeader.sno),
      field: "index",
      editable: false,
      width: 50,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.name),
      field: "user",
      valueGetter: (params: any) => params.row?.user?.userName,
      editable: false,
      width: 150,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.leaveType),
      field: "request",
      editable: false,
      width: 150,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.fromDate),
      field: "fromDate",
      editable: false,
      width: 100,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.toDate),
      field: "toDate",
      editable: false,
      width: 100,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.status),
      field: "status",
      editable: false,
      width: 100,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.approvedBy),
      field: "approver",
      // valueGetter: (params:any) => params.row?.approver?.userName,
      valueGetter: (params: any) => (params.row.status != "waiting" ? params.row.approver.userName : "Not yet approved"),
      editable: false,
      width: 250,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.action),
      field: "action",
      renderCell: renderDetailsButton,
      width: 100,
      sortable: false,
    },
  ];

  return (
    <>
    <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      <Box sx={{ height: 550, width: "100%" }}>
        <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.myLeaves.heading}</p>
        <div className="search  searchCus">
          <TextField
            className="btn-fill pull-right update-profile"
            id="outlined-basic"
            onChange={inputHandler}
            variant="outlined"
            label={Applicationlabel.myLeaves.searchBar}

          />
        </div>
        <br />
        <br />
        <br />
      <div className="remain-leave">
       <p>{Applicationlabel.myLeaves.remainingLeave}<span>{remainingLeave}</span></p>
       </div>

        <DataGrid
          disableColumnFilter={true}
          rows={filteredData}
          columns={columns}
          disableColumnMenu={true}
        />
      </Box>
    </>
  );
};
export default MyLeave;

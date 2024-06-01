import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Search from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { DataGrid, GridColumns, GridRowsProp } from '@mui/x-data-grid';
import Edit from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { green, red } from '@mui/material/colors';
import { IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
// import {  toaster } from 'evergreen-ui';
import moment from "moment";
import leaveService from '../../helpers/Services/leave.service';
import dashboardService from '../../helpers/Services/dashboard.service';
import FilterListIcon from '@mui/icons-material/FilterList';
import Applicationlabel from "../../common/en.json";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SimpleSnackbar from '../../common/toaster/toast';
import axios from 'axios';
import ENDPOINT from "../../helpers/Api";
import { BASE_URL } from "../../config/config";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '400px',
    width: '100%',

  },
};

const Requestedleaves: any = () => {
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
  );

  const current = new Date();
  const todayDate = `${String(current.getDate()).padStart(2, "0")}-${String(current.getMonth() + 1).padStart(2, "0")}-${current.getFullYear()}`;
  const [reqleave, setReqleave] = useState<GridRowsProp>([]);
  const [fromdate, setFromdate] = useState(todayDate);
  const [todate, setTodate] = useState(todayDate);
  const [dateStart, setDateStart] = useState(current);
  const [dateEnd, setDateEnd] = useState(current);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');
  const [values,setValues] = useState(0);
  const [startText, settext] = useState<any>("");
  const [excel,setExcel] = useState(false);
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");


  async function getRequestLeave() {
    if(dateEnd != null){
    const requestleave = await leaveService.getRequestLeaveByDate(
      userinfo.companyId,
      moment(dateStart).format("DD-MM-YYYY"),
      moment(dateEnd).format("DD-MM-YYYY"),
    );
    if (requestleave.status && requestleave.data) {
      const leave: any = [...requestleave.data];
      const b = leave.map((l: any, ind: any) => {
        l.index = ind + 1;
        return l;
      });
      setReqleave(b);
    //   setToast(true);
    // setMessage("Requested Leaves");
    }
  }
}

const inputHandler = (e: any) => {
  const lowerCase = e.target.value.toLowerCase();
  setSearchText(lowerCase);
};

const filteredData = reqleave.filter((el:any) => {
  if (searchText === "" && search === "") {
      return el;
  }
  else if(search !== "" && searchText === ""){
    return (String(el.user.employeeId).toLowerCase().includes(search));
  }
  else if(search !== "" && searchText !== ""){
    return (String(el.user.employeeId).toLowerCase().includes(search) && (String(el.id).toLowerCase().includes(searchText) || el.user.userName.toLowerCase().includes(searchText)
    || el.request.toLowerCase().includes(searchText) || el.fromDate.toLowerCase().includes(searchText) || el.toDate.toLowerCase().includes(searchText)
    || el.status.toLowerCase().includes(searchText) || String(el.approvedBy).toLowerCase().includes(searchText)))
  }
      return (String(el.id).toLowerCase().includes(searchText) || el.user.userName.toLowerCase().includes(searchText)
      || el.request.toLowerCase().includes(searchText) || el.fromDate.toLowerCase().includes(searchText) || el.toDate.toLowerCase().includes(searchText)
      || el.status.toLowerCase().includes(searchText) || String(el.approvedBy).toLowerCase().includes(searchText));
});

const inHandler = (e: any) => {
  const lowerCase = e.target.value.toLowerCase();
  setSearch(lowerCase);
};

  const onChangeHandler = (value : any) => {
    setExcel(false);
    setDateStart(value[0]);
    setDateEnd(value[1]);
}

  const exportUsersToExcel = async () => {
    try {
      if (!excel) {
        axios
          .get(
            BASE_URL + ENDPOINT.EXCEL_ALL + '/' + moment(dateStart).format("DD-MM-YYYY") + '/' + moment(dateEnd).format("DD-MM-YYYY") + '/' + userinfo.companyId,
            { responseType: "blob" }
          )
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Leaves${fromdate}.xlsx`);
            document.body.appendChild(link);
            link.click();
          });
      }
      else
        axios
          .get(
            BASE_URL + ENDPOINT.EXCEL_ALL + '/' + userinfo.companyId,
            { responseType: "blob" }
          )
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Leaves${fromdate}.xlsx`);
            document.body.appendChild(link);
            link.click();
          });
    } catch (error) {
      console.log("Error Exporting Users");
      return error;
    }
  };

  async function getWaitingLeave() {
    const waitingleave = await leaveService.getRequestLeaveByDate(
      userinfo.companyId,
      moment(dateStart).format("DD-MM-YYYY"),
      moment(dateEnd).format("DD-MM-YYYY"),
    );
    if (waitingleave.status && waitingleave.data) {
      const leave: any = [...waitingleave.data];
      const b = leave.filter((l: any, ind: any) => {
        l.index = ind + 1;
        return l.status == "waiting";
      });
      setReqleave(b);
      setToast(true);
     setMessage(Applicationlabel.toast.waitingLeave);
    }
  }

  async function getAllLeave() {
    setExcel(true);
    const allLeave = await dashboardService.getAppliedLeaves(
      userinfo.companyId
    );
    if (allLeave.status && allLeave.data) {
      const AllLeave: any = [...allLeave.data];
      const b = AllLeave.map((l: any, ind: any) => {
        l.index = ind + 1;
        return l;
      });
      setReqleave(b);
    }
    setToast(true);
    setMessage(Applicationlabel.toast.allLeaves);
  }

  const navigate = useNavigate();

  function closeModal() {
    setIsOpen(false);
  }

  const renderDetailsButton = (e: any) => (
    <>
      {/* <Tooltip title="Edit">
      <IconButton>
        <Edit
          onClick={() => {
            navigate("/leaves/add/");
          }}
          color="primary"
        />
        </IconButton>
      </Tooltip> */}

      <Tooltip title="View">
        <IconButton sx={{ color: green.A400 }}>
          {/* <Visibility onClick={() => {
            navigate(`/Requestedleaves/view/${e.id}`);
          }}
          /> */}
          <Visibility onClick={() => { navigate(`/leaves/list/view/${e.id}`); }} />
        </IconButton>
      </Tooltip>

      {/* <Tooltip title="Approve"> */}
      {(e.row.status) === "waiting" ? <>
      <Tooltip title="Approve">
      {/* <IconButton> */}
        <DoneOutlineIcon onClick={async () => {
          const senddata: any = {
            id: e.id,
            status: "approved",
          };

          const leaveapproval = await leaveService.approveleave(senddata);
          if (leaveapproval.status) {
            setToast(true);
            setMessage(Applicationlabel.toast.leaveApproved);
            getRequestLeave();
          }
        }} /></Tooltip>
        {/* </IconButton> */}

        <Tooltip title="reject">
          <IconButton sx={{ color: red.A700 }}>
            <CancelIcon onClick={(event) => { event.stopPropagation(); setIsOpen(true); setValues(e.id) }} />
          </IconButton>
        </Tooltip>
          </>
        : ""
      }
    </>
  );

  useEffect(() => {
    getRequestLeave();
  },[dateEnd]);

  const columns : any = [
    {
      headerName: Object.values(Applicationlabel.gridHeader.sno),
      field: "index",
      editable: false,
      width: 60,
    },
    {
      headerName:  Object.values(Applicationlabel.gridHeader.name),
      field: "user",
      valueGetter: (params: any) => params.row?.user?.userName,
      editable: false,
      width: 150,
    },
    {
      headerName:  Object.values(Applicationlabel.gridHeader.leaveType),
      field: "request",
      valueGetter: (params: any) => params.row?.request,
      editable: false,
      width: 150,
    },
    {
      headerName:  Object.values(Applicationlabel.gridHeader.fromDate),
      field: "fromDate",
      valueGetter: (params: any) => params.row?.fromDate,
      editable: false,
      width: 120,
    },
    {
      headerName:  Object.values(Applicationlabel.gridHeader.toDate),
      field: "toDate",
      valueGetter: (params: any) => params.row?.toDate,
      editable: false,
      width: 120,
    },
    {
      headerName:  Object.values(Applicationlabel.gridHeader.status),
      field: "status",
      valueGetter: (params: any) => params.row?.status,
      editable: false,
      width: 100,
    },
    {
      headerName:  Object.values(Applicationlabel.gridHeader.approvedBy),
      field: "approver",
      valueGetter: (params: any) => (params.row.status != "waiting"
          ? params.row.approver.userName
          : "Not yet approved"),
      editable: false,
      width: 250,
    },
    {
      headerName:  Object.values(Applicationlabel.gridHeader.action),
      field: "action",
      renderCell: renderDetailsButton,
      width: 150,
      sortable: false,
    },
  ];

  const handleKeyPress = async (event : any) =>{
    console.log("event.key",event.key == "Enter")
    if(event.key == "Enter")
    {
      submitFeedback()
    }
  }
  
  const submitFeedback  = async () =>{
    console.log("startText---->",startText);
    if(startText != ""){
      const senddata:any = {
        id: values,
        status: "rejected",
        feedBack: startText
      };

      const leaveapproval = await leaveService.approveleave(senddata);
      if (leaveapproval.status) {
        settext("");
        closeModal();
        setToast(true);
        setMessage(Applicationlabel.toast.leaveReject);
       getRequestLeave();
     }
    }
    else{
      setToast(true);
      setMessage(Applicationlabel.toast.enterFeedback);
    }
    
  }

  return (
    <>
      {/* <Card sx={{ display: "flex" }}> */}
      <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      <Box sx={{ height: 500, width: "100%" }}>
          {/* <CardContent sx={{ flex: "1 0 auto" }}> */}
            <div className="flex jc-sb">
              <p
                style={{ float: "left", fontSize: "22px", fontWeight: 500 }}
                className="fw-bolder"
              >
                {Applicationlabel.requestedLeaves.heading} 
              </p>

              <div>
                <Grid item xs={10} md={10}>
                    <DatePicker
                        id="dateStartEnd"
                        selectsRange={true}
                        startDate={dateStart}
                        endDate={dateEnd}
                        onChange={onChangeHandler}
                        dateFormat="dd/MM/yyyy"
                        className={'form-control form-control-sm'}
                        showDisabledMonthNavigation
                     />
                </Grid>
              </div>

              <div>
                <Button
                  className="mr10"
                  variant="contained"
                  data-testid="assignProject"
                  style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
                  onClick={() => {
                    exportUsersToExcel();
                    setToast(true);
                   setMessage(Applicationlabel.toast.export);
                  }}
                >
                  {Applicationlabel.button.export} 
                </Button>
                <Button
                  className="mr10"
                  variant="contained"
                  data-testid="assignProject"
                  style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
                  onClick={() => {
                    // toaster.notify('All leaves')
                    getAllLeave(); 
                  }}
                >
                 {Applicationlabel.button.allLeaves} 
                </Button>
                <Button  
                // style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
                >
                <Tooltip title="Waiting">
                  <FilterListIcon onClick={() => {
                    // toaster.notify('Waiting leaves')
                    getWaitingLeave();
                  }} />
                </Tooltip>
                </Button>
              </div>
            </div>

            <div className="flex jc-sb mt20">
              <div className="search">
                <div className="Search-wicon">
                  <Grid container>
                    <TextField
                      className="me-sm-2"
                      variant="standard"
                      sx={{ width: 350 }}
                      name="userid"
                      id="userid"
                      placeholder="Search By Employee Id"
                      label={Applicationlabel.requestedLeaves.searchBar} 
                      aria-describedby="basic-addon2"
                      onChange={inHandler}
                    />
                    {/* <Search /> */}
                  </Grid>
                </div>
              </div>

              <div className="search  searchCus">
                <TextField
                  className="btn-fill pull-right update-profile"
                  id="outlined-basic"
                  onChange={inputHandler}
                  variant="outlined"
                  label={Applicationlabel.requestedLeaves.search}
                />
              </div>
            </div>
            <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Example Modal"
      >
    
              <form onSubmit={(e)=>e.preventDefault()}>
                <div><h3>Reject</h3></div>
                <div>Please enter reason for rejection</div>
              <br/>
                <div>
              <TextField inputProps={{
                autoComplete: "off",
              }}  id="standard-basic" label="Feedback" variant="standard" onKeyDown={handleKeyPress} onChange={(e) => { settext((e.target.value).trim()) }} />
                </div>
              {/* </Grid> */}
              <br/>
              
                <Button color="primary" variant="contained" style={{ width: "350", backgroundColor: "#049FD9", color: "#ffffff" }}   onClick={async(e) => {
                  e.preventDefault();
                  submitFeedback();
                  // settext("");
                }} >
                  Submit
                </Button></form>
        
      </Modal>
            <DataGrid columns={columns} rows={filteredData} disableColumnFilter={true}   disableColumnMenu={true}/>
          {/* </CardContent> */}
        </Box>
      {/* </Card> */}
    </>
  );
};
export default Requestedleaves;

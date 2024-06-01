import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { DataGrid, GridColumns, GridRowsProp } from '@mui/x-data-grid';
import Visibility from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import Modal from 'react-modal';
import Button from '@mui/material/Button';
import { green, red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import SimpleSnackbar from '../../common/toaster/toast';
import Applicationlabel from "../../common/en.json";
import leaveService from '../../helpers/Services/leave.service';


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


const TeamLeave = () => {
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities
  );
  const [Teamleave, setTeamleave] = useState<GridRowsProp>([]);
  const [searchText, setSearchText] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [startText, settext] = useState<any>("");
  const [values,setValues] = useState(0); 
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");
  
  const navigate = useNavigate();

  const inputHandler = (e: any) => {
    const lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };

  const filteredData = Teamleave.filter((el: any) => {
    if (searchText === "") {
      return el;
    }
    return (String(el.id).toLowerCase().includes(searchText) || el.user.userName.toLowerCase().includes(searchText)
      || el.leave.status.toLowerCase().includes(searchText) || el.leave.fromDate.toLowerCase().includes(searchText) || el.leave.toDate.toLowerCase().includes(searchText)
      || String(el.leave.approvedBy).toLowerCase().includes(searchText) || el.leave.request.toLowerCase().includes(searchText));
  });

  async function getTeamleaves() {
    const getTeamleave = await leaveService.getrequestleave(userinfo);
    if (getTeamleave.status && getTeamleave.data) {
      const teamleav: any = [...getTeamleave.data];
      const dat = teamleav.map((res: any, index: any) => {
        res.index = index + 1;
        return res;
      });
      setTeamleave(dat);
    }
  }
  
  const renderDetailsButton = (e: any) => (
    <>
      <Tooltip title="View">
        <IconButton sx={{ color: green.A400 }}>
          <Visibility
            onClick={() => {
              navigate(`/leaves/teamleave/view/${e.row.leaveId}`);
            }}
          />
        </IconButton>
      </Tooltip>

      {e.row.leave.status  === "waiting" ? (
        <>
          <Tooltip title="approve">
            <DoneOutlineIcon
              onClick={async () => {
                const data = {
                  id: e.row.leaveId,
                  status: 'approved',
                };
                await leaveService.approveleave(data);
                setToast(true);
                setMessage(Applicationlabel.toast.leaveApproved)
                getTeamleaves();
              }}
            />
          </Tooltip>

          {/* <IconButton sx={{ color: red.A700 }}> */}
            {/* <Tooltip title="reject">
              <CancelIcon
                onClick={async () => {
                  const data = {
                    id: e.row.leaveId,
                    status: 'reject',
                  };
                  await leaveService.rejectleave(data);
                  getTeamleaves();
                }}
              /></Tooltip> */}
               <Tooltip title="reject">
          <IconButton sx={{ color: red.A700 }}>
            <CancelIcon onClick={() => { setIsOpen(true); setValues(e.row.leaveId) }} />
          </IconButton>
        </Tooltip>
        {/* </IconButton>{' '} */}
        </>
      ) : (
        ''
      )}
    </>
  );
  

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    getTeamleaves();
  }, []);

  const columns : any = [
    {
      headerName: Object.values(Applicationlabel.gridHeader.sno),
      field: 'index',
      editable: false,
      width: 50,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.name),
      field: 'userName',
      editable: false,
      valueGetter: (params: any) => params.row.user.userName,
      width: 170,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.leaveType),
      field: 'request',
      editable: false,
      valueGetter: (params: any) => params.row.leave.request,
      width: 150,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.fromDate),
      field: 'fromDate',
      editable: false,
      valueGetter: (params: any) => params.row.leave.fromDate,
      width: 100,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.toDate),
      field: 'toDate',
      editable: false,
      valueGetter: (params: any) => params.row.leave.toDate,
      width: 100,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.status),
      field: 'status',
      editable: false,
      valueGetter: (params: any) => params.row.leave.status,
      width: 100,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.approvedBy),
      field: 'approved by',
      editable: false,
      valueGetter: (params: any) =>
        params.row.leave.status != "waiting"
          ? params.row.leave.approver.userName
          : 'Not Yet Approved',
      width: 250,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.action),
      field: 'action',
      renderCell: renderDetailsButton,
      width: 120,
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
    // console.log("startText---->",startText);
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
        getTeamleaves();  
     }
    }
    else{
      setToast(true);
      setMessage(Applicationlabel.toast.enterFeedback);
    }
    
  }

  return (
    <>
     <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      <Box sx={{ height: 550, width: "100%" }}>
        <p
          style={{ float: 'left', fontSize: '22px', fontWeight: 500 }}
          className="fw-bolder"
        >
          {Applicationlabel.teamLeaves.heading}
        </p>

        <div className="search  searchCus">
          <TextField
            className="btn-fill pull-right update-profile"
            id="outlined-basic"
            onChange={inputHandler}
            variant="outlined"
            label= {Applicationlabel.teamLeaves.searchBar}
          />
        </div>

        <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Example Modal"
      >
    
          <form onSubmit={(e) => e.preventDefault()}>
            <div><h3>Reject</h3></div>
            <div>Please enter reason for rejection</div>
            <br />
            <div>
              <TextField inputProps={{
                autoComplete: "off",
              }} id="standard-basic" label="Feedback" variant="standard" onKeyDown={handleKeyPress} onChange={(e) => { settext((e.target.value).trim()) }} />
            </div>
            <br />

            <Button color="primary" variant="contained" style={{ width: "350", backgroundColor: "#049FD9", color: "#ffffff" }} onClick={async (e) => {
              // if (startText != "") {
              //   const senddata: any = {
              //     id: values,
              //     status: "rejected",
              //     feedBack: startText
              //   };

              //   const leaveapproval = await leaveService.approveleave(senddata);
              //   if (leaveapproval.status) {
              //     closeModal();
              //     getTeamleaves();
              //   }
              // }
              e.preventDefault();
              submitFeedback();
            }} >
              Submit
            </Button></form>
        
      </Modal>
        <DataGrid columns={columns} rows={filteredData} disableColumnFilter={true} disableColumnMenu={true}  />
      </Box>

    </>
  );
};
export default TeamLeave;

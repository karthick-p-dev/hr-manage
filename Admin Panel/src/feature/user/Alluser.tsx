import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import { DataGrid, GridColumns, GridRowsProp } from '@mui/x-data-grid';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TextField from "@mui/material/TextField";
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
// import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import { useNavigate , useParams } from "react-router-dom";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import { green } from "@mui/material/colors";
import Tooltip from "@mui/material/Tooltip";
import Modal from "react-modal";
import Button from "@mui/material/Button";
import Applicationlabel from "../../common/en.json";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import moment from "moment";
import SimpleSnackbar from "../../common/toaster/toast";
import { BASE_URL } from "../../config/config";
import "bootstrap/dist/css/bootstrap.min.css";
import userService from "../../helpers/Services/user.service";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "360px",
    width: "100%",

  },
};

const Alluser = () => {
  const [usersList, setUsersList] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(0);
  const [startDate, setdate] = useState<any>(new Date());
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");
  const [Active,setInactive] = useState(true);
  const [Doj,setDoj] = useState<any>();

  const {valuess }= useParams();
  const [value, setValue] = React.useState(valuess || "active");
  
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setInactive(!Active)
  };

  const navigate = useNavigate();
  
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
  );

  const inputHandler = (e: any) => {
    const lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };
  const filteredData = usersList.filter((el: any) => {
    if (searchText === "") {
      return el;
    }

    return (String(el.employeeId).toLowerCase().includes(searchText) || el.userName.toLowerCase().includes(searchText)
      || el.email.toLowerCase().includes(searchText) || el.mobileNumber.toLowerCase().includes(searchText));
  });

  async function getAllUser() {
    const response = await userService.getAllUsers(userinfo);
    if (response.status && response.data) {
      var user: any = [...response.data];
      const data = user.map((res: any, index: any) => {
        res.index = index + 1;
        return res;
      });
      setUsersList(data);
      // setToast(true);
      // setMessage(" All Users Loaded");
    }
    var DateOfjoin = user.map((data: any) => {
      data = moment(data.dateOfJoining).format("DD-MM-YYYY");
      return data;
    })
    setDoj(DateOfjoin);
  }

  

  async function getInactiveUsers() {
    const inactiveUsers = await userService.getAllInactiveUsers(userinfo);
    if (inactiveUsers.status && inactiveUsers.data) {
    const inactivUser: any =[...inactiveUsers.data]
    const data = inactivUser.map((req : any, index : any) => {
      req.index = index + 1;
      return req;
    });
    setUsersList(data);
  }
}

  function closeModal() {
    setIsOpen(false);
    getAllUser();
  }

  const renderDetailsButton : any = (e: any) => (
    <>
    {value == "active" &&
      <Tooltip title="Edit">
        <EditIcon sx={{ fontSize: 18 }} onClick={() => { navigate(`/user/edit/${e.id}`); }} color="primary" />
      </Tooltip>
      
     }

      <Tooltip title="View">
        <IconButton sx={{ color: green.A400 }}>
          <Visibility sx={{ fontSize: 18 }} onClick={() => { if(value == "1")navigate(`/userview/${value}/${e.id}`); 
        else{
          navigate(`/userview/${value}/${e.id}`)
        }}} />
        </IconButton>
      </Tooltip>
      {/* {value == "active" &&
      <Tooltip title="Timesheet">
        <AccessTimeIcon sx={{ fontSize: 18 }} onClick={() => { navigate(`/user/timesheet/${e.id}`); }} />
      </Tooltip>
} */}

      {/* <Tooltip title="Manual attendance">
        <DateRangeOutlinedIcon sx={{ fontSize: 18 }} className="ml10" onClick={() => { navigate(`/user/manualattendance/${e.id}`); }} />
      </Tooltip > */}
    </>
  );
  
  const toggle = (e: any) => (
    <>
      <div>
        <FormGroup>
          <FormControlLabel control={<Switch checked={e.row.isActive} />} onClick={async(event:any) => { 
            setValues(e.id)
            if(event.target && !event.target.checked) {
              setIsOpen(true); setValues(e.id) 
            }
            else
            {
              const senddata: any = {
                userId: e.id,
                isActive: 'true',
                dateOfExit: null,
                companyId: userinfo.companyId
              };
              const updateuser = await userService.updateAllUser(senddata);
              getInactiveUsers();
              setToast(true);
              setMessage(Applicationlabel.toast.userActive);
            }
          }
           } label={e.row.isActive == true ? "Active" : "inActive"} />
        </FormGroup>
      </div>

    </>
  );

  const columns: any = [
    {
      headerName: Object.values(Applicationlabel.gridHeader.empId),
      field: "employeeId",
      valueGetter: (params: any) => params.row?.employeeId,
      editable: false,
      width: 100,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.name),
      field: "userName",
      valueGetter: (params: any) => params.row?.firstName+" "+params.row?.lastName,
      editable: false,
      width: 190,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.email),
      field: "email",
      valueGetter: (params: any) => params.row?.email,
      editable: false,
      width: 280,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.contactNo),
      field: "contactNumber",
      valueGetter: (params: any) => params.row?.mobileNumber,
      editable: false,
      width: 150,
    },
    {

      headerName: Object.values(Applicationlabel.gridHeader.status),
      field: "isActive",
      valueGetter: (params: any) => params.row?.isActive,
      editable: false,
      renderCell: toggle,
      width: 150,
      sortable: false,
    },
    {

      headerName: Object.values(Applicationlabel.gridHeader.image),
      field: "profile",
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params: any) => <img src={BASE_URL+"/"+params.row.profile} className="tableimg"/>,
    },
    {
      headerName: Object.values(Applicationlabel.gridHeader.action),
      field: "actions",
      renderCell: renderDetailsButton,
      width: 150,
      sortable: false,
    },
  ];
  
  useEffect(() => {
    if(value == "active")
    getAllUser();
    else
    getInactiveUsers();
  }, []);

  return (
    <>
      {/* <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={holidaySchema}
            ></Formik> */}
      <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      <Box sx={{ height: 550, width: '100%' }}>
        <div className="flex jc-sb al-c">
          <p
            style={{ float: 'left', fontSize: '22px', fontWeight: 500 }}
            className="fw-bolder"
          >
            {Applicationlabel.allUsers.heading}
          </p>
          <div className="search  searchCus">
            <TextField
              id="outlined-basic"
              onChange={inputHandler}
              variant="outlined"
              fullWidth
              label={Applicationlabel.allUsers.searchBar}
              sx={{
                width: { sm: 100, md: 200 },
              }}
            />
          </div>
          {/* <div>
          <Button>
                <Tooltip title="INactive Users">
                  <GroupRemoveIcon onClick={() => {
                    getInactiveUsers();
                  }} />
                </Tooltip>
                </Button>
          </div> */}
        </div>
        <br />

<div className="w100 custom-tab">
        <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}  centered>
            <Tab label={Applicationlabel.allUsers.activeUsers} value="active" onClick={getAllUser}  />
            <Tab label={Applicationlabel.allUsers.inActiveUsers} value="2" onClick={getInactiveUsers} />
            
          </TabList>
        </Box>        
      </TabContext>
      </div>



        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          style={customStyles}
        >
          <form>
            <div>
              <h3>{Applicationlabel.allUsers.exitDate}</h3>
            </div>
            <div>{Applicationlabel.allUsers.addDOE}</div>
            <br />
            <div>
              <TextField
                type="date"
                name="date"
                variant="standard"
                onChange={async (e) => {
                  setdate(e.target.value);
                }}
                sx={{ width: 150 }}
                id="fromDate"
                className="form-control"
                autoComplete="off"
                inputProps={{
                  max: new Date().toISOString().substring(0, 10),
                }}
                defaultValue={new Date().toISOString().substring(0, 10)}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
              />
            </div>
            <br />

            <Button
              color="primary"
              variant="text"
              style={{ width: '350' }}
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              style={{ width: "350", backgroundColor: "#049FD9", color: "#ffffff" }}
              onClick={async (e) => {
                const senddata: any = {
                  userId: values,
                  isActive: 'false',
                  dateOfExit: startDate,
                  companyId : userinfo.companyId
                };
                if(moment(senddata.dateOfExit).format("DD-MM-YYYY") >= Doj){
                  const updateuser = await userService.updateAllUser(senddata);
                  if (updateuser.status) {
                    closeModal();
                    setToast(true);
                    setMessage(Applicationlabel.toast.userInactive);
                    getAllUser();
                  }
                }else{
                  setToast(true);
                  setMessage(Applicationlabel.allUsers.doeVal);
                }
                
               
              }}
            >
              Ok
            </Button>
          </form>
        </Modal>
        <DataGrid columns={columns} disableColumnFilter={true} rows={filteredData}  disableColumnMenu/>
      </Box>
    </>
  );
  // }}
  // </Formik>
};

export default Alluser;

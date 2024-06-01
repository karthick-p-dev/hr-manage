import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Visibility from "@mui/icons-material/Visibility";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { GridCellParams, GridColumns, GridRowsProp } from "@mui/x-data-grid";
import clsx from 'clsx';
import TextField from "@mui/material/TextField";
import { useNavigate,useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import TabPanel from "@mui/lab/TabPanel";
import SimpleSnackbar from '../../common/toaster/toast';
import attandanceService from "../../helpers/Services/attendance.service";
import DataGridComponent from "../../common/datatable/DataGrid";
import axios from "axios";
import ENDPOINT from "../../helpers/Api";
import Applicationlabel from "../../common/en.json";
import { BASE_URL } from "../../config/config";

var date : any;
const Allattendance = () => {
  const { status } = useParams();
// searchParams.get("__firebase_request_key")
  const [attendanceList, setAttendanceList] = useState<GridRowsProp>([]);
  const userinfo : any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [startDate, setStartDate] = useState(new Date());
  const current = new Date();
  const todayDate = `${String(current.getDate()).padStart(2, "0")}-${String(current.getMonth() + 1).padStart(2, "0")}-${current.getFullYear()}`;
  const [idfind] = useState("");
  const [userfind] = useState("");
  const [values, setValues] = React.useState<Dayjs | null>();
  const [presentstatus, setPresentstatus] = useState(true);
  const [absentstatus, setAbsentstatus] = useState(false);
  const [presentdata, setPresentdata] = useState([]);
  const [absentdata, setAbsentdata] = useState([]);
  const [presenttable, setPresenttable] = useState([]);
  const [absenttable, setAbsenttable] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");
  const [viewDate,setViewdate] = useState("");

  const navigate = useNavigate();

  const inputElement = useRef()

  const inputHandler = (e:any) => {
    const lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };

  const filteredData = attendanceList.filter((el:any) => {
    if (searchText === "") {
        return el;
    }

        return (String(el.employeeId).toLowerCase().includes(searchText) || el.userName.toLowerCase().includes(searchText));
});
  const clearState = () => {
    setPresentdata([]);
    setAbsentdata([]);
    setPresenttable([]);
    setAbsenttable([]);
    setPresentstatus(true);
    setValue("1");
  };
  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const gridColumns: GridColumns = [
    {
      field: "employeeId", headerName: "Employee Id", width: 130, hideable: false,
    },
    {
      field: "userName", headerName: "Name", width: 200,
    },
    {
      field: "totalhours", headerName: "Total Hours",width: 200,
    },
    {
      field: "totalbreaks", headerName: "Total Break",width: 200,
    },
    {
      field: "attstatus", headerName: "Attendance",width: 200,
      cellClassName: (params: GridCellParams<any>) => {
        return clsx('super-app', {
          Absent: params.value == "Absent",
          Present: params.value == "Present",
          Halfday: params.value == "Half day"
        });
      },
    },
    {
      field: "actions", headerName: "Actions", width: 100,sortable: false,
      renderCell: (param:any) => (
          <Visibility
            onClick={() => {
              navigate(`/attendance/view/${param.id}/${viewDate}`);
            }}
            color="success"
          />
        ),
    },
  ];

  const exportUsersToExcel = async () => {
    try {
      axios
        .get(
          BASE_URL + ENDPOINT.EXCEL_ATTENDANCE + '/' + date + '/' + userinfo.companyId,
          { responseType: "blob" }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `All Attendance${todayDate}.xlsx`);
          document.body.appendChild(link);
          link.click();
        });
    } catch (error) {
      console.log("Error Exporting Users");
      return error;
    }
  };

  const dataAppend = (response:any) => {
    if (response.data.present.length > 0) {
      setPresentdata(response.data.present);
      const snoabsentall: any = response.data.present.map((currentValue : any, Index : any) => {
        currentValue.sno = Index + 1;
        const checkatdata = currentValue.attendances[0];
        currentValue.totalhours = checkatdata.totalHours;
        currentValue.totalbreaks = checkatdata.totalBreakHours;
        currentValue.attstatus = checkatdata.attendanceStatus;
        currentValue.activUser = <Visibility />;
        return currentValue;
      });
      setPresenttable(snoabsentall);
      setAttendanceList(snoabsentall);
    }
    else if(response.data.present.length == 0)
      setAttendanceList([]);
    if (response.data.absent.length > 0) {
      setAbsentdata(response.data.absent);
      const snopresentall = response.data.absent.map((currentValues : any, Index : any) => {
        currentValues.sno = Index + 1;
        currentValues.totalhours = "00:00";
        currentValues.totalbreaks = "00:00";
        currentValues.attstatus = "Absent";
        currentValues.activUser = <Visibility />;
        return currentValues;
      });
      setAbsenttable(snopresentall);
      checkchange(snopresentall);
    }

  };
  const checkchange = (data: any) => {
    if(status != undefined && status == "false")
    {
      setAbsentstatus(true);
      setAttendanceList(data);
      setValue("3");
    }
  }
  useEffect(() => {
    // const current = new Date();
    const current = startDate;
    date  = `${String(current.getDate()).padStart(2, "0")}-${String(current.getMonth() + 1).padStart(2, "0")}-${current.getFullYear()}`;
    setViewdate(date);
    const checkres = async () => {
      const response = await attandanceService.getAllAttendance(userinfo, date);
      setAttendanceList([])
      dataAppend(response);
    }
    checkres();
    // setToast(true);
    // setMessage("All Attendance");
  }, []);


  const clickPresent = () => {
    setPresentstatus(true);
    setAttendanceList(presenttable);
    setValue("1");
    // setToast(true);
    // setMessage("Present");
  };
  const clickAbsent = () => {
    setAbsentstatus(true);
    setAttendanceList(absenttable);
    setValue("3");
    // setToast(true);
    // setMessage("Absent");
  };

  const handleDateSelect = async (values: any) => {
    setValues(values);
    clearState();
     date = `${String(values.$d.getDate()).padStart(2, "0")}-${String(values.$d.getMonth() + 1).padStart(2, "0")}-${values.$d.getFullYear()}`;
     setViewdate(date);
     const response = await attandanceService.filterAttendance(userinfo, date);
     dataAppend(response);
  };

  return (
    <>
      <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      <div className="App pad25 pb0 ">
        <div className="  flex jc-sb al-c">
          <div className="flex flex-dir-c ai-b">
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder">{Applicationlabel.allAttendance.heading}</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={Applicationlabel.allAttendance.dateLabel}
                value={values}
                disableFuture
                onChange={handleDateSelect}
                renderInput={(params) => <TextField {...params} variant="standard" />}
              />
            </LocalizationProvider>
          </div>
          <div className="flex ai-fe">
          <div className="search pad0 mr15 searchCus">
                    <TextField
                      id="outlined-basic"
                      onChange={inputHandler}
                      variant="outlined"
                      fullWidth
                      label={Applicationlabel.allAttendance.searchBar}
                      sx={{
                        width: { sm: 100, md: 200 }
                      }}
                    />
                  </div>
                  <Button
            className="mr10"
            variant="contained"
            data-testid="assignProject"
            style={{ width: "350", backgroundColor: "#049FD9", color: "#ffffff" }}
            onClick={() => {
              exportUsersToExcel();
            }}
          >
             {Applicationlabel.button.export} 
          </Button>
          </div>


        </div>
        <div>

        </div>
        {/* <Grid container xs={4} style={{ display: (idfind || userfind) ? "none" : "block" }} className="pad25 pl0">
            <TextField type="date" variant="standard" sx={{ width: 350 }} id="fromDate" value={startDate}  InputProps={{ inputProps: { max: new Date() } }} onChange={handleDateSelect}  className="form-control" autoComplete="off" />
    </Grid> */}
      </div>

      <div className="justify-content-center w100-MuiPaper-rounded bx-s-n">
        <Grid container xs={12} className="w100 custom-tab">
          <Card sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", '& .super-app.Absent': {
        color: '#a10202',
        fontWeight: '600',
        },
        '& .super-app.Present': {
          color: '#2c7001',
          fontWeight: '600',
        }, 
        '& .super-app.Halfday': {
          color: '#ED7014',
          fontWeight: '600',
        }, }}>
              <CardContent sx={{ flex: "1 0 auto" }} className="pt0">
                <TabContext value={value} >
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="w100">
                    <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
                      {presentstatus ? <Tab label="Present" value="1" onClick={clickPresent} />
                        : <Tab label={Applicationlabel.allAttendance.present} value="2" onClick={clickPresent} />
                      }
                      {absentstatus ? <Tab label="Absent" value="3" onClick={clickAbsent} />
                        : <Tab label={Applicationlabel.allAttendance.absent} value="4" onClick={clickAbsent} />
                      }
                    </TabList>
                  </Box>


                  {(presentdata != null || absentdata)
                    ? <div className=" pad25 w300-div">

                      <DataGridComponent columns={gridColumns} disableColumnFilter={true} items={filteredData} />
                    </div>
                    : <div className="justify-content-left">No Attendance exist.</div>
                  }
                </TabContext>
              </CardContent>
            </Box>
          </Card>
        </Grid>
      </div>
      {/* <hr className="mt-0" /> */}

    </>
  );
};

export default Allattendance;

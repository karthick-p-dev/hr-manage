import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import * as Yup from "yup";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, useParams } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import userService from "../../helpers/Services/user.service";
import DataPicker from "../../common/date-picker/DataPicker";
import moment from "moment";
import ImageIcon from "@mui/icons-material/Image";
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SimpleSnackbar from "../../common/toaster/toast";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BASE_URL } from '../../config/config';
import Applicationlabel from "../../common/en.json";
import Password from "../../common/Password/Password";

const Adduser = (userId: any) => {

  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
  );
  const current = new Date();
  const initialValues: any = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    firstName: "",
    lastName: "",
    designation: "",
    roleId: "",
    email: "",
    resqueToken: "",
    mobileNumber: "",
    DOB: "",
    gender: "",
    employeeId: "",
    password: "",
    positionId: "",
    confirmpassword: "",
    dateOfJoining: "",
    file: "",
    DateOfBirth:"",
  };
  
 const phoneRegExp=/^((\+[1-9\s ()-]*[-]?)|(\([0-9]*\)[ -]?)|(?!.*0{10})([0-9\s ()-])*)$/;
  const [addRole, setAddRole] = useState<any>([]);
  const [addPosition, setAddPosition] = useState<any>([]);
  const [userData, setUserData] = useState<any>(initialValues);
  const [isVisible, setVisible] = useState(false);
  const [isValue, setValue] = useState(false);
  const [imgData, setImgData] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [opend, setOpend] = useState(false);
  const [dobdate, setDobdate] = useState('');
  const [toast,setToast] = useState(false);
  const [message,setMessage] = useState("");
  const [show, setShow] = useState(false);

  const [lowerValidated, setLowerValidated]=useState(false);
  const [upperValidated, setUpperValidated]=useState(false);
  const [numberValidated, setNumberValidated]=useState(false);
  const [specialValidated, setSpecialValidated]=useState(false);
  const [lengthValidated, setLengthValidated]=useState(false);

  const navigate = useNavigate();

  const genderType: any = [
    { label: Applicationlabel.addUser.gendermale, value: "Male" },
    { label: Applicationlabel.addUser.genderfemale, value: "Female" },
    { label: Applicationlabel.addUser.genderothers, value: "others" },
  ];

  const { id } = useParams();

  async function geteditusers() {
    if (id) {
      const response = await userService.getUserById(id);
      setDobdate(moment(new Date(response.data.DOB)).format('DD-MM-YYYY'))
      if (response.status) { 
        response.data.DateOfBirth = response.data.DOB.split('-').reverse().join("-")
        setUserData(response.data);
      } else {
        console.log("error");
      }
    } else {
      setUserData(initialValues);
    }
  }
  async function getRole() {
    const roleInfos = await userService.getUserRoles();
    if (roleInfos.status) setAddRole(roleInfos.data);
  }

  async function getPosition() {
    const positionInfos = await userService.getUserPositions(userinfo);
    if (positionInfos.status) setAddPosition(positionInfos.data);
  }

  const handleSubmit = async (values: any) => {
    if(!id && (!lowerValidated || !upperValidated || !numberValidated || !specialValidated || !lengthValidated))
    {setShow(true)
    return;}
    let paramsData = new FormData();
    if (values.DateOfBirth && values.DateOfBirth.$d) {
      values.DateOfBirth = `${String(values.DateOfBirth.$d.getDate()).padStart(2, "0")}-${String(values.DateOfBirth.$d.getMonth() + 1).padStart(2, "0")}-${values.DateOfBirth.$d.getFullYear()}`;
      paramsData.append("DOB", values['DateOfBirth']);
      values.DOB=values.DateOfBirth
      paramsData.append("DateOfBirth", values['DateOfBirth'].split('-').reverse().join("-"));
      values.DateOfBirth=values.DateOfBirth.split('-').reverse().join("-");
    }
    else{
      paramsData.append("DOB", values['DateOfBirth'].split('-').reverse().join("-"));
      paramsData.append("DateOfBirth", values['DateOfBirth']);
    }
    if (values.dateOfJoining && values.dateOfJoining.$d) {
      values.dateOfJoining = `${values.dateOfJoining.$d.getFullYear()}-${String(values.dateOfJoining.$d.getMonth() + 1).padStart(2, "0")}-${String(values.dateOfJoining.$d.getDate()).padStart(2, "0")}`;
    }
    paramsData.append("firstName", values['firstName']);
    paramsData.append("lastName", values['lastName']);
    paramsData.append("designation", values['designation']);
    paramsData.append("gender", values['gender']);
    paramsData.append("employeeId", values["employeeId"]);
    paramsData.append("email", values['email']); 
    paramsData.append("mobileNumber", values['mobileNumber']);
    paramsData.append("companyId", userinfo.companyId);
    paramsData.append("roleId", values['roleId']);
    paramsData.append("resqueToken", values['resqueToken']);
    paramsData.append("positionId", values['positionId']);
    paramsData.append("dateOfJoining", values['dateOfJoining']);
    paramsData.append("userId", values['id']);
    paramsData.append("profile", values['profile']);
    paramsData.append("file", values['file']);
    if (id) {
      const response = await userService.updateUser(paramsData);
      if (response.status == false) {
        // alert(response.message);
        setToast(true);
        setMessage(response.message);
        return;
      }
      if (response.data) {
        // navigate("/user");
        setToast(true);
        setMessage(Applicationlabel.toast.userUpdated);
        setTimeout(() => {
          navigate("/user/active");
        }, 1000);
      }
    }
    else {
      const response = await userService.postUser(values);
      if (response.status == false) {
        // alert(response.message);
        setToast(true);
        setMessage(response.message);
        return;
      }
      if (response.data) {
        // navigate('/user');
        setToast(true);
        setMessage(Applicationlabel.toast.userAdded);
        setTimeout(() => {
          navigate("/user/active");
        }, 1000);
      }
    }
  };

  useEffect(() => {
    getRole();
    getPosition();
    geteditusers();
  }, [userId]);

  useEffect(() => {
    if (id) {
    setToast(true);
    setMessage("EditUser Loaded");
    }
    else{
      setToast(true);
    setMessage("AddUser Loaded");
    }
  }, []);

  let SignInSchema;
  if (id) {
    SignInSchema = Yup.object().shape({
      firstName: Yup.string().trim(Applicationlabel.adduserschema.firstNameSpace).strict(true).required(Applicationlabel.adduserschema.firstName),

      lastName: Yup.string().trim(Applicationlabel.adduserschema.lastNameSpace).strict(true).required(Applicationlabel.adduserschema.lastName),

      email: Yup.string().trim(Applicationlabel.adduserschema.emailSpace).strict(true).email(Applicationlabel.adduserschema.emailvalid)
        .required(Applicationlabel.adduserschema.email),

      positionId: Yup.string().trim().required(Applicationlabel.adduserschema.positionId),

      mobileNumber: Yup.string()
        .matches(phoneRegExp,Applicationlabel.adduserschema.mobilenumbermatch)
        .trim(Applicationlabel.adduserschema.mobileNoSpace).strict(true).required(Applicationlabel.adduserschema.mobileNumber),

       DateOfBirth: Yup.date()
        .max(new Date(), Applicationlabel.adduserschema.DOBgreater)
        .required(Applicationlabel.adduserschema.DOB),

      gender: Yup.string().trim().required(Applicationlabel.adduserschema.gender),

      employeeId: Yup.string().trim().required(Applicationlabel.adduserschema.employeeId),

      designation: Yup.string().trim(Applicationlabel.adduserschema.desiginationSpace).strict(true).required(Applicationlabel.adduserschema.desigination),

      dateOfJoining: Yup.date()
        .when('DateOfBirth',
          (DateOfBirth, schema) => {
            if (DateOfBirth) {
              const dayAfter = new Date(DateOfBirth.getTime() + 86400000);
              return schema.min(dayAfter,(Applicationlabel.adduserschema.dateofJoininglessthan) );
            }
            return schema;
          })
        .max(new Date(),(Applicationlabel.adduserschema.dateofjoiningmaximum) )
        .required(Applicationlabel.adduserschema.dateofjoining),
    });
  }

  else {
    SignInSchema = Yup.object().shape({
      firstName: Yup.string().trim(Applicationlabel.adduserschema.firstNameSpace).strict(true).required(Applicationlabel.adduserschema.firstName),

      lastName: Yup.string().trim(Applicationlabel.adduserschema.lastNameSpace).strict(true).required(Applicationlabel.adduserschema.lastName),

      email: Yup.string().trim(Applicationlabel.adduserschema.emailSpace).strict(true).email(Applicationlabel.adduserschema.emailvalid)
      .required(Applicationlabel.adduserschema.email),

      positionId: Yup.string().trim().required(Applicationlabel.adduserschema.positionId),

      mobileNumber: Yup.string()
        .matches(phoneRegExp, (Applicationlabel.adduserschema.mobilenumbermatch))
        .trim(Applicationlabel.adduserschema.mobileNoSpace).strict(true).required(Applicationlabel.adduserschema.mobileNumber),

      DateOfBirth: Yup.date().required(Applicationlabel.adduserschema.DOB)
      .max(new Date(), Applicationlabel.adduserschema.DOBgreater),

      gender: Yup.string().required(Applicationlabel.adduserschema.gender),

      employeeId: Yup.string()
      .trim().required(Applicationlabel.adduserschema.employeeId),

      password: Yup.string().trim().required(Applicationlabel.adduserschema.password),

      confirmpassword: Yup.string().trim().required(Applicationlabel.adduserschema.confirmPassword)
        .oneOf([Yup.ref('password'), null], Applicationlabel.adduserschema.passwordMatch),

      file: Yup.mixed() .required(Applicationlabel.adduserschema.image),

      designation: Yup.string().trim(Applicationlabel.adduserschema.desiginationSpace).strict(true).required(Applicationlabel.adduserschema.desigination),

      dateOfJoining: Yup.date()
        .when('DateOfBirth',
          (DateOfBirth, schema) => {
            if (DateOfBirth) {
              const dayAfter = new Date(DateOfBirth.getTime() + 86400000);

              return schema.min(dayAfter, Applicationlabel.adduserschema.dateofJoininglessthan);
            }
            return schema;
          })
        .max(new Date(), Applicationlabel.adduserschema.dateofjoiningmaximum)
        .required(Applicationlabel.adduserschema.dateofjoining),
    });
  }

  const handleChange = (e: any) => {
    console.log("e--->", e);
  }
  const toggle = () => {
    setVisible(!isVisible);
  };
  const togle = () => {
    setValue(!isValue);
  };
  const onclick= () =>{
    setShow(true);
    
  }
  
const handlePasswordSubmit=(value:any)=>{
    const lower = new RegExp('(?=.*[a-z])');
    const upper = new RegExp('(?=.*[A-Z])');
    const number = new RegExp('(?=.*[0-9])');
    const special = new RegExp('(?=.*[{!+=_~`()<>.,:;?@#|\/\$%\^&\*}])');
    const length = new RegExp('(?=.{8,})')
    if(lower.test(value)){
      setLowerValidated(true);
    }
    else{
      setLowerValidated(false);
    }
    if(upper.test(value)){
      setUpperValidated(true);
    }
    else{ 
      setUpperValidated(false);
    }
    if(number.test(value)){
      setNumberValidated(true);
    }
    else{
      setNumberValidated(false);
    }
    if(special.test(value)){
      setSpecialValidated(true);
    }
    else{
      setSpecialValidated(false);
    }
    if(length.test(value)){
      setLengthValidated(true);
    }
    else{
      setLengthValidated(false);
    }
    if(lowerValidated && upperValidated && numberValidated && specialValidated && lengthValidated)
    {setShow(false)}
  }
  const passwordcheck:any = {
    lowerValidated:lowerValidated,
    upperValidated:upperValidated,
    numberValidated:numberValidated,
    specialValidated:specialValidated,
    lengthValidated:lengthValidated
  }
  
  return (
    <>
    <SimpleSnackbar showToast={toast} message={message} setToast={setToast} />
      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto", margin: "0px 100px" }}>
            <Grid>
              {!id && (
                <>
                  <p
                    style={{ float: "left", fontSize: "22px", fontWeight: 500 }}
                    className="fw-bolder"
                  >
                    {Applicationlabel.addUser.heading}
                  </p>
                </>
              )}
              {id && (
                <>
                  <p
                    style={{ float: "left", fontSize: "22px", fontWeight: 500 }}
                    className="fw-bolder"
                  >
                    {Applicationlabel.addUser.editHeading}
                  </p>
                </>
              )}
            </Grid>
            <br />
            <br />
            <br />
            <br />
            <Formik
              initialValues={userData}
              onSubmit={handleSubmit}
              validationSchema={SignInSchema}
              enableReinitialize
            >
              {(formik: any) => {
                const { errors, touched } = formik;
                return (
                  <form
                    className="row g-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      formik.handleSubmit(e);
                    }}
                    noValidate
                  >
                    <br />
                    <Grid container spacing={3}>
                      <Grid item xs={6} className="p-1">
                        <TextField
                          variant="outlined" value={formik.values.firstName ? formik.values.firstName : ""} onChange={(e) => { formik.setFieldValue("firstName", e.target.value); }}
                          type="text" id="firstName" name="firstName" label={Applicationlabel.addUser.firstName} className="form-control" autoComplete="off" />
                        <br />
                        <ErrorMessage
                          name="firstName" component="span" className="error" />{" "}
                      </Grid>
                      <br />

                      <Grid item xs={6} className="p-1">
                        <TextField
                          variant="outlined" value={formik.values.lastName ? formik.values.lastName : ""} onChange={(e) => { formik.setFieldValue("lastName", e.target.value); }}
                          type="text" id="lastName" name="lastName" label={Applicationlabel.addUser.lastName} className="form-control" autoComplete="off" />
                        <br />
                        <ErrorMessage 
                          name="lastName" component="span" className="error" />{" "}
                      </Grid>
                      <br />

                      <Grid item xs={6} className="p-1">
                        <TextField
                          variant="outlined" value={formik.values.employeeId ? formik.values.employeeId : ""} onChange={(e) => { formik.setFieldValue("employeeId", e.target.value);}}
                          type="number" inputProps={{ min: "1"}} id="employeeId" name="employeeId" label={Applicationlabel.addUser.empId} autoComplete="off" className="form-control"
                          onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} />
                        <br />
                        <ErrorMessage 
                          name="employeeId" component="span" className="error" />{" "}
                        </Grid>
                        <br/>

                         <Grid item xs={6} className="p-1">
                        <TextField
                          variant="outlined" value={formik.values.email ? formik.values.email : ""} onChange={(e) => { formik.setFieldValue("email", e.target.value);}}
                          type="email" id="email" name="email" label={Applicationlabel.addUser.email} className="form-control" autoComplete="off" />
                        <br />
                        <ErrorMessage
                          name="email" component="span" className="error"/>{""}
                      </Grid>
                      <br />

                      <Grid item xs={6} className="p-1">
                        <TextField
                          variant="outlined" value={formik.values.mobileNumber ? formik.values.mobileNumber : ""} onChange={(e) => { formik.setFieldValue("mobileNumber", e.target.value);}}
                          type="text" id="mobileNumber" name="mobileNumber" label={Applicationlabel.addUser.mobile} className="form-control" autoComplete="off"
                        />
                        <br />
                        <ErrorMessage
                          name="mobileNumber" component="span" className="error" />{" "}
                      </Grid>
                    
                      <Grid item xs={6} className="p-1">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            open={opend}
                            onOpen={() => setOpend(true)}
                            onClose={() => setOpend(false)}
                            value={formik.values.DateOfBirth ? formik.values.DateOfBirth : null}
                            inputFormat="DD-MM-YYYY"
                            disableFuture
                            onChange={(e: any) => {
                              formik.setFieldValue("DateOfBirth", e);
                            }}
                            renderInput= {(params) => <TextField  {...params}   inputProps={{...params.inputProps, readOnly: true}} variant="outlined" onClick={(e) => setOpend(true)}  label={Applicationlabel.addUser.dob} autoComplete="off" className="form-control"/>}
                            />
                        </LocalizationProvider>
                        <ErrorMessage
                          name="DateOfBirth" component="span" className="error" />{" "}
                      </Grid>

                      <Grid item xs={6} className="p-1">
                        <TextField variant="outlined" select onChange={(e: any) => { handleChange(e.target.value); formik.setFieldValue("gender", e.target.value); }} type="text" id="gender" name="gender" value={formik.values.gender} label={Applicationlabel.addUser.gender} className={
                          errors.reason && touched.reason
                            ? "form-control input-error  mt-1 text-left"
                            : "form-control text-left"
                        } autoComplete="off">
                          <MenuItem value="">{Applicationlabel.addUser.chooseGender}</MenuItem>
                          {genderType.map((name: any, i: any) => (<MenuItem value={name.value} key={i}>{name.value}</MenuItem>))}
                        </TextField>
                        <br />
                        <ErrorMessage 
                          name="gender" component="span" className="error" />{" "}
                      </Grid>
                      <br />

                      <Grid item xs={6} className="p-1">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            open={open}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)}
                            value={formik.values.dateOfJoining ? formik.values.dateOfJoining : null}
                            inputFormat="DD-MM-YYYY"
                            disableFuture
                            onChange={(e: any) => {
                              formik.setFieldValue("dateOfJoining", e);
                            }}
                            renderInput={(params) => <TextField  {...params}  inputProps={{...params.inputProps, readOnly: true}} name="dateOfJoining"  onClick={(e) => setOpen(true)} variant="outlined" label={Applicationlabel.addUser.doj} autoComplete="off" className="form-control" />}
                          />
                        </LocalizationProvider>
                        <ErrorMessage   
                          name="dateOfJoining" component="span" className="error" />{" "}
                      </Grid>
                      <br />

                      {!id && (
                        <>
                          <Grid item xs={6} className="p-1">
                            <div className="rel">
                              <TextField
                                variant="outlined" value={formik.values.password ? formik.values.password : ""} onChange={(e:any) => { handlePasswordSubmit(e.target.value);
                                formik.setFieldValue("password", e.target.value);}}
                                type={!isVisible ? "password" : "text"} id="password" name="password" label={Applicationlabel.addUser.password} autoComplete="off"
                                className="form-control" onClick={onclick} onBlur={(e) => {setShow(false)}} />
                                 <span onClick={toggle} className="eye-ico">
                                 {isVisible ? <Visibility /> : <VisibilityOff />}
                                  </span>
                                {!show ? '' : 
                             <Password {...passwordcheck} />
                                }
                            </div>
                            <ErrorMessage 
                              name="password" component="span" className="error" />{" "}
                          </Grid>
                          <Grid item xs={6} className="p-1">
                            <div className="rel">
                              <TextField
                                variant="outlined" value={formik.values.confirmpassword ? formik.values.confirmpassword : ""}
                                onChange={(e) => { formik.setFieldValue("confirmpassword", e.target.value); }}
                                type={!isValue ? "password" : "text"} id="confirmpassword" name="confirmpassword" label={Applicationlabel.addUser.confirmPassword} 
                                autoComplete="off" className="form-control" />
                                  <span className="icon eye-ico" onClick={togle}>
                                     {isValue ? <Visibility /> : <VisibilityOff />}
                                   </span>
                             </div>
                            <ErrorMessage 
                              name="confirmpassword" component="span" className="error" />{" "}
                          </Grid>
                        </>
                      )}
                         <Grid item xs={6} className="p-1">
                        <TextField variant="outlined" select onChange={(e: any) => { handleChange(e.target.value); formik.setFieldValue("positionId", e.target.value); }} type="text" id="positionId" name="positionId" value={formik.values.positionId} label={Applicationlabel.addUser.designationRole} className={
                          errors.reason && touched.reason
                            ? "form-control input-error  mt-1 text-left"
                            : "form-control text-left"
                        } autoComplete="off"  >
                          <MenuItem value="">{Applicationlabel.addUser.chooseDesignationrole}</MenuItem>
                          {addPosition.map((name: any, i: any) => (<MenuItem value={name.id} key={i}>{name.name}</MenuItem>))}
                        </TextField>
                        <br />
                        <ErrorMessage 
                          name="positionId" component="span" className="error" />{" "}
                      </Grid>
                      <br/>
                      
                      <Grid item xs={6} className="p-1">
                        <TextField
                          variant="outlined" value={formik.values.designation ? formik.values.designation : ""} onChange={(e) => { formik.setFieldValue("designation", e.target.value); }}
                          type="text" id="designation" name="designation" label={Applicationlabel.addUser.designation} className="form-control" autoComplete="off" />
                        <br />
                        <ErrorMessage   
                          name="designation" component="span" className="error" />{" "}
                      </Grid>
                      <br />
                   

                      <Grid item xs={6} className="p-1">
                        <TextField
                          variant="outlined" value={formik.values.resqueToken ? formik.values.resqueToken : ""} onChange={(e) => { formik.setFieldValue("resqueToken", e.target.value); }}
                          type="text" id="resqueToken" name="resqueToken" label={Applicationlabel.addUser.rescue} className="form-control" autoComplete="off"/>
                        <br />
                        <ErrorMessage 
                          name="resqueToken" component="span" className="error" />{" "}
                      </Grid>
                      <br />
                      <Grid item xs={12} className="p-1">
                        <div className="previewProfilePic">
                          <img className="playerProfilePic_home_tile" 
                            src={
                              imgData != null
                                ? imgData : formik.values.profile
                                  ? `${BASE_URL}/` + formik.values.profile
                                  : ''} />
                          {!id && (
                            <>    {!formik.values.file ? <ImageIcon sx={{ fontSize: 100 }} /> : null}</>)}
                        </div>
                        <div className="uploadimagefile" ><label>{Applicationlabel.addUser.uploadImage}
                          <input id="file" name="file"  type="file" accept="image/*" onChange={(event) => {
                            if (event.currentTarget && event.currentTarget.files) {
                              if (event.currentTarget && event.currentTarget.files) { 
                                let fileData = event.currentTarget.files[0];
                                let mimeType = fileData.type;
                                if (mimeType.match(/image\/*/) == null) {
                                  return;
                                }
                                formik.setFieldValue("file", Object.values(event.currentTarget.files)[0]); }
                              const reader = new FileReader();
                              reader.addEventListener("load", () => {
                                setImgData(reader.result);
                              });
                              reader.readAsDataURL(event.currentTarget.files[0]);
                            }

                          }} autoComplete="off"
                            className="form-control"
                          />
                        </label>

                        </div>
                        <ErrorMessage
                          name="file"
                          component="span"
                          className="error error-text-upload"
                        />{" "}
                      </Grid>
                      <br />
                      <br />

                      <Grid item xs={12} className="p-1">
                        <div className="action-btn">
                          <Button
                            className="btn-fill pull-right update-profile"
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: "#049FD9", color: "#ffffff" }}
                          >
                            {Applicationlabel.button.submit}
                          </Button> &nbsp;&nbsp;
                          <Button
                            onClick={() => {
                              navigate("/user/active");
                            }}
                            className="btn-fill pull-right al-c"
                            type="submit"
                            variant="outlined"
                            style={{ backgroundColor: "white", border: "1px solid #049FD9" , color: "#049FD9"}}
                          >
                            {Applicationlabel.button.cancel}
                          </Button>
                        </div>
                      </Grid>

                      <div className="clearfix"></div>
                    </Grid>
                  </form>
                );
              }}
            </Formik>
          </CardContent>
        </Box>
      </Card>
    </>
  );
};
export default Adduser;
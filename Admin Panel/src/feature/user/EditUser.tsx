import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Formik, ErrorMessage } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../helpers/Services/user.service';
import DataPicker from "../../common/date-picker/DataPicker";
import moment from 'moment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BASE_URL } from '../../config/config';

const Adduser = () => {
  const userinfo: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities
  );
  const current = new Date();

  const initialValues: any = {
    userId: userinfo.id,
    companyId: userinfo.companyId,
    firstName: '',
    lastName: '',
    designation: '',
    roleId: '',
    email: '',
    resqueToken:'',
    mobileNumber: '',
    DOB: '',
    gender: '',
    employeeId: '',
    password: '',
    positionId: '',
    confirmpassword: '',
    dateOfJoining: '',
    file: '',
    profile: '',
  };
  const phoneRegExp =  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
  const [addRole, setAddRole] = useState<any>([]);
  const [addPosition, setAddPosition] = useState<any>([]);
  const [userData, setUserData] = useState<any>(initialValues);
  const [imgData, setImgData] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [opend, setOpend] = useState(false);
  const [dobdate, setDobdate] = useState('');
  const navigate = useNavigate();
  const genderType: any = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const { id } = useParams();
  async function geteditusers() {
    if (id) {
      const response = await userService.getUserById(id);
      if(response.data.DOB){  
        setDobdate(moment(new Date(response.data.DOB)).format('DD-MM-YYYY'))
      }
      if (response.status) {
        setUserData(response.data);
      } else {
        console.log('error');
      }
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
    if (values.DOB && values.DOB.$d) {
      values.DOB = `${String(values.DOB.$d.getDate()).padStart(2, "0")}-${String(values.DOB.$d.getMonth() + 1).padStart(2, "0")}-${values.DOB.$d.getFullYear()}`;
    }
    if (values.dateOfJoining && values.dateOfJoining.$d) {
      values.dateOfJoining = `${String(values.dateOfJoining.$d.getDate()).padStart(2, "0")}-${String(values.dateOfJoining.$d.getMonth() + 1).padStart(2, "0")}-${values.dateOfJoining.$d.getFullYear()}`;

    }
    let paramsData = new FormData();
    paramsData.append("firstName", values['firstName']);
    paramsData.append("lastName", values['lastName']);
    paramsData.append("designation", values['designation']);
    paramsData.append("DOB", values['DOB']); 
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
      if (response.data == false) {
        alert(response.message);
        return;
      }
      if (response.data) {
        navigate("/user");
      }
    }
    else {
      const response = await userService.postUser(values);
      if (response.data) {
        navigate('/user');
      }
    }
  };

  useEffect(() => {
    getRole();
    getPosition();
    geteditusers();
  }, []);

  const SignInSchema = Yup.object().shape({
    firstName: Yup.string()
    .trim().required('First Name is Required'),

    lastName: Yup.string()
    .trim().required('Last Name is Required'),

    roleId: Yup.string().trim().required('Select your Role'),

    email: Yup.string().trim().email().required('Email is Required'),

    positionId: Yup.string().trim().required('Designationrole  is required'),

    mobileNumber: Yup.string()
      .matches(phoneRegExp, "Mobile Number is Invalid")
      .trim().required("Mobile Number is Required"),

    DOB: Yup.date().required('Date Of Birth is Required'),

    gender: Yup.string().trim().required('Select your Gender'),

    employeeId: Yup.string().trim().required('Employee ID is Required'),

    designation: Yup.string().trim().required(' Designation is Required'),

    dateOfJoining: Yup.date()
    .when('DOB',
    (DOB, schema) => {
        if (DOB) {
        const dayAfter = new Date(DOB.getTime() + 86400000);
      
            return schema.min(dayAfter, 'Date Of Joining Is Must Greater Than DOB');
          }
          return schema;
    })
.required('Date Of Joining Is Required'),
  });

  const handleChange = (e: any) => {
    console.log('e--->', e);
  };

  const onKeyDown = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <Card sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto', margin: '0px 100px' }}>
            <Grid>
              <p
                style={{ float: 'left', fontSize: '22px', fontWeight: 500 }}
                className="fw-bolder"
              >
                Edit User Profile
              </p>
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
                    }} noValidate>
                    <Grid container spacing={3}>
                      <Grid item xs={6} className="p-1">
                        <TextField
                          variant="outlined" value={formik.values.firstName ? formik.values.firstName : ''} onChange={formik.handleChange}
                          type="text" id="firstName" name="firstName" label="First Name*" className="form-control" autoComplete="off" />
                        <br />
                        <ErrorMessage name="firstName" component="span" className="error" />{' '}
                      </Grid>
                      <br />
                      <Grid item xs={6} className="p-1">
                        <TextField variant="outlined" value={formik.values.lastName ? formik.values.lastName : ''} onChange={(e) => { formik.setFieldValue('lastName', e.target.value); }}
                          type="text" id="lastName" name="lastName" label="Last Name*" className="form-control" autoComplete="off" color="secondary" />
                        <br />
                        <ErrorMessage
                          name="lastName" component="span" className="error" />{' '}
                      </Grid>
                      <br />
                      <Grid item xs={6} className="p-1">
                        <TextField
                          variant="outlined" value={formik.values.designation ? formik.values.designation : ''} onChange={(e) => { formik.setFieldValue('designation', e.target.value); }}
                          type="text" id="designation" name="designation" label="Designation*" className="form-control" autoComplete="off" color="secondary" />
                        <br />
                        <ErrorMessage
                          name="designation" component="span" className="error" />{' '}
                      </Grid>
                      <br />
                      <Grid item xs={6} className="p-1">
                        <TextField variant="outlined" select onChange={(e: any) => { handleChange(e.target.value); formik.setFieldValue('roleId', e.target.value) }}
                          type="text" id="roleId" name="roleId" value={formik.values.roleId} label="Role*" className={errors.reason && touched.reason
                            ? 'form-control input-error  mt-1'
                            : 'form-control'} autoComplete="off">

                          <MenuItem value="">Choose Role</MenuItem>
                          {addRole.map((val: any, i: any) => (
                            <MenuItem value={val.id} key={i}> {val.roleName} </MenuItem>
                          ))}
                        </TextField>
                        <br />
                        <ErrorMessage name="roleId" component="span" className="error" />{' '}
                      </Grid>
                      <br />
                      <Grid item xs={6} className="p-1">

                        <TextField variant="outlined" value={formik.values.email ? formik.values.email : ''} onChange={(e) => { formik.setFieldValue('email', e.target.value); }}
                          type="email" id="email" name="email" label="Email*" className="form-control" autoComplete="off" color="secondary" />
                        <br />
                        <ErrorMessage name="email" component="span" className="error" /> {''}
                      </Grid>
                      <br />

                      <Grid item xs={6} className="p-1">
                        <TextField variant="outlined" value={formik.values.resqueToken ? formik.values.resqueToken : ''} onChange={(e) => { formik.setFieldValue('resqueToken', e.target.value); }}
                          type="text" id="resqueToken" name="resqueToken" label="Resque Time Token" className="form-control" autoComplete="off" color="secondary" />
                        <br />
                        <ErrorMessage name="resqueToken" component="span" className="error" />{' '}
                      </Grid>
                      <br />

                      <Grid item xs={6} className="p-1">

                        <TextField variant="outlined" value={formik.values.mobileNumber ? formik.values.mobileNumber : ''} onChange={(e) => { formik.setFieldValue('mobileNumber', e.target.value) }}
                          type="text" id="mobileNumber" name="mobileNumber" label="Mobile Number*" color="secondary" className="form-control" autoComplete="off" />
                        <br />
                        <ErrorMessage name="mobileNumber" component="span" className="error" />{' '}

                      </Grid>
                      <br />
                      <Grid item xs={6} className="p-1">
                         <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            open={opend}
                            onOpen={() => setOpend(true)}
                            onClose={() => setOpend(false)}
                            value={formik.values.DOB}
                            disableFuture
                            inputFormat="DD-MM-YYYY"
                            onChange={(e: any) => {
                              formik.setFieldValue('DOB', e);

                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                label="Date Of Birth"
                                name="DOB"
                                onClick={(e) => setOpend(true)}
                                 onKeyDown={onKeyDown}
                                autoComplete="off"
                                className="form-control"
                              />
                            )}
                          />

                        </LocalizationProvider>
                        {/* <DataPicker formValue={formik.values.DOB} formik={formik} value={new Date(formik.values.DOB) }
                             labelName="Date Of Birth*" type="date" onChange={formik.handleChange} disableFuture={true} inputFormat="DD-MM-YYYY" fieldName="DOB" errors={errors} touched={touched} handleSubmit={false}/> */}
                        <ErrorMessage
                          name="DOB"
                          component="span"
                          className="error"
                        />{" "}
                      </Grid>
                      <br />
                      <Grid item xs={6} className="p-1">
                        <TextField variant="outlined" select onChange={(e: any) => { handleChange(e.target.value); formik.setFieldValue('gender', e.target.value); }}
                          type="text" id="gender" name="gender" value={formik.values.gender} label="Gender*" className={errors.reason && touched.reason
                            ? 'form-control input-error  mt-1'
                            : 'form-control'} autoComplete="off" >
                          <MenuItem value="">Choose gender</MenuItem>
                          {genderType.map((name: any, i: any) => (
                            <MenuItem value={name.value} key={i}> {name.value}  </MenuItem>
                          ))}
                        </TextField>
                        <br />
                        <ErrorMessage name="gender" component="span" className="error" />{' '}
                      </Grid>
                      <br />
                      <Grid item xs={6} className="p-1">
                        <TextField variant="outlined" value={formik.values.employeeId ? formik.values.employeeId : ''} onChange={(e) => { formik.setFieldValue('employeeId', e.target.value); }}
                          type="number" id="employeeId" name="employeeId" label="Employee ID Number*" color="secondary" autoComplete="off" className="form-control" />
                        <br />
                        <ErrorMessage name="employeeId" component="span" className="error" />{' '}
                      </Grid>
                      <Grid item xs={6} className="p-1">
                        <TextField variant="outlined" select onChange={(e: any) => { handleChange(e.target.value); formik.setFieldValue('positionId', e.target.value); }}
                          type="text" id="positionId" name="positionId" value={formik.values.positionId} label="DesignationRole*" className={errors.reason && touched.reason
                            ? 'form-control input-error  mt-1'
                            : 'form-control'} autoComplete="off"  >

                          <MenuItem value="">Choose Designation Role</MenuItem>
                          {addPosition.map((name: any, i: any) => (
                            <MenuItem value={name.id} key={i}> {name.name} </MenuItem>
                          ))}
                        </TextField>
                        <br />

                        <ErrorMessage name="positionId" component="span" className="error" />{' '}
                      </Grid>

                      <Grid item xs={6} className="p-1">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                           open={open}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)}
                            value={formik.values.dateOfJoining}
                            inputFormat="DD-MM-YYYY"
                            disableFuture
                            onChange={(e: any) => {
                              formik.setFieldValue('dateOfJoining', e);
                            }}

                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                onKeyDown={onKeyDown}
                                onClick={(e) => setOpen(true)}
                                label="Date Of Joining"
                                name="dateOfJoining"
                                autoComplete="off"
                                className="form-control"
                              />
                            )}
                          />
                        </LocalizationProvider>
                        <br />
                        <ErrorMessage
                          name="dateOfJoining"
                          component="span"
                          className="error"
                        />{' '}
                        {/* <DataPicker formValue={formik.values.dateOfJoining} formik={formik} value={formik.values.dateOfJoining ? formik.values.dateOfJoining : ""}
                             labelName="Date Of Joining*" disableFuture={true}  inputFormat="DD-MM-YYYY" fieldName="dateOfJoining" errors={errors} touched={touched} handleSubmit={false}/>
                             <ErrorMessage
                            name="dateOfJoining"
                            component="span"
                            className="error"
                          />{" "} */}
                      </Grid>
                      <br />
                      <Grid item xs={12} className="p-1">
                        <div className="previewProfilePic">
                          <img
                            className="playerProfilePic_home_tile"
                            src={

                              imgData != null
                                ? imgData : formik.values.profile
                                  ? `${BASE_URL}/` + formik.values.profile
                                  : ''} />
                        </div>
                        <div  className="uploadimagefile" ><label>Upload Image
                        <input id="file" name="file" type="file" onChange={(event) => {
                          if (
                            event.currentTarget &&
                            event.currentTarget.files
                          ) {
                            formik.setFieldValue('file', event.currentTarget.files[0]);
                            const reader = new FileReader();
                            reader.addEventListener('load', () => {
                              setImgData(reader.result);
                            });
                            reader.readAsDataURL(
                              event.currentTarget.files[0]
                            );
                          }
                        }}
                          autoComplete="off" className="form-control" />
                          </label>
                          </div>
                        <br />
                        <ErrorMessage name="file" component="span" className="error" />{' '}
                      </Grid>
                      <br />
                      <br />

                      <Grid item xs={12} className="p-1">
                        <div className="action-btn">
                          <Button
                            className="btn-fill pull-right update-profile"
                            type="submit"
                            variant="contained"
                            color="secondary"
                          >
                            submit
                          </Button>&nbsp;&nbsp;
                          
                          <Button
                            onClick={() => {
                              navigate('/user');
                            }}
                            className="btn-fill pull-right"
                            variant="outlined"
                            color="secondary"
                          >
                            cancel
                          </Button> 
                        </div>
                      </Grid>

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

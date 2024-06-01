import React from 'react';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Formik, ErrorMessage, FieldArray, Field, Form } from "formik";
import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Applicationlabel from "../../common/en.json";

const CandidateOnboardingstep1 = () => {
    const initialValues: any = {
        name: "",
        email: "",
        mobileNo: "",
        dateofBirth: "",
        //emergencyContact: "",
        bloodGroup: "",
        currentAddress: "",
        PermanentAddress: "",
        //whoareThey:"",
        emergencyContact: [{
          emergencyContact: "",
          whoareThey:"",
      }]
    };
    const Add:any={
      emergencyContact: "",
      whoareThey:"",
    }

  const currentdate = new Date();
  currentdate.setFullYear(currentdate.getFullYear() - 14)
 
  const phoneRegExp=/^((\+[1-9\s ()-]*[-]?)|(\([0-9]*\)[ -]?)|(?!.*0{10})([0-9\s ()-])*)$/;
  const nameRegExp=  /^[A-Z@~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-]*$/i;

  const [age, setAge] = React.useState('');
  const [userData, setUserData] = useState<any>(initialValues);
  const [formFields, setFormFields] = useState<any>([{Add}]);
  const [open, setOpen] = useState(false);
  const [isDisable,setIsDisable]=useState(false);

  console.log("open",open);

  const whoareThey: any = [
    { label: Applicationlabel.OnboardingStep1.spouse, value: "Spouse" },
    { label: Applicationlabel.OnboardingStep1.father, value: "Father" },
    { label: Applicationlabel.OnboardingStep1.mother, value: "Mother" },
    { label: Applicationlabel.OnboardingStep1.Guardian , value: "Guardian"},
  ];

  const handleChange = (event: any) => {
    setAge(event.target.value as string);
    //formik.setFieldValue("dateofBirth", e);
  };
  const handleSubmit = async (values: any) => {
    // values
    console.log("values-->",values)
  }

  const addFields = () => {
    let object = {
      emergencyContact: "",
      whoareThey: ""
    }
    setFormFields([...formFields, object])
   
  }


  const SignInSchema = Yup.object().shape({
    // name: Yup.string().trim()
    // .matches(nameRegExp,Applicationlabel.OnboardingStep1Schema.namematch)
    // .required(Applicationlabel.OnboardingStep1Schema.name),
    // email: Yup.string().trim().email(Applicationlabel.OnboardingStep1Schema.emailvalid)
    // .required(Applicationlabel.OnboardingStep1Schema.email),
    //   mobileNo: Yup.string().trim()
    // .matches(phoneRegExp,Applicationlabel.OnboardingStep1Schema.mobilenumberinvalid)
    // .min(6, Applicationlabel.OnboardingStep1Schema.numberatlest)
    // .required(Applicationlabel.OnboardingStep1Schema.mobileNumber),
    // dateofBirth: Yup.string().trim().required(Applicationlabel.OnboardingStep1Schema.dob),
    // emergencyContact: Yup.string().trim()
    // .matches(phoneRegExp,Applicationlabel.OnboardingStep1Schema.emergencyContactinvalid)
    // .required(Applicationlabel.OnboardingStep1Schema.emergencyContact),
    // bloodGroup: Yup.string().trim().required(Applicationlabel.OnboardingStep1Schema.bloodGroup),
    // PermanentAddress: Yup.string().trim().required(Applicationlabel.OnboardingStep1Schema.permanentAddress),
    // currentAddress: Yup.string().trim().required(Applicationlabel.OnboardingStep1Schema.currentaddress),
  });


  return (
    <div className="mt40">
     
      <Card className="candidate-card mt40">
        <div className="step-text1">{Applicationlabel.OnboardingStep1.step1}</div>
        <div className="step-text">{Applicationlabel.OnboardingStep1.personaldetails}</div>
        {/* Step 1 */}
      
          <Formik
              validationSchema={SignInSchema}
              initialValues={userData}
              onSubmit={handleSubmit}
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
                    <>
      </>
        <div className="step-card">
          <TextField
            id="name"
            type="text"
            name='name'
            label={Applicationlabel.OnboardingStep1.name}
            onChange={formik.handleChange}
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
            autoComplete="off"
          />
           <ErrorMessage
             name="name"
             component="span"
             className="error"
             />{""}

          <TextField
            id="email"
            type="email"
            name="email"
            label={Applicationlabel.OnboardingStep1.email}
            onChange={formik.handleChange}
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
            autoComplete="off"
          />
           <ErrorMessage
             name="email"
             component="span"
             className="error"
             />{""}

           <TextField
            id="mobileNo"
            type="email"
            name="mobileNo"
            label={Applicationlabel.OnboardingStep1.mobileNumber}
            onChange={formik.handleChange}
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
            autoComplete="off"
          />
           <ErrorMessage
             name="mobileNo"
             component="span"
             className="error"
             />{""}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              value={formik.values.dateofBirth ? formik.values.dateofBirth : null}
              maxDate={currentdate}
              inputFormat="DD-MM-YYYY"
              onChange={(e: any) => {
                formik.setFieldValue("dateofBirth", e);
              }}
              renderInput= {(params) => <TextField  {...params}   inputProps={{...params.inputProps, readOnly: true}}  
              id="dateofBirth"
              type="date"
              name="dateofBirth"
              label={Applicationlabel.OnboardingStep1.dob}
              onChange={formik.handleChange}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              className="mb15"
              autoComplete="off"
               onClick={(e) => setOpen(true)}/>}
                />
              </LocalizationProvider>
          <ErrorMessage
             name="dateofBirth"
             component="span"
             className="error"
             />{""}

          <TextField
            id="bloodGroup"
            type="text"
            name="bloodGroup"
            label={Applicationlabel.OnboardingStep1.bloodGroup}
            onChange={formik.handleChange}
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
            autoComplete="off"
          />
          <ErrorMessage
             name="bloodGroup"
             component="span"
             className="error"
             />{""}
<Grid container spacing={2}>
{formFields.map((form:any, index:number) => {
   if (index < 4 ){ 
    if(index==3){
      setIsDisable(true)
    }
   return(
    <>
    {/* <FieldArray
                        name="selectedItems"
                        render={arrayHelpers => (
                            <div>
                                {formik.values.emergencyContact && formik.values.emergencyContact.length > 0 ? (
                                    formik.values.emergencyContact.map((item: any, index: any) => (
                                        <div key={index}>
                                            <Field as="div"
                                                   name={`emergencyContact${[0]}.whoareThey`}
                                            >
                                                <select name={`emergencyContact.${[0]}.whoareThey`}
                                                        //multiple={true}
                                                        className="form-control"
                                                        value={item._id}
                                                        onChange={(event) => {
                                                            handleChange(event);
                                                        }}
                                                > */}
                                                    {/* <option value={formik.values.emergencyContact.whoareThey}>
                                                        Choisir items
                                                    </option> */}
                                                    {/* {whoareThey.map((name: any, i: any) => (<option value={name.value} key={i}>{name.value}</option>))} */}
                                                    {/* {itemList(items)} // data from api */}
                                                {/* </select>
                                            </Field>
                                        </div>
                                    ))
                                ) : null} */}
                                {/* <div>
                                    <div>
                                        <button type="submit">Submit</button>
                                    </div>
                                </div> */}
                            {/* </div>
                        )}
                    /> */}
            <Grid item lg={7}>
              <TextField
                id="emergencyContact"
                type="text"
                name="emergencyContact"
                label={Applicationlabel.OnboardingStep1.emergencyContact}
                onChange={formik.handleChange}
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
                className="mb15"
                autoComplete="off"
              />
               <ErrorMessage
             name="emergencyContact"
             component="span"
             className="error"
             />{""}
            </Grid>
            <Grid item lg={3}>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                className="text-left"
              >
                <InputLabel id="demo-simple-select-label">
                  {Applicationlabel.OnboardingStep1.whoarekey}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label= {Applicationlabel.OnboardingStep1.whoarekey}
                  name="whoareThey"
                  value ={age}
                  onChange={(event: SelectChangeEvent) => {
                    setAge(event.target.value as string);
                    formik.setFieldValue("whoareThey", event.target.value as string);
                  }}
                  //value={formik.values[0].initialValues.whoareThey}
                  className="mb15 "
                  autoComplete="off"
                >
                 {whoareThey.map((name: any, i: any) => (<MenuItem value={name.value} key={i}>{name.value}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
          
            </>
            )
   }
  
})}
            <Grid item lg={2}>
              <Button variant="contained" className="mt8 fw btn2 mt40" onClick={addFields} disabled={isDisable}>
                {Applicationlabel.button.add}
              </Button>
            </Grid>
            </Grid>
          <TextField
            id="outlined-multiline-static"
            label={Applicationlabel.OnboardingStep1.currentAddress}
            name="currentAddress"
            multiline
            onChange={formik.handleChange}
            rows={4}
            fullWidth
            margin="dense"
            className="mb15"
            autoComplete="off"
          />
           <ErrorMessage
             name="currentAddress"
             component="span"
             className="error"
             />{""}
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              label={Applicationlabel.OnboardingStep1.sameas}
              className="mb10 "
            />
          </FormGroup>
          <TextField
            id="outlined-multiline-static"
            label={Applicationlabel.OnboardingStep1.permanentaddress}
            name="PermanentAddress"
            onChange={formik.handleChange}
            multiline
            rows={4}
            fullWidth
            margin="dense"
            className="mb15 mt3"
            autoComplete="off"
          />
            <ErrorMessage
             name="PermanentAddress"
             component="span"
             className="error"
             />{""}
          <div className="mt40">
            <Button variant="contained"  type="submit" className="mt15 fright btn1">
            {Applicationlabel.button.next}
            </Button>
          </div>
        </div>
        </form>
         );
        }}
         </Formik>
      </Card>
    </div>
  );
};

export default CandidateOnboardingstep1;

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

// import { Dayjs } from 'dayjs';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// const [value, setValue] = React.useState<Dayjs | null>(null);
const steps = [
  'Personal Details',
  'Skills',
  'Experience',
  'Academics',
  'Certified Courses',
  'Personal Identification Documents',
  'Resume Upload',
];

const CandidateOnboarding = () => {
  const [age, setAge] = React.useState('');
  const [skills, setskills] = React.useState('');
  const [level, setlevel] = React.useState('');
  const [tools, settools] = React.useState('');
  const [toollevels, settoollevels] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const skillshandleChange = (event: SelectChangeEvent) => {
    setskills(event.target.value as string);
  };
  const levelhandleChange = (event: SelectChangeEvent) => {
    setlevel(event.target.value as string);
  };
  const toolshandleChange = (event: SelectChangeEvent) => {
    settools(event.target.value as string);
  };
  const toollevelshandleChange = (event: SelectChangeEvent) => {
    settoollevels(event.target.value as string);
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <div className="mt40">
      {/* <h3 className="card-title">Candidate Onboard</h3> */}
      <Box sx={{ width: '100%' }}>
        <Stepper nonLinear activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              Step {activeStep + 1}
            </Typography> */}
              {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'none' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))}
            </Box> */}
            </React.Fragment>
          )}
        </div>
      </Box>
      <Card className="candidate-card mt40">
        <div className="step-text1">Step 1</div>
        <div className="step-text">Personal details </div>
        {/* Step 1 */}
        <div className="step-card">
          <TextField
            id=""
            type="text"
            label="Name"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="email"
            label="Email address"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="date"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Blood group"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <Grid container spacing={2}>
            <Grid item lg={7}>
              <TextField
                id=""
                type="text"
                label="Emergency contact number"
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
                className="mb15"
              />
            </Grid>
            <Grid item lg={3}>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                className="text-left"
              >
                <InputLabel id="demo-simple-select-label">
                  Who are they
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Who are they"
                  onChange={handleChange}
                  className="mb15 "
                >
                  <MenuItem value={10}>Spouse</MenuItem>
                  <MenuItem value={20}>Father</MenuItem>
                  <MenuItem value={30}>Mother</MenuItem>
                  <MenuItem value={40}>Guardian</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={2}>
              <Button variant="contained" className="mt8 fw btn2 mt40">
                Add
              </Button>
            </Grid>
          </Grid>
          <TextField
            id="outlined-multiline-static"
            label="Current Address"
            multiline
            rows={4}
            fullWidth
            margin="dense"
            className="mb15"
          />
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Same as current address"
              className="mb10 "
            />
          </FormGroup>
          <TextField
            id="outlined-multiline-static"
            label="Permanent Address"
            multiline
            rows={4}
            fullWidth
            margin="dense"
            className="mb15 mt3"
          />
          <div className="mt40">
            <Button variant="contained" className="mt15 fright btn1">
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Card className="candidate-card ">
        {/* Step 2 */}
        <div className="step-card clear">
          <div className="step-text1">Step 2</div>
          <div className="step-text">Skills</div>

          <TextField
            id=""
            type="text"
            label="Designation"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Domain(E-Commerce, ERP, Banking, etc.,)"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          {/* SKILLS */}
          <Grid container spacing={2}>
            <Grid item lg={7}>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                className="text-left"
              >
                <InputLabel id="demo-simple-select-label">Skills</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={skills}
                  label="Skills"
                  onChange={skillshandleChange}
                  className="mb15 "
                >
                  <MenuItem value={10}>C++</MenuItem>
                  <MenuItem value={11}>Java</MenuItem>
                  <MenuItem value={12}>Python</MenuItem>
                  <MenuItem value={13}>HTML</MenuItem>
                  <MenuItem value={14}>CSS</MenuItem>
                  <MenuItem value={15}>Java script</MenuItem>
                  <MenuItem value={16}>Type script</MenuItem>
                  <MenuItem value={17}>SQL</MenuItem>
                  <MenuItem value={18}>React Js</MenuItem>
                  <MenuItem value={19}>Node Js</MenuItem>
                  <MenuItem value={20}>Angular Js</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={3}>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                className="text-left"
              >
                <InputLabel id="demo-simple-select-label">Level</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={level}
                  label="Age"
                  onChange={levelhandleChange}
                  className="mb15 "
                >
                  <MenuItem value={10}>Beginner</MenuItem>
                  <MenuItem value={20}>Practitioner</MenuItem>
                  <MenuItem value={30}>Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={2}>
              <Button variant="contained" className="mt8 fw btn2">
                Add
              </Button>
            </Grid>
          </Grid>
          {/* TOOLs */}
          <Grid container spacing={2}>
            <Grid item lg={7}>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                className="text-left"
              >
                <InputLabel id="demo-simple-select-label">Tools</InputLabel>
                <Select
                  labelId="tools"
                  id="tools"
                  value={tools}
                  label="Tools"
                  onChange={toolshandleChange}
                  className="mb15 "
                >
                  <MenuItem value={10}>Jira</MenuItem>
                  <MenuItem value={11}>Azure</MenuItem>
                  <MenuItem value={12}>Asana</MenuItem>
                  <MenuItem value={13}>Selenium</MenuItem>
                  <MenuItem value={14}>Test Rail</MenuItem>
                  <MenuItem value={15}>Qase</MenuItem>
                  <MenuItem value={16}>Figma</MenuItem>
                  <MenuItem value={17}>Adobe XD</MenuItem>
                  <MenuItem value={18}>Photoshop</MenuItem>
                  <MenuItem value={19}>MS Excel</MenuItem>
                  <MenuItem value={20}>MS Office</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={3}>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                className="text-left"
              >
                <InputLabel id="demo-simple-select-label">Level</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={toollevels}
                  label="level"
                  onChange={toollevelshandleChange}
                  className="mb15 "
                >
                  <MenuItem value={13}>Beginner</MenuItem>
                  <MenuItem value={20}>Practitioner</MenuItem>
                  <MenuItem value={30}>Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={2}>
              <Button variant="contained" className="mt8 fw btn2">
                Add
              </Button>
            </Grid>
          </Grid>
          <div className="jc-b flex mt40 ">
            <Button variant="contained" className="mt15 fright btn2">
              Back
            </Button>
            <Button variant="contained" className="mt15 fright btn1">
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Step 3 */}
      <Card className="candidate-card ">
        <div className="step-card clear">
          <div className="step-text1">Step 3</div>
          <div className="step-text">Experience</div>

          <TextField
            id=""
            type="text"
            label="Total year of work experience "
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Total year of work experience in IT (ex: 2.5)"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Previous Company Name"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Designation"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Domain"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <Grid container spacing={2}>
            <Grid item lg={6}>
              <TextField
                id=""
                type="date"
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
                className="mb15"
                label="Joined Date "
              />
            </Grid>
            <Grid item lg={6}>
              <TextField
                id=""
                type="date"
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
                className="mb15"
                label="Relieving Date "
              />
            </Grid>
          </Grid>

          <TextField
            id=""
            type="text"
            label="Total number of Organization worked Previously (Numbers)"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />

          <div className="jc-b flex mt40">
            <Button variant="contained" className="mt15 fright btn2">
              Back
            </Button>
            <Button variant="contained" className="mt15 fright btn1">
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Step 4 */}
      <Card className="candidate-card ">
        <div className="step-card clear">
          <div className="step-text1">Step 4</div>
          <div className="step-text">Academics</div>
          {/* PG */}
          <div>
            <div className="textleft pg-text">PG - ACADEMICS</div>
            <TextField
              id=""
              type="text"
              label="PG Organization name "
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              className="mb15"
            />
            <Grid container spacing={2} className="mb15">
              <Grid item lg={4}>
                <TextField
                  id=""
                  type="text"
                  label="Branch"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  id=""
                  type="text"
                  label="Percentage"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  id=""
                  type="text"
                  label="Year of Pass out "
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
            </Grid>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Button variant="contained" component="label" className="btn2">
                Consolidated Mark Sheet upload
                <input hidden accept="image/*" multiple type="file" />
              </Button>
              <span>Fila name</span>
            </Stack>
            <div className="divider-line"></div>
          </div>
          {/* UG */}
          <div>
            <div className="textleft pg-text">UG - ACADEMICS</div>
            <TextField
              id=""
              type="text"
              label="UG Organization name "
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              className="mb15"
            />
            <Grid container spacing={2} className="mb15">
              <Grid item lg={4}>
                <TextField
                  id=""
                  type="text"
                  label="Branch"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  id=""
                  type="text"
                  label="Percentage"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  id=""
                  type="text"
                  label="Year of Pass out "
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
            </Grid>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Button variant="contained" component="label" className="btn2">
                Consolidated Mark Sheet upload
                <input hidden accept="image/*" multiple type="file" />
              </Button>
              <span>File name</span>
            </Stack>
            <div className="divider-line"></div>
          </div>
          {/* Diploma */}
          <div>
            <div className="textleft pg-text">Diploma - ACADEMICS</div>
            <TextField
              id=""
              type="text"
              label="Diploma Organization name "
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              className="mb15"
            />
            <Grid container spacing={2} className="mb15">
              <Grid item lg={4}>
                <TextField
                  id=""
                  type="text"
                  label="Branch"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  id=""
                  type="text"
                  label="Percentage"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  id=""
                  type="text"
                  label="Year of Pass out "
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
            </Grid>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Button variant="contained" component="label" className="btn2">
                Consolidated Mark Sheet upload
                <input hidden accept="image/*" multiple type="file" />
              </Button>
              <span>File name</span>
            </Stack>
            <div className="divider-line"></div>
          </div>
          {/* 12th */}
          <div>
            <div className="textleft pg-text">12th - ACADEMICS</div>
            <TextField
              id=""
              type="text"
              label="12th School Name "
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              className="mb15"
            />
            <Grid container spacing={2} className="mb15">
              <Grid item lg={6}>
                <TextField
                  id=""
                  type="text"
                  label="Percentage"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  id=""
                  type="text"
                  label="Year of Pass out "
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
            </Grid>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Button variant="contained" component="label" className="btn2">
                Photo Copy of Marksheet upload
                <input hidden accept="image/*" multiple type="file" />
              </Button>
              <span>File name</span>
            </Stack>
            <div className="divider-line"></div>
          </div>
          {/* 10th */}
          <div>
            <div className="textleft pg-text">10th - ACADEMICS</div>
            <TextField
              id=""
              type="text"
              label="10th School Name "
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              className="mb15"
            />
            <Grid container spacing={2} className="mb15">
              <Grid item lg={6}>
                <TextField
                  id=""
                  type="text"
                  label="Percentage"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  id=""
                  type="text"
                  label="Year of Pass out "
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="dense"
                  className="mb15"
                />
              </Grid>
            </Grid>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Button variant="contained" component="label" className="btn2">
                Photo Copy of Marksheet upload
                <input hidden accept="image/*" multiple type="file" />
              </Button>
              <span>File name</span>
            </Stack>
          </div>

          <div className="jc-b flex mt40 ">
            <Button variant="contained" className="mt15 fright btn2">
              Back
            </Button>
            <Button variant="contained" className="mt15 fright btn1">
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Step 5 */}
      <Card className="candidate-card ">
        <div className="step-card clear">
          <div className="step-text1">Step 5</div>
          <div className="step-text"> Certified Courses</div>

          <TextField
            id=""
            type="text"
            label="Course Name "
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Course Duration"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id="outlined-multiline-static"
            label="Certified Body"
            multiline
            rows={4}
            defaultValue="Default Value"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" component="label" className="btn2">
              Certificate Copy upload
              <input hidden accept="image/*" multiple type="file" />
            </Button>
            <span>File namey</span>
          </Stack>

          <div className="jc-b flex  mt40">
            <Button variant="contained" className="mt15 fright btn2">
              Back
            </Button>
            <Button variant="contained" className="mt15 fright btn1">
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Step 6 */}
      <Card className="candidate-card ">
        <div className="step-card clear">
          <div className="step-text1">Step 6</div>
          <div className="step-text"> Personal Identification Documents</div>

          <TextField
            id=""
            type="text"
            label="Aadhar Number "
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="PAN Number "
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Passport Number  "
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Bank Account Name "
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Bank Account Number "
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="IFSC Code "
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />
          <TextField
            id=""
            type="text"
            label="Bank Branch Location"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            className="mb15"
          />

          <div className="jc-b flex  mt40">
            <Button variant="contained" className="mt15 fright btn2">
              Back
            </Button>
            <Button variant="contained" className="mt15 fright btn1">
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Step 7 */}
      <Card className="candidate-card ">
        <div className="step-card clear">
          <div className="step-text1">Step 7</div>
          <div className="step-text"> Resume Upload</div>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" component="label" className="btn2">
              Current CV upload
              <input hidden accept="image/*" multiple type="file" />
            </Button>
            <span>File name</span>
          </Stack>

          <div className="jc-b flex  mt40">
            <Button variant="contained" className="mt15 fright btn2">
              Back
            </Button>
            <Button variant="contained" className="mt15 fright btn1">
              Finish
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CandidateOnboarding;

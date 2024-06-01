import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";

export default function MonthPicker(props:any) {
  const errorFieldName = `${props.errors}.${props.fieldName}`;
  const touchedFieldName = `${props.touched}.${props.fieldName}`;
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          // disablePast={props.disablePast}
          views = {["year", "month"]}
          value={props.formValue}
          onChange={(newValue: any) => {
            props.formik.setFieldValue(props.fieldName, newValue);
            if (props.handleSubmit) {
              props.formik.handleSubmit(newValue);
            }
          }}
          label={props.labelName}
          inputFormat={props.inputFormat}
          renderInput={(params: any) => <TextField name={props.fieldName} id={props.fieldName} value={ props.formValue }
          variant="standard" size="small" {...params} sx={{ width: "100%" }} className={`form-control ${errorFieldName && touchedFieldName} ? 'input-error  mt-1' : ''}`}/>}
        />
      </LocalizationProvider>
    );
  }

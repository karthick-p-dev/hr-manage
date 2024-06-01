import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";

export default function DataPicker(props:any) {
  const errorFieldName = `${props.errors}.${props.fieldName}`;
  const touchedFieldName = `${props.touched}.${props.fieldName}`;
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          open={props.open}
          onOpen={props.onOpen}
          onClose={props.onClose}
          disablePast={props.disablePast}
          disableFuture={props.disableFuture}
          minDate={props.minDate}
          value={props.formValue}
          onChange={(newValue: any) => {
            props.formik.setFieldValue(props.fieldName, newValue);
            if (props.handleSubmit) {
              props.formik.handleSubmit(newValue);
            }
          }}
          label={props.labelName}
          inputFormat={props.inputFormat}
          renderInput={(params: any) => <TextField {...params}   inputProps={{...params.inputProps, readOnly: props.readOnly}} name={props.fieldName} id={props.fieldName} onClick={props.onClick} value={ props.formValue } style={{width: `${props.width}`}}
          variant="standard" size="small" autoComplete="off"  className={`form-control ${errorFieldName && touchedFieldName} ? 'input-error  mt-1' : ''}`}/>}
          />
      </LocalizationProvider>
    );
  }

import React from "react";
import TextField from "@mui/material/TextField";

export default function InputField(props:any) {
    return (
    <TextField
      type={props.type}
      label={props.label}
      select={props.select}
      name={props.name}
      variant={props.variant}
      value={props.value}
      onChange={props.onChange}
      sx={{ width: 350 }}
      autoComplete={props.autoComplete}
      onBlur={props.onBlur}
      helperText={props.helperText}
      error={props.error}
      disabled={props.disabled}
      className={props.className}
      size={props.size}
      multiline={props.multiline}
      rows={props.rows || 1}
      maxRows={props.maxRows}
      placeholder={props.placeholder}
      InputLabelProps=
      {
        props.InputLabelProps
        ? { shrink: props.InputLabelProps }
        : undefined
      }
    />
    );
}

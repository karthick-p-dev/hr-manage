import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar ,{SnackbarOrigin} from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function SimpleSnackbar(props:any) {
  const handleClose = () => {
    // if (reason === 'clickaway') {
    //   return;
    // }
    props.setToast(false);
  };

  const action = (
    <React.Fragment>
      {/* <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      {/* <Button onClick={handleClick}>Open simple snackbar</Button> */}
      <Snackbar
        open={props.showToast}
        autoHideDuration={3000}
        onClose={handleClose}
        message={props.message}
        action={action}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
       }}
      />
    </div>
  );
}

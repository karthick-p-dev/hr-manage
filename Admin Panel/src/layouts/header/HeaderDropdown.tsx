import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Notifications from "@mui/icons-material/Notifications";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@material-ui/core/Badge";
import Person from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import { onSignout } from "../../app/redux/actions/action";

const HeaderDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  function logout() {
    dispatch(onSignout());
    sessionStorage.removeItem("UserToken");
    // localStorage.clear();
    localStorage.removeItem("UserToken");
    navigate("/login");
  }

  return (

    <React.Fragment>
      {/* <IconButton aria-label="show  new notifications" color="inherit" >
              <Badge color="secondary">
                <Notifications />
              </Badge>
            </IconButton> */}
      <Tooltip title="">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2, color: "white" }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Person/>{user.userName}
          </IconButton>
        </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: "\"\"",
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick= { () => { navigate("/account"); }}>
          <Avatar />My Account
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout

        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default HeaderDropdown;

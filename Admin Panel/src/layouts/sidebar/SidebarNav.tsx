import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useSelector } from "react-redux";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import AppRoutes from "../../routes/AppRoutes";
import { useLocation } from "react-router-dom";


const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function SidebarNav({ NavItemList }: any) {
  
const location = useLocation();
  const navigate = useNavigate();
  const user: any = useSelector(
    (state: any) => state && state.signReducer && state.signReducer.entities,
  );
  const userposition = JSON.parse(user.position.permissionJson);
  console.log(
    "user.position.permissionJson",
    JSON.parse(user.position.permissionJson),
  );
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const changeColor = { backgroundImage : `linear-gradient(90deg, rgba(4,159,217,1) 0%, rgba(126,191,83,1) 50%, rgba(87,160,39,1) 100%)`};
  const [objectsList, setObjectsList] = React.useState(NavItemList);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const arr = [...objectsList];
    for (let i = 0; i < arr.length; i += 1) {
      arr[i].isVisible = true;
      arr[i].isDisable = true;
      if (Object.prototype.hasOwnProperty.call(arr[i], "children")) {
        for (let j = 0; j < arr[i].children.length; j += 1) {
          arr[i].children[j].isVisible = true;
          arr[i].children[j].isDisable = true;
        }
      }
    }

    for (let i = 0; i < arr.length; i += 1) {
      for (let j = 0; j < userposition.length; j += 1) {
        if (arr[i].checkname && (arr[i].checkname.toLowerCase() === userposition[j].name.toLowerCase()) && !userposition[j].isVisible) {
          arr[i].isVisible = userposition[j].isVisible;
          arr[i].isDisable = userposition[j].isDisable;
        } else if (Object.prototype.hasOwnProperty.call(arr[i], "children")) {
          arr[i].isOpen = false;
          for (let k = 0; k < arr[i].children.length; k += 1) {
            if (arr[i].children[k].checkname && userposition[j].name.toLowerCase() === arr[i].children[k].checkname.toLowerCase() && !userposition[j].isVisible) {
              arr[i].children[k].isVisible = userposition[j].isVisible;
              arr[i].children[k].isDisable = userposition[j].isDisable;
            }
          }
        }
      }
    }
    setObjectsList(arr);
  }, []);

  const handleClick = (item: any, linkPage: any) => {
    setObjectsList(
      objectsList.map((e: any) => (e.name === item.name ? { ...e, isOpen: !e.isOpen } : e)),  
    ); 
    if (linkPage) {
      navigate(linkPage);
    }
  };

  return (
    <>

    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar style={changeColor}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
         {!open ? <MenuIcon  /> : null}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="header-menu-right"
          >
            <b className="mt5">Great Innovus</b><div>{user && user.token && <Header />}</div>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="{item.listCities.id}"
          className="custom-sidebar"
        >
          {objectsList.map((item: any) => (
            <Box component="section" key={item.name}>
              {Object.prototype.hasOwnProperty.call(item, "isVisible") && item.isVisible ? (
                  <ListItemButton
                  selected={location.pathname.includes(item.to)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(item, item.to);

                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                    {item.isOpen && item.children !== undefined ? (
                      <ExpandLess />
                    ) : (
                      ""
                    )}
                    {!item.isOpen && item.children !== undefined ? (
                      <ExpandMore />
                    ) : (
                      ""
                    )}
                  </ListItemButton>
              ) : ""
            }
              <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children
                    && item.children.map((child: any, index: number) => (
                      <Box key = {index}>
                        {Object.prototype.hasOwnProperty.call(child, "isVisible")
                        && child.isVisible ? (
                          <ListItemButton 
                          selected={location.pathname.includes(child.to) || location.pathname.includes(child.attendanceabsent)}

                            onClick={(e) => {
                              e.preventDefault();
                              handleClick(child, child.to);
                            }
                          }
                            sx={{ pl: 4 }}
                            key={child.name}

                          >
                            <ListItemIcon>{child.icon}</ListItemIcon>
                            <ListItemText primary={child.name} />
                          </ListItemButton>
                        ) : ("")}
                      </Box>
                    ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Drawer>
      <Main open={open} className="bg-l-sky">
        <DrawerHeader />
        <Typography paragraph>
          <AppRoutes />
        </Typography>
      </Main>
    </Box>
    </>
  );
}

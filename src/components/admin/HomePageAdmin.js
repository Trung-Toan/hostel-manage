import React, { memo } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList"; // Changed to ViewListIcon for clarity
import AdminHeader from "./header/HeaderAdmin";
import { CardList, ClipboardPlus, FileEarmarkText, FilePlus, ListCheck, PersonLinesFill, PersonPlus, PlusSquare, Receipt, Tags, Tools } from "react-bootstrap-icons";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const HomePageAdmin = ({ isLogin, userLogin }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [hostelOpen, setHostelOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [untilityOpen, setUntilityOpen] = React.useState(false);
  const [invoiceOpen, setInvoiceOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toggleHostelMenu = () => {
    setHostelOpen((prev) => !prev);
  };

  const toggleAccountMenu = () => {
    setAccountOpen((prev) => !prev);
  };

  const urlPath =
    userLogin?.role === 1 ? "admin" : userLogin?.role === 2 ? "manager" : "";
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography style={{ width: "100%" }}>
            <AdminHeader isLogin={isLogin} />
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Quản lý nhà trọ */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleHostelMenu}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary={`${
                  userLogin?.role === 1 ? "Quản lý nhà trọ" : "Quản lý bài đăng"
                }`}
              />
              {hostelOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={hostelOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                component={NavLink}
                to={`/${urlPath}/`}
              >
                <ListItemIcon>
                  <ViewListIcon /> {/* Changed to ViewListIcon */}
                </ListItemIcon>
                <ListItemText
                  primary={`${
                    userLogin?.role === 1
                      ? "Danh sách nhà trọ"
                      : "Danh sách bài đăng"
                  }`}
                />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={NavLink}
                to={`/${urlPath}/${
                  userLogin?.role === 1 ? "create_hostel" : "add_new_post"
                }`}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${
                    userLogin?.role === 1 ? "Thêm nhà trọ" : "Thêm bài đăng"
                  }`}
                />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Quản lý tài khoản */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleAccountMenu}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Quản lý tài khoản" />
              {accountOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={accountOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                component={NavLink}
                to={`/${urlPath}/view_account`}
              >
                <ListItemIcon>
                  <PersonLinesFill />
                </ListItemIcon>
                <ListItemText primary="Danh sách tài khoản" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={NavLink}
                to={`/${urlPath}/create_account`}
              >
                <ListItemIcon>
                  <PersonPlus />
                </ListItemIcon>
                <ListItemText primary="Tạo tài khoản" />
              </ListItemButton>
            </List>
          </Collapse>
          {/* Quản lý tiện ích (utilities) */}
          {(userLogin?.role === 2 || userLogin?.role === 1) && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setUntilityOpen((prev) => !prev)}
                >
                  <ListItemIcon>
                    <Tools />
                  </ListItemIcon>
                  <ListItemText primary="Quản lý tiện ích" />
                  {untilityOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
              </ListItem>
              <Collapse in={untilityOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={NavLink}
                    to={`/${urlPath}/view_utilities`}
                  >
                    <ListItemIcon>
                      <CardList />
                    </ListItemIcon>
                    <ListItemText primary="Danh sách tiện ích" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={NavLink}
                    to={`/${urlPath}/create_utilities`}
                  >
                    <ListItemIcon>
                      <ClipboardPlus />
                    </ListItemIcon>
                    <ListItemText primary="Thêm tiện ích" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )}

          {/* Quản lý hóa đơn (invoice) */}
          {userLogin?.role === 2 && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setInvoiceOpen((prev) => !prev)}>
                  <ListItemIcon>
                    <Receipt />
                  </ListItemIcon>
                  <ListItemText primary="Quản lý hóa đơn" />
                  {invoiceOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
              </ListItem>
              <Collapse in={invoiceOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={NavLink}
                    to="/manager/view_invoice"
                  >
                    <ListItemIcon>
                      <FileEarmarkText />
                    </ListItemIcon>
                    <ListItemText primary="Danh sách hóa đơn" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={NavLink}
                    to="/manager/create_invoice"
                  >
                    <ListItemIcon>
                      <FilePlus />
                    </ListItemIcon>
                    <ListItemText primary="Thêm hóa đơn" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )}

          {/* Quản lý danh mục (category) */}
          {/* {(userLogin?.role === 2 || userLogin?.role === 1) && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setCategoryOpen((prev) => !prev)}
                >
                  <ListItemIcon>
                  <Tags />
                  </ListItemIcon>
                  <ListItemText primary="Quản lý danh mục" />
                  {categoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
              </ListItem>
              <Collapse in={categoryOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={NavLink}
                    to={`/${urlPath}/view_category`}
                  >
                    <ListItemIcon>
                      <ListCheck />
                    </ListItemIcon>
                    <ListItemText primary="Danh sách danh mục" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={NavLink}
                    to={`/${urlPath}/create_category`}
                  >
                    <ListItemIcon>
                      <PlusSquare />
                    </ListItemIcon>
                    <ListItemText primary="Thêm danh mục" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )} */}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default memo(HomePageAdmin);

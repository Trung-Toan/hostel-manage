import React, { useState } from "react";
import { List, ListItem, ListItemButton, ListItemText, Collapse, ListItemIcon } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const SidebarMenu = () => {
  const [openHostel, setOpenHostel] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);

  const handleToggleHostel = () => setOpenHostel(!openHostel);
  const handleToggleAccount = () => setOpenAccount(!openAccount);

  return (
    <List>
      {/* Quản lý nhà trọ */}
      <ListItem disablePadding>
        <ListItemButton onClick={handleToggleHostel}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lý nhà trọ" />
          {openHostel ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={openHostel} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Xem danh sách nhà trọ" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/create_hostel">
            <ListItemIcon>
              <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Thêm nhà trọ mới" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Quản lý tài khoản */}
      <ListItem disablePadding>
        <ListItemButton onClick={handleToggleAccount}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lý tài khoản" />
          {openAccount ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={openAccount} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/view_account">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Xem danh sách tài khoản" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/create_account">
            <ListItemIcon>
              <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Thêm tài khoản mới" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
};

export default SidebarMenu;

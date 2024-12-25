import React, { memo } from "react";
import {
  Container,
  Navbar,
  Nav,
  Dropdown,
  Button,
} from "react-bootstrap";
import {
  Bell,
  PersonCircle,
  BoxArrowRight,
  ClipboardData,
} from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const admin = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();
  const urlPart = admin?.role === 1 ? "admin" : "manager";

  const onLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar style={{width: "100%"}}>
        {/* Logo */}
        <Navbar.Brand as={Link} to={`/${urlPart}`} className="fw-bold text-warning">
          Quản Lý Phòng trọ
        </Navbar.Brand>
        {/* Toggle button for mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" style={{justifyContent: "end"}}>
          {/* Notifications */}
          <Nav.Link to="#" className="me-3 text-white">
            <Bell size={24} />
          </Nav.Link>

          {/* Admin Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-warning" id="dropdown-basic">
              <PersonCircle size={24} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>
                Xin chào, {admin?.fullName || "Admin"}!
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to={`/${urlPart}/information`}>
                <ClipboardData className="me-2" />
                Thông tin cá nhân
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onLogout}>
                <BoxArrowRight className="me-2" />
                Đăng xuất
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
    </Navbar>
  );
};

export default memo(AdminHeader);

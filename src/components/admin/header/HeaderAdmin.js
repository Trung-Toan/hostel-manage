import React from "react";
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
  PeopleFill,
  HouseFill,
  BarChartFill,
} from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const admin = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  const onLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/admin" className="fw-bold text-warning">
          Quản Lý Hệ Thống
        </Navbar.Brand>

        {/* Toggle button for mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/users" className="d-flex align-items-center">
              <PeopleFill className="me-2" />
              Quản lý người dùng
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/rooms" className="d-flex align-items-center">
              <HouseFill className="me-2" />
              Quản lý phòng trọ
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/reports" className="d-flex align-items-center">
              <BarChartFill className="me-2" />
              Báo cáo
            </Nav.Link>
          </Nav>

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
              <Dropdown.Item as={Link} to="/admin/information">
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
      </Container>
    </Navbar>
  );
};

export default AdminHeader;

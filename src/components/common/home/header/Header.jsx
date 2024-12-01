import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Form, FormControl, Button, Dropdown } from 'react-bootstrap';
import { Bell, PersonCircle, BoxArrowRight, Receipt, InfoCircle } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../../../authen/Login';

const Header = ({login = false}) => {
 
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const isLoggedIn = login;
  const navigate = useNavigate();
  console.log(user);
  console.log(isLoggedIn);

  const onLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null); 
    navigate("/login");
  };

  return (
    <Navbar bg="light" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand href="#" className="fw-bold">
          Quản Lý Phòng Trọ
        </Navbar.Brand>

        {/* Toggle button for mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Search Bar */}
          <Form className="d-flex ms-auto me-4 align-items-center" style={{ maxWidth: '400px', flex: 1 }}>
            <FormControl
              type="search"
              placeholder="Tìm kiếm phòng trọ..."
              className="rounded-pill"
              style={{ boxShadow: 'none', borderColor: '#ced4da' }}
              aria-label="Search"
            />
            <Button variant="warning" className="rounded-pill ms-2 px-3" style={{ boxShadow: 'none', whiteSpace: 'nowrap' }}>
              Tìm kiếm
            </Button>
          </Form>

          <Nav className="ms-auto align-items-center">
            {/* Notifications */}
            <Nav.Link href="#" className="me-3">
              <Bell size={24} />
            </Nav.Link>

            {/* User Section */}
            {isLoggedIn ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                  <PersonCircle size={24} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>Xin chào, {user?.fullName || "you"}!</Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="information">
                    <InfoCircle className="me-2" />
                    Xem thông tin cá nhân
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="list_invoice">
                    <Receipt className="me-2" />
                    Xem hóa đơn thanh toán
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={onLogout}>
                    <BoxArrowRight className="me-2" />
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link to="/login" className="btn btn-outline-info">Đăng nhập</Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

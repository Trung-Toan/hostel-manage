import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import BackToHome from "../BackToHome";

const EditInformation = () => {
  const [user, setUser] = useState({
    id: "1",
    fullName: "Customer User",
    username: "customer",
    email: "customer@gmail.com",
    phoneNumber: "0123456789",
    persionalAuth: "0123456789098",
    dob: "1999-01-01",
    address: "Long Biên, Hà Nội",
    avatar: "https://via.placeholder.com/150", // Thay bằng đường dẫn avatar thực tế
    status: 1,
    role: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated User Information:", user);
    alert("Thông tin đã được cập nhật thành công!");
  };

  return (
    <>
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <BackToHome/>
                <h3 className="mb-4 text-center">Edit Information</h3>

                {/* Avatar */}
                <div className="text-center mb-4">
                  <Image
                    src={user.avatar}
                    alt="User Avatar"
                    roundedCircle
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <Form.Group className="mt-3">
                    <Form.Label>Avatar URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="avatar"
                      value={user.avatar}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </div>

                <Form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={user.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  {/* Username */}
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  {/* Phone Number */}
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={user.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  {/* Personal Auth */}
                  <Form.Group className="mb-3">
                    <Form.Label>Personal Auth</Form.Label>
                    <Form.Control
                      type="text"
                      name="persionalAuth"
                      value={user.persionalAuth}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  {/* Date of Birth */}
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={user.dob}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  {/* Address */}
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={user.address}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  {/* Status */}
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={user.status}
                      onChange={handleInputChange}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Role */}
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={user.role}
                      onChange={handleInputChange}
                    >
                      <option value={0}>User</option>
                      <option value={1}>Admin</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="text-center">
                    <BackToHome/>
                    <Button type="submit" variant="primary" style={{marginLeft: "16px"}}>
                      Save Changes
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditInformation;

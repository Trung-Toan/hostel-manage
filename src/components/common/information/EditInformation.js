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

const EditInformation = ({userLogin}) => {
  const [user, setUser] = useState(userLogin);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thông tin đã được cập nhật thành công!");
  };

  return (
    <>
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Button as={Link} to={`/${userLogin.role === 1 ? "admin/" : ""}information`} variant="outline-info">
                  Trở về
                </Button>
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
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col>
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
                    </Col>
                    <Col>
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
                    </Col>
                  </Row>

                  <Row>
                    <Col>
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
                    </Col>
                    <Col>
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
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col>
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
                    </Col>
                    <Col>
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
                    </Col>
                  </Row>

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

                  {/* Submit Button */}
                  <div className="text-center">
                    <BackToHome />
                    <Button
                      type="submit"
                      variant="primary"
                      style={{ marginLeft: "16px" }}
                    >
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

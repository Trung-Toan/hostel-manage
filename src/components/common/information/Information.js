import React from 'react';
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import BackToHome from '../BackToHome';
import { Link } from 'react-router-dom';

const Information = ({userLogin}) => {
    const user = userLogin;
    
      const renderRole = (role) => {
        return role === 0 ? "User" : "Admin";
      };
    
      const renderStatus = (status) => {
        return status === 1 ? "Active" : "Inactive";
      };
    
      return (
        <Container className="mt-4">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  {/* Header */}
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <Image
                        src={user.avatar}
                        alt="User Avatar"
                        roundedCircle
                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                      />
                    </Col>
                    <Col>
                      <h3>{user.fullName}</h3>
                      <p className="text-muted mb-0">Username: {user.username}</p>
                      <p className="text-muted mb-0">Email: {user.email}</p>
                      <p className="text-muted">Role: {renderRole(user.role)}</p>
                    </Col>
                  </Row>
    
                  <hr />
    
                  {/* User Details */}
                  <Row>
                    <Col md={6} className="mb-3">
                      <strong>Phone Number:</strong>
                      <p>{user.phoneNumber}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Date of Birth:</strong>
                      <p>{user.dob}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Personal Auth:</strong>
                      <p>{user.persionalAuth}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Status:</strong>
                      <p>{renderStatus(user.status)}</p>
                    </Col>
                    <Col md={12} className="mb-3">
                      <strong>Address:</strong>
                      <p>{user.address}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Created At:</strong>
                      <p>{user.createdAt}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Updated At:</strong>
                      <p>{user.updatedAt}</p>
                    </Col>
                  </Row>
    
                  <hr />
    
                  {/* Footer Actions */}
                  <div className="text-center">
                    <BackToHome/>
                    <Link to={"edit_information"} className='btn btn-primary' style={{marginLeft: "16px"}}>Edit Information</Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    };

export default Information;
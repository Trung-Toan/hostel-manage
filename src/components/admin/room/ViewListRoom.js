import React from "react";
import { Card, Container, Row, Col, Badge, ListGroup, Button } from "react-bootstrap";

const ViewListRoom = () => {
  const roomData = {
    id: "1",
    hostelId: "1",
    name: "Phòng 101",
    description: "Phòng đầy đủ tiện nghi, có ban công.",
    price: 3500000,
    area: 25,
    status: 1,
    categoryId: "1",
    utilities: ["1", "2"],
    images: ["room1_img1", "room1_img2"],
    currentOccupants: 2,
    createdAt: "2024-11-20 10:00:00",
    updatedAt: "2024-11-20 12:00:00",
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Card>
            <Card.Header className="text-center">
              <h3>{roomData.name}</h3>
              <Badge bg={roomData.status === 1 ? "success" : "secondary"}>
                {roomData.status === 1 ? "Còn phòng" : "Hết phòng"}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                {/* Hình ảnh */}
                <Col md={6} className="mb-3">
                  <div className="d-flex flex-column gap-2">
                    {roomData.images.map((img, index) => (
                      <div
                        key={index}
                        style={{
                          width: "100%",
                          height: "150px",
                          backgroundColor: "#f1f1f1",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <span>Hình {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </Col>

                {/* Thông tin chi tiết */}
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Giá thuê:</strong> {formatCurrency(roomData.price)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Diện tích:</strong> {roomData.area} m²
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Số người hiện tại:</strong> {roomData.currentOccupants}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Mô tả:</strong> {roomData.description}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>

              {/* Tiện ích */}
              <div className="mt-4">
                <h5>Tiện ích</h5>
                <div className="d-flex flex-wrap gap-2">
                  {roomData.utilities.map((utility, index) => (
                    <Badge key={index} bg="info">
                      Tiện ích {utility}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Ngày tạo và cập nhật */}
              <div className="mt-4">
                <p>
                  <strong>Ngày tạo:</strong> {formatDate(roomData.createdAt)}
                </p>
                <p>
                  <strong>Ngày cập nhật:</strong> {formatDate(roomData.updatedAt)}
                </p>
              </div>
            </Card.Body>

            {/* Hành động */}
            <Card.Footer className="text-center">
              <Button variant="primary" className="me-2">
                Chỉnh sửa
              </Button>
              <Button variant="danger">Xóa</Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewListRoom;

import React, { useState } from "react";
import {
  Spinner,
  Card,
  Row,
  Col,
  Badge,
  Dropdown,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import './non-arrow.css';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Notification from "../../common/information/Notification";

const ViewListHostel = ({ data, isLoading, onDelete, onViewDetails }) => {
  const [updateMessage, setUpdateMessage] = useState(null);
  
  const queryClient = useQueryClient();
  const {mutate} = useMutation({
    mutationFn: (payload) => axios.put(`http://localhost:9999/hostel/${payload.id}`, payload),
    onSuccess: () => {
      setUpdateMessage({
        type: "success",
        text: "Cập nhật thông tin thành công!",
      });
      queryClient.refetchQueries(["hostel"]);
    },
    onError: () => {
      setUpdateMessage({
        type: "error",
        text: "Gặp lỗi từ máy chủ. Xin vui lòng thử lại sau!",
      });
    }    
  });

  const changeStatus = (hostel) => {
    const updatedHostel = {
      ...hostel,
      status: hostel.status === 1 ? 0 : 1,
    };
    mutate(updatedHostel);
  }

  return (
    <div className="container mt-4">
      <Notification
        updateMessage={updateMessage}
        setUpdateMessage={setUpdateMessage}
      />
      <h2 className="text-center mb-4">Quản lý danh sách nhà trọ</h2>
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4}>
          {data?.data?.map((hostel) => (
            <Col key={hostel.id} className="mb-4">
              <Card className="h-100 shadow-sm position-relative">
                {/* Dropdown ... ở góc trên phải của ảnh */}
                <Dropdown className="position-absolute top-0 end-0 m-2">
                  <Dropdown.Toggle
                    as="span"
                    id={`dropdown-hostel-${hostel.id}`}
                    role="button"
                    className="p-0 border-0"
                    style={{
                      cursor: "pointer",
                      boxShadow: "none",
                      fontSize: "1.5rem",
                      lineHeight: "0.5",
                    }}
                  >
                    ...
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`edit_hostel/${hostel.id}`}>
                      Chỉnh sửa
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => changeStatus(hostel)}
                      className= {`${hostel.status === 1 ? "text-danger" : "text-success"}`}
                    >
                      {hostel.status === 1 ? "Dừng hoạt động" : "Hoạt động"}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* Hình ảnh */}
                <Card.Img
                  variant="top"
                  src={`path/to/image/${hostel?.images[0]}`}
                  alt={hostel.name}
                  style={{ height: "180px", objectFit: "cover" }}
                />

                {/* Nội dung */}
                <Card.Body>
                  <Card.Title>{hostel.name}</Card.Title>
                  <Card.Text>
                    <strong>Địa chỉ:</strong> {hostel?.address}
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      {hostel.description.length > 60
                        ? `${hostel.description.substring(0, 60)}...`
                        : hostel.description}
                    </small>
                  </Card.Text>
                </Card.Body>

                {/* Footer */}
                <Card.Footer className="d-flex justify-content-between align-items-center">
                  {/* Badge trạng thái */}
                  <Badge bg={hostel.status === 1 ? "success" : "secondary"}>
                    {hostel.status === 1 ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                  {/* Nút Xem phòng trọ */}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onViewDetails(hostel.id)}
                  >
                    Xem phòng trọ
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ViewListHostel;

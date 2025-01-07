import React, { memo, useEffect, useState } from "react";
import {
  Spinner,
  Card,
  Row,
  Col,
  Badge,
  Dropdown,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./non-arrow.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Notification from "../../../Notification";
import getCurrentDateTime from "../../../until/getCurrentDate";

const ViewListHostel = ({ data, isLoading }) => {
  const [updateMessage, setUpdateMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const queryClient = useQueryClient();
  useEffect(() => {
    setFilteredData(data?.data);
  }, [data?.data]);
  const { mutate } = useMutation({
    mutationFn: (payload) =>
      axios.put(`http://localhost:9999/hostel/${payload.id}`, payload),
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
    },
  });

  const handleSearch = () => {
    const filtered = data?.data?.filter((hostel) =>
      hostel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    if (order === "") {
      // Trả về danh sách mặc định
      setFilteredData(data?.data);
      return;
    }
    const sortedData = [...filteredData].sort((a, b) => {
      if (order === "asc") return a.name.localeCompare(b.name);
      if (order === "desc") return b.name.localeCompare(a.name);
      return 0;
    });
    setFilteredData(sortedData);
  };

  const changeStatus = (hostel) => {
    const updatedHostel = {
      ...hostel,
      status: hostel.status === 1 ? 0 : 1,
      updatedAt: getCurrentDateTime(),
    };
    mutate(updatedHostel);
  };

  return (
    <div className="container mt-4">
      <Notification
        updateMessage={updateMessage}
        setUpdateMessage={setUpdateMessage}
      />
      <div className="d-flex justify-content-center mb-5">
        <Link to={"/admin/create_hostel"} className="btn btn-success">
          Tạo phòng trọ mới
        </Link>
      </div>
      <h2 className="text-center mb-4">Quản lý danh sách nhà trọ</h2>

      {/* Tìm kiếm và Sắp xếp */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Thanh tìm kiếm */}
        <InputGroup style={{width: "30%"}}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </InputGroup>

        {/* Lựa chọn sắp xếp */}
        <Form.Group controlId="sortOrder" className="d-flex align-items-center">
          <Form.Label className="mb-0 me-2">Sắp xếp:</Form.Label>
          <Form.Select
            value={sortOrder}
            onChange={(e) => handleSort(e.target.value)}
            className="w-auto"
          >
            <option value="">Mặc định</option>
            <option value="asc">Tên tăng dần</option>
            <option value="desc">Tên giảm dần</option>
          </Form.Select>
        </Form.Group>
      </div>

      {/* Danh sách nhà trọ */}
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredData && filteredData.length > 0 ? (
        <Row
          xs={1}
          sm={2}
          md={3}
          lg={4}
          className="d-flex justify-content-center"
        >
          {  filteredData?.map((hostel) => (
            <Col key={hostel.id} className="mb-4">
              <Card className="h-100 shadow-sm position-relative">
                {/* Dropdown */}
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
                      className={`${
                        hostel.status === 1 ? "text-danger" : "text-success"
                      }`}
                    >
                      {hostel.status === 1 ? "Dừng hoạt động" : "Hoạt động"}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* Hình ảnh */}
                <Card.Img
                  variant="top"
                  src={hostel?.images[0]}
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
                    as={Link}
                    to={`/admin/room/${hostel.id}`}
                  >
                    Xem phòng trọ
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          )) }
        </Row>
      ) : (
        <div className="d-flex justify-content-center">
          <p>
            Danh sách trống!
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(ViewListHostel);

import React, { memo, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Form,
  InputGroup,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Notification from "../../../src/Notification";
import getCurrentDateTime from "../../until/getCurrentDate";
import Loading from "../../until/Loading";

const ViewListCategory = ({ data, isLoading }) => {
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
      axios.put(`http://localhost:9999/category/${payload.id}`, payload),
    onSuccess: () => {
      setUpdateMessage({
        type: "success",
        text: "Cập nhật thông tin thành công!",
      });
      queryClient.refetchQueries(["category"]);
    },
    onError: () => {
      setUpdateMessage({
        type: "error",
        text: "Gặp lỗi từ máy chủ. Xin vui lòng thử lại sau!",
      });
    },
  });

  const handleSearch = () => {
    const filtered = data?.data?.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    if (order === "") {
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

  const changeStatus = (category) => {
    const updatedCategory = {
      ...category,
      status: category.status === 1 ? 0 : 1,
      updatedAt: getCurrentDateTime(),
    };
    mutate(updatedCategory);
  };

  return (
    <div className="container mt-4">
      <Notification
        updateMessage={updateMessage}
        setUpdateMessage={setUpdateMessage}
      />
      <div className="d-flex justify-content-center mb-5 mt-5">
        <Link to={"/admin/create_category"} className="btn btn-success">
          Tạo danh mục mới
        </Link>
      </div>
      <h2 className="text-center mb-4">Quản lý danh sách danh mục</h2>

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

      {/* Danh sách danh mục dưới dạng bảng */}
      {isLoading ? (
        <Loading/>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle shadow-sm"
        >
          <thead className="table-primary text-center">
            <tr>
              <th className="col-md-2">Tên danh mục</th>
              <th className="col-md">Mô tả</th>
              <th className="col-md-1">Trạng thái</th>
              <th className="col-md-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((category) => (
              <tr key={category.id} className="text-center">
                <td className="col-md-2 fw-bold">{category.name}</td>
                <td className="col-md text-muted text-truncate">
                  {category.description}
                </td>
                <td className="col-md-1">
                  <Badge
                    bg={category.status === 1 ? "success" : "secondary"}
                    className="py-2 px-3 text-uppercase"
                  >
                    {category.status === 1 ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </td>
                <td className="col-md-2">
                  <Row className="g-2 justify-content-center">
                    <Col xs="auto">
                      <Link
                        className="btn btn-outline-warning btn-sm px-3"
                        to={`edit_category/${category.id}`}
                      >
                        <i className="fas fa-edit me-1"></i> Chỉnh sửa
                      </Link>
                    </Col>
                    <Col xs="auto">
                      <Button
                        type="button"
                        variant={
                          category.status === 1
                            ? "outline-danger"
                            : "outline-success"
                        }
                        size="sm"
                        onClick={() => changeStatus(category)}
                        className="px-3"
                      >
                        <i
                          className={`fas ${
                            category.status === 1 ? "fa-ban" : "fa-check"
                          } me-1`}
                        ></i>
                        {category.status === 1 ? "Dừng hoạt động" : "Hoạt động"}
                      </Button>
                    </Col>
                  </Row>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default memo(ViewListCategory);

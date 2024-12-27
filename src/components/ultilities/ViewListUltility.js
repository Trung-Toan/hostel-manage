import React, { memo, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import Loading from "../../until/Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Notification from "../../Notification";
import { Link } from "react-router-dom";

const ViewListUltility = ({ data, isloading }) => {
  const [updateMessage, setUpdateMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    setFilteredData(data?.data || []);
  }, [data?.data]);

  const { mutate } = useMutation({
    mutationFn: (payload) =>
      axios.put(`http://localhost:9999/utilities/${payload.id}`, payload),
    onSuccess: () => {
      setUpdateMessage({
        type: "success",
        text: "Cập nhật thông tin thành công!",
      });
      queryClient.refetchQueries(["utilities"]);
    },
    onError: () => {
      setUpdateMessage({
        type: "error",
        text: "Gặp lỗi từ máy chủ. Xin vui lòng thử lại sau!",
      });
    },
  });

  const handleSearch = () => {
    const filtered = data?.data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSort = (order) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (order === "asc") return a.name.localeCompare(b.name);
      if (order === "desc") return b.name.localeCompare(a.name);
      return 0;
    });
    setFilteredData(sortedData);
    setSortOrder(order);
  };

  return (
    <Container>
      <Notification
        updateMessage={updateMessage}
        setUpdateMessage={setUpdateMessage}
      />
      <h2 className="text-center">Quản lý tiện ích</h2>
      <div className="d-flex justify-content-between align-items-center mt-4">
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
      {isloading ? (
        <Loading />
      ) : (
        <Table
          bordered
          striped
          responsive
          hover
          className="align-middle shadow-sm mt-3"
        >
          <thead className="table-primary text-center">
            <tr>
              <th>Id</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredData?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  {item.status === 1 ? (
                    <span className="text-success">Hoạt động</span>
                  ) : (
                    <span className="text-danger">Không hoạt động</span>
                  )}
                </td>
                <td>
                  <Row className="justify-content-center">
                    <Col xs={"auto"} className="justify-content-start">
                      <Button
                        variant={item.status === 1 ? "secondary" : "success"}
                        onClick={() =>
                          mutate({ ...item, status: item.status === 1 ? 0 : 1 })
                        }
                      >
                        {item.status === 1 ? "Không hoạt động" : "Hoạt động"}
                      </Button>
                    </Col>
                    <Col xs={"auto"} className="justify-content-end">
                      <Link className="btn btn-warning" to={`edit_ultility/${item.id}`}>Chỉnh sửa</Link>
                    </Col>
                  </Row>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default memo(ViewListUltility);

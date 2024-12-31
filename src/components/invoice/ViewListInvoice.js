import React, { memo, useEffect, useState } from "react";
import {
  Spinner,
  Button,
  Form,
  InputGroup,
  Accordion,
} from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Notification from "../../../src/Notification";
import ViewInvoiceByHostel from "./ViewInvoiceByHostel";
import getCurrentDateTime from "../../until/getCurrentDate";

const ViewListInvoice = ({ data, isLoading }) => {
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
      axios.put(`http://localhost:9999/invoice/${payload.id}`, payload),
    onSuccess: () => {
      setUpdateMessage({
        type: "success",
        text: "Cập nhật thông tin hóa đơn thành công!",
      });
      queryClient.refetchQueries(["invoice"]);
    },
    onError: () => {
      setUpdateMessage({
        type: "error",
        text: "Gặp lỗi từ máy chủ. Xin vui lòng thử lại sau!",
      });
    },
  });

  const handleSearch = () => {
    const filtered = data?.data?.filter((invoice) =>
      invoice.month.toLowerCase().includes(searchTerm.toLowerCase())
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
      const monthA = new Date(a.month);
      const monthB = new Date(b.month);
      return order === "asc" ? monthA - monthB : monthB - monthA;
    });
    setFilteredData(sortedData);
  };

  const changeStatus = (invoice) => {
    const updatedInvoice = {
      ...invoice,
      status: invoice.status === "1" ? "0" : "1",
      updatedAt: getCurrentDateTime(),
    };
    mutate(updatedInvoice);
  };

  // Nhóm hóa đơn theo tháng
  const groupedInvoices = filteredData?.reduce((acc, invoice) => {
    const { month } = invoice;
    if (!acc[month]) acc[month] = [];
    acc[month].push(invoice);
    return acc;
  }, {});

  return (
    <div className="container mt-4">
      <Notification
        updateMessage={updateMessage}
        setUpdateMessage={setUpdateMessage}
      />
      <h2 className="text-center mb-4">Quản lý hóa đơn</h2>

      {/* Tìm kiếm và Sắp xếp */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <InputGroup style={{width: "30%"}}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tháng (VD: 2024-11)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </InputGroup>

        <Form.Group controlId="sortOrder" className="d-flex align-items-center">
          <Form.Label className="mb-0 me-2">Sắp xếp theo tháng:</Form.Label>
          <Form.Select
            value={sortOrder}
            onChange={(e) => handleSort(e.target.value)}
            className="w-auto"
          >
            <option value="">Mặc định</option>
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </Form.Select>
        </Form.Group>
      </div>

      {/* Danh sách hóa đơn dạng Accordion */}
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : groupedInvoices && Object.keys(groupedInvoices).length > 0 ? (
        <Accordion defaultActiveKey={Object.keys(groupedInvoices)[0]}>
          {Object.entries(groupedInvoices).map(([month, invoices]) => (
            <Accordion.Item eventKey={month} key={month}>
              <Accordion.Header>Tháng: {month}</Accordion.Header>
              <Accordion.Body>
                <ViewInvoiceByHostel
                  invoices={invoices}
                  changeStatus={changeStatus}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <div className="text-center">Không có dữ liệu để hiển thị.</div>
      )}
    </div>
  );
};

export default memo(ViewListInvoice);

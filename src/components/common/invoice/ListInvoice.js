// ListInvoice.js
import React, { memo, useEffect, useState } from "react";
import { Accordion, Table, Badge, Container, Spinner } from "react-bootstrap";
import {
  Calendar,
  House,
  FileText,
  CheckCircle,
  ExclamationCircle,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import BackToHome from "../BackToHome";
import { useFetchData } from "../../../fetchData/DataFetch";

const ListInvoice = ({ user, invoices, loading }) => {
  const [room, setRoom] = useState({});
  const {getData} = useFetchData();

  const tenantRoomId = user?.roomID;
  const tenantHostelId = user?.hostelID;
  

  useEffect(() => {
    const fetchData = async () => {
      if (tenantRoomId) {
        const data = await getData(`http://localhost:9999/room/${tenantRoomId}`);
        if (data) {
          setRoom(data);
        }
      }
    };
    fetchData();
  }, [tenantRoomId]);

  const filteredInvoices = invoices
    .filter((invoice) => invoice.roomId === tenantRoomId && invoice.hostelId === tenantHostelId )
    .sort((a, b) => new Date(a.month) - new Date(b.month)); // Sắp xếp theo tháng từ bé đến lớn
  // Nhóm hóa đơn theo tháng sau khi đã lọc và sắp xếp
  const groupedInvoices = filteredInvoices.reduce((acc, invoice) => {
    const { month } = invoice;
    if (!acc[month]) acc[month] = [];
    acc[month].push(invoice);
    return acc;
  }, {});

  return (
    <Container className="py-4">
      <BackToHome/>
      <h2 className="mb-4 text-center">
        Danh sách hóa đơn của {user ? user.name : "bạn"}
      </h2>

      {loading ? (
        // Hiệu ứng loading khi chờ tải dữ liệu
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Accordion defaultActiveKey={(Object.keys(groupedInvoices).length - 1).toString()}>
          {Object.keys(groupedInvoices)?.map((month, index) => (
            <Accordion.Item eventKey={index.toString()} key={month}>
              {/* Tiêu đề của mỗi tháng */}
              <Accordion.Header>
                <Calendar className="me-2" />
                Hóa đơn tháng {month}
                <Badge bg="info" className="ms-3">
                  {groupedInvoices[month].length} hóa đơn
                </Badge>
              </Accordion.Header>
              {/* Nội dung danh sách hóa đơn */}
              <Accordion.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Phòng</th>
                      <th className="text-center">Tháng</th>
                      <th className="text-center">Tổng tiền</th>
                      <th className="text-center">Trạng thái</th>
                      <th className="text-center">Ngày tạo</th>
                      <th className="text-center">Ngày cập nhật</th>
                      <th className="text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedInvoices[month].map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="text-center">
                          <FileText className="me-2" />
                          {invoice.id}
                        </td>
                        <td className="text-center">
                          <House className="me-2" />
                          {room.name}
                        </td>
                        <td className="text-center">{invoice.month}</td>
                        <td className="text-center">{invoice.totalAmount.toLocaleString("vi-VN")} ₫</td>
                        <td className="text-center">
                          {invoice.status === "1" ? (
                            <Badge bg="success">
                              <CheckCircle className="me-2" />
                              Đã thanh toán
                            </Badge>
                          ) : (
                            <Badge bg="danger">
                              <ExclamationCircle className="me-2" />
                              Chưa thanh toán
                            </Badge>
                          )}
                        </td>
                        <td className="text-center">{invoice.createdAt}</td>
                        <td className="text-center">{invoice.updatedAt}</td>
                        <td className="text-center">
                          <Link to={`invoice/${invoice.id}`} className="btn btn-info">Xem chi tiết</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default memo(ListInvoice);

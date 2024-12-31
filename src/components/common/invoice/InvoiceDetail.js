import React, { memo, useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import {
  FileText,
  House,
  Calendar,
  Lightning,
  Water,
  CheckCircle,
  ExclamationCircle,
} from "react-bootstrap-icons";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useFetchData, useGetInvoiceById } from "../../../fetchData/DataFetch";
import BackToHome from "../BackToHome";

const InvoiceDetail = () => {
  const { idInvoice } = useParams();
  const { invoice, loading } = useGetInvoiceById(idInvoice);
  const [room, setRoom] = useState({});
  const { getData } = useFetchData();
  const navigate = useNavigate();
  const location = useLocation();

  const isManager = location.pathname.includes("manager");

  useEffect(() => {
    const fetchData = async () => {
      if (invoice) {
        const data = await getData(
          `http://localhost:9999/room/${invoice.roomId}`
        );
        if (data) {
          setRoom(data);
        }
      }
    };
    fetchData();
  }, [invoice]);

  // Check if invoice data is loaded
  if (Object.keys(invoice).length === 0 || !invoice) {
    return (
      <Container className="py-4">
       {isManager ? null : <BackToHome />}
        {loading ? (
          // Hiệu ứng loading khi chờ tải dữ liệu
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <h2 className="text-center">Không tìm thấy hóa đơn</h2>
        )}
        <div className="text-end">
          <Link to={"/list_invoice"} className="btn btn-outline-info">
            Trở về trang trước
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {isManager ? null : <BackToHome />}
      <h2 className="mb-4 text-center">Chi tiết hóa đơn</h2>
      {loading ? (
        // Hiệu ứng loading khi chờ tải dữ liệu
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Card>
          <Card.Header className="d-flex align-items-center justify-content-between">
            <div>
              <FileText className="me-2" />
              Mã hóa đơn: <strong>{invoice.id || "N/A"}</strong>
            </div>
            <div>
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
            </div>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={8}>
                <div>
                  <House className="me-2" />
                  Phòng: <strong>{room.name || "N/A"}</strong>
                </div>
                <div>
                  <Calendar className="me-2" />
                  Tháng: <strong>{invoice.month || "N/A"}</strong>
                </div>
              </Col>
              <Col md>
                <div className="d-flex justify-content-between">
                  <div>Ngày tạo:</div>{" "}
                  <div className="fw-bold">{invoice.createdAt || "N/A"}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Ngày cập nhật: </div>
                  <div className="fw-bold">{invoice.updatedAt || "N/A"}</div>
                </div>
              </Col>
            </Row>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Hạng mục</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {/* tiền phòng */}
                <tr>
                  <td>Tiền thuê phòng</td>
                  <td>1</td>
                  <td className="text-end">
                    {(room.price || "-").toLocaleString("vi-VN")} ₫{" "}
                  </td>
                  <td className="text-end">
                    {(invoice.priceRoom || 0).toLocaleString("vi-VN")} ₫
                  </td>
                </tr>

                {/* tiền điện */}
                <tr>
                  <td>
                    <Lightning className="me-2" />
                    Tiền điện
                  </td>
                  <td>{invoice.electricityUsage || 0} kWh</td>
                  <td className="text-end">
                    {(invoice.priceElectricity || 0).toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="text-end">
                    {(
                      (invoice.electricityUsage || 0) *
                      (invoice.priceElectricity || 0)
                    ).toLocaleString("vi-VN")}{" "}
                    ₫
                  </td>
                </tr>

                {/* nước */}
                <tr>
                  <td>
                    <Water className="me-2" />
                    Tiền nước
                  </td>
                  <td>{invoice.waterUsage || 0} m³</td>
                  <td className="text-end">
                    {(invoice.priceWater || 0).toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="text-end">
                    {(
                      (invoice.waterUsage || 0) * (invoice.priceWater || 0)
                    ).toLocaleString("vi-VN")}{" "}
                    ₫
                  </td>
                </tr>

                {/* tiền dịch vụ */}
                <tr>
                  <td>Phí dịch vụ</td>
                  <td>{invoice?.currentOccupants} người</td>
                  <td className="text-end">
                    {(invoice.servicePricePerPerson || 0).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    ₫
                  </td>
                  <td className="text-end">
                    {(invoice.serviceFee || 0).toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="3" className="text-end">
                    Tổng tiền
                  </th>
                  <th>
                    {(invoice.totalAmount || 0).toLocaleString("vi-VN")} ₫
                  </th>
                </tr>
              </tfoot>
            </Table>
            <div className="text-end">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-outline-info me-2"
              >
                Trở về trang trước
              </button>
              <Link
                to={`/manager/edit_invoice/${idInvoice}`}
                className={`${
                  isManager ? "" : "d-none"
                } btn btn-outline-warning`}
              >
                Chỉnh sửa hoá đơn
              </Link>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default memo(InvoiceDetail);

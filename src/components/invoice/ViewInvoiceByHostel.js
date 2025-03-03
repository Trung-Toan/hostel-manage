import React from "react";
import { Accordion, Badge, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import NameHostel from "./NameHostel";
import NameRoom from "./NameRoom";

const ViewInvoiceByHostel = ({ invoices = [], changeStatus }) => {
  const groupInvoiceByHostel = invoices?.reduce((acc, invoice) => {
    const { hostelId } = invoice;
    if (!acc[hostelId]) acc[hostelId] = [];
    acc[hostelId].push(invoice);
    return acc;
  }, {});

  console.log(groupInvoiceByHostel);

  return (
    <>
      {groupInvoiceByHostel && Object.keys(groupInvoiceByHostel).length > 0 ? (
        <Accordion defaultActiveKey={Object.keys(groupInvoiceByHostel)[0]}>
          {Object.entries(groupInvoiceByHostel).map(([hostelId, invoices]) => {
            return (
              <>
                <Accordion.Item eventKey={hostelId} key={hostelId}>
                  <NameHostel hostelId = {hostelId} />
                  <Accordion.Body>
                    <Table striped bordered hover responsive>
                      <thead className="table-dark ">
                        <tr className="text-center">
                          <th>Phòng</th>
                          <th>Trạng thái</th>
                          <th>Tổng tiền</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices?.map((invoice) => (
                          <tr key={invoice.id} className="text-center">
                            <NameRoom roomId = {invoice.roomId} />
                            <td>
                              <Badge
                                bg={
                                  invoice.status === "1"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {invoice.status === "1"
                                  ? "Đã thanh toán"
                                  : "Chưa thanh toán"}
                              </Badge>
                            </td>
                            <td>
                              {invoice?.totalAmount?.toLocaleString()} VND
                            </td>
                            <td className="d-flex justify-content-center">
                              <Button
                                variant={
                                  invoice.status === "1"
                                    ? "outline-danger"
                                    : "outline-success"
                                }
                                size="sm"
                                onClick={() => changeStatus(invoice)}
                                className="me-2"
                              >
                                {invoice.status === "1"
                                  ? "Hủy thanh toán"
                                  : "Xác nhận thanh toán"}
                              </Button>
                              <Link
                                className="btn btn-outline-warning"
                                to={"/manager/invoice/" + invoice.id}
                              >
                                Xem chi tiết
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              </>
            );
          })}
        </Accordion>
      ) : (
        <div className="text-center">Không có dữ liệu để hiển thị.</div>
      )}
    </>
  );
};

export default ViewInvoiceByHostel;

import React, { useState, memo, useEffect } from "react";
import {
  Table,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import ChooseRoom from "./ChooseRoom";
import ChooseHostel from "./ChooseHostel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useGetDataByUrl } from "../../fetchData/DataFetch";
import getCurrentDateTime from "../../until/getCurrentDate";
import getMonth from "../../until/getMonth";
import Swal from "sweetalert2";

const CreateNewInvoice = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [creationMessage, setCreationMessage] = useState(null);
  const queryClient = useQueryClient();

  // fiter data customer
  const { data } = useGetDataByUrl(
    "http://localhost:9999/user/?role=0",
    "customer"
  );

  const filterCustomer =
    data?.data?.filter(
      (c) =>
        c.status === 1 &&
        c.hostelID === selectedHostel?.id &&
        c.roomID === selectedRoom?.id
    ) || null;

  // get room by hostelId
  const { data: room } = useGetDataByUrl(
    `http://localhost:9999/room/${selectedRoom?.id}`,
    `room${selectedRoom?.id}`
  );

  // filter invoce by month
  const currentMonth = getMonth();

  const { data: dataByMonth } = useGetDataByUrl(
    `http://localhost:9999/invoice?month=${currentMonth}`,
    `month ${currentMonth}`
  );

  const { mutate: createInvoice, isLoading: creatingInvoice } = useMutation({
    mutationFn: (payload) =>
      axios.post(`http://localhost:9999/invoice`, payload),
    onSuccess: () => {
      setCreationMessage({
        type: "success",
        text: "Tạo hoá đơn thành công!",
      });
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Tạo hoá đơn thành công!",
        timer: 3000,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["invoice"]);
    },
    onError: () => {
      setCreationMessage({
        type: "error",
        text: "Có lỗi xảy ra khi tạo hoá đơn!",
      });
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi tạo hoá đơn!",
        timer: 3000,
        showConfirmButton: false,
      });
    },
  });

  const checkDuplicate = () => {
    const data =
      dataByMonth?.data?.filter(
        (d) =>
          d.roomId === selectedRoom?.id && d.hostelId === selectedHostel?.id
      ) || [];
    return data.length > 0;
  };

  useEffect(() => {
    if (!selectedRoom?.id || !selectedHostel?.id || !dataByMonth) {
      setCreationMessage(null); // Xóa thông báo khi dữ liệu không đầy đủ
      return;
    }

    if (filterCustomer?.length === 0) {
      setCreationMessage({
        type: "error",
        text: "Phòng trọ hiện tại chưa có ai ở!",
      });
      return;
    }

    const isDuplicate = checkDuplicate();
    if (isDuplicate) {
      setCreationMessage({
        type: "error",
        text: "Tháng này bạn đã tạo hoá đơn cho phòng trọ này!",
      });
    } else {
      setCreationMessage(null);
    }
  }, [selectedRoom, selectedHostel, dataByMonth, filterCustomer]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      roomId: selectedRoom?.id || "",
      hostelId: selectedHostel?.id || "",
      month: getMonth(),
      priceRoom: room?.data?.price || 0,
      electricityUsage: 0,
      priceElectricity: 3500,
      waterUsage: 0,
      priceWater: 15000,
      servicePricePerPerson: 100000,
      currentOccupants: filterCustomer?.length,
      status: "0",
    },
    validationSchema: Yup.object({
      roomId: Yup.string()
        .required("Phòng trọ không được để trống.")
        .nullable(),
      hostelId: Yup.string()
        .required("Nhà trọ không được để trống.")
        .nullable(),
      month: Yup.string().required("Tháng không được để trống."),
      priceRoom: Yup.number().required("Giá phòng không được để trống."),
      electricityUsage: Yup.number().required("Số điện không được để trống."),
      priceElectricity: Yup.number().required("Giá điện không được để trống."),
      waterUsage: Yup.number().required("Số nước không được để trống."),
      priceWater: Yup.number().required("Giá nước không được để trống."),
      servicePricePerPerson: Yup.number().required(
        "Giá dịch vụ không được để trống."
      ),
    }),
    onSubmit: (values) => {
      const fullPayload = {
        ...values,

        totalAmount:
          values?.priceRoom +
          values?.electricityUsage * values?.priceElectricity +
          values?.waterUsage * values?.priceWater +
          (filterCustomer?.length || 0) * values?.servicePricePerPerson,
        serviceFee:
          (filterCustomer?.length || 0) * values?.servicePricePerPerson,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      };
      createInvoice(fullPayload);
    },
  });

  return (
    <div className="container my-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4">Tạo Hoá Đơn</h2>
        <Table bordered responsive className="align-middle">
          <thead className="table-primary text-center">
            <tr className="row">
              <th className="col-md-3 ">Nhà trọ</th>
              <th className="col-md-2">Phòng trọ</th>
              <th className="col-md">Tạo hoá đơn</th>
            </tr>
          </thead>
          <tbody>
            <tr className="row">
              <td className="col-md-3 p-3">
                <ChooseHostel
                  selectedHostel={selectedHostel}
                  setSelectedHostel={setSelectedHostel}
                />
              </td>
              <td className="col-md-2 p-3">
                <ChooseRoom
                  hostelId={selectedHostel?.id}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                />
              </td>
              <td className="col-md p-3">
                <Card className="border-0">
                  <Card.Body>
                    {creationMessage && (
                      <Alert
                        variant={
                          creationMessage.type === "success"
                            ? "success"
                            : "danger"
                        }
                        className="mb-3"
                      >
                        {creationMessage.text}
                      </Alert>
                    )}
                    {selectedRoom?.id ? (
                      <Form onSubmit={formik.handleSubmit}>
                        {/* Giá phòng */}
                        <Form.Group controlId="priceRoom" className="mb-3">
                          <Form.Label>Giá phòng</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="text"
                              value={
                                formik.values.priceRoom?.toLocaleString(
                                  "vi-VN"
                                ) || ""
                              }
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                formik.setFieldValue(
                                  "priceRoom",
                                  value ? parseInt(value) : ""
                                );
                              }}
                              isInvalid={
                                formik.touched.priceRoom &&
                                formik.errors.priceRoom
                              }
                            />
                            <InputGroup.Text>vnd</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.priceRoom}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>

                        {/* Số điện và Giá điện */}
                        <Row>
                          <Col>
                            <Form.Group
                              controlId="electricityUsage"
                              className="mb-3"
                            >
                              <Form.Label>Số điện</Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="number"
                                  {...formik.getFieldProps("electricityUsage")}
                                  isInvalid={
                                    formik.touched.electricityUsage &&
                                    formik.errors.electricityUsage
                                  }
                                />
                                <InputGroup.Text>kWh</InputGroup.Text>
                              </InputGroup>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.electricityUsage}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group
                              controlId="priceElectricity"
                              className="mb-3"
                            >
                              <Form.Label>Giá điện</Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  value={
                                    formik.values.priceElectricity?.toLocaleString(
                                      "vi-VN"
                                    ) || ""
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    formik.setFieldValue(
                                      "priceElectricity",
                                      value ? parseInt(value) : ""
                                    );
                                  }}
                                  isInvalid={
                                    formik.touched.priceElectricity &&
                                    formik.errors.priceElectricity
                                  }
                                />
                                <InputGroup.Text>vnd</InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.priceElectricity}
                                </Form.Control.Feedback>
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Số nước và Giá nước */}
                        <Row>
                          <Col>
                            <Form.Group controlId="waterUsage" className="mb-3">
                              <Form.Label>Số nước</Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="number"
                                  {...formik.getFieldProps("waterUsage")}
                                  isInvalid={
                                    formik.touched.waterUsage &&
                                    formik.errors.waterUsage
                                  }
                                />
                                <InputGroup.Text>m³</InputGroup.Text>
                              </InputGroup>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.waterUsage}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="priceWater" className="mb-3">
                              <Form.Label>Giá nước</Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  value={
                                    formik.values.priceWater?.toLocaleString(
                                      "vi-VN"
                                    ) || ""
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    formik.setFieldValue(
                                      "priceWater",
                                      value ? parseInt(value) : ""
                                    );
                                  }}
                                  isInvalid={
                                    formik.touched.priceWater &&
                                    formik.errors.priceWater
                                  }
                                />
                                <InputGroup.Text>vnd</InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.priceWater}
                                </Form.Control.Feedback>
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Số lượng người và Giá dịch vụ mỗi người */}
                        <Row>
                          <Col>
                            <Form.Group
                              controlId="currentOccupants"
                              className="mb-3"
                            >
                              <Form.Label>Số lượng người</Form.Label>
                              <InputGroup>
                                <Form.Control
                                  disabled
                                  type="number"
                                  value={formik?.values?.currentOccupants}
                                />
                                <InputGroup.Text>Người</InputGroup.Text>
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group
                              controlId="servicePricePerPerson"
                              className="mb-3"
                            >
                              <Form.Label>Giá dịch vụ mỗi người</Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  value={
                                    formik.values.servicePricePerPerson?.toLocaleString(
                                      "vi-VN"
                                    ) || ""
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    formik.setFieldValue(
                                      "servicePricePerPerson",
                                      value ? parseInt(value) : ""
                                    );
                                  }}
                                  isInvalid={
                                    formik.touched.servicePricePerPerson &&
                                    formik.errors.servicePricePerPerson
                                  }
                                />
                                <InputGroup.Text>vnd</InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.servicePricePerPerson}
                                </Form.Control.Feedback>
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Tổng tiền */}
                        <Form.Group controlId="totalAmount" className="mb-3">
                          <Form.Label>Tổng tiền</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="text"
                              value={
                                (
                                  formik?.values?.priceRoom +
                                  formik?.values?.electricityUsage *
                                    formik?.values?.priceElectricity +
                                  formik?.values?.waterUsage *
                                    formik?.values?.priceWater +
                                  formik?.values?.currentOccupants *
                                    formik?.values?.servicePricePerPerson
                                )?.toLocaleString("vi-VN") || ""
                              }
                              disabled
                              isInvalid={
                                formik.touched.totalAmount &&
                                formik.errors.totalAmount
                              }
                            />
                            <InputGroup.Text>vnd</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.totalAmount}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>

                        {/* Nút submit */}
                        <div className="text-center">
                          <Button
                            type={`${
                              checkDuplicate() || filterCustomer?.length === 0
                                ? "button"
                                : "submit"
                            }`}
                            variant={`${
                              checkDuplicate() || filterCustomer?.length === 0
                                ? "secondary"
                                : "primary"
                            } `}
                            disabled={creatingInvoice}
                          >
                            {creatingInvoice ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Tạo hoá đơn"
                            )}
                          </Button>
                        </div>
                      </Form>
                    ) : (
                      <p className="text-center"> Không thể tạo hoá đơn</p>
                    )}
                  </Card.Body>
                </Card>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
export default memo(CreateNewInvoice);

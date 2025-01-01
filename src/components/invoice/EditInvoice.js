import React, { useState, memo } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useGetDataByUrl } from "../../fetchData/DataFetch";
import { useNavigate, useParams } from "react-router-dom";
import getCurrentDateTime from "../../until/getCurrentDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../../until/Loading";

const EditInvoice = () => {
  const [updateMessage, setUpdateMessage] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetDataByUrl(
    `http://localhost:9999/invoice/${id}`,
    `invoice${id}`
  );

  const roomId = data?.data?.roomId;
  const { data: room, isLoading: loadRoom } = useGetDataByUrl(
    roomId ? `http://localhost:9999/room/${roomId}` : null,
    roomId ? `room${roomId}` : null
  );

  const queryClient = useQueryClient();
  const invoiceData = data?.data;

  const { mutate } = useMutation({
    mutationFn: (payload) =>
      axios.put(`http://localhost:9999/invoice/${id}`, payload),
    onSuccess: () => {
      setUpdateMessage({
        type: "success",
        text: "Cập nhật hoá đơn thành công!",
      });
      queryClient.invalidateQueries(["invoice", `invoice${id}`]);
      navigate(-1);
    },
    onError: () => {
      setUpdateMessage({
        type: "error",
        text: "Có lỗi xảy ra khi cập nhật hoá đơn!",
      });
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      roomId: invoiceData?.roomId || "",
      hostelId: invoiceData?.hostelId || "",
      month: invoiceData?.month || "",
      priceRoom: room?.data?.price || 0,
      electricityUsage: invoiceData?.electricityUsage || 0,
      priceElectricity: invoiceData?.priceElectricity || 3500,
      waterUsage: invoiceData?.waterUsage || 0,
      priceWater: invoiceData?.priceWater || 15000,
      servicePricePerPerson: invoiceData?.servicePricePerPerson || 100000,
      currentOccupants: invoiceData?.currentOccupants || 0,
    },
    validationSchema: Yup.object({
      roomId: Yup.string().required("Phòng trọ không được để trống."),
      hostelId: Yup.string().required("Nhà trọ không được để trống."),
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
      const totalAmount = [
        values?.priceRoom,
        values?.electricityUsage * values?.priceElectricity,
        values?.waterUsage * values?.priceWater,
        values?.currentOccupants * values?.servicePricePerPerson,
      ].reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

      const fullPayload = {
        ...invoiceData,
        ...values,
        totalAmount,
        updatedAt: getCurrentDateTime(),
      };
      mutate(fullPayload);
    },
  });

  if (isLoading || loadRoom) {
    return <Loading />;
  }

  if (!data || !room) {
    return <Alert variant="danger">Không thể tải dữ liệu hoá đơn hoặc phòng.</Alert>;
  }

  return (
    <div className="container my-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4">Chỉnh sửa Hoá Đơn</h2>
        <Form onSubmit={formik.handleSubmit}>
          {updateMessage && (
            <Alert
              variant={updateMessage.type === "success" ? "success" : "danger"}
            >
              {updateMessage.text}
            </Alert>
          )}
          <Row>
            <Col>
              <Form.Group controlId="priceRoom" className="mb-3">
                <Form.Label>Giá phòng</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    formik.values.priceRoom
                      ? parseInt(formik.values.priceRoom, 10).toLocaleString("vi-VN")
                      : "0"
                  }
                  onChange={(e) => {
                    const rawValue = parseFloat(e.target.value.replace(/\D/g, "")) || 0;
                    formik.setFieldValue("priceRoom", rawValue);
                  }}
                  isInvalid={
                    formik.touched.priceRoom && formik.errors.priceRoom
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.priceRoom}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="electricityUsage" className="mb-3">
                <Form.Label>Số điện</Form.Label>
                <Form.Control
                  type="number"
                  {...formik.getFieldProps("electricityUsage")}
                  isInvalid={
                    formik.touched.electricityUsage &&
                    formik.errors.electricityUsage
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.electricityUsage}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="priceElectricity" className="mb-3">
                <Form.Label>Giá điện</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    formik.values.priceElectricity
                      ? parseInt(formik.values.priceElectricity, 10).toLocaleString("vi-VN")
                      : "0"
                  }
                  onChange={(e) => {
                    const rawValue = parseFloat(e.target.value.replace(/\D/g, "")) || 0;
                    formik.setFieldValue("priceElectricity", rawValue);
                  }}
                  isInvalid={
                    formik.touched.priceElectricity && formik.errors.priceElectricity
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.priceElectricity}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="waterUsage" className="mb-3">
                <Form.Label>Số nước</Form.Label>
                <Form.Control
                  type="number"
                  {...formik.getFieldProps("waterUsage")}
                  isInvalid={
                    formik.touched.waterUsage && formik.errors.waterUsage
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.waterUsage}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="priceWater" className="mb-3">
                <Form.Label>Giá nước</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    formik.values.priceWater
                      ? parseInt(formik.values.priceWater, 10).toLocaleString("vi-VN")
                      : "0"
                  }
                  onChange={(e) => {
                    const rawValue = parseFloat(e.target.value.replace(/\D/g, "")) || 0;
                    formik.setFieldValue("priceWater", rawValue);
                  }}
                  isInvalid={
                    formik.touched.priceWater && formik.errors.priceWater
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.priceWater}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="servicePricePerPerson" className="mb-3">
                <Form.Label>Giá dịch vụ mỗi người</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    formik.values.servicePricePerPerson
                      ? parseInt(formik.values.servicePricePerPerson, 10).toLocaleString("vi-VN")
                      : "0"
                  }
                  onChange={(e) => {
                    const rawValue = parseFloat(e.target.value.replace(/\D/g, "")) || 0;
                    formik.setFieldValue("servicePricePerPerson", rawValue);
                  }}
                  isInvalid={
                    formik.touched.servicePricePerPerson && formik.errors.servicePricePerPerson
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.servicePricePerPerson}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="currentOccupants" className="mb-3">
                <Form.Label>Số người ở hiện tại</Form.Label>
                <Form.Control
                  type="number"
                  {...formik.getFieldProps("currentOccupants")}
                  isInvalid={
                    formik.touched.currentOccupants && formik.errors.currentOccupants
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.currentOccupants}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <InputGroup>
              <p className="fw-bold">Tổng tiền: </p>
              <p>
                {formik?.values?.priceRoom &&
                  parseInt(
                    [
                      formik?.values?.priceRoom,
                      formik?.values?.electricityUsage * formik?.values?.priceElectricity,
                      formik?.values?.waterUsage * formik?.values?.priceWater,
                      formik?.values?.currentOccupants * formik?.values?.servicePricePerPerson,
                    ].reduce((sum, val) => sum + (val || 0), 0),
                    10
                  ).toLocaleString("vi-VN") || "0"}
                vnd
              </p>
            </InputGroup>
          </Row>
          <div className="text-center">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              className="me-3"
            >
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary">
              Cập nhật
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default memo(EditInvoice);

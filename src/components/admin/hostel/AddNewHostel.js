import React, { memo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import useProcessFile from "../../../until/processFile";
import getCurrentDateTime from "../../../until/getCurrentDate";

const AddNewHostel = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [creationMessage, setCreationMessage] = useState(null);

  const { mutate: createHostel, isLoading: creatingHostel } = useMutation({
    mutationFn: (payload) => axios.post(`http://localhost:9999/hostel`, payload),
    onSuccess: () => {
      setCreationMessage({
        type: "success",
        text: "Thêm nhà trọ mới thành công!",
      });
      setTimeout(() => navigate(-1), 500);
      queryClient.invalidateQueries(["hostels"]);
    },
    onError: () => {
      setCreationMessage({
        type: "error",
        text: "Có lỗi xảy ra khi thêm nhà trọ mới!",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      description: "",
      status: 1,
      images: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Tên nhà trọ không được bỏ trống."),
      address: Yup.string().trim().required("Địa chỉ không được bỏ trống."),
      description: Yup.string(),
      status: Yup.number().required("Trạng thái không được bỏ trống."),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        status: Number(values.status),
        createdAt: getCurrentDateTime(),
        updatedAd: getCurrentDateTime(),
      };
      createHostel(payload);
    },
  });

  const { processFile, convertFilesToBase64 } = useProcessFile();

  const saveImagesToFormik = (base64Images) => {
    formik.setFieldValue("images", [...formik.values.images, ...base64Images]);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const acceptedFormats = ["image/jpeg", "image/jpg", "image/png"];

    const validFiles = processFile(files, acceptedFormats);

    if (validFiles.length === 0) return;

    convertFilesToBase64(validFiles)
      .then((base64Images) => saveImagesToFormik(base64Images))
      .catch(() => alert("Có lỗi xảy ra khi xử lý hình ảnh."));
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="text-center">Thêm nhà trọ mới</h2>
          {creationMessage && (
            <Alert
              variant={
                creationMessage.type === "success" ? "success" : "danger"
              }
              className="mt-3"
            >
              {creationMessage.text}
            </Alert>
          )}
          <Form onSubmit={formik.handleSubmit} className="mt-4">
            <Form.Group controlId="name">
              <Form.Label>Tên nhà trọ</Form.Label>
              <Form.Control
                type="text"
                {...formik.getFieldProps("name")}
                isInvalid={formik.touched.name && formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="address" className="mt-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                {...formik.getFieldProps("address")}
                isInvalid={formik.touched.address && formik.errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.address}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...formik.getFieldProps("description")}
              />
            </Form.Group>

            <Form.Group controlId="status" className="mt-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select {...formik.getFieldProps("status")}>
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="images" className="mt-3">
              <Form.Label>Hình ảnh</Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {formik.values.images.map((img, index) => (
                  <div key={index} className="position-relative">
                    <img
                      src={img}
                      alt={`Hostel ${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <div
                      className="delete-button"
                      onClick={() => handleImageRemove(index)}
                    >
                      x
                    </div>
                  </div>
                ))}
              </div>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                className="mt-2"
                onChange={(event) => handleImageUpload(event)}
              />
            </Form.Group>

            <div className="text-center mt-4">
              <Button variant="primary" type="submit" disabled={creatingHostel}>
                {creatingHostel ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Thêm nhà trọ"
                )}
              </Button>
              <Button
                variant="secondary"
                className="ms-3"
                onClick={() => navigate(-1)}
              >
                Hủy
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default memo(AddNewHostel);

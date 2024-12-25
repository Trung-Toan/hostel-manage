import React, { memo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetData } from "../../../fetchData/DataFetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Form,
  Button,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Card,
  Image,
} from "react-bootstrap";
import axios from "axios";
import "./EditHostel.css";
import useProcessFile from "../../../until/processFile";
import getCurrentDateTime from "../../../until/getCurrentDate";
import { FaTrash } from "react-icons/fa";

const EditHostel = ({ hostelList }) => {
  const { hId } = useParams();
  const navigate = useNavigate();
  const { getData } = useGetData();
  const [updateMessage, setUpdateMessage] = useState(null);
  const [img, setImg] = useState("");

  const {
    data: hostelDetail,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getData(`http://localhost:9999/hostel/${hId}`),
    queryKey: ["hostelDetail" + hId],
    staleTime: 10000,
    cacheTime: 1000 * 60,
    enabled: !!hId,
    retry: false,
  });

  const queryClient = useQueryClient();
  const { mutate, isLoading: updatingHostel } = useMutation({
    mutationFn: (payload) =>
      axios.put(`http://localhost:9999/hostel/${hId}`, payload),
    onSuccess: () => {
      setUpdateMessage({
        type: "success",
        text: "Cập nhật nhà trọ thành công!",
      });
      setTimeout(() => navigate(-1), 2000);
      queryClient.invalidateQueries(["hostelDetail" + hId]);
      queryClient.refetchQueries(["hostel"]);
    },
    onError: () => {
      setUpdateMessage({
        type: "error",
        text: "Có lỗi xảy ra khi cập nhật nhà trọ!",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: hostelDetail?.data?.name || "",
      address: hostelDetail?.data?.address || "",
      description: hostelDetail?.data?.description || "",
      status: hostelDetail?.data?.status || 1,
      images: hostelDetail?.data?.images || [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .required("Tên nhà trọ không được bỏ trống.")
        .test(
          "unique-name",
          "Tên nhà trọ đã tồn tại, vui lòng chọn tên khác.",
          function (value) {
            const rootName = hostelDetail?.data?.name || "";
            const currentName = this.parent.name || "";

            if (!hostelList || hostelList.length === 0) return true;

            for (let h of hostelList) {
              if (
                h.name.toLowerCase() === value.toLocaleLowerCase() &&
                currentName !== rootName
              ) {
                return false;
              }
            }
            return true;
          }
        ),
      address: Yup.string().trim().required("Địa chỉ không được bỏ trống."),
      description: Yup.string(),
      status: Yup.number().required("Trạng thái không được bỏ trống."),
    }),
    onSubmit: (values) => {
      const payload = {
        ...hostelDetail?.data,
        ...values,
        status: Number(values.status),
        updatedAt: getCurrentDateTime(),
      };
      mutate(payload);
    },
  });

  useEffect(() => {
    if (formik.values.images.length > 0) {
      setImg(formik.values.images[0]);
    }
  }, [formik.values.images]);

  const { processFile, convertFilesToBase64 } = useProcessFile();

  const saveImagesToFormik = (base64Images) => {
    formik.setFieldValue("images", [...formik.values.images, ...base64Images]);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const acceptedFormats = ["image/jpeg", "image/jpg"];

    const validFiles = processFile(files, acceptedFormats);

    if (validFiles.length === 0) return;

    convertFilesToBase64(validFiles)
      .then((base64Images) => {
        saveImagesToFormik(base64Images);
      })
      .catch((error) => {
        alert("Có lỗi xảy ra khi xử lý hình ảnh.");
      });
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Lỗi: {error.message}</Alert>;
  }

  return (
    <Container fluid>
      <Row className="mt-4 justify-content-center">
        <Col md={8}>
          <h2 className="text-center text-primary">
            Chỉnh sửa thông tin nhà trọ
          </h2>
          {updateMessage && (
            <Alert
              variant={updateMessage.type === "success" ? "success" : "danger"}
              className="mt-3 text-center"
            >
              {updateMessage.text}
            </Alert>
          )}
          <Form onSubmit={formik.handleSubmit} className="mt-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-4">
                    <Form.Group controlId="images">
                      <Form.Label className="fw-bold">Hình ảnh</Form.Label>
                      <Card>
                        <Card.Body className="text-center">
                          <Image
                            src={img || "https://via.placeholder.com/300"}
                            alt="Hostel"
                            fluid
                            rounded
                            className="mb-3 border"
                            style={{ height: "300px", objectFit: "contain" }}
                          />
                          <div
                            className="d-flex flex-wrap gap-3 justify-content-center p-2"
                            style={{ borderTop: "1px solid black" }}
                          >
                            {formik.values.images.map((i, index) => (
                              <div
                                key={index}
                                className="position-relative thumbnail-container"
                              >
                                <Image
                                  src={i}
                                  alt={`Hostel ${index}`}
                                  onClick={() => setImg(i)}
                                  thumbnail
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "contain",
                                    border:
                                      i === img
                                        ? "2px solid red"
                                        : "1px solid #ddd",
                                    cursor: "pointer",
                                  }}
                                />
                                <div
                                  className="delete-button"
                                  onClick={() => handleImageRemove(index)}
                                >
                                  <FaTrash />
                                </div>
                              </div>
                            ))}
                          </div>
                          <Form.Control
                            type="file"
                            multiple
                            accept="image/*"
                            className="mt-2"
                            onChange={handleImageUpload}
                          />
                        </Card.Body>
                      </Card>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="name" className="mb-3">
                      <Form.Label className="fw-bold">Tên nhà trọ</Form.Label>
                      <Form.Control
                        type="text"
                        {...formik.getFieldProps("name")}
                        isInvalid={formik.touched.name && formik.errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="address" className="mb-3">
                      <Form.Label className="fw-bold">Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        {...formik.getFieldProps("address")}
                        isInvalid={
                          formik.touched.address && formik.errors.address
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="status" className="mb-3">
                      <Form.Label className="fw-bold">Trạng thái</Form.Label>
                      <Form.Select {...formik.getFieldProps("status")}>
                        <option value={1}>Hoạt động</option>
                        <option value={0}>Ngừng hoạt động</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.status}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="description" className="mb-3">
                      <Form.Label className="fw-bold">Mô tả</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        {...formik.getFieldProps("description")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="mt-4 text-center">
              <Button
                type="submit"
                variant="primary"
                className="me-3"
                disabled={updatingHostel}
              >
                {updatingHostel ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : null}
                Cập nhật
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={updatingHostel}
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

export default memo(EditHostel);

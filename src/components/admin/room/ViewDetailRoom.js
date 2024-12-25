import React, { memo, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Alert,
  Card,
  Image,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import useProcessFile from "../../../until/processFile";
import getCurrentDateTime from "../../../until/getCurrentDate";
import { FaTrash } from "react-icons/fa";
import { AiOutlineSave, AiOutlineRollback } from "react-icons/ai";

const ViewDetailRoom = ({ utilities, statusMapping }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [updateMessage, setUpdateMessage] = useState(null);
  const [img, setImg] = useState("");

  const {
    data: roomData,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => axios.get(`http://localhost:9999/room/${roomId}`),
    queryKey: ["roomDetail", roomId],
    staleTime: 10000,
    cacheTime: 1000 * 60,
    enabled: !!roomId,
    retry: false,
  });

  const { mutate: updateRoom, isLoading: updatingRoom } = useMutation({
    mutationFn: (payload) =>
      axios.put(`http://localhost:9999/room/${roomId}`, payload),
    onSuccess: () => {
      setUpdateMessage({
        type: "success",
        text: "Cập nhật thông tin phòng thành công!",
      });
      setTimeout(() => navigate(-1), 2000);
      queryClient.invalidateQueries(["roomDetail", roomId]);
      queryClient.refetchQueries(["rooms"]);
    },
    onError: () => {
      setUpdateMessage({
        type: "error",
        text: "Có lỗi xảy ra khi cập nhật thông tin phòng!",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: roomData?.data?.name || "",
      price: roomData?.data?.price || 0,
      description: roomData?.data?.description || "",
      status: roomData?.data?.status || 1,
      images: roomData?.data?.images || [],
      area: roomData?.data?.area || 0,
      utilities: roomData?.data?.utilities || [],
      currentOccupants: roomData?.data?.currentOccupants || 0,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Tên phòng không được bỏ trống."),
      price: Yup.number().required("Giá thuê không được bỏ trống."),
      area: Yup.number().required("Diện tích không được bỏ trống."),
      description: Yup.string(),
      status: Yup.number().required("Trạng thái không được bỏ trống."),
      utilities: Yup.array()
        .of(Yup.string())
        .required("Tiện ích không được bỏ trống."),
    }),
    onSubmit: (values) => {
      const payload = {
        ...roomData?.data,
        ...values,
        status: Number(values.status),
        updatedAt: getCurrentDateTime(),
      };
      updateRoom(payload);
    },
  });

  useEffect(() => {
    if (formik?.values?.images.length > 0) {
      setImg(formik.values.images[0]);
    }
  }, [formik.values.images]);

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
    <Container>
      <Row className="mt-4">
        <Col md={{ span: 8, offset: 2 }}>
          <h2 className="text-center text-primary">
            Chỉnh sửa thông tin phòng
          </h2>
          {updateMessage && (
            <Alert
              variant={updateMessage.type === "success" ? "success" : "danger"}
              className="mt-3 text-center"
            >
              {updateMessage.text}
            </Alert>
          )}
          <Form
            onSubmit={formik.handleSubmit}
            className="mt-4 border p-4 rounded shadow-sm bg-light"
          >
            <Row>
              <Col md={6}>
                <Form.Group controlId="images" className="mb-4">
                  <Form.Label className="fw-bold">Hình ảnh</Form.Label>
                  <Card className="p-3">
                    <Image
                      src={img || "https://via.placeholder.com/300"}
                      alt="Hostel"
                      fluid
                      rounded
                      className="mb-3 border"
                      style={{ height: "300px", objectFit: "contain" }}
                    />
                    <div className="d-flex flex-wrap gap-3 justify-content-center border-top pt-3">
                      {formik.values.images.map((i, index) => (
                        <div key={index} className="position-relative">
                          <Image
                            src={i}
                            alt={`Hostel ${index}`}
                            onClick={() => setImg(i)}
                            thumbnail
                            className="border"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "contain",
                              border:
                                i === img ? "2px solid red" : "1px solid #ddd",
                              cursor: "pointer",
                            }}
                          />
                          <div
                            className="position-absolute top-0 start-100 translate-middle badge bg-danger"
                            style={{ cursor: "pointer" }}
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
                      className="mt-3"
                      onChange={handleImageUpload}
                    />
                  </Card>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label className="fw-bold">Tên phòng</Form.Label>
                  <Form.Control
                    type="text"
                    {...formik.getFieldProps("name")}
                    isInvalid={formik.touched.name && formik.errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="price" className="mb-3">
                  <Form.Label className="fw-bold">Giá thuê</Form.Label>
                  <Form.Control
                    type="number"
                    {...formik.getFieldProps("price")}
                    isInvalid={formik.touched.price && formik.errors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.price}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="area" className="mb-3">
                  <Form.Label className="fw-bold">Diện tích</Form.Label>
                  <Form.Control
                    type="number"
                    {...formik.getFieldProps("area")}
                    isInvalid={formik.touched.area && formik.errors.area}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.area}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="utilities" className="mb-3">
                  <Form.Label>Tiện ích</Form.Label>
                  <div>
                    {utilities?.data?.map((utility) => (
                      <Form.Check
                        key={utility.id}
                        type="checkbox"
                        label={utility.name}
                        value={utility.id}
                        className="form-check" // Đảm bảo className đúng theo CSS
                        onChange={(e) => {
                          const { checked, value } = e.target;
                          const currentUtilities = formik.values.utilities;

                          if (checked) {
                            formik.setFieldValue("utilities", [
                              ...currentUtilities,
                              value,
                            ]);
                          } else {
                            formik.setFieldValue(
                              "utilities",
                              currentUtilities.filter((item) => item !== value)
                            );
                          }
                        }}
                        checked={formik.values.utilities.includes(utility.id)}
                      />
                    ))}
                  </div>
                  {formik.touched.utilities && formik.errors.utilities && (
                    <Form.Text className="text-danger">
                      {formik.errors.utilities}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label className="fw-bold">Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...formik.getFieldProps("description")}
                  />
                </Form.Group>

                <Form.Group controlId="status" className="mb-3">
                  <Form.Label className="fw-bold">Trạng thái</Form.Label>
                  <Form.Select {...formik.getFieldProps("status")}>
                    {Object.keys(statusMapping)?.map((s) => {
                      const status = statusMapping[s];
                      return (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={updatingRoom}
                className="me-3"
              >
                {updatingRoom ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <AiOutlineSave className="me-1" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
              <Button variant="secondary" onClick={() => navigate(-1)}>
                <AiOutlineRollback className="me-1" />
                Hủy
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default memo(ViewDetailRoom);

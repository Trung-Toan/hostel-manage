import React, { memo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import useProcessFile from "../../../until/processFile";
import getCurrentDateTime from "../../../until/getCurrentDate";

const AddNewRoom = ({utilities}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [creationMessage, setCreationMessage] = useState(null);
  const { hId } = useParams();

  const { mutate: createRoom, isLoading: creatingRoom } = useMutation({
    mutationFn: (payload) => axios.post(`http://localhost:9999/room`, payload),
    onSuccess: () => {
      setCreationMessage({
        type: "success",
        text: "Thêm phòng mới thành công!",
      });
      setTimeout(() => navigate(-1), 2000);
      queryClient.invalidateQueries(["rooms"]);
    },
    onError: () => {
      setCreationMessage({
        type: "error",
        text: "Có lỗi xảy ra khi thêm phòng mới!",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      status: 1,
      images: [],
      area: 0,
      utilities: [],
      currentOccupants: 0,
    },

    validationSchema: Yup.object({
      name: Yup.string().trim().required("Tên phòng không được bỏ trống."),
      price: Yup.number()
        .required("Giá phòng không được bỏ trống.") // Kiểm tra không bỏ trống trước tiên
        .positive("Giá phòng phải lớn hơn 0.") // Kiểm tra số dương trước
        .min(10000, "Giá phòng phải lớn hơn 10,000vnđ.") // Giá trị tối thiểu
        .max(20000000, "Giá phòng không được vượt quá 20,000,000vnđ."), // Giá trị tối đa
      description: Yup.string()
        .trim()
        .required("Bạn không được bỏ trống trường này."),
      status: Yup.number().required("Trạng thái không được bỏ trống."),
      area: Yup.number("Bạn phải nhập số diện tích.")
        .required("Bạn không được bỏ qua trường này.")
        .positive("Diện tích phòng phải lớn hơn 0.")
        .min(10, "Bạn phải nhập diện tích là lớn hơn 10m²")
        .max(200, "Bạn phải nhập diện tích nhỏ hơn 200m²"),
      utilities: Yup.array()
        .min(1, "Bạn phải chọn ít nhất một tiện ích.")
        .required("Trường này là bắt buộc."),
      currentOccupants: Yup.number("Bạn phải nhập 1 số")
        .required("Ban không được bỏ trống trường này")
        .min(0, "Số lượng người ở không được bé hơn 0")
        .max(5, "Số lượng người ở không được vượt quá 5 người"),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        status: Number(values.status),
        hostelId: hId,
        area: Number(values.area),
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      };
      createRoom(payload);
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
          <h2 className="text-center mb-3">Thêm phòng mới</h2>
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
          <Form onSubmit={formik.handleSubmit} className="mb-4">
            {/* name */}
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Tên phòng</Form.Label>
              <Form.Control
                type="text"
                {...formik.getFieldProps("name")}
                placeholder="Nhập tên phòng trọ"
                isInvalid={formik.touched.name && formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col className="mb-3">
                {/* price */}
                <Form.Group controlId="price">
                  <Form.Label>Giá phòng</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      {...formik.getFieldProps("price")}
                      isInvalid={formik.touched.price && formik.errors.price}
                      placeholder="Nhập giá phòng"
                    />
                    <span className="bg-secondary p-2">
                      vnd
                    </span>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.price}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col>
                {/* area */}
                <Form.Group controlId="area">
                  <Form.Label>Diện tích</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      {...formik.getFieldProps("area")}
                      placeholder="Nhập diện tích phòng"
                      isInvalid={formik.touched.area && formik.errors.area}
                    />
                    <span className="bg-secondary p-2">
                      m²
                    </span>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.area}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="currentOccupants" className="mb-3">
                  <Form.Label>Số người ở</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      {...formik.getFieldProps("currentOccupants")}
                      placeholder="Nhập số lượng người ở"
                      isInvalid={
                        formik.touched.currentOccupants &&
                        formik.errors.currentOccupants
                      }
                    />
                    <span className="bg-secondary p-2">người</span>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.currentOccupants}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col>
                {/* status */}
                <Form.Group controlId="status" className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select {...formik.getFieldProps("status")}>
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Không hoạt động</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
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

            {/* description */}
            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả phòng"
                {...formik.getFieldProps("description")}
                isInvalid={
                  formik.touched.description && formik.errors.description
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>
            
            {/* image */}
            <Form.Group controlId="images" className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {formik.values.images.map((img, index) => (
                  <div key={index} className="position-relative">
                    <img
                      src={img}
                      alt={`Room ${index}`}
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
            {/* submit */}
            <div className="text-center mb-4">
              <Button variant="primary" type="submit" disabled={creatingRoom}>
                {creatingRoom ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Thêm phòng"
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

export default memo(AddNewRoom);

import React, { useState } from "react";
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
} from "react-bootstrap";
import axios from "axios";
import "./EditHostel.css";
import useProcessFile from "../../../until/processFile";

const EditHostel = () => {
  const { hId } = useParams();
  const navigate = useNavigate();
  const { getData } = useGetData();
  const [updateMessage, setUpdateMessage] = useState(null);

  // Fetch Hostel Details
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

  // Update Hostel Mutation
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
      name: Yup.string().trim().required("Tên nhà trọ không được bỏ trống."),
      address: Yup.string().trim().required("Địa chỉ không được bỏ trống."),
      description: Yup.string(),
      status: Yup.number().required("Trạng thái không được bỏ trống."),
    }),
    onSubmit: (values) => {
      const payload = {
        ...hostelDetail?.data,
        ...values,
        status: Number(values.status),
      };
      mutate(payload);
    },
  });

  const {processFile, convertFilesToBase64} = useProcessFile();

  const saveImagesToFormik = (base64Images) => {
    formik.setFieldValue("images", [...formik.values.images, ...base64Images]);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const acceptedFormats = ["image/jpeg", "image/jpg"];

    // Gọi hàm xử lý tệp
    const validFiles = processFile(files, acceptedFormats);

    if (validFiles.length === 0) return; // Nếu không có tệp hợp lệ, dừng lại

    // Chuyển đổi file sang Base64
    convertFilesToBase64(validFiles)
      .then((base64Images) => {
        console.log("Hình ảnh dưới dạng Base64:", base64Images);
        // Lưu vào Formik
        saveImagesToFormik(base64Images);
      })
      .catch((error) => {
        console.error("Lỗi khi xử lý file: ", error);
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
    <Container>
      <Row className="mt-4">
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="text-center">Chỉnh sửa thông tin nhà trọ</h2>
          {updateMessage && (
            <Alert
              variant={updateMessage.type === "success" ? "success" : "danger"}
              className="mt-3"
            >
              {updateMessage.text}
            </Alert>
          )}
          <Form onSubmit={formik.handleSubmit} className="mt-4">
            {/* Tên */}
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

            {/* Địa chỉ */}
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

            {/* Mô tả */}
            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...formik.getFieldProps("description")}
              />
            </Form.Group>

            {/* Trạng thái */}
            <Form.Group controlId="status" className="mt-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select {...formik.getFieldProps("status")}>
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </Form.Select>
            </Form.Group>

            {/* Hình ảnh */}
            <Form.Group controlId="images" className="mt-3">
              <Form.Label>Hình ảnh</Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {/* Hiển thị hình ảnh đã chọn */}
                {formik.values.images.map((img, index) => (
                  <div key={index} className="position-relative">
                    {/* Hình ảnh */}
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
                    {/* Nút Xóa */}
                    <div
                      className="delete-button"
                      onClick={() => handleImageRemove(index)}
                    >
                      x
                    </div>
                  </div>
                ))}
              </div>
              {/* Input file */}
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                className="mt-2"
                onChange={(event) => handleImageUpload(event)}
              />
            </Form.Group>

            <div className="text-center mt-4">
              <Button variant="primary" type="submit" disabled={updatingHostel}>
                {updatingHostel ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Lưu thay đổi"
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

export default EditHostel;

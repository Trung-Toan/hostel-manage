import React, { memo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useProcessFile from "../../../until/processFile";
import getCurrentDateTime from "../../../until/getCurrentDate";

const CreateNewPost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [creationMessage, setCreationMessage] = useState(null);

  const { mutate: createPost, isLoading: creatingPost } = useMutation({
    mutationFn: (payload) => axios.post(`http://localhost:9999/post`, payload),
    onSuccess: () => {
      setCreationMessage({
        type: "success",
        text: "Tạo bài đăng mới thành công!",
      });
      setTimeout(() => navigate(-1), 2000);
      queryClient.invalidateQueries(["posts"]);
    },
    onError: () => {
      setCreationMessage({
        type: "error",
        text: "Có lỗi xảy ra khi tạo bài đăng mới!",
      });
    },
  });

  const { processFile, convertFilesToBase64 } = useProcessFile();

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      images: [],
      status: 1,
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Tiêu đề không được bỏ trống."),
      content: Yup.string().trim().required("Nội dung không được bỏ trống."),
      status: Yup.number()
        .oneOf([0, 1], "Trạng thái không hợp lệ")
        .required("Trạng thái không được bỏ trống."),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        status: Number(values.status),
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      };
      createPost(payload);
    },
  });

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
    <div style={{ margin: "0 auto", width: "50%" }}>
      <div className="create-new-post">
        <h2 className="text-center">Tạo bài đăng mới</h2>
        {creationMessage && (
          <Alert
            variant={creationMessage.type === "success" ? "success" : "danger"}
          >
            {creationMessage.text}
          </Alert>
        )}
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              isInvalid={formik.touched.title && !!formik.errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nội dung</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              isInvalid={formik.touched.content && !!formik.errors.content}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.content}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hình ảnh</Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              onChange={handleImageUpload}
            />
            <Row className="mt-3">
              {formik.values.images.map((image, index) => (
                <Col key={index} md={3} className="mb-3">
                  <div className="image-preview">
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      className="img-thumbnail"
                    />
                    <div className="d-flex justify-content-center">
                      <Button
                        variant="danger"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleImageRemove(index)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              isInvalid={formik.touched.status && !!formik.errors.status}
            >
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.status}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Link to={"/"} className="btn btn-warning me-3">
              Trở về
            </Link>
            <Button type="submit" disabled={creatingPost}>
              {creatingPost ? "Đang tạo..." : "Đăng bài"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default memo(CreateNewPost);

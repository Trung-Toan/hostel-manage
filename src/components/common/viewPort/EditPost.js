import React, { memo, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import useProcessFile from "../../../until/processFile";
import getCurrentDateTime from "../../../until/getCurrentDate";

const EditPost = () => {
  const { id } = useParams(); // Lấy ID bài viết từ URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editMessage, setEditMessage] = useState(null);

  const {
    data: post,
    isLoading: loadingPost,
    error: fetchError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => axios.get(`http://localhost:9999/post/${id}`),
    staleTime: 10000,
    cacheTime: 1000 * 60,
  });

  // Mutation cập nhật bài viết
  const { mutate: updatePost, isLoading: updatingPost } = useMutation({
    mutationFn: (payload) =>
      axios.put(`http://localhost:9999/post/${id}`, payload),
    onSuccess: () => {
      setEditMessage({
        type: "success",
        text: "Cập nhật bài đăng thành công!",
      });
      setTimeout(() => navigate(-1), 2000);
      queryClient.invalidateQueries(["posts"]);
    },
    onError: () => {
      setEditMessage({
        type: "error",
        text: "Có lỗi xảy ra khi cập nhật bài đăng!",
      });
    },
  });

  const { processFile, convertFilesToBase64 } = useProcessFile();

  const formik = useFormik({
    initialValues: {
      title: post?.data?.title || "",
      content: post?.data?.content || "",
      images: Array.isArray(post?.data?.images) ? post?.data?.images : [],
      status: post?.data?.status || 1,
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
        updatedAt: getCurrentDateTime(),
      };
      updatePost(payload);
    },
    enableReinitialize: true, // Cho phép khởi tạo lại formik values khi dữ liệu bài viết được load
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

  if (loadingPost) return <div>Đang tải dữ liệu bài viết...</div>;
  if (fetchError)
    return <div>Không thể tải bài viết: {fetchError.message}</div>;

  return (
    <div style={{ margin: "0 auto", width: "50%" }}>
      <div className="edit-post">
        <h2 className="text-center">Chỉnh sửa bài đăng</h2>
        {editMessage && (
          <Alert
            variant={editMessage.type === "success" ? "success" : "danger"}
          >
            {editMessage.text}
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
              multiple
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
            <Button type="submit" disabled={updatingPost}>
              {updatingPost ? "Đang cập nhật..." : "Lưu thay đổi"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default memo(EditPost);

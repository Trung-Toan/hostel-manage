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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import getCurrentDateTime from "../../until/getCurrentDate";
import { useGetDataByUrl } from "../../fetchData/DataFetch";
import Loading from "../../until/Loading";

const CreateNewCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [creationMessage, setCreationMessage] = useState(null);
  const location = useLocation();
  const { id } = useParams();

  const { data, isLoading } = useGetDataByUrl(
    `http://localhost:9999/category/${id}`,
    `category,${id}`
  );

  const isLoadingValue = isLoading || false;

  const { mutate: createCategory, isLoading: creatingCategory } = useMutation({
    mutationFn: (payload) =>
      location.pathname.includes("edit_category")
        ? axios.put(`http://localhost:9999/category/${id}`, payload)
        : axios.post(`http://localhost:9999/category`, payload),
    onSuccess: () => {
      location.pathname.includes("edit_category")
        ? setCreationMessage({
            type: "success",
            text: "Cập nhật danh mục mới thành công!",
          })
        : setCreationMessage({
            type: "success",
            text: "Thêm danh mục mới thành công!",
          });

      setTimeout(() => navigate(-1), 2000);
      queryClient.invalidateQueries(["category"]);
    },
    onError: () => {
      setCreationMessage({
        type: "error",
        text: "Có lỗi xảy ra khi. Xin vui lòng thử lại sau!",
      });
    },
  });

  const formik = useFormik({
    enableReinitialize: true, // Buộc Formik cập nhật initialValues khi data thay đổi
    initialValues: {
      name: location.pathname.includes("edit_category")
        ? data?.data?.name || ""
        : "",
      description: location.pathname.includes("edit_category")
        ? data?.data?.description || ""
        : "",
      status: location.pathname.includes("edit_category")
        ? data?.data?.status || 1
        : 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Tên danh mục không được bỏ trống."),
      description: Yup.string(),
      status: Yup.number().required("Trạng thái không được bỏ trống."),
    }),
    onSubmit: (values) => {
      const payload = location.pathname.includes("edit_category")
        ? {
            ...values,
            status: Number(values.status),
            updatedAt: getCurrentDateTime(),
          }
        : {
            ...values,
            status: Number(values.status),
            createdAt: getCurrentDateTime(),
            updatedAt: getCurrentDateTime(),
          };
      createCategory(payload);
    },
  });

  return (
    <Container>
      {isLoadingValue && location.pathname.includes("edit_category") ? (
        <Loading />
      ) : (
        <Row className="mt-4">
          <Col md={{ span: 6, offset: 3 }}>
            <h2 className="text-center">
              {location.pathname.includes("edit_category")
                ? "Chỉnh sửa danh mục"
                : "Thêm danh mục mới"}
            </h2>
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
                <Form.Label>Tên danh mục</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("name")}
                  isInvalid={formik.touched.name && formik.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
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

              <div className="text-center mt-4">
                {location.pathname.includes("edit_category") ? (
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={creatingCategory}
                  >
                    {creatingCategory ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Cập nhật"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="warning"
                    type="submit"
                    disabled={creatingCategory}
                  >
                    {creatingCategory ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Thêm mới"
                    )}
                  </Button>
                )}
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
      )}
    </Container>
  );
};

export default memo(CreateNewCategory);

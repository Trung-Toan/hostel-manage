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
import { useGetDataByUrl } from "../../fetchData/DataFetch";
import Loading from "../../until/Loading";
import getCurrentDateTime from "../../until/getCurrentDate";

const CreateNewUltility = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [creationMessage, setCreationMessage] = useState(null);

  const { id } = useParams();
  const location = useLocation();
  const pathUltility = location.pathname.includes("edit_ultility");

  const { data, isLoading } = useGetDataByUrl(
    `http://localhost:9999/utilities/${id}`,
    `utilities${id}`
  );

  const loading = isLoading || false;

  const { mutate: createUltility, isLoading: creatingUltility } = useMutation({
    mutationFn: (payload) =>
      pathUltility
        ? axios.put(`http://localhost:9999/utilities/${id}`, payload)
        : axios.post(`http://localhost:9999/utilities`, payload),
    onSuccess: () => {
      setCreationMessage({
        type: "success",
        text: `${
          pathUltility
            ? "Cập nhật tiện ích thành công!" 
            : "Thêm tiện ích mới thành công!"
        } `,
      });
      setTimeout(() => navigate(-1), 2000);
      queryClient.invalidateQueries(["utilities"]);
    },
    onError: () => {
      setCreationMessage({
        type: "error",
        text: `${
          pathUltility
            ? "Có lỗi xảy ra khi cập nhật tiện ích!"
            : "Có lỗi xảy ra khi thêm tiện ích mới!" 
        } `,
      });
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.data?.name || "",
      description: data?.data?.description || "",
      status: data?.data?.status || 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Tên tiện ích không được bỏ trống."),
      description: Yup.string().trim(),
      status: Yup.number().required("Trạng thái không được bỏ trống."),
    }),
    onSubmit: (values) => {
      const payload = pathUltility
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
      createUltility(payload);
    },
  });

  return (
    <Container>
      {loading && pathUltility ? (
        <Loading />
      ) : (
        <Row className="mt-4">
          <Col md={{ span: 6, offset: 3 }}>
            <h2 className="text-center">Thêm tiện ích mới</h2>
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
                <Form.Label>Tên tiện ích</Form.Label>
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
                <Button
                  variant={pathUltility ? "warning" : "primary"}
                  type="submit"
                  disabled={creatingUltility}
                >
                  {creatingUltility ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    `${!pathUltility ? "Thêm mới" : "Cập nhật"}`
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
      )}
    </Container>
  );
};

export default memo(CreateNewUltility);

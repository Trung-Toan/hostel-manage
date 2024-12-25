import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateUser } from "../../../fetchData/DataFetch";
import Notification from "../../../Notification";

const EditInformation = ({ userLogin }) => {
  const { updateUser } = useUpdateUser();
  const [isLoading, setIsLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      fullName: userLogin.fullName || "",
      username: userLogin.username || "",
      email: userLogin.email || "",
      phoneNumber: userLogin.phoneNumber || "",
      persionalAuth: userLogin.persionalAuth || "",
      dob: userLogin.dob || "",
      address: userLogin.address || "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().trim().required("Trường này không được bỏ trống"),
      username: Yup.string().trim().required("Trường này không được bỏ trống"),
      email: Yup.string()
        .trim()
        .email("Email không hợp lệ")
        .required("Trường này không được bỏ trống"),
      phoneNumber: Yup.string()
        .trim()
        .matches(
          /^(0|(\+84))[0-9]{9}$/,
          "Số điện thoại phải bắt đầu bằng +84 hoặc 0 và theo sau là 9 chữ số"
        )
        .required("Trường này không được bỏ trống"),
      persionalAuth: Yup.string()
        .trim()
        .required("Trường này không được bỏ trống"),
      dob: Yup.date()
        .required("Trường này không được bỏ trống")
        .min(
          new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
          "Tuổi phải dưới 30 tuổi"
        )
        .max(
          new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
          "Tuổi phải trên 16 tuổi"
        ),
      address: Yup.string().trim().required("Trường này không được bỏ trống"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setUpdateMessage(null);
      try {
        const updatedUser = await updateUser(userLogin.id, {
          ...userLogin,
          ...values,
        });
        if (updatedUser) {
          setUpdateMessage({
            type: "success",
            text: "Cập nhật thông tin thành công!",
          });
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          throw new Error("Không nhận được phản hồi từ máy chủ.");
        }
      } catch (error) {
        setUpdateMessage({
          type: "error",
          text: "Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại!",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Container className="mt-4">
      {/* Component thông báo */}
      <Notification
        updateMessage={updateMessage}
        setUpdateMessage={setUpdateMessage}
      />

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Button
                as={Link}
                to={`/${
                  userLogin.role === 1
                    ? "admin/"
                    : userLogin.role === 2
                    ? "manager/"
                    : ""
                }information`}
                variant="outline-info"
              >
                Trở về
              </Button>
              <h3 className="mb-4 text-center">Edit Information</h3>

              {/* Avatar */}
              <div className="text-center mb-4">
                <Image
                  src={userLogin.avatar}
                  alt="User Avatar"
                  roundedCircle
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Form */}
              <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col>
                    {/* Full Name */}
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.fullName && !!formik.errors.fullName
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.fullName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    {/* Username */}
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.username && !!formik.errors.username
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    {/* Email */}
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.email && !!formik.errors.email
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    {/* Phone Number */}
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.phoneNumber &&
                          !!formik.errors.phoneNumber
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.phoneNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    {/* Personal Auth */}
                    <Form.Group className="mb-3">
                      <Form.Label>Personal Auth</Form.Label>
                      <Form.Control
                        type="text"
                        name="persionalAuth"
                        value={formik.values.persionalAuth}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.persionalAuth &&
                          !!formik.errors.persionalAuth
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.persionalAuth}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    {/* Date of Birth */}
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.dob && !!formik.errors.dob}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.dob}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Address */}
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.address && !!formik.errors.address
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        {" Đang cập nhật..."}
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditInformation;

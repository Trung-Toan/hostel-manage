import React, { memo, useState } from "react";
import { Form, Button, Container, InputGroup, Alert } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLogin } from "../../validation/Login";

const Login = ({ user, handelIsLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loginToSystem } = useLogin();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      username: user.username || "",
      password: user.password || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().trim()
        .required("Tên đăng nhập không được để trống")
        .min(3, "Tên đăng nhập phải ít nhất 3 ký tự"),
      password: Yup.string().trim()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
    }),
    onSubmit: async (values) => {
      try {
        const { findUser } = await loginToSystem(
          values.username,
          values.password
        );
        if (!findUser) {
          setErrorMessage(
            "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại."
          );
        } else {
          sessionStorage.setItem("user", JSON.stringify(findUser));
          setErrorMessage("");
          handelIsLogin(true);
          navigate("/");
        }
      } catch (error) {
        setErrorMessage("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
      }
    },
  });

  return (
    <Container
      className="p-4 bg-white rounded shadow"
      style={{ maxWidth: "400px" }}
    >
      <h2 className="text-center mb-4">Đăng nhập</h2>

      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}

      <Form onSubmit={formik.handleSubmit}>
        {/* Tên đăng nhập */}
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Tên đăng nhập</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Nhập tên đăng nhập"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.username && formik.touched.username}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.username}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Mật khẩu */}
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Mật khẩu</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Nhập mật khẩu"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.password && formik.touched.password}
            />
            <Button
              variant="outline-secondary"
              onClick={togglePasswordVisibility}
              className="border-left-0"
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </Button>
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        {/* Nút đăng nhập */}
        <Button
          variant="warning"
          type="submit"
          className="w-100"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </Form>
      <p className="text-center mt-3">
        Quên mật khẩu ?{" "}
        <Link to="/find_email" className="text-warning">
          Tìm tài khoản
        </Link>
      </p>
    </Container>
  );
};

export default memo(Login);

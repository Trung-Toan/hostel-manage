import React, { memo, useState } from "react";
import { Form, Button, Container, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Eye, EyeSlash } from 'react-bootstrap-icons';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <Container
      className="p-4 bg-white rounded shadow"
      style={{ maxWidth: "400px" }}
    >
      <h2 className="text-center mb-4">Đăng ký</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formFullName">
          <Form.Label>Họ và Tên</Form.Label>
          <Form.Control type="text" placeholder="Nhập họ và tên" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Nhập email" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Mật khẩu</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              required
            />
            <Button
              variant="outline-secondary"
              onClick={togglePasswordVisibility}
              className="border-left-0"
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </Button>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label>Xác nhận mật khẩu</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Xác nhận mật khẩu"
              required
            />
            <Button
              variant="outline-secondary"
              onClick={toggleConfirmPasswordVisibility}
              className="border-left-0"
            >
              {showConfirmPassword ? <EyeSlash /> : <Eye />}
            </Button>
          </InputGroup>
        </Form.Group>
        <Button variant="warning" type="submit" className="w-100">
          Đăng ký
        </Button>
      </Form>
      <p className="text-center mt-3">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-warning">
          Đăng nhập
        </Link>
      </p>
    </Container>
  );
};

export default memo(Register);

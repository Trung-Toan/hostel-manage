import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import SendEmailComponent from "../../until/send.mail";
import { useLogin } from "../../validation/Login";

const FindEmail = ({ user, handleSetEmail }) => {
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendEmail } = SendEmailComponent;
  const { findEmail, loadingUser } = useLogin();
  const [otp, setOtp] = useState("");
  const [clickSendOtp, setClikSendOtp] = useState(false);
  const navigate = useNavigate();
  const [userFound, setUserFound] = useState({});

  useEffect(() => {
    const generateOtp = () => {
      setOtp(Math.floor(100000 + Math.random() * 900000).toString());
    };
    generateOtp();
    setInterval(generateOtp, 5 * 60 * 1000);
  }, []);

  // validate for email and otp
  const formik = useFormik({
    initialValues: {
      email: user.email || "",
      otp: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email là không được bỏ trống")
        .email("Bạn phải nhập đúng định dạng"),
      otp: Yup.string()
        .required("Bạn phải nhập mã OTP")
        .matches(/^\d{6}$/, "Mã OTP phải gồm 6 chữ số"),
    }),
    onSubmit: (values) => {
      if (!clickSendOtp) {
        setErrorMessage("Bạn chưa gửi mã OTP");
        return;
      }

      if (!(otp === formik.values.otp)) {
        setErrorMessage("Mã OTP không đúng");
        return;
      }

      navigate("/forgot_password/" + (userFound.id || "0") );
    },
  });

  const SendOtp = async (email) => {
    // Đánh dấu trường email là touched
    formik.setFieldTouched("email", true);
    const validationErrors = await formik.validateForm();
    if (validationErrors.email) {
      return;
    }
    if (loadingUser) {
      setErrorMessage("Đang tải dữ liệu người dùng...");
      return;
    }
    setLoading(true);
    try {
      const findUser = await findEmail(email);
      if (!findUser) {
        setErrorMessage("Không tìm thấy email!");
        return;
      }
      await sendEmail(email, "Xác thực mã OTP", `${otp}`);
      setUserFound(findUser);
      handleSetEmail(email);
      setClikSendOtp(true);
      setErrorMessage(
        `Đẫ gửi mã OTP. Lưu ý mã otp chỉ tồn tại trong vòng 5 phút.`
      );
      setTimer(60);
    } catch (error) {
      console.error("Lỗi khi gửi OTP:", error);
      setErrorMessage("Đã xảy ra lỗi khi gửi OTP. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <Container
      className="p-4 bg-white rounded shadow"
      style={{ maxWidth: "400px" }}
    >
      <h2 className="text-center">Tìm tài khoản</h2>
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Nhập Email</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.email && formik.touched.email}
            />
            <Button
              variant="warning"
              className="border-left-0"
              onClick={() => SendOtp(formik.values.email)}
              disabled={timer > 0 || loading} // Vô hiệu hóa nút khi đếm ngược hoặc đang loading
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : timer > 0 ? (
                `Gửi lại sau ${timer}s`
              ) : (
                "Gửi OTP"
              )}
            </Button>
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="otp">
          <Form.Label>Nhập mã OTP</Form.Label>
          <Form.Control
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.otp && formik.touched.otp}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.otp}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="warning" type="submit" className="w-100">
          Tìm tài khoản
        </Button>
      </Form>
      <p className="text-center">
        Đăng nhập lại
        <Link to="/login" className="text-warning ms-2">
          Login
        </Link>
      </p>
    </Container>
  );
};

export default FindEmail;

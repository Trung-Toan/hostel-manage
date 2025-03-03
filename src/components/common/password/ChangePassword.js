import React, { memo, useState } from "react";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import getCurrentDateTime from "../../../until/getCurrentDate";

const ChangePassword = ({ userLogin }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const { mutate: changePassword, isLoading } = useMutation({
    mutationFn: (payload) =>
      axios.put(`http://localhost:9999/user/${userLogin.id}`, payload),
    onSuccess: () => {
      setMessage({
        type: "success",
        text: "Thay đổi mật khẩu thành công!",
      });
      setTimeout(() => navigate(-1), 500);
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Có lỗi xảy ra!",
      });
    },
  });

  console.log(userLogin);

  const checkPassword = (password) => {
    return password === userLogin?.password;
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Vui lòng nhập mật khẩu cũ"),
      newPassword: Yup.string()
        .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
        .max(16, "Mật khẩu mới dài nhất 16 ký tự")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          "Mật khẩu mới phải bao gồm chữ cái, số và ký tự đặc biệt"
        )
        .required("Vui lòng nhập mật khẩu mới"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng xác nhận mật khẩu mới"),
    }),
    onSubmit: (values, { setFieldError }) => {
      if (!checkPassword(values?.oldPassword)) {
        setFieldError(
          "oldPassword",
          "Mật khẩu của bạn nhập không đúng. Vui lòng kiểm tra lại!"
        );
      } else {
        if (checkPassword(values?.newPassword)) {
          setFieldError(
            "newPassword",
            "Mật khẩu này trùng với mật khẩu cũ. Vui lòng nhập mật khẩu khác!"
          );
        } else {
          const payload = {
            ...userLogin,
            password: values.newPassword,
            updatedAt: getCurrentDateTime(),
          };
          changePassword(payload);
        }
      }
    },
  });

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Đổi Mật Khẩu</h2>
      <Form
        onSubmit={formik.handleSubmit}
        className="border p-3 rounded shadow m-auto"
        style={{ maxWidth: "600px" }}
      >
        {message && (
          <Alert variant={message.type === "success" ? "success" : "danger"}>
            {message.text}
          </Alert>
        )}

        {/* Mật khẩu cũ */}
        <Form.Group controlId="oldPassword" className="mb-3">
          <Form.Label>Mật khẩu cũ</Form.Label>
          <InputGroup>
            <Form.Control
              type={showOldPassword ? "text" : "password"}
              {...formik.getFieldProps("oldPassword")}
              isInvalid={
                formik.touched.oldPassword && formik.errors.oldPassword
              }
            />
            <InputGroup.Text
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <EyeFill /> : <EyeSlashFill />}
            </InputGroup.Text>
            <Form.Control.Feedback type="invalid">
              {formik.errors.oldPassword}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        {/* Mật khẩu mới */}
        <Form.Group controlId="newPassword" className="mb-3">
          <Form.Label>Mật khẩu mới</Form.Label>
          <InputGroup>
            <Form.Control
              type={showNewPassword ? "text" : "password"}
              {...formik.getFieldProps("newPassword")}
              isInvalid={
                formik.touched.newPassword && formik.errors.newPassword
              }
            />
            <InputGroup.Text
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeFill /> : <EyeSlashFill />}
            </InputGroup.Text>
            <Form.Control.Feedback type="invalid">
              {formik.errors.newPassword}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        {/* Xác nhận mật khẩu mới */}
        <Form.Group controlId="confirmPassword" className="mb-3">
          <Form.Label>Xác nhận mật khẩu mới</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              {...formik.getFieldProps("confirmPassword")}
              isInvalid={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
            <InputGroup.Text
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeFill /> : <EyeSlashFill />}
            </InputGroup.Text>
            <Form.Control.Feedback type="invalid">
              {formik.errors.confirmPassword}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        {/* Nút submit */}
        <div className="text-center">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="me-3"
            variant="secondary"
          >
            Huỷ
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default memo(ChangePassword);

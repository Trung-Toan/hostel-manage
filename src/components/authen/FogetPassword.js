import { useFormik } from "formik";
import React, { memo, useEffect, useState, useCallback } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useGetUserByID, useUpdateUser } from "../../fetchData/DataFetch";

// Tách riêng PasswordInput để ngăn render không cần thiết
const PasswordInput = memo(
  ({
    label,
    name,
    value,
    onChange,
    onBlur,
    isInvalid,
    show,
    toggleShow,
  }) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control
          type={show ? "text" : "password"}
          placeholder={`Nhập ${label.toLowerCase()}`}
          name={name}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          isInvalid={!!isInvalid}
        />
        <Button variant="outline-secondary" onClick={toggleShow} type="button">
          {show ? <EyeSlash /> : <Eye />}
        </Button>
        <Form.Control.Feedback type="invalid">{isInvalid}</Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  )
);

const ForgetPassword = ({ email }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { uid } = useParams();
  const { user, loadingUser } = useGetUserByID(uid);

  // Gọi hook useUpdateUser
  const { isUpdate, updateError, updateUser } = useUpdateUser();

  useEffect(() => {
    if (!email || (!loadingUser && (!user || user?.email !== email))) {
      navigate("/login");
    }
  }, [email, navigate, user, loadingUser]);

  useEffect(() => {
    if (isUpdate) {
      navigate("/login");
    } else if (updateError) {
      setMessageError("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  }, [isUpdate, updateError, navigate]);

  const formik = useFormik({
    initialValues: {
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Bạn không được bỏ trống")
        .min(8, "Mật khẩu phải ít nhất 8 ký tự")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
          "Mật khẩu phải bao gồm ít nhất 1 ký tự thường, 1 ký tự hoa, 1 số và 1 ký hiệu đặc biệt"
        ),
      rePassword: Yup.string()
        .required("Bạn không được bỏ trống")
        .oneOf([Yup.ref("password")], "Mật khẩu không khớp"),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        if (user && uid === user.id) {
          await updateUser(uid, { ...user, password: values.password });
          navigate("/");
        } else {
          setMessageError("Không thể thay đổi mật khẩu");
        }
      } catch (error) {
        setMessageError("Đã xảy ra lỗi, vui lòng thử lại sau.");
        console.log(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleShowRePassword = useCallback(() => {
    setShowRePassword((prev) => !prev);
  }, []);

  return (
    <>
      {loadingUser ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Container
          className="shadow p-4 rounded bg-white"
          style={{ maxWidth: "400px" }}
        >
          <h2 className="text-center">Thay đổi mật khẩu</h2>
          {messageError && (
            <Alert variant="danger" className="text-center">
              {messageError}
            </Alert>
          )}
          <Form onSubmit={formik.handleSubmit}>
            <PasswordInput
              label="Mật khẩu"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.password && formik.errors.password}
              show={showPassword}
              toggleShow={toggleShowPassword}
            />
            <PasswordInput
              label="Nhập lại mật khẩu"
              name="rePassword"
              value={formik.values.rePassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.rePassword && formik.errors.rePassword}
              show={showRePassword}
              toggleShow={toggleShowRePassword}
            />
            <Button
              type="submit"
              variant="warning"
              className="w-100"
              disabled={submitting}
            >
              {submitting ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Thay đổi mật khẩu"
              )}
            </Button>
          </Form>
        </Container>
      )}
    </>
  );
};

export default memo(ForgetPassword);

import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Form,
  Button,
  InputGroup,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useGetData } from "../../fetchData/DataFetch";
import ViewRoomByHostel from "./ViewRoomByHostel";

const CreateAccount = ({ userLogin }) => {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false); // State để toggle mật khẩu
  const navigate = useNavigate();
  const [isLoadRoom, setIsLoadRoom] = useState();
  const [errorRoom, setErrorRoom] = useState(null);

  const handleChangeLoadingRoom = useCallback((stateLoading) => {
    setIsLoadRoom(stateLoading);
  }, []);

  const handleChangeErrorRoom = useCallback((stateError) => {
    setErrorRoom(stateError);
  }, []);

  const { getData } = useGetData();

  

  const {
    data: hostel,
    isLoading: loadingHostel,
    error: errorHostel,
  } = useQuery({
    queryFn: () => getData("http://localhost:9999/hostel"),
    queryKey: ["hostel"],
    staleTime: 10000,
    cacheTime: 1000 * 60,
  });

  // Mutation để gửi dữ liệu lên server
  const { mutate: createAccount, isLoading: creatingAccount } = useMutation({
    mutationFn: (payload) => axios.post(`http://localhost:9999/user`, payload),
    onSuccess: () => {
      alert("Tạo tài khoản thành công!");
      queryClient.invalidateQueries(["accounts"]);
      setTimeout(() => {
        navigate("/admin/view_account");
      }, 1000);
    },
    onError: () => {
      alert("Có lỗi xảy ra khi tạo tài khoản!");
    },
  });

  // Formik và Yup để xác thực
  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      dob: "",
      address: "",
      personalAuth: "",
      hostelID: hostel?.data[0]?.id || "",
      roomID: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().trim().required("Họ và tên không được bỏ trống."),
      username: Yup.string()
        .trim()
        .required("Tên đăng nhập không được bỏ trống."),
      email: Yup.string()
        .email("Email không hợp lệ.")
        .required("Email không được bỏ trống."),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Số điện thoại chỉ chứa chữ số.")
        .required("Số điện thoại không được bỏ trống."),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
        .required("Mật khẩu không được bỏ trống."),
      dob: Yup.date()
        .required("Ngày sinh không được bỏ trống.")
        .test("dob-range", "Tuổi phải từ 16 đến 100.", function (value) {
          if (!value) return false;
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDifference = today.getMonth() - birthDate.getMonth();

          if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
          ) {
            return age - 1 >= 16 && age - 1 <= 100;
          }

          return age >= 16 && age <= 100;
        }),
      address: Yup.string().trim().required("Địa chỉ không được bỏ trống."),
      personalAuth: Yup.string()
        .trim()
        .required("Mã định danh cá nhân không được bỏ trống.")
        .matches(/^[0-9a-zA-Z]+$/, "Mã định danh phải chỉ chứa chữ và số."),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        role: userLogin.role === 1 ? 2 : 0,
        status: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      createAccount(payload);
    },
  });

  const handleChangeRoom = (acc, accountId, newRoomId) => {
    formik.setFieldValue("roomID", newRoomId);
  };
  useEffect(() => {
    if (hostel?.data?.[0]?.id) {
      formik.setFieldValue("hostelID", hostel.data[0].id);
    }
  }, [hostel]);
  

  if (loadingHostel || isLoadRoom) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Đang tải danh sách tài khoản...</p>
      </Container>
    );
  }

  if (errorHostel || errorRoom) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Hệ thống đang gặp sự cố. Xin vui lòng thử lại sau!
        </Alert>
      </Container>
    );
  }

  if (userLogin.role !== 1 && userLogin.role !== 2) {
    return <p>Bạn không có quyền tạo tài khoản.</p>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">
        Tạo tài khoản {userLogin.role === 1 ? "Manager" : "Customer"}
      </h2>
      <Form onSubmit={formik.handleSubmit}>
        {/* Họ và tên */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="username">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Nhập tên đăng nhập"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.username && !!formik.errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.username}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="fullName">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Nhập họ và tên"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.fullName && !!formik.errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Email */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Nhập email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.email && !!formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                placeholder="Nhập số điện thoại"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.phoneNumber && !!formik.errors.phoneNumber
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Mật khẩu */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="password">
              <Form.Label>Mật khẩu</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.password && !!formik.errors.password
                  }
                />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeSlashFill /> : <EyeFill />}
                </InputGroup.Text>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="dob">
              <Form.Label>Ngày sinh</Form.Label>
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

        {/* Địa chỉ */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="personalAuth">
              <Form.Label>Mã định danh cá nhân(Số CCCD)</Form.Label>
              <Form.Control
                type="text"
                name="personalAuth"
                placeholder="Nhập mã định danh cá nhân"
                value={formik.values.personalAuth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.personalAuth && !!formik.errors.personalAuth
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.personalAuth}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="address">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Nhập địa chỉ"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.address && !!formik.errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.address}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
          <Form.Group controlId="hostel">
          <Form.Label>Chọn nhà trọ</Form.Label>
            <Form.Select
              aria-label="Default select example"
              name="hostelID" 
              value={formik.values.hostelID} 
              onChange={formik.handleChange}
            >
              {hostel?.data?.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
            
          </Col>

          <Col className={`${userLogin.role !== 2 ? "d-none" : ""}`}>
          <Form.Group controlId="room">
          <Form.Label>Chọn phòng trọ</Form.Label>
            <ViewRoomByHostel
              handleChangeRoom = {handleChangeRoom}
              handleChangeLoadingRoom={handleChangeLoadingRoom}
              handleChangeErrorRoom={handleChangeErrorRoom}
              rId={formik.values.roomID}
              hId={formik.values.hostelID}
            />
          </Form.Group>
            
          </Col>
        </Row>

        {/* Nút Submit */}
        <Button type="submit" disabled={creatingAccount} className="w-100">
          Tạo tài khoản
        </Button>
      </Form>
    </Container>
  );
};

export default memo(CreateAccount);

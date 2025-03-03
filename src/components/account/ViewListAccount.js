import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Table,
  Container,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Button,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import "./cssTable.css";
import { useGetData } from "../../fetchData/DataFetch";
import { useQuery } from "@tanstack/react-query";
import ViewRoomByHostel from "./ViewRoomByHostel";
import getCurrentDateTime from "../../until/getCurrentDate";
import Notification from "../../Notification";
import { Link } from "react-router-dom";

const ViewListAccount = ({ userLogin }) => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoadRoom, setIsLoadRoom] = useState();
  const [errorRoom, setErrorRoom] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState("");

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
    queryFn: () => getData("http://localhost:9999/hostel/?status=1"),
    queryKey: ["hostels1"],
    staleTime: 10000,
    cacheTime: 1000 * 60,
  });

  useEffect(() => {
    if (userLogin.role === 1 || userLogin.role === 2) {
      const targetRole = userLogin.role === 1 ? 2 : 0;
      axios
        .get(`http://localhost:9999/user?role=${targetRole}`)
        .then((response) => {
          setAccounts(response.data);
          setFilteredAccounts(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Không thể tải danh sách tài khoản!");
          setLoading(false);
        });
    } else {
      setError("Bạn không có quyền xem danh sách tài khoản!");
      setLoading(false);
    }
  }, [userLogin.role]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setSelectedHostel("");
    const results = accounts?.filter(
      (account) =>
        account.fullName.toLowerCase().includes(term.trim()) ||
        account.id.toString().includes(term.trim()) ||
        account.email.toLowerCase().includes(term.trim()) ||
        account.phoneNumber.includes(term.trim()) ||
        hostel?.data?.some(
          (h) =>
            h.id === account.hostelID &&
            h.name.toLowerCase().includes(term.trim())
        )
    );
    setFilteredAccounts(results);
  };

  // Sắp xếp
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sorted = [...filteredAccounts].sort((a, b) => {
      let aValue, bValue;

      if (field === "hostel") {
        const hostelA = hostel?.data?.find((h) => h.id === a.hostelID);
        const hostelB = hostel?.data?.find((h) => h.id === b.hostelID);
        aValue = hostelA ? hostelA.name.toLowerCase() : "";
        bValue = hostelB ? hostelB.name.toLowerCase() : "";
      } else {
        aValue = a[field] ? a[field].toString().toLowerCase() : "";
        bValue = b[field] ? b[field].toString().toLowerCase() : "";
      }

      if (newSortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    setFilteredAccounts(sorted);
  };

  const handleFilterByHostel = (e) => {
    const hostelId = e.target.value;
    setSelectedHostel(hostelId);
    setSearchTerm("");

    if (hostelId === "") {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter(
        (account) => account.hostelID.toString() === hostelId
      );
      setFilteredAccounts(filtered);
    }
  };

  const handleUpdateStatus = async (accountId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      // Tìm tài khoản trong danh sách hiện tại
      const accountToUpdate = accounts.find(
        (account) => account.id === accountId
      );

      // Gửi yêu cầu PUT để cập nhật trạng thái, giữ lại tất cả các trường cũ ngoài trạng thái
      await axios.put(`http://localhost:9999/user/${accountId}`, {
        ...accountToUpdate, // giữ lại tất cả các trường cũ
        status: newStatus, // chỉ thay đổi status
      });

      // Cập nhật trạng thái trong state mà không thay đổi các trường khác
      const updatedAccounts = accounts.map((account) =>
        account.id === accountId ? { ...account, status: newStatus } : account
      );
      setUpdateMessage({
        type: "success",
        text: "Thay đổi trạng thái thành công!",
      });

      // Cập nhật lại state với danh sách tài khoản đã thay đổi
      setAccounts(updatedAccounts);
      setFilteredAccounts(updatedAccounts);
    } catch (error) {
      setUpdateMessage({
        type: "error",
        text: "Có lỗi xảy ra khi cập nhật trạng thái!",
      });
    }
  };

  const handleChangeHostel = (account, accountId, newHostelId) => {
    axios
      .put(`http://localhost:9999/user/${accountId}`, {
        ...account,
        hostelID: newHostelId,
        updatedAt: getCurrentDateTime(),
      })
      .then(() => {
        const updatedAccounts = accounts.map((account) =>
          account.id === accountId
            ? { ...account, hostelID: newHostelId }
            : account
        );
        setUpdateMessage({
          type: "success",
          text: "Chuyển đổi nhà trọ thành công!",
        });
        setAccounts(updatedAccounts);
        setFilteredAccounts(updatedAccounts);
      })
      .catch(() => {
        setUpdateMessage({
          type: "error",
          text: "Có lỗi xảy ra khi cập nhật nhà trọ!",
        });
      });
  };

  const handleChangeRoom = (acc, accountId, newRoomId) => {
    axios
      .put(`http://localhost:9999/user/${accountId}`, {
        ...acc,
        roomID: newRoomId,
        updatedAt: getCurrentDateTime(),
      })
      .then(() => {
        const updatedAccounts = accounts.map((account) =>
          account.id === accountId ? { ...account, roomID: newRoomId } : account
        );
        setUpdateMessage({
          type: "success",
          text: "Chuyển đổi phòng trọ thành công!",
        });
        setAccounts(updatedAccounts);
        setFilteredAccounts(updatedAccounts);
      })
      .catch(() => {
        setUpdateMessage({
          type: "error",
          text: "Có lỗi xảy ra khi cập nhật phòng trọ!",
        });
      });
  };

  if (loading || loadingHostel || isLoadRoom) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Đang tải danh sách tài khoản...</p>
      </Container>
    );
  }

  if (error || errorHostel || errorRoom) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Hệ thống đang gặp sự cố. Xin vui lòng thử lại sau!
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 p-1">
      <Notification
        updateMessage={updateMessage}
        setUpdateMessage={setUpdateMessage}
      />
      <h2 className="text-center mb-4">
        Danh sách tài khoản{" "}
        {userLogin.role === 1 ? "User (Quản lý)" : "Customer"}
      </h2>
      <Row className="mb-4 justify-content-between">
        <Col md={4}>
          <Form.Group controlId="search">
            <Form.Label className="fw-bold">Tìm kiếm</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setFilteredAccounts(accounts);
                }}
              >
                Xóa tìm kiếm
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="fiterHostel">
            <Form.Label className="fw-bold">Lọc theo nhà trọ</Form.Label>
            <InputGroup className="mb-3">
              <Form.Select
                value={selectedHostel}
                onChange={handleFilterByHostel}
                aria-label="Lọc theo nhà trọ"
              >
                <option value="">Tất cả nhà trọ</option>
                {hostel?.data?.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      {/* Danh sách tài khoản */}
      {filteredAccounts.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr className="row">
              <th
                className="col-md-1 text-center d-flex justify-content-center align-items-center"
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer" }}
              >
                ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="col-md-1 text-center d-flex justify-content-center align-items-center">
                Ảnh đại diện
              </th>
              <th
                className="col-md-2 text-center d-flex justify-content-center align-items-center"
                onClick={() => handleSort("fullName")}
                style={{ cursor: "pointer" }}
              >
                Họ và tên{" "}
                {sortField === "fullName" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="col-md-2 text-center d-flex justify-content-center align-items-center"
                onClick={() => handleSort("email")}
                style={{ cursor: "pointer" }}
              >
                Email{" "}
                {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>

              <th
                className="col-md-1 text-center d-flex justify-content-center align-items-center"
                onClick={() => handleSort("phoneNumber")}
                style={{ cursor: "pointer" }}
              >
                Số điện thoại{" "}
                {sortField === "phoneNumber" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="col-md text-center d-flex justify-content-center align-items-center"
                onClick={() => handleSort("hostel")}
                style={{ cursor: "pointer" }}
              >
                Nhà trọ{" "}
                {sortField === "hostel" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>

              <th
                className={`${
                  userLogin.role !== 2 ? "d-none" : ""
                } col-md text-center d-flex justify-content-center align-items-center`}
              >
                Phòng
              </th>
              <th className="col-md-1 text-center d-flex justify-content-center align-items-center">
                Trạng thái
              </th>
              <th className="col-md-1 text-center d-flex justify-content-center align-items-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr className="row" key={account.id}>
                <td className="col-md-1 d-flex text-center justify-content-center align-items-center">
                  {account.id}
                </td>
                <td className="col-md-1 d-flex text-center justify-content-center align-items-center">
                  <Image
                    src={account.avatar}
                    alt="User Avatar"
                    roundedCircle
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td className="col-md-2 text-center d-flex justify-content-center align-items-center">
                  {account.fullName}
                </td>
                <td className="col-md-2 text-center d-flex justify-content-center align-items-center">
                  {account.email}
                </td>
                <td className="col-md-1 text-center d-flex justify-content-center align-items-center">
                  {account.phoneNumber}
                </td>
                <td className="col-md d-flex text-center justify-content-center align-items-center">
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) =>
                      handleChangeHostel(account, account.id, e.target.value)
                    }
                  >
                    {hostel?.data?.map((h) => (
                      <option
                        key={h.id}
                        value={h.id}
                        selected={h.id === account.hostelID}
                      >
                        {h.name}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td
                  className={`${
                    userLogin.role !== 2 ? "d-none" : ""
                  } col-md d-flex text-center justify-content-center align-items-center`}
                >
                  <ViewRoomByHostel
                    hId={account.hostelID}
                    handleChangeLoadingRoom={handleChangeLoadingRoom}
                    handleChangeErrorRoom={handleChangeErrorRoom}
                    rId={account.roomID}
                    accountId={account.id}
                    account={account}
                    handleChangeRoom={handleChangeRoom}
                  />
                </td>
                <td
                  className={`col-md-1 text-center d-flex justify-content-center align-items-center text-${
                    account.status === 1 ? "success" : "danger"
                  }`}
                >
                  {account.status === 1 ? "Active" : "Inactive"}{" "}
                </td>
                <td className="col-md-1 text-center d-flex justify-content-center align-items-center">
                  <Button
                    size="sm"
                    variant={account.status === 1 ? "danger" : "success"}
                    onClick={() =>
                      handleUpdateStatus(account.id, account.status)
                    }
                  >
                    {account.status === 1 ? "Ban" : "Active"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center mt-5">
          <p>
            Chưa có tài khoản nào được tạo. Hãy thêm tài khoản mới ngay bây giờ!
          </p>
          <Link to={"/manager/create_account"} className="btn btn-primary">
            Thêm tài khoản mới
          </Link>
        </div>
      )}
    </Container>
  );
};

export default memo(ViewListAccount);

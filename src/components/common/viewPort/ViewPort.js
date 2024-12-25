import React, { memo, useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Image,
  Container,
  Spinner,
  Button,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const ViewPort = ({ posts, userLogin, loadingPost, onDelete }) => {
  const [viewPost, setViewPost] = useState([]);

  useEffect(() => {
    if (!loadingPost) {
      const filteredPosts =
        userLogin?.role === 1
          ? (posts || []).filter((p) => p.status !== 0)
          : posts || [];
      setViewPost(filteredPosts);
    }
  }, [loadingPost, posts, userLogin]);

  return (
    <Container>
      {/* Nút Thêm mới bài viết */}
      <div
        className={`text-center my-4 ${userLogin?.role !== 2 ? "d-none" : ""}`}
      >
        <Link to={"add_new_post"} className="btn btn-success">
          Thêm bài mới
        </Link>
      </div>

      {loadingPost ? (
        // Hiệu ứng loading khi chờ tải dữ liệu
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        viewPost?.map((p) => (
          <Card
            key={p.id}
            className="my-4 border-0"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              boxShadow: "0 0 10px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Card.Body className={`p-3 `}>
              {/* Header */}
              <Row className="align-items-center mb-3">
                <Col>
                  <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    {p.title}
                  </div>
                  <small className="text-muted">{p.createdAt}</small>
                </Col>
                <Col
                  xs="auto"
                  className={`${userLogin?.role !== 2 ? "d-none" : ""}`}
                >
                  <Badge bg={p.status === 1 ? "success" : "secondary"}>
                    {p.status === 1 ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </Col>
              </Row>

              {/* Content */}
              <Card.Text className="mb-3" style={{ fontSize: "1rem" }}>
                {p.content}
              </Card.Text>

              {/* Images */}
              {p.images && (
                <div className="d-flex flex-wrap justify-content-center mb-3">
                  <Image
                    src={p.images}
                    alt={p.title}
                    className="mb-2"
                    style={{
                      height: "300px", 
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}
              {/* Action Buttons */}
              <div
                className={`d-flex ${
                  userLogin?.role !== 2 ? "d-none" : ""
                } justify-content-between`}
              >
                <Link className="btn btn-warning" to={`/manager/edit/${p.id}`}>
                  Chỉnh sửa
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(p.id)}
                >
                  Xóa
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default memo(ViewPort);

import React, { memo, useRef, useState } from "react";
import {
  Card,
  Row,
  Col,
  Image,
  Button,
  Form,
  Container,
  Spinner,
} from "react-bootstrap";
import {
  HandThumbsUpFill,
  HandThumbsUp,
  Chat,
  Share,
} from "react-bootstrap-icons";

const ViewPort = ({ posts, loadingPost }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, name: "Lan Anh", text: "Chúc mừng em nha! 🎉" },
    { id: 2, name: "Minh Huy", text: "Xinh quá trời ơi! 😍" },
    { id: 3, name: "Ngọc Trâm", text: "Chúc mừng sinh nhật! 🎂" },
  ]);
  const [newComment, setNewComment] = useState("");

  // Tạo ref để tham chiếu đến phần cuối cùng của bình luận
  const lastCommentRef = useRef(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() !== "") {
      // Thêm bình luận mới vào danh sách
      const updatedComments = [
        ...comments,
        { id: comments.length + 1, name: "Bạn", text: newComment },
      ];
      setComments(updatedComments);
      setNewComment("");

      // Cuộn đến phần bình luận mới nhất
      lastCommentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  console.log(posts);

  return (
    <Container>
      {loadingPost ? (
        // Hiệu ứng loading khi chờ tải dữ liệu
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        posts?.map((p) => (
          <Card
            key={p.id}
            className="my-4 border-0"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Card.Body className="p-2">
              {/* Header */}
              <Row className="align-items-center mb-2">
                <Col>
                  <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                    {p.title}
                  </div>
                  <small className="text-muted">{p.createdAt}</small>
                </Col>
              </Row>

              {/* Content */}
              <Card.Text className="mb-3" style={{ fontSize: "1rem" }}>
                {p.content}
              </Card.Text>

              {/* Images */}
              <div className="d-flex flex-wrap justify-content-between">
                <Image
                  src={p.images}
                  alt="Image 1"
                  className="mb-2"
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default memo(ViewPort);

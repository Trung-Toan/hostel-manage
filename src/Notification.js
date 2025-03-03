import React, { memo } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import ".";

const Notification = ({ updateMessage, setUpdateMessage }) => {
  return (
    <ToastContainer
      position="top-right" // Định vị trí
      style={{
        top: "50px",
        right: "0px",
        position: "fixed",
        zIndex: 1050, // Đảm bảo Toast nằm trên các thành phần khác
        padding: "1rem", // Khoảng cách nội bộ
      }}
    >
      {updateMessage && (
        <Toast
          onClose={() => setUpdateMessage(null)}
          show={!!updateMessage}
          delay={3000}
          autohide
          bg={updateMessage.type === "success" ? "success" : "danger"}
          className="text-white custom-toast"
        >
          <Toast.Header closeButton={false} className="border-0">
            <strong className="me-auto">
              {updateMessage.type === "success" ? (
                <FaCheckCircle className="text-success me-2" />
              ) : (
                <FaExclamationCircle className="text-danger me-2" />
              )}
              {updateMessage.type === "success" ? "Thành công" : "Lỗi"}
            </strong>
            <button
              type="button"
              className="btn-close btn-close-white ms-2"
              onClick={() => setUpdateMessage(null)}
              aria-label="Close"
            ></button>
          </Toast.Header>
          <Toast.Body>{updateMessage.text}</Toast.Body>
        </Toast>
      )}
    </ToastContainer>
  );
};

export default memo(Notification);

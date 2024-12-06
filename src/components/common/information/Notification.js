import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./notification.css"

const Notification = ({ updateMessage, setUpdateMessage }) => {
  return (
    <ToastContainer position="top-end" className="p-3">
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
              {updateMessage.type === "success"
                ? "Thành công"
                : "Lỗi"}
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

export default Notification;

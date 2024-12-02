// components/DataFetch.js
import { useEffect, useState } from "react";

/**
 * Fetch all invoices.
 *
 * @returns {Object} { invoices: Array, loadingInvoice: Boolean }
 */
function useGetAllInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoice, setLoadingInvoice] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9999/invoice")
      .then((response) => response.json())
      .then((data) => setInvoices(data))
      .catch((error) => console.error("Error fetching invoices:", error))
      .finally(() => setLoadingInvoice(false));
  }, []);

  return { invoices, loadingInvoice };
}

/**
 * Fetch an invoice by its ID.
 *
 * @param {string|number} id - The ID of the invoice.
 * @returns {Object} { invoice: Object, loading: Boolean }
 */
function useGetInvoiceById(id) {
  const [invoice, setInvoice] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Bỏ qua nếu ID không hợp lệ.
    fetch(`http://localhost:9999/invoice/${id}`)
      .then((res) => res.json())
      .then((data) => setInvoice(data))
      .catch((err) =>
        console.error(`Error fetching invoice ${id}: ${err.message}`)
      )
      .finally(() => setLoading(false));
  }, [id]);

  return { invoice, loading };
}

/**
 * Fetch all rooms.
 *
 * @returns {Object} { rooms: Array, loadingRoom: Boolean }
 */
function useGetAllRooms() {
  const [rooms, setRooms] = useState([]);
  const [loadingRoom, setLoadingRoom] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9999/room")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching rooms:", err))
      .finally(() => setLoadingRoom(false));
  }, []);

  return { rooms, loadingRoom };
}

/**
 * Fetch an room by its ID
 *
 * @param {string|number} idRoom - the ID of room
 * @returns {Object} {room: object, loadingRoomById: Boolean}
 */
function useGetRoomById(idRoom) {
  const [room, setRoom] = useState([]);
  const [loadingRoomById, setLoadingRoomById] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9999/room/" + idRoom)
      .then((res) => res.json())
      .then((data) => setRoom(data))
      .catch((err) => console.error("Error fetching rooms:", err))
      .finally(() => setLoadingRoomById(false));
  }, [idRoom]);

  return { room, loadingRoomById };
}

/**
 * Fetch all post
 *
 * @returns {Object} {posts: Array, loadingPost: Boolean}
 */
function useGetAllPosts() {
  const [posts, setPosts] = useState([]);
  const [loadingPost, setLoadPost] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9999/post")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.log(err))
      .finally(() => setLoadPost(false));
  }, []);

  return { posts, loadingPost };
}

function useGetAllUser() {
  const [users, setUsers] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9999/user")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingUser(false));
  }, []);
  return { users, loadingUser };
}

function useGetUserByID(id) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  useEffect(() => {
    fetch("http://localhost:9999/user/" + id)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingUser(false));
  }, [id]);
  return { user, loadingUser };
}

function useUpdateUser() {
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [userUD, setUserUD] = useState(null); // Đổi tên biến từ user -> userUD

  const updateUser = async (id, userUpdate) => {
    setIsUpdate(false); // Reset trạng thái trước khi cập nhật mới
    try {
      const response = await fetch(`http://localhost:9999/user/${id}`, {
        method: "PUT",
        body: JSON.stringify(userUpdate),
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      });
      if (!response.ok) {
        throw new Error(`Failed to update user with ID: ${id}`);
      }
      const data = await response.json();
      setUserUD(data); // Gán dữ liệu vào userUD
      setIsUpdate(true);
    } catch (error) {
      setUpdateError(new Error(`Failed to update user: ${error.message}`));
    }
  };

  return { isUpdate, updateError, userUD, updateUser }; // Trả về userUD thay vì user
}


export {
  useUpdateUser,
  useGetUserByID,
  useGetAllInvoices,
  useGetInvoiceById,
  useGetAllRooms,
  useGetRoomById,
  useGetAllPosts,
  useGetAllUser,
};

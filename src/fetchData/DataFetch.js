// components/DataFetch.js
import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
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
  const { data, isLoading: loadingPost } = useQuery({
    queryKey: ["post"],
    queryFn: () => axios.get("http://localhost:9999/post"),
    staleTime: 10000,
    cacheTime: 1000 * 60,
  });
  const posts = data?.data;
  return { posts, loadingPost };
}

function useGetDataByUrl(url, key) {
  const { data, isLoading } = useQuery({
    queryKey: [key],
    queryFn: () => axios.get(url),
    staleTime: 10000,
    cacheTime: 1000 * 60,
  });
  return { data, isLoading };
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
  const [updateError, setUpdateError] = useState(null);

  const updateUser = async (id, userUpdate) => {
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
      return data;
    } catch (error) {
      setUpdateError(new Error(`Failed to update user: ${error.message}`));
    }
  };

  return { updateError, updateUser };
}

function useFetchData() {
  const getData = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fail to load data`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`Error loading URL "${url}":`, error);
      return null;
    }
  };
  return { getData };
}

const useGetData = () => {
  const getData = (url) => {
    return axios.get(url);
  };
  return { getData };
};

export {
  useGetDataByUrl,
  useGetData,
  useFetchData,
  useUpdateUser,
  useGetUserByID,
  useGetAllInvoices,
  useGetInvoiceById,
  useGetAllRooms,
  useGetRoomById,
  useGetAllPosts,
  useGetAllUser,
};

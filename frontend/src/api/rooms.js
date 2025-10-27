import axios from "axios";

const API_URL = "http://localhost:8000/api/rooms";

export const getRooms = () => axios.get(API_URL);

export const createRoom = (formData) =>
  axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateRoom = (id, formData) =>
  axios.post(`${API_URL}/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteRoom = (id) => axios.delete(`${API_URL}/${id}`);

import axios from "axios";

const API_URL = "http://localhost:8000/api/rooms"; // تأكد من هذا العنوان

export const getRooms = () => axios.get(API_URL);
export const getRoom = (id) => axios.get(`${API_URL}/${id}`);
export const createRoom = (data) => axios.post(API_URL, data);
export const updateRoom = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteRoom = (id) => axios.delete(`${API_URL}/${id}`);


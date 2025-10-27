import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/bookings";

export const getBookings = () => axios.get(API_URL);
export const createBooking = (formData) => axios.post(API_URL, formData);
export const updateBooking = (id, formData) =>
  axios.put(`${API_URL}/${id}`, formData);
export const deleteBooking = (id) => axios.delete(`${API_URL}/${id}`);

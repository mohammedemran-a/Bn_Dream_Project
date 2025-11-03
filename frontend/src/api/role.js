import axios from "./axios";

export const getRoles = async () => {
  const response = await axios.get("/api/roles");
  return response.data;
};

export const getPermissions = async () => {
  const response = await axios.get("/api/permissions");
  return response.data;
};

export const createRole = async (data) => {
  const response = await axios.post("/api/roles", data);
  return response.data;
};

export const updateRole = async (id, data) => {
  const response = await axios.put(`/api/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id) => {
  const response = await axios.delete(`/api/roles/${id}`);
  return response.data;
};

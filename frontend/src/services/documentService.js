import api from "./api";

export const getAll = () => {
  return api.get("/documents");
};

export const getAllAdmin = () => {
  return api.get("/documents/admin");
};

export const getById = (docId) => {
  return api.get(`/documents/${docId}`);
};

export const getByCategory = (category) => {
  return api.get(`/documents/category/${category}`);
};

export const create = (data) => {
  return api.post("/documents", data);
};

export const update = (docId, data) => {
  return api.put(`/documents/${docId}`, data);
};

export const toggleStatus = (docId) => {
  return api.patch(`/documents/${docId}/toggle`);
};

export const deleteDoc = (docId) => {
  return api.delete(`/documents/${docId}`);
};

export const search = (query) => {
  return api.get(`/documents/search?q=${encodeURIComponent(query)}`);
};

export const getRelated = (docId) => {
  return api.get(`/documents/${docId}/related`);
};

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNews = (category, page) =>
  API.get(`/news?category=${category}&page=${page}`);

export const fetchArticle = (id) => API.get(`/news/${id}`);

export const translateArticle = (articleId, targetLanguage) =>
  API.post("/translate", { articleId, targetLanguage });

export const adminLogin = (username, password) =>
  API.post("/auth/login", { username, password });

export const adminFetchNews = (category) =>
  API.post("/admin/fetch", { category });

export const adminGetDrafts = () => API.get("/admin/drafts");

export const adminGetArticles = () => API.get("/admin/articles");

export const adminPublish = (id) => API.put(`/admin/publish/${id}`);

export const adminUnpublish = (id) => API.put(`/admin/unpublish/${id}`);

export const adminDelete = (id) => API.delete(`/admin/articles/${id}`);

export const adminGetStats = () => API.get("/admin/stats");

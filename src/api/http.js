import axios from "axios";

// Later when your Express + SQLite backend exists,
// set VITE_API_BASE_URL=http://localhost:5000/api in .env
// and this client will work immediately.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || ""
});

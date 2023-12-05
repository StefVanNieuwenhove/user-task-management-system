import axiosRoot from 'axios';

//const BASE_URL = import.meta.env.VITE_SERVER_URL;
const DEV_URL = import.meta.env.VITE_DEV_URL;

export const axios = axiosRoot.create({
  baseURL: DEV_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE ',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.withCredentials = true;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

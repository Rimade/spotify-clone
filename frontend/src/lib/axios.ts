import axios from 'axios';

const baseURL =
	import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api';

export const axiosInstance = axios.create({
	baseURL,
});

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Define the LoginResponse interface to specify the expected response structure
interface LoginResponse {
    authToken: string;
    username: string;
}

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Updated login function with type annotations and data return
export const login = async (data: { contact_number: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login', data);
    return response.data;  // Return only the data to match LoginResponse type
};

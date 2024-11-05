import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Define the LoginResponse interface to specify the expected response structure
interface LoginResponse {
    authToken: string;
    username: string;
}

interface CreateUserResponse {
    authToken: string;
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

export const createuser = async (data: { name: string
    student_class: string;
    dob: string;
    school_name: string;
    mother_name: string;
    father_name: string;
    contact_number: string;
    secondary_contact_number: string;
    email: string;
    address: string;
    city: string;
    course: string; }): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>('/api/auth/createuser', data);
    return response.data;  // Return only the data to match LoginResponse type
};

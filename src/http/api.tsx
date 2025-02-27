import axios, { AxiosError } from 'axios';
import { LoginResponse, LoginError } from '../types/api';
import Cookies from 'js-cookie';

//const BASE_URL = import.meta.env.VITE_BASE_URL || "https://bobkidsportalbackend.onrender.com";
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface CreateUserResponse {
    authToken: string;
}

// Define the expected response structure for fetching a student
interface FetchStudentResponse {
    _id: string;
    student_code: string;
    name: string;
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
    course: string;
    level: string;
    status: string;
    role: string;
}

// UpdateStudent function
interface UpdateStudentDataParams {
    id: string;
    updateData: Partial<Student>; // Accepts partial data for flexibility
}

interface Student {
    _id: string;
    student_code: string;
    name: string;
    student_class: string;
    dob: string;
    school_name: string;
    mother_name: string;
    father_name: string;
    contact_number: string;
    secondary_contact_number?: string;
    email: string;
    address: string;
    city: string;
    course: string;
    level: string;
    status: string;
}


const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// Updated login function with type annotations and data return
interface LoginCredentials {
    contact_number: string;
    password: string;
    role: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${BASE_URL}/api/auth/login`, credentials);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<LoginError>;
            if (axiosError.response) {
                const errorData = axiosError.response.data;
                throw new Error(errorData.error || 'An error occurred during login.');
            }
        }
        throw new Error('An unexpected error occurred. Please try again later.');
    }
};



export const createuser = async (data: {
    name: string
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
    course: string;
}): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>('/api/auth/createuser', data);
    return response.data;  // Return only the data to match LoginResponse type
};


// Utility function to fetch student details
export const fetchStudent = async (id: string | null): Promise<FetchStudentResponse | null> => {
    if (!id) return null;
    const response = await api.get<FetchStudentResponse>(`/api/admin/user/${id}`);
    const data = response.data;
    if (data.dob) {
        data.dob = new Date(data.dob).toISOString().split("T")[0];
    }
    return data;
};

// Combined function for updating student details
export const updateStudentData = async ({ id, updateData }: UpdateStudentDataParams) => {
    const token = Cookies.get('token');
    if (!token) {
        console.error("No auth token found");
        throw new Error("Authorization token is missing");
    }

    // Make PUT request with provided data
    const response = await api.put(`/api/admin/updateuser/${id}`, updateData, {
        headers: {
            "Content-Type": "application/json",
            "auth-token": token,
        },
    });

    return response.data;
};


export const fetchStudents = async () => {
    const response = await api.get(`/api/admin/fetchalluser`);
    return response.data;
};


export const fetchReceiptNumber = async () => {
    const response = await api.get(`${BASE_URL}/api/admin/receipt-number`);
    return response.data;
};

// In your API module file, e.g., api.js or api.ts
export const addReceipt = async ({ formData, authToken }: { formData: FormData, authToken: string }) => {
    const response = await api.post(`${BASE_URL}/api/admin/addreciept`, {
        headers: {
            'auth-token': authToken,
        },
        body: formData,
    });

    return response.data;
};

// Function to save the receipt data
export const saveReceipt = async (data: FormData) => {
    const authToken = Cookies.get('token');
    const response = await axios.post(`${BASE_URL}/api/admin/addreciept`, data, {
        headers: {
            'auth-token': authToken,
            "Content-Type": "application/json"
        },
    });
    return response.data;
};

// Function to save the mreceipt data
export const savemReceipt = async (data: FormData) => {
    const authToken = Cookies.get('token');

    // Extract mreceiptNo from FormData
    const mreceiptNo = data.get("mreceiptNo");

    if (!mreceiptNo) {
        throw new Error("mreceiptNo is missing in FormData");
    }

    const payload = {
        mreceiptNo: Number(mreceiptNo),  // Ensure it's a number
    };

    const response = await axios.post(`${BASE_URL}/api/admin/addmreciept`, JSON.stringify(payload), {
        headers: {
            'auth-token': authToken,
            'Content-Type': 'application/json'
        },
    });

    return response.data;
};


export const getReceipt = async () => {
    const response = await api.get(`${BASE_URL}/api/admin/getreciept`);
    if (!response.data) {
        throw new Error("Receipt not found");
    }
    return response.data;
};

export const getReceiptbyid = async (id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/api/admin/receipts/${id}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Failed to fetch receipt:", error)
        throw error
    }
}


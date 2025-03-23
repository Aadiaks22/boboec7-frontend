import axios, { AxiosError } from 'axios';
import { LoginResponse, LoginError } from '../types/api';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// const BASE_URL = import.meta.env.VITE_BASE_URL || "https://bobkidsportalbackend.onrender.com";
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
    gstno: string;
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

// Define the expected response type
interface DeleteResponse {
    message: string;
}

// Define the interface for the decoded JWT data
interface JwtPayload {
    user: {
        id: string;
        username: string;
        gstno: string;
        role: string;
    };
}

const token = Cookies.get('token');

// Extract username from token (if exists)
let username = "";
let gstno = "";
if (token) {
    try {
        const decodedToken = jwtDecode(token) as JwtPayload;
        username = decodedToken.user.username || "Unknown User"; // Fallback if username is missing
        gstno = decodedToken.user.gstno || "GST Not Found";
    } catch (error) {
        console.error("Invalid token:", error);
    }
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
    const token = Cookies.get('token');
    const response = await api.post<CreateUserResponse>('/api/auth/createuser', data, {
        headers: {
            'auth-token': token,
        },
    });
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
    return {...data, gstno}; // Add gstno to response
};

// Combined function for updating student details
export const updateStudentData = async ({ id, updateData }: UpdateStudentDataParams) => {
    const token = Cookies.get('token');
    if (!token) {
        //console.error("No auth token found");
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
    const token = Cookies.get('token');
    const response = await api.get(`/api/admin/fetchalluser`, {
        headers: {
            'auth-token': token,
        },
    });
    return response.data;
};


export const fetchReceiptNumber = async () => {
    const authToken = Cookies.get('token');
    const response = await api.get(`${BASE_URL}/api/admin/receipt-number`, {
        headers: {
            'userName': username,
            'auth-token': authToken
        },
    });
    return response.data;
};

// Function to save the receipt data
export const saveReceipt = async (data: FormData) => {
    const authToken = Cookies.get('token');
    const response = await axios.post(`${BASE_URL}/api/admin/addreciept`, data, {
        headers: {
            'userName': username,
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
            'userName': username,
            'auth-token': authToken,
            'Content-Type': 'application/json'
        },
    });

    return response.data;
};


export const getReceipt = async () => {
    const authToken = Cookies.get('token');
    const response = await api.get(`${BASE_URL}/api/admin/getreciept`, {
        headers: {
            'auth-token': authToken,
        },
    });
    if (!response.data) {
        throw new Error("Receipt not found");
    }
    return response.data;
};

export const getReceiptbyid = async (id: string) => {
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
};

export const logoutUser = async (username: string): Promise<void> => {
    try {
        const response = await axios.delete(`/api/auth/logout`, {
            data: { username }, // Correct way to send data in DELETE request
        });
        return response.data; 
    } catch (error) {
        console.error("Error logging out:", error);
        throw error; // Rethrow error for handling in the caller function
    }
};

export async function verifyToken(token: string | undefined) {
    if (!token) return { valid: false }; // Avoid unnecessary API calls

    try {
        const response = await axios.post(`/api/auth/verify-token`, { token },
            {
                headers: {
                    'auth-token': token,
                },
            });
        return response.data;
    } catch (error) {
        console.error('Token verification failed:', error);
        return { valid: false }; // Prevent infinite loop
    }
}

export const deletestudentdata = async (): Promise<DeleteResponse> => {
    const response = await axios.delete(`/api/admin/deletestudentdata`);
    return response.data;
};

export const deletereceiptdata = async (): Promise<DeleteResponse> => {
    const response = await axios.delete(`/api/admin/deletereceiptdata`);
    return response.data;
};



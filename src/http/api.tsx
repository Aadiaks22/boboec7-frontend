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

// Define the expected response structure for fetching a student
interface FetchStudentResponse {
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

// // Define the Credentials interface
// interface Credential {
//     name: string;
//     student_class: string;
//     dob: string;
//     school_name: string;
//     mother_name: string;
//     father_name: string;
//     contact_number: string;
//     secondary_contact_number: string;
//     email: string;
//     address: string;
//     city: string;
//     course: string;
//     level: string;
//     status: string;
// }

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
export const login = async (data: { contact_number: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login', data);
    return response.data;  // Return only the data to match LoginResponse type
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
export const fetchStudent = async (id: string): Promise<FetchStudentResponse | null> => {
    if (!id) return null;
    const response = await api.get<FetchStudentResponse>(`/api/admin/user/${id}`);
    const data = response.data;
    if (data.dob) {
        data.dob = new Date(data.dob).toISOString().split("T")[0];
    }
    return data;
};



// Mutation to update student details
// export const updateStudent = async ({ id, credentials }: UpdateStudentParams) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//         console.error("No auth token found");
//         throw new Error("Authorization token is missing");
//     }
//     const response = await api.put(`/api/admin/updateuser/${id}`, credentials, {
//         headers: {
//             "Content-Type": "application/json",
//             "auth-token": token,
//         },
//     });
//     return response.data;
// };


// export const updateStudentone = async ({ id, updateData }: { id: string, updateData: Partial<Student> }) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         console.error("No auth token found");
//         throw new Error("Authorization token is missing");
//     }
//     const response = await api.put(`/api/admin/updateuser/${id}`, updateData, {
//         headers: {
//             "Content-Type": "application/json",
//             "auth-token": token,
//         },
//     });
//     return response.data;
//   };


// Combined function for updating student details
export const updateStudentData = async ({ id, updateData }: UpdateStudentDataParams) => {
    const token = localStorage.getItem("token");
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

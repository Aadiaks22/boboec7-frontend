export interface LoginResponse {
    success: boolean;
    authToken: string;
    username: string;
    role: string;
    message?: string;
  }
  
  export interface LoginError {
    success: false;
    error: string;
  }
  
  
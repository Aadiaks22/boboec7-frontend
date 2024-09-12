import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Student {
  _id: string;
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
  role: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FeeCollection = () => {
  const { id } = useParams<{ id: string }>(); // Extract the student ID from the route
  const [student, setStudent] = useState<Student | null>(null); // State to store student details
  const [error, setError] = useState<string | null>(null); // State to store error message

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) {
        setError("No student ID provided");
        return;
      }
      
      try {
        const response = await fetch(`${BASE_URL}/api/admin/user/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student details");
        }
        const data = await response.json();
        
        //console.log("Student Data:", data); // Log the student data to the console
        
        setStudent(data); // Set the fetched student details
      } catch (error) {
        setError("Error fetching student details");
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
  }, [id]);

  return (
    <div>
      <h1>Fee Collection</h1>
      {error && <p>{error}</p>}
      {student ? (
        <pre>{JSON.stringify(student, null, 2)}</pre> // Display student details in JSON format
      ) : (
        !error && <p>Loading student details...</p>
      )}
    </div>
  );
};

export default FeeCollection;

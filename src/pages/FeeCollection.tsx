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
    <>
    <div className="max-w-2xl mx-auto p-4 border border-black">
      <h1 className="text-2xl font-bold text-center border-b-2 border-black pb-2">Fee Receipt</h1>
      
      <div className="text-xl font-bold text-center my-4">
        OEC-7 ACADEMY
      </div>
      <div className="text-sm text-center mb-4">
        (GST IN - 09AJUPB7083R1Z5 )
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="font-bold">Student Code : </span>
          1117
        </div>
        <div className="text-right">
          <span className="font-bold">Receipt No. : </span>
          327
        </div>
        <div>
          <span className="font-bold">Student Name : </span>
          RISHI AGRAWAL
        </div>
        <div></div>
        <div>
          <span className="font-bold">Course Name : </span>
          BRAINOBRAIN
        </div>
        <div className="text-right">
          <span className="font-bold">Date : </span>
          2-Feb-24
        </div>
        <div>
          <span className="font-bold">Level : </span>
          4
        </div>
      </div>
      
      <table className="w-full border-collapse border border-black mb-4">
        <thead>
          <tr>
            <th className="border border-black p-2">Description</th>
            <th className="border border-black p-2">Rate</th>
            <th className="border border-black p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2">Course Fee</td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2">2279.66</td>
          </tr>
          <tr>
            <td className="border border-black p-2 pl-8">Central Tax</td>
            <td className="border border-black p-2">9%</td>
            <td className="border border-black p-2">205.16</td>
          </tr>
          <tr>
            <td className="border border-black p-2 pl-8">State Tax</td>
            <td className="border border-black p-2">9%</td>
            <td className="border border-black p-2">205.16</td>
          </tr>
          <tr>
            <td className="border border-black p-2">Exercise Book</td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2">357.18</td>
          </tr>
          <tr>
            <td className="border border-black p-2 pl-8">Central Tax</td>
            <td className="border border-black p-2">6%</td>
            <td className="border border-black p-2">21.42</td>
          </tr>
          <tr>
            <td className="border border-black p-2 pl-8">State Tax</td>
            <td className="border border-black p-2">6%</td>
            <td className="border border-black p-2">21.42</td>
          </tr>
        </tbody>
      </table>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="font-bold">Mode of Payment : </span>
          Online
        </div>
        <div className="text-right">
          <span className="font-bold">Total Amount : </span>
          3090
        </div>
        <div></div>
        <div className="text-right">
          <span className="font-bold">Amount in Words : </span>
          THREE THOUSAND NINE HUNDRED NINTY RUPEES ONLY
        </div>
      </div>
      
      <div className="mt-8">
        <span className="font-bold">Authority Seal And Signature</span>
      </div>
    </div>
    <div>
      <h1>Fee Collection</h1>
      {error && <p>{error}</p>}
      {student ? (
        <pre>{JSON.stringify(student, null, 2)}</pre> // Display student details in JSON format
      ) : (
        !error && <p>Loading student details...</p>
      )}
    </div>
    </>
  );
};

export default FeeCollection;

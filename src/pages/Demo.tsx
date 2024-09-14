import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  role: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FeeCollection = () => {
  const { id } = useParams<{ id: string }>(); // Extract the student ID from the route
  const [student, setStudent] = useState<Student | null>(null); // State to store student details
  const [error, setError] = useState<string | null>(null); // State to store error message
  const [currentDate, setCurrentDate] = useState<string>("");

  // Course Fee, Exercise Book Amount, and Tax States
  const [courseFee, setCourseFee] = useState<number>(0);
  const [exerciseBookFee, setExerciseBookFee] = useState<number>(0);
  const [centralTax9, setCentralTax9] = useState<number>(0);
  const [stateTax9, setStateTax9] = useState<number>(0);
  const [centralTax6, setCentralTax6] = useState<number>(0);
  const [stateTax6, setStateTax6] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    // Set the current date in "DD/MM/YYYY" format
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    setCurrentDate(formattedDate);

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

  // Calculate 9% tax for course fee and 6% tax for exercise book fee
  useEffect(() => {
    const calculatedCentralTax9 = courseFee * 0.09;
    const calculatedStateTax9 = courseFee * 0.09;
    const calculatedCentralTax6 = exerciseBookFee * 0.06;
    const calculatedStateTax6 = exerciseBookFee * 0.06;

    setCentralTax9(calculatedCentralTax9);
    setStateTax9(calculatedStateTax9);
    setCentralTax6(calculatedCentralTax6);
    setStateTax6(calculatedStateTax6);

    // Calculate total amount (Course Fee + Exercise Book Fee + All Taxes)
    const total = courseFee + exerciseBookFee + calculatedCentralTax9 + calculatedStateTax9 + calculatedCentralTax6 + calculatedStateTax6;
    setTotalAmount(total);
  }, [courseFee, exerciseBookFee]);

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
          <div className="flex">
            <Label className="mt-3 font-bold fs-1" htmlFor="studentCode">Student Code:</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="studentCode"
              name="studentCode"
              value={student?.student_code || ""} // Bind student ID (student code)
              readOnly
            />
          </div>
          <div className="flex text-right">
            <Label className="mt-3 font-bold fs-1" htmlFor="studentCode">Receipt No. :</Label>
            <Input className="w-auto ml-2" id="studentCode" name="studentCode" />
          </div>
          <div className="flex">
            <Label className="mt-3 font-bold fs-1" htmlFor="studentName">Student Name:</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="studentName"
              name="studentName"
              value={student?.name || ""} // Bind student name
              readOnly
            />
          </div>
          <div></div>
          <div className="flex">
            <Label className="mt-3 font-bold fs-1" htmlFor="courseName">Course Name:</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="courseName"
              name="courseName"
              value={student?.course || ""} // Bind course name
              readOnly
            />
          </div>
          <div className="flex text-right">
            <Label className="mt-3 font-bold fs-1" htmlFor="studentCode">Date :</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="date"
              name="date"
              value={currentDate} // Set current date here
              readOnly
            />
          </div>
          <div className="flex text-right">
            <Label className="mt-3 font-bold fs-1" htmlFor="level">Level:</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="level"
              name="level"
              value={student?.level || ""} // Bind student level
              readOnly
            />
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
              <td className="border border-black p-2" style={{ width: '177.333334px' }}>
                <Input
                  name="courseFee"
                  className="w-40 text-center border-none bg-transparent"
                  style={{ float: 'right' }}
                  value={courseFee}
                  onChange={(e) => setCourseFee(Number(e.target.value))}
                /></td>
            </tr>
            <tr>
              <td className="border border-black p-2 pl-8">Central Tax</td>
              <td className="border border-black p-2">9%</td>
              <td className="border border-black p-2"><Input
                name="courseFee"
                className="w-40 text-center border-none bg-transparent"
                style={{ float: 'right' }}
                value={centralTax9.toFixed(2)}
                readOnly
              /></td>
            </tr>
            <tr>
              <td className="border border-black p-2 pl-8">State Tax</td>
              <td className="border border-black p-2">9%</td>
              <td className="border border-black p-2"><Input
                name="courseFee"
                className="w-40 text-center border-none bg-transparent"
                style={{ float: 'right' }}
                value={stateTax9.toFixed(2)}
                readOnly
              /></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Exercise Book</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"><Input
                name="courseFee"
                className="w-40 text-center border-none bg-transparent"
                style={{ float: 'right' }}
                value={exerciseBookFee}
                onChange={(e) => setExerciseBookFee(Number(e.target.value))}
              /></td>
            </tr>
            <tr>
              <td className="border border-black p-2 pl-8">Central Tax</td>
              <td className="border border-black p-2">6%</td>
              <td className="border border-black p-2"><Input
                name="courseFee"
                className="w-40 text-center border-none bg-transparent"
                style={{ float: 'right' }}
                value={centralTax6.toFixed(2)}
                readOnly
              /></td>
            </tr>
            <tr>
              <td className="border border-black p-2 pl-8">State Tax</td>
              <td className="border border-black p-2">6%</td>
              <td className="border border-black p-2">
                <Input
                  name="courseFee"
                  className="w-40 text-center border-none bg-transparent"
                  style={{ float: 'right' }}
                  value={stateTax6.toFixed(2)}
                  readOnly
                /></td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex">
            <Label className="mt-3 font-bold fs-1" htmlFor="studentCode">Mode of Payment :</Label>
            <Input className="w-auto ml-2 border-none bg-transparent" id="studentCode" name="studentCode" />
          </div>
          <div className="flex text-center">
            <Label className="mt-3 font-bold fs-1" htmlFor="studentCode" style={{ float: 'right' }}>Total Amount :</Label>
            <Input className="w-auto ml-2 border-none bg-transparent" id="studentCode" name="studentCode" style={{
              paddingTop: '4px',
              paddingBottom: '4px',
              paddingRight: '8px',
              paddingLeft: '8px',
              width: '117.33px',
              float: 'right'
            }}
              value={totalAmount.toFixed(2)}
                  readOnly />
          </div>
          <div></div>
          <div className="flex text-center">
            <Label className="mt-3 font-bold fs-1" htmlFor="studentCode">Amount in Words :</Label>
            <Input className="w-auto ml-2 border-none bg-transparent" id="studentCode" name="studentCode" />
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

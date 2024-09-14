import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import numberToWords from 'number-to-words';
import { Button } from "@/components/ui/button";
import { PrinterIcon, SaveIcon } from "lucide-react";
import './FeeCollection.css';

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

// Define LevelDropdownProps interface
interface LevelDropdownProps {
  level: string;
  onLevelChange: (level: string) => void;
}

// LevelDropdown component
const LevelDropdown: React.FC<LevelDropdownProps> = ({ level, onLevelChange }) => {
  return (
    <div className="flex text-right">
      <Label className="mt-1 font-bold fs-1" htmlFor="level">Level:</Label>
      <select
        id="level"
        name="level"
        value={level}
        onChange={(e) => onLevelChange(e.target.value)}
        className="w-auto ml-2 border-none bg-transparent"
        style={{
          paddingTop: "0px",
          paddingBottom: "0px",
          height: "20px",
          paddingLeft: "0px",
          paddingRight: "0px",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "inherit"
        }}
      >
        {[...Array(10).keys()].map(i => (
          <option key={i + 1} value={i + 1}>
            Level {i + 1}
          </option>
        ))}
      </select>
    </div>
  );
};


const BASE_URL = import.meta.env.VITE_BASE_URL;

const FeeCollection = () => {

  const receiptRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    // Implement save functionality here
    // For example, you could send the data to your backend API
    console.log('Saving receipt...');
    // Add your save logic here
  };

  const handlePrint = () => {
    window.print();
  };

  const [receiptNumber, setReceiptNumber] = useState<number | null>(null);

  useEffect(() => {
    const fetchReceiptNumber = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/receipt-number`);
        const data = await response.json();
        setReceiptNumber(data.receiptNumber);
      } catch (error) {
        console.error('Error fetching receipt number:', error);
      }
    };

    fetchReceiptNumber();
  }, []);

  const { id } = useParams<{ id: string }>(); // Extract the student ID from the route
  const [student, setStudent] = useState<Student | null>(null); // State to store student details
  const [error, setError] = useState<string | null>(null); // State to store error message
  const [currentDate, setCurrentDate] = useState<string>("");

  // Course Fee, Exercise Book Amount, and Tax States
  const [courseFee, setCourseFee] = useState<number>(0);
  const [exerciseBookFee, setExerciseBookFee] = useState<number>(0);
  const [kitFee, setkitFee] = useState<number>(0);
  const [jacketFee, setjacketFee] = useState<number>(0);
  const [centralTax9, setCentralTax9] = useState<number>(0);
  const [stateTax9, setStateTax9] = useState<number>(0);
  const [centralTax6, setCentralTax6] = useState<number>(0);
  const [stateTax6, setStateTax6] = useState<number>(0);
  const [centralTax25, setCentralTax25] = useState<number>(0);
  const [stateTax25, setStateTax25] = useState<number>(0);
  const [centralTax06, setCentralTax06] = useState<number>(0);
  const [stateTax06, setStateTax06] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalAmountInWords, setTotalAmountInWords] = useState<string>("");

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
    const calculatedCentralTax25 = kitFee * 0.025;
    const calculatedStateTax25 = kitFee * 0.025;
    const calculatedCentralTax06 = jacketFee * 0.06;
    const calculatedStateTax06 = jacketFee * 0.06;

    setCentralTax9(calculatedCentralTax9);
    setStateTax9(calculatedStateTax9);
    setCentralTax6(calculatedCentralTax6);
    setStateTax6(calculatedStateTax6);
    setCentralTax25(calculatedCentralTax25);
    setStateTax25(calculatedStateTax25);
    setCentralTax06(calculatedCentralTax06);
    setStateTax06(calculatedStateTax06);



    // Calculate total amount (Course Fee + Exercise Book Fee + All Taxes)
    const total = courseFee + exerciseBookFee + kitFee + jacketFee + calculatedCentralTax9 + calculatedStateTax9 + calculatedCentralTax6 + calculatedStateTax6 + calculatedCentralTax25 + calculatedStateTax25 + calculatedCentralTax06 + calculatedStateTax06;
    setTotalAmount(total);
    setTotalAmountInWords(numberToWords.toWords(total).toUpperCase()); // Convert number to words
  }, [courseFee, exerciseBookFee, kitFee, jacketFee]);

  const handleLevelChange = (newLevel: string) => {
    if (student) {
      setStudent({ ...student, level: newLevel });
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto mt-4 flex justify-end space-x-4">
        <Button onClick={handleSave} className="flex items-center">
          <SaveIcon className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button onClick={handlePrint} className="flex items-center">
          <PrinterIcon className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>
      <div id="receipt" ref={receiptRef} className="w-full max-w-[210mm] mx-auto p-4 border border-black print:border-none print-full-width">
      <div className="max-w-2xl mx-auto p-4 border border-black">
        <div className="text-xl font-bold text-center my-4">
          OEC-7 ACADEMY (Student Copy)
        </div>
        <div className="text-sm text-center mb-4">
          (GST IN - 09AJUPB7083R1Z5 )
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex">
            <Label className="mt-1 font-bold fs-1" htmlFor="studentCode">Student Code:</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="studentCode"
              name="studentCode"
              value={student?.student_code || ""} // Bind student ID (student code)
              readOnly
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "20px",
                paddingLeft: "0px",
                paddingRight: "0px"
              }}
            />
          </div>
          <div className="flex text-right">
            <Label className="mt-1 font-bold fs-1" htmlFor="studentCode">Receipt No. :</Label>
            <Input className="w-auto ml-2 border-none bg-transparent" id="receiptNumber" name="receiptNumber"
              value={receiptNumber || ''}
              readOnly
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "20px",
                paddingLeft: "0px",
                paddingRight: "0px"
              }} />
          </div>
          <div className="flex">
            <Label className="mt-1 font-bold fs-1" htmlFor="studentName">Student Name:</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="studentName"
              name="studentName"
              value={student?.name || ""} // Bind student name
              readOnly
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "20px",
                paddingLeft: "0px",
                paddingRight: "0px"
              }}
            />
          </div>
          <div className="flex text-right">
            <Label className="mt-1 font-bold fs-1" htmlFor="courseName">Course Name:</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="courseName"
              name="courseName"
              value={student?.course || ""} // Bind course name
              readOnly
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "20px",
                paddingLeft: "0px",
                paddingRight: "0px"
              }}
            />
          </div>
          <div className="flex">
            <LevelDropdown
              level={student?.level || "1"}
              onLevelChange={handleLevelChange}
            />
          </div>
          <div className="flex text-right">
            <Label className="mt-1 font-bold fs-1" htmlFor="studentCode">Date :</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="date"
              name="date"
              value={currentDate} // Set current date here
              readOnly
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "20px",
                paddingLeft: "0px",
                paddingRight: "0px"
              }}
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
            <tr style={{ height: '40px' }}>
              <td className="border border-black p-2">Course Fee</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2" style={{ width: '177.333334px', height: '30px' }}>
                <Input
                  name="courseFee"
                  className="w-40 text-center border-none bg-transparent"
                  style={{
                    float: 'right',
                    paddingBottom: "0px",
                    paddingTop: "0px",
                    height: "25px"
                  }}
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
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
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
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
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
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
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
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
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
                  style={{
                    float: 'right',
                    paddingBottom: "0px",
                    paddingTop: "0px",
                    height: "25px"
                  }}
                  value={stateTax6.toFixed(2)}
                  readOnly
                /></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Kit Fee</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"><Input
                name="kitFee"
                className="w-40 text-center border-none bg-transparent"
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
                value={kitFee}
                onChange={(e) => setkitFee(Number(e.target.value))}
              /></td>
            </tr>
            <tr>
              <td className="border border-black p-2 pl-8">Central Tax</td>
              <td className="border border-black p-2">2.5%</td>
              <td className="border border-black p-2"><Input
                name="courseFee"
                className="w-40 text-center border-none bg-transparent"
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
                value={centralTax25.toFixed(2)}
                readOnly
              /></td>
            </tr>
            <tr>
              <td className="border border-black p-2 pl-8">State Tax</td>
              <td className="border border-black p-2">2.5%</td>
              <td className="border border-black p-2">
                <Input
                  name="courseFee"
                  className="w-40 text-center border-none bg-transparent"
                  style={{
                    float: 'right',
                    paddingBottom: "0px",
                    paddingTop: "0px",
                    height: "25px"
                  }}
                  value={stateTax25.toFixed(2)}
                  readOnly
                /></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Jacket Fee</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"><Input
                name="jacketFee"
                className="w-40 text-center border-none bg-transparent"
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
                value={jacketFee}
                onChange={(e) => setjacketFee(Number(e.target.value))}
              /></td>
            </tr>
            <tr>
              <td className="border border-black p-2 pl-8">Central Tax</td>
              <td className="border border-black p-2">6%</td>
              <td className="border border-black p-2"><Input
                name="courseFee"
                className="w-40 text-center border-none bg-transparent"
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
                value={centralTax06.toFixed(2)}
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
                  style={{
                    float: 'right',
                    paddingBottom: "0px",
                    paddingTop: "0px",
                    height: "25px"
                  }}
                  value={stateTax06.toFixed(2)}
                  readOnly
                /></td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex">
            <Label className="mt-3 font-bold fs-1" htmlFor="paymentMode">Mode of Payment :</Label>
            <select className="w-auto ml-2 border-none bg-transparent" id="paymentMode" name="paymentMode">
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
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
            <Label className="mt-1 font-bold fs-1" htmlFor="amountInWords">Amount in Words :</Label>
            <textarea
              className="w-auto ml-2 border-none bg-transparent"
              id="amountInWords"
              name="amountInWords"
              value={totalAmountInWords}
              readOnly
              rows={3} // Adjust the number of rows as needed
              style={{ resize: 'none' }} // Prevent resizing if not needed
            />
          </div>

        </div>
        <div className="mt-8">
          <span className="font-bold">Authority Seal And Signature</span>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-4 border border-black">
        <div className="text-xl font-bold text-center my-4">
          OEC-7 ACADEMY (Student Copy)
        </div>
        <div className="text-sm text-center mb-4">
          (GST IN - 09AJUPB7083R1Z5 )
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex">
            <Label className="mt-1 font-bold fs-1" htmlFor="studentCode">Student Code:</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="studentCode"
              name="studentCode"
              value={student?.student_code || ""} // Bind student ID (student code)
              readOnly
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "20px",
                paddingLeft: "0px",
                paddingRight: "0px"
              }}
            />
          </div>
          <div className="flex text-right">
            <Label className="mt-1 font-bold fs-1" htmlFor="studentCode">Receipt No. :</Label>
            <Input className="w-auto ml-2 border-none bg-transparent" id="receiptNumber" name="receiptNumber"
              value={receiptNumber || ''}
              readOnly
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "20px",
                paddingLeft: "0px",
                paddingRight: "0px"
              }} />
          </div>
          <div className="flex">
            <Label className="mt-1 font-bold fs-1" htmlFor="studentName">Student Name:</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="studentName"
              name="studentName"
              value={student?.name || ""} // Bind student name
              readOnly
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "20px",
                paddingLeft: "0px",
                paddingRight: "0px"
              }}
            />
          </div>
          <div className="flex text-right">
            <Label className="mt-1 font-bold fs-1" htmlFor="courseName">Course Name:</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="courseName"
              name="courseName"
              value={student?.course || ""} // Bind course name
              readOnly
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "20px",
                paddingLeft: "0px",
                paddingRight: "0px"
              }}
            />
          </div>
          <div className="flex">
            <LevelDropdown
              level={student?.level || "1"}
              onLevelChange={handleLevelChange}
            />
          </div>
          <div className="flex text-right">
            <Label className="mt-1 font-bold fs-1" htmlFor="studentCode">Date :</Label>
            <Input
              className="w-auto ml-2 border-none bg-transparent"
              id="date"
              name="date"
              value={currentDate} // Set current date here
              readOnly
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "20px",
                paddingLeft: "0px",
                paddingRight: "0px"
              }}
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
            <tr style={{ height: '40px' }}>
              <td className="border border-black p-2">Course Fee</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2" style={{ width: '177.333334px', height: '30px' }}>
                <Input
                  name="courseFee"
                  className="w-40 text-center border-none bg-transparent"
                  style={{
                    float: 'right',
                    paddingBottom: "0px",
                    paddingTop: "0px",
                    height: "25px"
                  }}
                  readOnly
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
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
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
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
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
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
                readOnly
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
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
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
                  style={{
                    float: 'right',
                    paddingBottom: "0px",
                    paddingTop: "0px",
                    height: "25px"
                  }}
                  value={stateTax6.toFixed(2)}
                  readOnly
                /></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Kit Fee</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"><Input
                name="kitFee"
                className="w-40 text-center border-none bg-transparent"
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
                readOnly
                value={kitFee}
                onChange={(e) => setkitFee(Number(e.target.value))}
              /></td>
            </tr>
            <tr>
              <td className="border border-black p-2 pl-8">Central Tax</td>
              <td className="border border-black p-2">2.5%</td>
              <td className="border border-black p-2"><Input
                name="courseFee"
                className="w-40 text-center border-none bg-transparent"
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
                value={centralTax25.toFixed(2)}
                readOnly
              /></td>
            </tr>
            <tr>
              <td className="border border-black p-2 pl-8">State Tax</td>
              <td className="border border-black p-2">2.5%</td>
              <td className="border border-black p-2">
                <Input
                  name="courseFee"
                  className="w-40 text-center border-none bg-transparent"
                  style={{
                    float: 'right',
                    paddingBottom: "0px",
                    paddingTop: "0px",
                    height: "25px"
                  }}
                  value={stateTax25.toFixed(2)}
                  readOnly
                /></td>
            </tr>
            <tr>
              <td className="border border-black p-2">Jacket Fee</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"><Input
                name="jacketFee"
                className="w-40 text-center border-none bg-transparent"
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
                readOnly
                value={jacketFee}
                onChange={(e) => setjacketFee(Number(e.target.value))}
              /></td>
            </tr>
            <tr>
              <td className="border border-black p-2 pl-8">Central Tax</td>
              <td className="border border-black p-2">6%</td>
              <td className="border border-black p-2"><Input
                name="courseFee"
                className="w-40 text-center border-none bg-transparent"
                style={{
                  float: 'right',
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  height: "25px"
                }}
                value={centralTax06.toFixed(2)}
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
                  style={{
                    float: 'right',
                    paddingBottom: "0px",
                    paddingTop: "0px",
                    height: "25px"
                  }}
                  value={stateTax06.toFixed(2)}
                  readOnly
                /></td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex">
            <Label className="mt-3 font-bold fs-1" htmlFor="paymentMode">Mode of Payment :</Label>
            <select className="w-auto ml-2 border-none bg-transparent" id="paymentMode" name="paymentMode">
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
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
            <Label className="mt-1 font-bold fs-1" htmlFor="amountInWords">Amount in Words :</Label>
            <textarea
              className="w-auto ml-2 border-none bg-transparent"
              id="amountInWords"
              name="amountInWords"
              value={totalAmountInWords}
              readOnly
              rows={3} // Adjust the number of rows as needed
              style={{ resize: 'none' }} // Prevent resizing if not needed
            />
          </div>

        </div>
        <div className="mt-8">
          <span className="font-bold">Authority Seal And Signature</span>
        </div>
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

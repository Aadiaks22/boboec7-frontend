import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import numberToWords from 'number-to-words';
import { Button } from "@/components/ui/button";
import { PrinterIcon, SaveIcon } from "lucide-react";
import './FeeCollection.css';
import './Demo3';
import Demo3 from "./Demo3";
import html2canvas from "html2canvas";

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

  const handlePrint = () => {
    if (!isSaved) {
      alert('Please save the receipt before printing');
      return;
    }
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

  const { id: r_id } = useParams<{ id: string }>(); // Extract the student ID from the route
  const [student, setStudent] = useState<Student | null>(null); // State to store student details
  //const [error, setError] = useState<string | null>(null); // State to store error message
  const [currentDate, setCurrentDate] = useState<string>("");

  // State to store dynamically added student ID
  const [s_id, setSId] = useState<string | null>(null);

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
  const [mcourseFee, setMCourseFee] = useState<number>(0);
  const [mkitFee, setMKitFee] = useState<number>(0);

  const handleAddStudent = (studentId: string) => {
    console.log("Student ID for fee collection:", studentId);
    // You can now use this studentId in your fee collection logic
    setSId(studentId); // Store the student ID
    setCourseFee(0);
    setExerciseBookFee(0);
    setkitFee(0);
    setjacketFee(0);
    setCentralTax9(0);
    setStateTax9(0);
    setCentralTax6(0);
    setStateTax6(0);
    setCentralTax25(0);
    setStateTax25(0);
    setCentralTax06(0);
    setStateTax06(0);
    setMCourseFee(0);
    setMKitFee(0);
  };

  // Prioritize s_id if available, otherwise fall back to r_id
  const id = r_id || s_id;

  useEffect(() => {
    // Set the current date in "DD/MM/YYYY" format
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    setCurrentDate(formattedDate);

    const fetchStudent = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/user/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student details");
        }
        const data = await response.json();

        //console.log("Student Data:", data); // Log the student data to the console

        setStudent(data); // Set the fetched student details
      } catch (error) {
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
    const total = courseFee + exerciseBookFee + kitFee + jacketFee + calculatedCentralTax9 + calculatedStateTax9 + calculatedCentralTax6 + calculatedStateTax6 + calculatedCentralTax25 + calculatedStateTax25 + calculatedCentralTax06 + calculatedStateTax06 + mcourseFee + mkitFee;
    setTotalAmount(total);
    setTotalAmountInWords(numberToWords.toWords(total).toUpperCase()); // Convert number to words
  }, [courseFee, exerciseBookFee, kitFee, jacketFee, mcourseFee, mkitFee]);

  const handleLevelChange = (newLevel: string) => {
    if (student) {
      setStudent({ ...student, level: newLevel });
    }
  };

  //Save Data of the fee-reciept
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false); // New state variable for save status

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setErrorMessage(null); // Reset any previous error message
    setSuccessMessage(null); // Reset any previous success message

    // Check if values exist
    if (!receiptNumber) {
      setErrorMessage('Missing receipt number');
      return;
    }
    if (!student) {
      setErrorMessage('Missing Student Details');
      return;
    }
    if (!student || !student.name) {
      setErrorMessage('Missing student name');
      return;
    }
    if (!totalAmount) {
      setErrorMessage('Missing total amount');
      return;
    }

    // Capture the invoice content as an image using html2canvas
    const invoiceElement = document.querySelector('.invoice') as HTMLElement;
    const authToken = localStorage.getItem('token'); // Ensure the key matches how you're storing the token

    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    if (invoiceElement) {
      try {
        const canvas = await html2canvas(invoiceElement);
        const imageBlob = await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob as Blob), 'image/png'));

        // Create FormData to send the image as a file
        const formData = new FormData();
        formData.append('reciept_number', receiptNumber.toString());
        formData.append('name', student?.name || "");
        formData.append('date', new Date().toISOString());
        formData.append('paid_upto', student?.level || "");
        formData.append('net_amount', totalAmount.toString());
        formData.append('reciept_img', imageBlob, `receipt_${receiptNumber}.png`); // Append image as a file


        console.log("FormData being sent:", formData); // Log the request body

        const response = await fetch(`${BASE_URL}/api/admin/addreciept`, {
          method: 'POST',
          headers: {
            'auth-token': authToken, // Ensure you have the auth token here
          },
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to save receipt');
        }

        const json = await response.json();

        if (json.success) {
          setIsSaved(true);
          setSuccessMessage('Receipt saved successfully');

        } else {
          setErrorMessage('Error in saving receipt');
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unknown error occurred');
        }
      }
    } else {
      setErrorMessage('Invoice element not found');
    }
  };


  const renderReceipt = (copy: number) => (
    <div className="invoice border border-black p-2 print:border-none print:p-1 print:text-[8pt] print:leading-tight">
      <div className="text-lg font-bold text-center mb-2 print:text-sm">
        OEC-7 ACADEMY ({copy === 1 ? 'Student' : 'Office'} Copy)
      </div>
      <div className="text-xs text-center mb-2 print:text-[7pt]">
        (GST IN - 09AJUPB7083R1Z5)
      </div>

      <div className="grid grid-cols-2 gap-1 mb-2 text-xs print:text-[7pt]">
        <div className="flex">
          <Label className="mt-1 font-bold" htmlFor={`studentCode${copy}`}>Student Code:</Label>
          <Input
            className="w-auto ml-1 border-none bg-transparent p-0 h-auto"
            id={`studentCode${copy}`}
            name={`studentCode${copy}`}
            value={student?.student_code || ""}
            readOnly
          />
        </div>
        <div className="flex">
          <Label className="mt-1 font-bold" htmlFor={`receiptNumber${copy}`}>Receipt No.:</Label>
          <Input
            className="w-auto ml-1 border-none bg-transparent p-0 h-auto"
            id={`receiptNumber${copy}`}
            name={`receiptNumber${copy}`}
            value={receiptNumber || ''}
            readOnly
          />
        </div>
        <div className="flex">
          <Label className="mt-1 font-bold" htmlFor={`studentName${copy}`}>Student Name:</Label>
          <Input
            className="w-auto ml-1 border-none bg-transparent p-0 h-auto"
            id={`studentName${copy}`}
            name={`studentName${copy}`}
            value={student?.name || ""}
            readOnly
          />
        </div>
        <div className="flex">
          <Label className="mt-1 font-bold" htmlFor={`courseName${copy}`}>Course:</Label>
          <Input
            className="w-auto ml-1 border-none bg-transparent p-0 h-auto"
            id={`courseName${copy}`}
            name={`courseName${copy}`}
            value={student?.course || ""}
            readOnly
          />
        </div>
        <div className="flex">
          {!r_id && (<LevelDropdown
            level={student?.level || "1"}
            onLevelChange={handleLevelChange}
          />)}
        </div>
        <div className="flex">
          <Label className="mt-1 font-bold" htmlFor={`date${copy}`}>Date:</Label>
          <Input
            className="w-auto ml-1 border-none bg-transparent p-0 h-auto"
            id={`date${copy}`}
            name={`date${copy}`}
            value={currentDate}
            readOnly
          />
        </div>
      </div>
      {(student?.course === 'BRAINOBRAIN' && !r_id) && (
        <table className="w-full border-collapse border border-black mb-2 text-xs print:text-[7pt]">
          <thead>
            <tr>
              <th className="border border-black p-1 print:p-[2px]">Description</th>
              <th className="border border-black p-1 print:p-[2px]">Rate</th>
              <th className="border border-black p-1 print:p-[2px]">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 print:p-[2px]">Course Fee</td>
              <td className="text-center border border-black p-1 print:p-[2px]"></td>
              <td className="border border-black p-1 print:p-[2px]">
                <Input
                  name={`courseFee${copy}`}
                  className="w-full text-center border-none bg-transparent p-0 h-auto"
                  value={courseFee}
                  onChange={(e) => setCourseFee(Number(e.target.value))}
                  readOnly={copy === 2}
                />
              </td>
            </tr>
            <tr>
              <td className="text-center border border-black p-1 print:p-[2px] pl-4">Central Tax</td>
              <td className="text-center border border-black p-1 print:p-[2px]">9%</td>
              <td className="border border-black p-1 print:p-[2px]">
                <Input
                  name={`centralTax9${copy}`}
                  className="w-full text-center border-none bg-transparent p-0 h-auto"
                  value={centralTax9.toFixed(2)}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td className="text-center border border-black p-1 print:p-[2px] pl-4">State Tax</td>
              <td className="text-center border border-black p-1 print:p-[2px]">9%</td>
              <td className="border border-black p-1 print:p-[2px]">
                <Input
                  name={`stateTax9${copy}`}
                  className="w-full text-center border-none bg-transparent p-0 h-auto"
                  value={stateTax9.toFixed(2)}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 print:p-[2px]">Exercise Book</td>
              <td className="text-center border border-black p-1 print:p-[2px]"></td>
              <td className="border border-black p-1 print:p-[2px]">
                <Input
                  name={`exerciseBookFee${copy}`}
                  className="w-full text-center border-none bg-transparent p-0 h-auto"
                  value={exerciseBookFee}
                  onChange={(e) => setExerciseBookFee(Number(e.target.value))}
                  readOnly={copy === 2}
                />
              </td>
            </tr>
            <tr>
              <td className="text-center border border-black p-1 print:p-[2px] pl-4">Central Tax</td>
              <td className="text-center border border-black p-1 print:p-[2px]">6%</td>
              <td className="border border-black p-1 print:p-[2px]">
                <Input
                  name={`centralTax6${copy}`}
                  className="w-full text-center border-none bg-transparent p-0 h-auto"
                  value={centralTax6.toFixed(2)}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td className="text-center border border-black p-1 print:p-[2px] pl-4">State Tax</td>
              <td className="text-center border border-black p-1 print:p-[2px]">6%</td>
              <td className="border border-black p-1 print:p-[2px]">
                <Input
                  name={`stateTax6${copy}`}
                  className="w-full text-center border-none bg-transparent p-0 h-auto"
                  value={stateTax6.toFixed(2)}
                  readOnly
                />
              </td>
            </tr>
            {/* Checking if 'student' exists */}
            {/* {r_id && (
              <>
                <tr>
                  <td className="border border-black p-1 print:p-[2px]">Kit Fee</td>
                  <td className="text-center border border-black p-1 print:p-[2px]"></td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`kitFee${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={kitFee}
                      onChange={(e) => setkitFee(Number(e.target.value))}
                      readOnly={copy === 2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-center border border-black p-1 print:p-[2px] pl-4">Central Tax</td>
                  <td className="text-center border border-black p-1 print:p-[2px]">2.5%</td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`centralTax25${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={centralTax25.toFixed(2)}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-center border border-black p-1 print:p-[2px] pl-4">State Tax</td>
                  <td className="text-center border border-black p-1 print:p-[2px]">2.5%</td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`stateTax25${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={stateTax25.toFixed(2)}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1 print:p-[2px]">Jacket Fee</td>
                  <td className="text-center border border-black p-1 print:p-[2px]"></td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`jacketFee${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={jacketFee}
                      onChange={(e) => setjacketFee(Number(e.target.value))}
                      readOnly={copy === 2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-center border border-black p-1 print:p-[2px] pl-4">Central Tax</td>
                  <td className="text-center border border-black p-1 print:p-[2px]">6%</td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`centralTax06${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={centralTax06.toFixed(2)}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-center border border-black p-1 print:p-[2px] pl-4">State Tax</td>
                  <td className="text-center border border-black p-1 print:p-[2px]">6%</td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`stateTax06${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={stateTax06.toFixed(2)}
                      readOnly
                    />
                  </td>
                </tr></>
            )} */}
          </tbody>
        </table>)}

      {r_id && (
        <table className="w-full border-collapse border border-black mb-2 text-xs print:text-[7pt]">
          <thead>
            <tr>
              <th className="border border-black p-1 print:p-[2px]">Description</th>
              <th className="border border-black p-1 print:p-[2px]">Rate</th>
              <th className="border border-black p-1 print:p-[2px]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* Checking if 'student' exists */}
            {r_id && (
              <>
                <tr>
                  <td className="border border-black p-1 print:p-[2px]">Kit Fee</td>
                  <td className="text-center border border-black p-1 print:p-[2px]"></td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`kitFee${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={kitFee}
                      onChange={(e) => setkitFee(Number(e.target.value))}
                      readOnly={copy === 2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-center border border-black p-1 print:p-[2px] pl-4">Central Tax</td>
                  <td className="text-center border border-black p-1 print:p-[2px]">2.5%</td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`centralTax25${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={centralTax25.toFixed(2)}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-center border border-black p-1 print:p-[2px] pl-4">State Tax</td>
                  <td className="text-center border border-black p-1 print:p-[2px]">2.5%</td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`stateTax25${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={stateTax25.toFixed(2)}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1 print:p-[2px]">Jacket Fee</td>
                  <td className="text-center border border-black p-1 print:p-[2px]"></td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`jacketFee${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={jacketFee}
                      onChange={(e) => setjacketFee(Number(e.target.value))}
                      readOnly={copy === 2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-center border border-black p-1 print:p-[2px] pl-4">Central Tax</td>
                  <td className="text-center border border-black p-1 print:p-[2px]">6%</td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`centralTax06${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={centralTax06.toFixed(2)}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-center border border-black p-1 print:p-[2px] pl-4">State Tax</td>
                  <td className="text-center border border-black p-1 print:p-[2px]">6%</td>
                  <td className="border border-black p-1 print:p-[2px]">
                    <Input
                      name={`stateTax06${copy}`}
                      className="w-full text-center border-none bg-transparent p-0 h-auto"
                      value={stateTax06.toFixed(2)}
                      readOnly
                    />
                  </td>
                </tr></>
            )}
          </tbody>
        </table>)}

      {(student?.course === 'MENTAL MATH') && (
        <table className="w-full border-collapse border border-black mb-2 text-xs print:text-[7pt]">
          <thead>
            <tr>
              <th className="border border-black p-1 print:p-[2px]">Description</th>
              <th className="border border-black p-1 print:p-[2px]">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center border border-black p-1 print:p-[2px]">Course Fee</td>
              <td className="border border-black p-1 print:p-[2px]">
                <Input
                  name={`courseFee${copy}`}
                  className="w-full text-center border-none bg-transparent p-0 h-auto"
                  value={mcourseFee}
                  onChange={(e) => setMCourseFee(Number(e.target.value))}
                  readOnly={copy === 2}
                />
              </td>
            </tr>
            <tr>
              <td className="text-center border border-black p-1 print:p-[2px]">Kit Fee</td>
              <td className="border border-black p-1 print:p-[2px]">
                <Input
                  name={`kitFee${copy}`}
                  className="w-full text-center border-none bg-transparent p-0 h-auto"
                  value={mkitFee}
                  onChange={(e) => setMKitFee(Number(e.target.value))}
                  readOnly={copy === 2}
                />
              </td>
            </tr>
          </tbody>
        </table>)}


      <div className="grid grid-cols-2 gap-2 mb-2 text-xs print:text-[7pt]">
        <div className="flex">
          <Label className="mt-1 font-bold" htmlFor={`paymentMode${copy}`}>Mode:</Label>
          <select className="w-auto ml-1 border-none bg-transparent" id={`paymentMode${copy}`} name={`paymentMode${copy}`}>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
          </select>
        </div>
        <div className="flex text-center">
          <Label className="mt-1 font-bold" htmlFor={`totalAmount${copy}`}>Total:</Label>
          <Input
            className="w-auto ml-1 border-none bg-transparent p-0 h-auto"
            id={`totalAmount${copy}`}
            name={`totalAmount${copy}`}
            value={totalAmount.toFixed(2)}
            readOnly
          />
        </div>
        <div></div>
        <div className="flex justify-end">
          <Label className="font-bold" htmlFor={`amountInWords${copy}`}>Amount in Words:</Label>
          <textarea
            className="w-full ml-1 border-none bg-transparent p-0 h-auto text-xs print:text-[7pt]"
            id={`amountInWords${copy}`}
            name={`amountInWords${copy}`}
            value={totalAmountInWords}
            readOnly
            rows={2}
            style={{ resize: 'none' }}
          />
        </div>
      </div>
      <div className="flex">
        <div className="mt-2 text-xs print:text-[7pt]">
          <span className="font-bold">Authority Seal And Signature</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="border mt-2 p-4 bg-white shadow">
      <div className="w-full max-w-[297mm] mx-auto p-4">
        {!r_id && (
          <div className="print:hidden">
            <Demo3 onAddStudent={handleAddStudent} />
          </div>)}

        <div>
          {errorMessage && <div className="error-message text-red-500">{errorMessage}</div>}
          {successMessage && <div className="success-message text-green-500 print:hidden ml-4">{successMessage}</div>}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex">
          </div>
          <div className="flex space-x-4 max-w-2xl mt-4 print:hidden" style={{ marginTop: "0px" }}>
            <Button onClick={handleSave} className="flex items-center bg-[#02a0a0]">
              <SaveIcon className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button onClick={handlePrint} className="flex items-center bg-[#02a0a0]">
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </div>
      <div id="receipt" ref={receiptRef} className="w-full max-w-[297mm] mx-auto p-4 print:p-0 print:max-w-full">
        <div className="print:flex print:flex-row print:justify-between">
          {renderReceipt(1)}
          {renderReceipt(2)}
        </div>
      </div>
    </div>
  );
};

export default FeeCollection;
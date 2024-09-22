import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ITEMS_PER_PAGE = 10;
const levels = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
const statuses = ["Active", "Inactive", "Pending", "Dropped", "Graduate"];


export default function StudentManagement({ openModal }: { openModal: (id: string) => void }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active'); // Default to Active
  // const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  // const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/fetchalluser`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data.filter((student: Student) => student.status === 'Active')); // Filter active students initially
      } catch (error) {
        setError('Error fetching student data');
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Apply search and status filter
  useEffect(() => {
    let filtered = students;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, students]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const handleLevelChange = async (studentId: string, newLevel: string) => {
    if (!studentId) {
      console.error('Student ID is required');
      return;
    }
  
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }
  
    try {
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student._id === studentId ? { ...student, level: newLevel } : student
        )
      );
  
      const response = await fetch(`${BASE_URL}/api/admin/updateuser/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
        body: JSON.stringify({ level: newLevel }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update student level');
      }
  
      const result = await response.json();
      console.log('Student level updated successfully:', result);
    } catch (error) {
      console.error('Error updating student level:', error);
    }
  };
  
  const handleStatusChange = async (studentId: string, newStatus: string) => {
    if (!studentId) {
      console.error('Student ID is required');
      return;
    }
  
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }
  
    try {
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student._id === studentId ? { ...student, status: newStatus } : student
        )
      );
  
      const response = await fetch(`${BASE_URL}/api/admin/updateuser/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update student status');
      }
  
      const result = await response.json();
      console.log('Student status updated successfully:', result);
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Define table columns
    const tableColumn = [
      "Student Code",
      "Name",
      // "Class",
      "Date of Birth",
      "Contact Number",
      "Course",
      "Level",
      // "Status"
    ];
    
    // Prepare table rows based on filteredStudents
    const tableRows = filteredStudents.map(student => [
      student.student_code,
      student.name,
      // student.student_class,
      new Date(student.dob).toLocaleDateString(),
      student.contact_number,
      student.course,
      student.level,
      // student.status
    ]);

    // Add title to PDF
    doc.setFontSize(18);
    doc.text("Registered Students Report", 14, 22);
    
    // Add current date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Add autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 }, // Customize header color and text color
      alternateRowStyles: { fillColor: [238, 238, 238] }, // Alternate row color
      margin: { top: 10 },
      didDrawPage: (data) => {
        // Add footer with page numbers
        const pageCount = doc.getNumberOfPages();
        const currentPage = doc.getCurrentPageInfo();
        doc.setFontSize(10);
        doc.text(`Page ${currentPage} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    // Save the PDF
    doc.save('registered_student_report.pdf');
  };

  // Function to generate and download Excel file
  const generateExcel = () => {
    // Define the worksheet data
    const worksheetData = filteredStudents.map((student) => ({
      "Student Code": student.student_code,
      "Name": student.name,
      // "Class": student.student_class,
      "Date of Birth": new Date(student.dob).toLocaleDateString(),
      "Contact Number": student.contact_number,
      "Course": student.course,
      "Level": student.level,
      // "Status": student.status,
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Define workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Generate a binary string representation of the workbook
    const workbookOut = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Create a Blob from the binary string
    const blob = new Blob([workbookOut], { type: "application/octet-stream" });

    // Trigger the download
    saveAs(blob, "registered_students_report.xlsx");
  };

  // const openModal = (id: string) => {
  //   const student = students.find(s => s._id === id)
  //   if (student) {
  //     setSelectedStudent(student)
  //     setIsModalOpen(true)
  //   }
  // }

  return (
    <div className="main-content p-4 max-w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">All Registered Students</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4 flex items-center">
        <Input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2 mr-2"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <Button onClick={() => setSearchQuery('')} className="mr-2">Clear</Button>
        
        {/* Download PDF Button */}
        <Button onClick={generatePDF} className="mr-2">Download PDF</Button>
        
        {/* Download Excel Button */}
        <Button onClick={generateExcel}>Download Excel</Button>
      </div>
      {students.length > 0 ? (
        <div className="overflow-hidden rounded-md border flex flex-col h-full">
          <ScrollArea className="flex-1 overflow-y-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5px] sticky top-0 bg-background border">S_Code</TableHead>
                  <TableHead className="w-[500px] sticky top-0 bg-background border">Name</TableHead>
                  <TableHead className="w-[30px] sticky top-0 bg-background border">Class</TableHead>
                  <TableHead className="w-[100px] sticky top-0 bg-background border">Date of Birth</TableHead>
                  <TableHead className="w-[100px] sticky top-0 bg-background border">Contact Number</TableHead>
                  <TableHead className="w-auto sticky top-0 bg-background border">Course</TableHead>
                  <TableHead className="w-[150px] sticky top-0 bg-background border">Level</TableHead>
                  <TableHead className="w-[290px] sticky top-0 bg-background border">Status</TableHead>
                  <TableHead className="w-[50px] sticky top-0 bg-background border">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium border">{student.student_code}</TableCell>
                    <TableCell className='border'>{student.name}</TableCell>
                    <TableCell className='border'>{student.student_class}</TableCell>
                    <TableCell className='border'>{new Date(student.dob).toLocaleDateString()}</TableCell>
                    <TableCell className='border'>{student.contact_number}</TableCell>
                    <TableCell className='border'>{student.course}</TableCell>
                    <TableCell className='border'>
                      <select
                        value={student?.level || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleLevelChange(student._id, e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        {levels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className='border'>
                      <select
                        value={student?.status || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(student._id, e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className='border'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost"><ChevronDown/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openModal(student._id)}>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ) : (
        <p>No students found</p>
      )}
      <div className="pagination mt-4 flex justify-between items-center">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
      </div>
    </div>
  );
}

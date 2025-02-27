'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Users, FileSpreadsheet, FileText } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchStudents, updateStudentData } from '@/http/api'

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

//const BASE_URL = import.meta.env.VITE_BASE_URL;
const ITEMS_PER_PAGE = 10;
const levels = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
const statuses = ["Active", "Inactive", "Pending", "Dropped", "Graduate"];

export default function StudentManagement({ openModal }: { openModal: (id: string) => void }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');

  // Use `useQuery` to fetch student data
  const { data } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  useEffect(() => {
    if (data) {
      setStudents(data);
      setFilteredStudents(data.filter((student: Student) => student.status === 'Active'));
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setError('Error fetching student data');
      console.error('Error fetching students:', error);
    }
  }, [error]);

  useEffect(() => {
    let filtered = students;

    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(lowercasedQuery)
      );
    }

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

  // Update student mutation
  const updateMutation = useMutation({
    mutationFn: updateStudentData,
    onSuccess: () => {

    },
    onError: (error) => {
      console.error("An error occurred:", error);
    },
  });

  const handleLevelChange = async (studentId: string, newLevel: string) => {
    if (!studentId) {
      console.error('Student ID is required');
      return;
    }

    try {
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student._id === studentId ? { ...student, level: newLevel } : student
        )
      );

      updateMutation.mutate({ id: studentId, updateData: { level: newLevel } }); // Pass the right types

    } catch (error) {
      console.error('Error updating student level:', error);
    }
  };

  const handleStatusChange = async (studentId: string, newStatus: string) => {
    if (!studentId) {
      console.error('Student ID is required');
      return;
    }

    try {
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student._id === studentId ? { ...student, status: newStatus } : student
        )
      );

      updateMutation.mutate({ id: studentId, updateData: { status: newStatus } }); // Pass the right types

    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Student Code",
      "Name",
      "Date of Birth",
      "Contact Number",
      "Course",
      "Level",
    ];

    const tableRows = filteredStudents.map(student => [
      student.student_code,
      student.name,
      new Date(student.dob).toLocaleDateString(),
      student.contact_number,
      student.course,
      student.level,
    ]);

    doc.setFontSize(18);
    doc.text("Registered Students Report", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      alternateRowStyles: { fillColor: [238, 238, 238] },
      margin: { top: 10 },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save('registered_student_report.pdf');
  };

  const generateExcel = () => {
    const worksheetData = filteredStudents.map((student) => ({
      "Student Code": student.student_code,
      "Name": student.name,
      "Date of Birth": new Date(student.dob).toLocaleDateString(),
      "Contact Number": student.contact_number,
      "Course": student.course,
      "Level": student.level,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const workbookOut = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([workbookOut], { type: "application/octet-stream" });
    saveAs(blob, "registered_students_report.xlsx");
  };

  return (
    <Card className="w-full max-w-6xl mx-auto sm:mx-4">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="text-3xl font-bold flex items-center">
          <Users className="mr-2" />
          All Registered Students
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {error && <p className="text-red-500 mb-4 p-2 bg-red-100 rounded">{error}</p>}
        <div className="mb-6 flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <div className="w-full sm:flex-1 sm:min-w-[200px]">
            <Input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto border rounded p-2 bg-white"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div className="flex w-full sm:w-auto gap-2">
            <Button onClick={() => setSearchQuery('')} variant="outline" className="flex-1 sm:flex-none">Clear</Button>
            <Button onClick={generatePDF} className="bg-red-500 hover:bg-red-600 flex-1 sm:flex-none">
              <FileText className="mr-2" />
              PDF
            </Button>
            <Button onClick={generateExcel} className="bg-green-500 hover:bg-green-600 flex-1 sm:flex-none">
              <FileSpreadsheet className="mr-2" />
              Excel
            </Button>
          </div>
        </div>
        {students.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-500 to-purple-500">
                    <TableHead className="text-white font-bold">S_Code</TableHead>
                    <TableHead className="text-white font-bold">Name</TableHead>
                    <TableHead className="text-white font-bold hidden sm:table-cell">Class</TableHead>
                    <TableHead className="text-white font-bold hidden sm:table-cell">Date of Birth</TableHead>
                    <TableHead className="text-white font-bold hidden sm:table-cell">Contact</TableHead>
                    <TableHead className="text-white font-bold hidden sm:table-cell">Course</TableHead>
                    <TableHead className="text-white font-bold">Level</TableHead>
                    <TableHead className="text-white font-bold">Status</TableHead>
                    <TableHead className="text-white font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student, index) => (
                    <TableRow key={student._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <TableCell className="font-medium">{student.student_code}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{student.student_class}</TableCell>
                      <TableCell className="hidden sm:table-cell">{new Date(student.dob).toLocaleDateString()}</TableCell>
                      <TableCell className="hidden sm:table-cell">{student.contact_number}</TableCell>
                      <TableCell className="hidden sm:table-cell">{student.course}</TableCell>
                      <TableCell>
                        <select
                          value={student?.level || ''}
                          onChange={(e) => handleLevelChange(student._id, e.target.value)}
                          className="w-full p-2 border rounded-md bg-white"
                        >
                          {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <select
                          value={student?.status || ''}
                          onChange={(e) => handleStatusChange(student._id, e.target.value)}
                          className="w-full p-2 border rounded-md bg-white"
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost"><ChevronDown className="h-4 w-4" /></Button>
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
          <p className="text-center text-gray-500 my-8">No students found</p>
        )}
        <div className="pagination mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
          >
            Previous
          </Button>
          <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


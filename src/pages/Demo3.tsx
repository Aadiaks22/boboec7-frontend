import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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
const statuses = ["active", "dropped out", "on hold", "graduate"];


 
export default function StudentManagement() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
  
    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/admin/fetchalluser`);
          if (!response.ok) {
            throw new Error('Failed to fetch students');
          }
          const data = await response.json();
          setStudents(data);
          setFilteredStudents(data); // Initialize with all students
        } catch (error) {
          setError('Error fetching student data');
          console.error('Error fetching students:', error);
        }
      };
  
      fetchStudents();
    }, []);
  
    useEffect(() => {
      if (searchQuery.trim() === '') {
        setFilteredStudents([]); // Clear filtered students if no search query
      } else {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = students.filter(student =>
          student.name.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredStudents(filtered);
      }
      setCurrentPage(1); // Reset pagination to page 1
    }, [searchQuery, students]);
  
    // Calculate paginated students
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
  
    return (
      <div className="main-content p-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
  
        <div className="mb-4 flex items-center">
          <Input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2"
          />
          <Button onClick={() => setSearchQuery('')}>Clear</Button>
        </div>
  
        {searchQuery && filteredStudents.length > 0 ? (
          <div className="overflow-hidden rounded-md border flex flex-col h-full">
            <ScrollArea className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] sticky top-0 bg-background">S_Code</TableHead>
                    <TableHead className="sticky top-0 bg-background">Name</TableHead>
                    <TableHead className="sticky top-0 bg-background">Class</TableHead>
                    <TableHead className="sticky top-0 bg-background">Date of Birth</TableHead>
                    <TableHead className="sticky top-0 bg-background">Contact Number</TableHead>
                    <TableHead className="sticky top-0 bg-background">Course</TableHead>
                    <TableHead className="sticky top-0 bg-background">Level</TableHead>
                    <TableHead className="sticky top-0 bg-background">Status</TableHead>
                    <TableHead className="sticky top-0 bg-background">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">{student.student_code}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.student_class}</TableCell>
                      <TableCell>{new Date(student.dob).toLocaleDateString()}</TableCell>
                      <TableCell>{student.contact_number}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>
                        <select
                          value={student.level}
                          onChange={(e) => console.log(`Changed level for ${student._id}: ${e.target.value}`)}
                          className="w-full p-2 border rounded"
                        >
                          {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <select
                          value={student.status}
                          onChange={(e) => console.log(`Changed status for ${student._id}: ${e.target.value}`)}
                          className="w-full p-2 border rounded"
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline">Add</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ) : searchQuery && filteredStudents.length === 0 ? (
          <p>No students found matching the search.</p>
        ) : (
          <p>Please enter a search query to display students.</p>
        )}
      </div>
    );
  }
  
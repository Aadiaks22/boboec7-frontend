import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useMutation } from '@tanstack/react-query';
import { fetchStudents } from '@/http/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from 'lucide-react';

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

const ITEMS_PER_PAGE = 10;

export default function StudentManagement({ onAddStudent }: { onAddStudent: (studentId: string) => void }) {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [studentAdded, setStudentAdded] = useState(false); // Track if a student is added

    const mutation = useMutation({
        mutationFn: fetchStudents,
        onSuccess: (data) => {
            setStudents(data);
            setFilteredStudents(data); // Initialize with all students
        },
        onError: (error) => {
            setError('Error fetching student data');
            console.error('Error fetching students:', error);
        },
    });

    // Trigger the mutation only once when the component mounts
    useEffect(() => {
        mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to ensure the mutation only runs once on mount

    // Update filtered students when searchQuery or students change
    useEffect(() => {
        if (!students.length) return; // Don't filter until data is fetched

        setStudentAdded(false); // Reset studentAdded when search query changes

        if (searchQuery.trim() === '') {
            setFilteredStudents(students); // Reset to all students when the search query is cleared
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

    // Handle "Add" button click
    const handleAddClick = (studentId: string) => {
        // Ensure studentId is valid before calling onAddStudent
        if (studentId) {
            onAddStudent(studentId);
            setSearchQuery(''); // Clear search query
            setStudentAdded(true); // Set studentAdded to true to hide the table
        }
    };

    return (
        <div className="main-content p-4">
            {error && <Alert variant="destructive" className="mb-4">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>}

            <div className="mb-4 flex items-center">
                <Input
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mr-2"
                />
                <Button onClick={() => setSearchQuery('')} className='bg-[#02a0a0]'>Clear</Button>
            </div>

            {!studentAdded && searchQuery && filteredStudents.length > 0 && (
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
                                        <TableCell>{student.level}</TableCell>
                                        <TableCell>{student.status}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" onClick={() => handleAddClick(student._id)}>Add</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            )}
            {/* Show message after student is added */}
            {studentAdded && (
                <Alert variant="default" className="mb-4 bg-green-100 text-green-800 border-green-300">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Student has been added successfully. You can now proceed to the fee collection.</AlertDescription>
              </Alert>
            )}

            {/* Show no students found message when search query doesn't match */}
            {!studentAdded && searchQuery && filteredStudents.length === 0 && (
                <p>No students found matching the search.</p>
            )}

            {/* Prompt to enter search query when search bar is empty */}
            {!studentAdded && !searchQuery && (
                <p>Please enter a search query to display students.</p>
            )}
        </div>
    );
}

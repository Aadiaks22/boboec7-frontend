import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from "react";
import AllStudent from "./AllStudent";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface Credentials {
  name: string;
  student_class: string;
  dob: string;
  school_name: string;
  mother_name: string;
  father_name: string;
  contact_number: string;
  secondary_contact_number: string;
  email: string;
  address: string;
  city: string;
  course: string;
  level: string;
  status: string;
  role: string;
}

export default function RegisterStudent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credentials>({
    name: "",
    student_class: "",
    dob: "",
    school_name: "",
    mother_name: "",
    father_name: "",
    contact_number: "",
    secondary_contact_number: "",
    email: "",
    address: "",
    city: "",
    course: "",
    level: "",
    status: "",
    role: "",
  });

  const handleOpenModal = (id: string) => {
    console.log('Modal trigger');
    setId(id);
    setIsModalOpen(true);
  };

  const fetchStudent = useCallback(async () => {
    if (!id) return;

    try {
      const response = await fetch(`${BASE_URL}/api/admin/user/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch student details");
      }
      const data = await response.json();
      if (data.dob) {
        const dob = new Date(data.dob);
        data.dob = dob.toISOString().split('T')[0];
      }
      console.log(data);
      setCredentials(data);
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No auth token found');
        return;
      }
  
      const response = await fetch(`${BASE_URL}/api/admin/updateuser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const json = await response.json();
  
      if (json.success) {
        console.log('Update Successful');
        setCredentials({
          name: "",
          student_class: "",
          dob: "",
          school_name: "",
          mother_name: "",
          father_name: "",
          contact_number: "",
          secondary_contact_number: "",
          email: "",
          address: "",
          city: "",
          course: "",
          level: "",
          status: "",
          role: "",
        });
        navigate(`/dashboard/register-student`);
        setIsModalOpen(false);
        
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Trigger')
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AllStudent openModal={handleOpenModal} />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="flex justify-between px-6 py-4 sticky top-0 bg-background z-10">
            <DialogTitle className="text-lg font-semibold">Edit Student<Button
        variant="ghost"
        size="icon"
        onClick={() => setIsModalOpen(false)}
        aria-label="Close dialog"
        className="justify-right border p-1 h-auto"
        style={{marginLeft: 700}}
      >
        <X className="h-5 w-5" />
      </Button></DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-8rem)] px-6">
            <div className="py-4">
              <h2 className="text-2xl mb-4">Update Student</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Full Name" required value={credentials.name} onChange={onChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student_class">Class</Label>
                    <Input id="student_class" name="student_class" placeholder="Current Class" required value={credentials.student_class} onChange={onChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" name="dob" type="date" required value={credentials.dob} onChange={onChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school_name">School Name</Label>
                    <Input id="school_name" name="school_name" placeholder="School Name" required value={credentials.school_name} onChange={onChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mother_name">Mother's Name</Label>
                    <Input id="mother_name" name="mother_name" placeholder="Mother's Name" required value={credentials.mother_name} onChange={onChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="father_name">Father's Name</Label>
                    <Input id="father_name" name="father_name" placeholder="Father's Name" required value={credentials.father_name} onChange={onChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input id="contact_number" name="contact_number" type="tel" placeholder="Primary Contact Number" required value={credentials.contact_number} onChange={onChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_contact_number">Secondary Contact Number</Label>
                    <Input id="secondary_contact_number" name="secondary_contact_number" type="tel" placeholder="Secondary Contact Number" value={credentials.secondary_contact_number} onChange={onChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="Email Address" value={credentials.email} onChange={onChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" placeholder="City" required value={credentials.city} onChange={onChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" placeholder="Full Address" required value={credentials.address} onChange={onChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select value={credentials.course} onValueChange={(value) => setCredentials({ ...credentials, course: value })}>
                      <SelectTrigger id="course">
                        <SelectValue placeholder="Select Course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRAINOBRAIN">BRAINOBRAIN</SelectItem>
                        <SelectItem value="MENTAL MATH">MENTAL MATH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select value={credentials.level} onValueChange={(value) => setCredentials({ ...credentials, level: value })}>
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                          <SelectItem key={level} value={level.toString()}>Level {level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={credentials.status} onValueChange={(value) => setCredentials({ ...credentials, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Dropped">Dropped</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full">Update Student</Button>
              </form>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
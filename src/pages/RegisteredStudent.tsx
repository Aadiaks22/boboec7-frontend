import { useState, useRef, useEffect, useCallback } from "react";
import AllStudent from "./AllStudent";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);
  const [id, setId] = useState<string | null>(null); // Assuming you are getting 'id' from somewhere

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

  const handleOpenPopover = (id: string) => {
    console.log('Popover trigger');
    setId(id);
    setIsPopoverOpen(true);
  };

  const fetchStudent = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/user/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch student details");
      }
      const data = await response.json();
      // Format the dob to YYYY-MM-DD (remove the time part)
      if (data.dob) {
        const dob = new Date(data.dob);
        data.dob = dob.toISOString().split('T')[0]; // Extract only the date part
      }
      console.log(data);
      setCredentials(data); // Assuming fetched data structure matches `Credentials`
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
          'Content-Type': 'application/json',  // Include this for JSON body
          'auth-token': token,  // Ensure you have the auth token here
        },
        body: JSON.stringify(credentials),  // Ensure credentials is structured properly
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const json = await response.json();
  
      if (json.success) {
        console.log('Update Successful');
        
        // Reset credentials if the update was successful
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
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Trigger')
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AllStudent openPopover={handleOpenPopover} />
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button ref={popoverTriggerRef} className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-[90vw] max-w-3xl max-h-[90vh] overflow-auto p-10" style={{ left: '350px', top: '50px', transform: 'none', position: 'fixed' }}>
          <div className="bg-white">
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
                      <SelectItem value="1">Level 1</SelectItem>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3</SelectItem>
                      <SelectItem value="4">Level 4</SelectItem>
                      <SelectItem value="5">Level 5</SelectItem>
                      <SelectItem value="6">Level 6</SelectItem>
                      <SelectItem value="7">Level 7</SelectItem>
                      <SelectItem value="8">Level 8</SelectItem>
                      <SelectItem value="9">Level 9</SelectItem>
                      <SelectItem value="10">Level 10</SelectItem>
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
        </PopoverContent>
      </Popover>
    </>
  );
} 
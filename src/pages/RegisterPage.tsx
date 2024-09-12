import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function StudentRegistrationForm() {
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Include token if it exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/auth/createuser`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();

      if (json.success) {
        // Decode the JWT token to get user ID
        const { user } = jwtDecode<{ user: { id: string } }>(json.authToken);
        console.log("Student ID:", user.id);

        if (user.id) {
          navigate(`/dashboard/fee-collection/${user.id}`);
        } else {
          console.error("User ID is undefined");
        }
      } else {
        console.error("Invalid registration");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>Please fill out all the required information to register a new student.</CardDescription>
        </CardHeader>
        <CardContent>
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
                <Select onValueChange={(value) => setCredentials({ ...credentials, course: value })}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">BOB</SelectItem>
                    <SelectItem value="science">Mental Math</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select onValueChange={(value) => setCredentials({ ...credentials, level: value })}>
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
                <Select onValueChange={(value) => setCredentials({ ...credentials, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setCredentials({ ...credentials, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">Register Student</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

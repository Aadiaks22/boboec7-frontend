import { useState, FormEvent, ChangeEvent} from "react";
import AllStudent from "./AllStudent";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { fetchStudent, updateStudentData } from "@/http/api";

// Define the Credentials interface
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
}

const RegisterStudent = () => {
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
  });


  const navigate = useNavigate();

  // Fetch student mutation
  const mutation = useMutation({
    mutationFn: fetchStudent,
    onSuccess: (data) => {
      if (data) {
        setCredentials({
          name: data.name,
          student_class: data.student_class,
          dob: data.dob,
          school_name: data.school_name,
          mother_name: data.mother_name,
          father_name: data.father_name,
          contact_number: data.contact_number,
          secondary_contact_number: data.secondary_contact_number,
          email: data.email,
          address: data.address,
          city: data.city,
          course: data.course,
          level: data.level,
          status: data.status,
        });
      }
    },
    onError: (error) => {
      console.error("Error fetching student:", error);
    },
  });


  const handleOpenModal = async (id: string) => {
    if (!id) {
      return alert("Error Data Not Found");
    }
    setId(id);
    mutation.mutate(id, {
      onSuccess: () => {
        setIsModalOpen(true);  // Open the modal after data is fetched
      }
    });
  };
  

  // Update student mutation
  const updateMutation = useMutation({
    mutationFn: updateStudentData,
    onSuccess: () => {
      setIsModalOpen(false);
      navigate(`/dashboard/register-student`);
    },
    onError: (error) => {
      console.error("An error occurred:", error);
    },
  });


  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      updateMutation.mutate({ id: id, updateData: credentials }); // Pass the right types
    }
  };


  // Handle input changes
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle select value changes
  const onSelectChange = (e: string, field: string) => {
    setCredentials({ ...credentials, [field]: e });
  };


  return (
    <>
      <AllStudent openModal={handleOpenModal} />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby="dialog-description" className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="flex justify-between px-6 py-4 sticky top-0 bg-background z-10">
            <DialogTitle className="text-lg font-semibold">
              Edit Student
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
                className="justify-right border p-1 h-auto"
                style={{ marginLeft: 700 }}
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-8rem)] px-6">
            <div className="py-4">
              <h2 className="text-2xl mb-4">Update Student</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Full Name"
                      required
                      value={credentials.name}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student_class">Class</Label>
                    <Input
                      id="student_class"
                      name="student_class"
                      placeholder="Current Class"
                      required
                      value={credentials.student_class}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      required
                      value={credentials.dob}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school_name">School Name</Label>
                    <Input
                      id="school_name"
                      name="school_name"
                      placeholder="School Name"
                      value={credentials.school_name}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mother_name">Mother's Name</Label>
                    <Input
                      id="mother_name"
                      name="mother_name"
                      placeholder="Mother's Name"
                      value={credentials.mother_name}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="father_name">Father's Name</Label>
                    <Input
                      id="father_name"
                      name="father_name"
                      placeholder="Father's Name"
                      value={credentials.father_name}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input
                      id="contact_number"
                      name="contact_number"
                      placeholder="Contact Number"
                      required
                      value={credentials.contact_number}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_contact_number">Secondary Contact</Label>
                    <Input
                      id="secondary_contact_number"
                      name="secondary_contact_number"
                      placeholder="Secondary Contact"
                      value={credentials.secondary_contact_number}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={credentials.email}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Address"
                      value={credentials.address}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="City"
                      value={credentials.city}
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select
                      value={credentials.course}
                      onValueChange={(value) => onSelectChange(value, "course")}
                    >
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
                    <Select
                      value={credentials.level}
                      onValueChange={(value) => onSelectChange(value, "level")}
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={`${i + 1}`}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={credentials.status}
                      onValueChange={(value) => onSelectChange(value, "status")}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Dropped">Dropped</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="mt-4">
                  Update Student
                </Button>
              </form>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterStudent;

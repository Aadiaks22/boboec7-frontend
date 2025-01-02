import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate } from "react-router-dom"
import { GraduationCapIcon, UserIcon } from "lucide-react"
import { useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { createuser } from "@/http/api"
import { Input } from "@/components/ui/input"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

const StudentRegistrationForm = () => {
  const navigate = useNavigate()

  const [course, setCourse] = useState<string | undefined>(undefined)

  // References for inputs
  const nameRef = useRef<HTMLInputElement>(null)
  const student_classRef = useRef<HTMLInputElement>(null)
  const dobRef = useRef<HTMLInputElement>(null)
  const school_nameRef = useRef<HTMLInputElement>(null)
  const mother_nameRef = useRef<HTMLInputElement>(null)
  const father_nameRef = useRef<HTMLInputElement>(null)
  const contact_numberRef = useRef<HTMLInputElement>(null)
  const secondary_contact_numberRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLTextAreaElement>(null)
  const cityRef = useRef<HTMLInputElement>(null)

  // Mutation for creating user
  const mutation = useMutation({
    mutationFn: createuser,
    onSuccess: (data) => {
      console.log("User created successfully")
      const { user } = jwtDecode<{ user: { id: string } }>(data.authToken)
      console.log("Student ID:", user.id)
      if (user.id) {
        navigate(`/dashboard/fee-collection/${user.id}`)
      } else {
        console.error("User ID is undefined")
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.error || "An error occurred";
        alert(errorMessage); // Display the error message to the user
      } else {
        console.error("An unknown error occurred:", error);
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const name = nameRef.current?.value
    const student_class = student_classRef.current?.value
    const dob = dobRef.current?.value
    const school_name = school_nameRef.current?.value
    const mother_name = mother_nameRef.current?.value
    const father_name = father_nameRef.current?.value
    const contact_number = contact_numberRef.current?.value
    const secondary_contact_number = secondary_contact_numberRef.current?.value
    const email = emailRef.current?.value
    const address = addressRef.current?.value
    const city = cityRef.current?.value

    if (!name || !student_class || !dob || !school_name || !mother_name || !father_name || !contact_number || !secondary_contact_number || !email || !address || !city || !course) {
      return alert("Please complete all fields")
    }

    // Execute mutation
    mutation.mutate({
      name,
      student_class,
      dob,
      school_name,
      mother_name,
      father_name,
      contact_number,
      secondary_contact_number,
      email,
      address,
      city,
      course,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8 bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center bg-blend-overlay">
      <Card className="w-full max-w-4xl mx-auto mt-4 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-purple-700 flex items-center justify-center">
            <GraduationCapIcon className="w-6 sm:w-8 h-6 sm:h-8 mr-2" />
            Student Registration
          </CardTitle>
          <CardDescription className="text-sm sm:text-lg text-gray-600">
            Embark on a journey of knowledge and growth. Fill out the form below to register a new student.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-700">Full Name</Label>
                <Input ref={nameRef} id="name" name="name" placeholder="John Doe" required className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_class" className="text-purple-700">Class</Label>
                <Input ref={student_classRef} id="student_class" name="student_class" placeholder="10th Grade" required className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-purple-700">Date of Birth</Label>
                <Input ref={dobRef} id="dob" name="dob" type="date" required className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school_name" className="text-purple-700">School Name</Label>
                <Input ref={school_nameRef} id="school_name" name="school_name" placeholder="Sunshine High School" required className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_name" className="text-purple-700">Mother's Name</Label>
                <Input ref={mother_nameRef} id="mother_name" name="mother_name" placeholder="Jane Doe" required className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_name" className="text-purple-700">Father's Name</Label>
                <Input ref={father_nameRef} id="father_name" name="father_name" placeholder="John Doe Sr." required className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number" className="text-purple-700">Primary Contact</Label>
                <Input ref={contact_numberRef} id="contact_number" name="contact_number" type="tel" placeholder="+1 (555) 123-4567" required className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_contact_number" className="text-purple-700">Secondary Contact</Label>
                <Input ref={secondary_contact_numberRef} id="secondary_contact_number" name="secondary_contact_number" type="tel" placeholder="+1 (555) 987-6543" className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-700">Email Address</Label>
                <Input ref={emailRef} id="email" name="email" type="email" placeholder="john.doe@example.com" className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-purple-700">City</Label>
                <Input ref={cityRef} id="city" name="city" placeholder="New York" required className="border-purple-300 focus:border-purple-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-purple-700">Full Address</Label>
              <Textarea ref={addressRef} id="address" name="address" placeholder="123 Main St, Apt 4B, New York, NY 10001" required className="border-purple-300 focus:border-purple-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course" className="text-purple-700">Course</Label>
                <Select onValueChange={(value) => setCourse(value)}>
                  <SelectTrigger id="course" className="border-purple-300 focus:border-purple-500">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRAINOBRAIN">BRAINOBRAIN</SelectItem>
                    <SelectItem value="MENTAL MATH">MENTAL MATH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
              <UserIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Register Student
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>

  )
}

export default StudentRegistrationForm

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GraduationCapIcon, UserIcon } from "lucide-react"

const BASE_URL = import.meta.env.VITE_BASE_URL

interface Credentials {
  name: string
  student_class: string
  dob: string
  school_name: string
  mother_name: string
  father_name: string
  contact_number: string
  secondary_contact_number: string
  email: string
  address: string
  city: string
  course: string
  level: string
  status: string
  role: string
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
  })
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`${BASE_URL}/api/auth/createuser`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const json = await response.json()

      if (json.success) {
        const { user } = jwtDecode<{ user: { id: string } }>(json.authToken)
        console.log("Student ID:", user.id)

        if (user.id) {
          navigate(`/dashboard/fee-collection/${user.id}`)
        } else {
          console.error("User ID is undefined")
        }
      } else {
        console.error("Invalid registration")
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8 bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center bg-blend-overlay">
      <Card className="w-full max-w-4xl mx-auto mt-4 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-700 flex items-center justify-center">
            <GraduationCapIcon className="w-8 h-8 mr-2" />
            Student Registration
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Embark on a journey of knowledge and growth. Fill out the form below to register a new student.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-700">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required value={credentials.name} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_class" className="text-purple-700">Class</Label>
                <Input id="student_class" name="student_class" placeholder="10th Grade" required value={credentials.student_class} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-purple-700">Date of Birth</Label>
                <Input id="dob" name="dob" type="date" required value={credentials.dob} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school_name" className="text-purple-700">School Name</Label>
                <Input id="school_name" name="school_name" placeholder="Sunshine High School" required value={credentials.school_name} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_name" className="text-purple-700">Mother's Name</Label>
                <Input id="mother_name" name="mother_name" placeholder="Jane Doe" required value={credentials.mother_name} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_name" className="text-purple-700">Father's Name</Label>
                <Input id="father_name" name="father_name" placeholder="John Doe Sr." required value={credentials.father_name} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number" className="text-purple-700">Primary Contact</Label>
                <Input id="contact_number" name="contact_number" type="tel" placeholder="+1 (555) 123-4567" required value={credentials.contact_number} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_contact_number" className="text-purple-700">Secondary Contact</Label>
                <Input id="secondary_contact_number" name="secondary_contact_number" type="tel" placeholder="+1 (555) 987-6543" value={credentials.secondary_contact_number} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-700">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="john.doe@example.com" value={credentials.email} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-purple-700">City</Label>
                <Input id="city" name="city" placeholder="New York" required value={credentials.city} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-purple-700">Full Address</Label>
              <Textarea id="address" name="address" placeholder="123 Main St, Apt 4B, New York, NY 10001" required value={credentials.address} onChange={onChange} className="border-purple-300 focus:border-purple-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course" className="text-purple-700">Course</Label>
                <Select onValueChange={(value) => setCredentials({ ...credentials, course: value })}>
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
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
              <UserIcon className="w-5 h-5 mr-2" />
              Register Student
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          By registering, you agree to our{" "}
          <a href="#" className="text-purple-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-purple-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
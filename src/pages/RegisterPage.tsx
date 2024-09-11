import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function StudentRegistrationForm() {
  return (
    <div className="mt-8 sm:mt-12 md:mt-16 mb-8 sm:mb-12 md:mb-16"> {/* Added top margin here */}
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>Please fill out all the required information to register a new student.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Full Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Input id="class" placeholder="Current Class" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School Name</Label>
                <Input id="school" placeholder="School Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother">Mother's Name</Label>
                <Input id="mother" placeholder="Mother's Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father">Father's Name</Label>
                <Input id="father" placeholder="Father's Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input id="contact" type="tel" placeholder="Primary Contact Number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-contact">Secondary Contact Number</Label>
                <Input id="secondary-contact" type="tel" placeholder="Secondary Contact Number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email Address"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Full Address" required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select>
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
                <Select>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Level 1</SelectItem>
                    <SelectItem value="intermediate">Level 2</SelectItem>
                    <SelectItem value="advanced">Level 3</SelectItem>
                    <SelectItem value="beginner">Level 4</SelectItem>
                    <SelectItem value="intermediate">Level 5</SelectItem>
                    <SelectItem value="advanced">Level 6</SelectItem>
                    <SelectItem value="beginner">Level 7</SelectItem>
                    <SelectItem value="intermediate">Level 8</SelectItem>
                    <SelectItem value="advanced">Level 9</SelectItem>
                    <SelectItem value="advanced">Level 10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="pending">Dropped</SelectItem>
                    <SelectItem value="pending">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">User</SelectItem>
                    <SelectItem value="teacher-assistant">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button type="submit" className="w-full">Register Student</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
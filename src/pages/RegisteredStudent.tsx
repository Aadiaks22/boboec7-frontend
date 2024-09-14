import { useState, useRef } from "react";
import UpdateStudent from "./AllStudent";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterStudent() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);

  const handleOpenPopover = () => {
    setIsPopoverOpen(true);
    if (popoverTriggerRef.current) {
      popoverTriggerRef.current.click();
    }
  };

  return (
    <>
      <UpdateStudent openPopover={handleOpenPopover} />
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button ref={popoverTriggerRef} className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-[90vw] max-w-3xl max-h-[90vh] overflow-auto p-10" style={{left: '350px', top: '50px', transform: 'none', position: 'fixed'}}>
          <div className="bg-white">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Full Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student_class">Class</Label>
                  <Input id="student_class" name="student_class" placeholder="Current Class" required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" name="dob" type="date" required  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school_name">School Name</Label>
                  <Input id="school_name" name="school_name" placeholder="School Name" required  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mother_name">Mother's Name</Label>
                  <Input id="mother_name" name="mother_name" placeholder="Mother's Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father_name">Father's Name</Label>
                  <Input id="father_name" name="father_name" placeholder="Father's Name" required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input id="contact_number" name="contact_number" type="tel" placeholder="Primary Contact Number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary_contact_number">Secondary Contact Number</Label>
                  <Input id="secondary_contact_number" name="secondary_contact_number" type="tel" placeholder="Secondary Contact Number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Email Address"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" placeholder="City" required  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" placeholder="Full Address" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select>
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
              </div>
              <Button type="submit" className="w-full">Register Student</Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
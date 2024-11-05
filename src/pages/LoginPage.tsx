import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/http/api";
import { LoaderCircle } from "lucide-react";

const LoginPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const phoneRef = useRef<HTMLInputElement>(null);
  const dobYearRef = useRef<HTMLInputElement>(null);

  // Mutations
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login successful");
      localStorage.setItem("token", data.authToken);
      localStorage.setItem("username", data.username);
      navigate("/dashboard"); // Uncomment if you want navigation
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form from reloading the page

    const contact_number = phoneRef.current?.value;
    const password = dobYearRef.current?.value;

    if (!contact_number || !password) {
      return alert("Please enter Contact Number and Year of Birth");
    }
    mutation.mutate({ contact_number, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-orange-300">
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-shrink-0 transform transition-all duration-500 ease-in-out hover:scale-105 lg:w-1/2">
              <img
                src="/images/bob-intro1.jpg"
                alt="BOB"
                className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              />
            </div>
            <div className="flex-grow lg:w-1/2">
              <div className="flex flex-col items-center lg:items-start gap-4 mb-6">
                <img
                  src="/images/brainobrain-logo.png"
                  alt="Brainobrain Logo"
                  className="h-16 w-16 hover:scale-110 transition-transform duration-300"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    transform: isHovered ? "rotate(360deg)" : "rotate(0deg)",
                    transition: "transform 0.5s ease-in-out",
                  }}
                />
                <h1 className="text-3xl sm:text-4xl font-bold text-orange-800 tracking-tight text-center lg:text-left">
                  Welcome to{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-500">
                    BRAINOBRAIN-OEC7
                  </span>
                </h1>
                <p className="text-orange-700 text-center lg:text-left max-w-md">
                  Unlock your potential with our innovative learning techniques and expert guidance.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto lg:mx-0">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-orange-700">
                    Phone Number
                  </Label>
                  <Input
                    ref={phoneRef}
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                    className="bg-orange-50 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dobYear" className="text-orange-700">
                    Year of Birth
                  </Label>
                  <Input
                    ref={dobYearRef}
                    id="dobYear"
                    type="password"
                    placeholder="Enter your year of birth"
                    required
                    className="bg-orange-50 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {mutation.isPending && <LoaderCircle className="animate-spin" />}
                  <span className="ml-2">Login</span>
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

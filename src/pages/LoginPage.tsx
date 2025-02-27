import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/http/api";
import { LoaderCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from 'lucide-react';
import { LoginResponse } from "@/types/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const phoneRef = useRef<HTMLInputElement>(null);
  const dobYearRef = useRef<HTMLInputElement>(null);

  const [activeForm, setActiveForm] = useState<"admin" | "user">("user");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleFormSwitch = (form: "admin" | "user") => {
    setActiveForm(form);
    setError(null);
    setSuccess(null);
  };

  const mutation = useMutation<LoginResponse, Error, { contact_number: string; password: string; role: string }>({
    mutationFn: login,
    onSuccess: (data) => {
      setSuccess("Login successful. Redirecting...");
      const options = {
        //httpOnly: true, 
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
        secure: true,
        sameSite: 'strict' as const
      };
      Cookies.set('token', data.authToken, options);
      // Cookies.set('username', data.username, options);
      // Cookies.set('role', data.role, options);
      
      // Use navigate directly instead of setTimeout
      navigate("/dashboard", { replace: true });
    },
    onError: (error: Error) => {
      setError(error.message || "An unexpected error occurred. Please try again.");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const contact_number = phoneRef.current?.value;
    const password = dobYearRef.current?.value;
    const role = activeForm;

    if (!contact_number || !password) {
      setError("Please enter both Contact Number and Year of Birth.");
      setIsLoading(false);
      return;
    }

    mutation.mutate({ contact_number, password, role });
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
              <div className="flex justify-center mb-4 space-x-4">
                <Button
                  onClick={() => handleFormSwitch("admin")}
                  variant={activeForm === "admin" ? "default" : "outline"}
                  className="w-1/2"
                >
                  Administration
                </Button>
                <Button
                  onClick={() => handleFormSwitch("user")}
                  variant={activeForm === "user" ? "default" : "outline"}
                  className="w-1/2"
                >
                  Kid's Practice Portal
                </Button>
              </div>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert variant="default" className="mb-4 bg-green-100 text-green-800 border-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto lg:mx-0">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-orange-700">
                    {activeForm === "admin" ? "Username" : "Mobile Number"}
                  </Label>
                  <Input
                    ref={phoneRef}
                    id="phone"
                    type="tel"
                    placeholder={`Enter your ${activeForm === "admin" ? "username" : "mobile number"}`}
                    required
                    className="bg-orange-50 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dobYear" className="text-orange-700">
                    {activeForm === "admin" ? "Password" : "Year of Birth"}
                  </Label>
                  <Input
                    ref={dobYearRef}
                    id="dobYear"
                    type="password"
                    placeholder={`Enter your ${activeForm === "admin" ? "password" : "year of birth"}`}
                    required
                    className="bg-orange-50 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  <span>
                    {activeForm === "admin" ? "Login as Administrator" : "Login to Kid's Practice Portal"}
                  </span>
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


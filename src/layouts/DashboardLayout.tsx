import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrums";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import {
  Home,
  Menu,
  CircleUser,
  ChevronLeft,
  ChevronRight,
  School,
  GraduationCap,
  CreditCard,
  User,
  FileText,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import '../pages/FeeCollection.css';
import Cookies from "js-cookie";


const HomePage = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate("/auth/login");
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr] bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`hidden border-r bg-[#343a40] dark:bg-gray-800 md:block print:hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-[60px]' : 'w-[220px] lg:w-[230px]'}`}>
        <div className="fixed flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 w-[228px] items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-[#ef8600] dark:text-blue-400">
            <img
                src="/images/favicon.png"
                alt="BOB"
                style={{height: 30, width: 30}}

              />
              {!isSidebarCollapsed && <span>BOBOEC7</span>}
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                to="/dashboard/kids-dictation"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Home className="h-4 w-4" />
                {!isSidebarCollapsed && "Kid's Dictation"}
              </Link>
              <Link
                to="/dashboard/register"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <GraduationCap className="h-4 w-4" />
                {!isSidebarCollapsed && "Student Registration"}
              </Link>
              <Link
                to="/dashboard/fee-collection"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <CreditCard className="h-4 w-4" />
                {!isSidebarCollapsed && "Fee Collection"}
              </Link>
              <Link
                to="/dashboard/register-student"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <User className="h-4 w-4" />
                {!isSidebarCollapsed && "Register Students"}
              </Link>
              <Link
                to="/dashboard/feeinvoice"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <FileText className="h-4 w-4" />
                {!isSidebarCollapsed && "Fee Invoice"}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <div className="">
          <header className={`fixed left-0 right-0 sm:w-full transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-[60px]' : 'lg:ml-[230px]'} 
          ${isSidebarCollapsed ? 'lg:w-[calc(100%-(60px))]' : 'lg:w-[calc(100%-(230px))]'} 
          ${isSidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[220px]'} 
          ${isSidebarCollapsed ? 'md:w-[calc(100%-(60px))]' : 'md:w-[calc(100%-(230px))]'} 
          z-10 flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-800 px-4 lg:h-[60px] lg:px-6 print:hidden`}>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col bg-white dark:bg-gray-800">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-blue-600 dark:text-blue-400">
                    <School className="h-6 w-6" />
                    <span>BOBOEC7</span>
                  </Link>
                  <Link to="/dashboard/kids-dictation" className="flex items-center gap-4 rounded-xl px-3 py-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    <Home className="h-5 w-5" />
                    Home
                  </Link>
                  <Link to="/dashboard/register" className="flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    <GraduationCap className="h-5 w-5" />
                    Student Registration
                  </Link>
                  <Link to="/dashboard/fee-collection" className="flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    <CreditCard className="h-5 w-5" />
                    Fee Collection
                  </Link>
                  <Link to="/dashboard/register-student" className="flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    <User className="h-5 w-5" />
                    Register Students
                  </Link>
                  <Link to="/dashboard/feeinvoice" className="flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    <FileText className="h-5 w-5" />
                    Fee Invoice
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex"
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>

            <div className="w-full flex-1">
              <Breadcrumbs />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full text-[#593f6c]">
                  <CircleUser className="h-5 w-5 text-[#593f6c]" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Button variant="ghost" onClick={handleLogout}>Logout</Button></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
        </div>
        <div>
          <main className={`flex flex-1 flex-col mt-10 gap-4 p-4 lg:gap-6 lg:p-6 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[0px] lg:ml-[0px]'}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
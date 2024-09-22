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
  Package2,
  Home,
  ShoppingCart,
  Menu,
  CircleUser,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import '../pages/FeeCollection.css'

const HomePage = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate("/auth/login");
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]">
      {/* Sidebar */}
      <div className={`hidden border-r bg-muted/40 md:block print:hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-[60px]' : 'w-[220px] lg:w-[230px]'}`}>
        <div className="fixed flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              {!isSidebarCollapsed && <span>BOBOEC7</span>}
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                to="/dashboard/home"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                {!isSidebarCollapsed && "Home"}
              </Link>
              <Link
                to="/dashboard/register"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                {!isSidebarCollapsed && "Student Registration"}
              </Link>
              <Link
                to="/dashboard/fee-collection"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                {!isSidebarCollapsed && "Fee Collection"}
              </Link>
              <Link
                to="/dashboard/register-student"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                {!isSidebarCollapsed && "Register Students"}
              </Link>
              <Link
                to="/dashboard/feeinvoice"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                {!isSidebarCollapsed && "Fee Invoice"}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <div className="">
          <header className={`fixed left-0 right-0 sm:w-full lg:left-[${isSidebarCollapsed ? '60px' : '230px'}] lg:w-[calc(100%-${isSidebarCollapsed ? '60px' : '230px'})] z-10 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 print:hidden`}>
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
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                    <Package2 className="h-6 w-6" />
                    <span>BOBOEC7</span>
                  </Link>
                  <Link to="/dashboard/home" className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                    <Home className="h-5 w-5" />
                    Home
                  </Link>
                  <Link to="/dashboard/register" className="flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                    <ShoppingCart className="h-5 w-5" />
                    Student Registration
                  </Link>
                  <Link to="/dashboard/fee-collection" className="flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                    <ShoppingCart className="h-5 w-5" />
                    Fee Collection
                  </Link>
                  <Link to="/dashboard/register-student" className="flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                    <ShoppingCart className="h-5 w-5" />
                    Register Students
                  </Link>
                  <Link to="/dashboard/feeinvoice" className="flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                    <ShoppingCart className="h-5 w-5" />
                    Fee Invoice
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className={`hidden md:flex ${isSidebarCollapsed ? 'ml-[50px]' : 'ml-[0px]'} ${!isSidebarCollapsed ? 'md:ml-[230px] lg:ml-[0px]': ''} `}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>

            <div className="w-full flex-1">
              <Breadcrumbs />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
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
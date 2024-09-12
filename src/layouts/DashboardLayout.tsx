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
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";


const HomePage = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate("/auth/login");
  }
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>BOBOEC7</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                to="/dashboard/home"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/dashboard/register"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Student Registration
              </Link>
              <Link
                to="/dashboard/fee-collection"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Fee Collection
              </Link>
              <Link
                to="/dashboard/register-student"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Register Students
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
              </nav>
            </SheetContent>
          </Sheet>

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

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/store/authStore";
import { CgMenuLeft } from "react-icons/cg";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }: any) => {
  const { user, removeAuth } = useAuthStore((state: any) => ({
    user: state.user,
    removeAuth: state.removeAuth,
  }));

  return (
    <div className="navbar border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center">
          <button
            className="sidebar-toggle"
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
            }}
          >
            <CgMenuLeft className="text-3xl" />
          </button>

          <nav className="flex items-center space-x-4 lg:space-x-6 ml-6">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                [
                  isActive
                    ? "text-sm font-medium transition-colors hover:text-primary"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                ].join(" ")
              }
            >
              Admin
            </NavLink>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                [
                  isActive
                    ? "text-sm font-medium transition-colors hover:text-primary"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                ].join(" ")
              }
            >
              Home
            </NavLink>
          </nav>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`${import.meta.env.VITE_STORAGE_URL}/${
                      import.meta.env.VITE_STORAGE_FOLDER
                    }/uploads/${user.avatar}`}
                    alt={user.username}
                  />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Jimwel Marius Dizon
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to="/home/settings">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => {
                    removeAuth();
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

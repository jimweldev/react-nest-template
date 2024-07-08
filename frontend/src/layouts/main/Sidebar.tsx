import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaGaugeHigh, FaUsers } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ isSidebarOpen }: any) => {
  const { pathname } = useLocation();

  return (
    <ScrollArea
      className={`sidebar ${isSidebarOpen ? "" : "collapsed"} border-r`}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Home
          </h2>

          <div className="space-y-1">
            <Button
              variant={pathname === "/home" ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <NavLink className="sidebar-item" to={`/home`}>
                <FaGaugeHigh className="text-lg mr-2" />
                Dashboard
              </NavLink>
            </Button>
            <Button
              variant={pathname === "/clients" ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <NavLink className="sidebar-item" to={`/clients`}>
                <FaUsers className="text-lg mr-2" />
                Users
              </NavLink>
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Sidebar;

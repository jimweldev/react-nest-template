import { ScrollArea } from "@/components/ui/scroll-area";
import { Outlet } from "react-router-dom";
import Navbar from "../private/Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

import "@/styles/Layout.css";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="wrapper">
      {/* sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <ScrollArea className="main" color="bg-gray-400">
        {/* navbar */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* main */}
        <main className="@container/main content p-8 space-y-4">
          <Outlet />
        </main>
      </ScrollArea>
    </div>
  );
};

export default AdminLayout;

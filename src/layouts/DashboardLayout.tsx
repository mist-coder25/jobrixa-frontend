import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-primary text-textPrimary">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-60 pb-16 md:pb-0 h-full overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto relative h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

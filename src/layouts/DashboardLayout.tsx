import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-main)] text-white font-inter">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
        <main className="flex-1 flex flex-col h-full bg-[var(--bg-card)]/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

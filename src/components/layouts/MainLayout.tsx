import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Sidebar";

export function MainLayout() {
  return (
    <div className="flex h-screen">
      <AppSidebar className="w-64 border-r" />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
} 
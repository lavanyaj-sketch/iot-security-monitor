import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
  headerSlot: ReactNode;
}

export default function AppShell({ children, headerSlot }: AppShellProps) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        {headerSlot}
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

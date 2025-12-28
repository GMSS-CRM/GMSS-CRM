import type { ReactNode } from "react";
import { useAuth } from "../app/providers/AuthProvider";
import { logout } from "../modules/auth/services/auth.service";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "#1e293b",
          color: "#fff",
          padding: 20,
        }}
      >
        <h3>GMSS CRM</h3>

        <nav style={{ marginTop: 30 }}>
          <p>Dashboard</p>
          <p>Vendors</p>
          <p>Tenders</p>
          <p>Products</p>
        </nav>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1 }}>
        {/* Header */}
        <header
          style={{
            height: 60,
            borderBottom: "1px solid #e5e7eb",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{user?.email}</span>
          <button onClick={logout}>Logout</button>
        </header>

        {/* Page Content */}
        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}

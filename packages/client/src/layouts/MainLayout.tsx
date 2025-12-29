import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../app/providers/AuthProvider";
import { logout } from "../modules/auth/services/auth.service";
import "./MainLayout.css";

const menuItems = [
  { key: "dashboard", label: "Dashboard", path: "/dashboard" },
  { key: "users", label: "Users", path: "/users" },
  { key: "roles", label: "Roles", path: "/roles" },
  { key: "permissions", label: "Permissions", path: "/permissions" },
];

export default function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="sidebar-header">
          <span className="logo">GMSS</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon" aria-hidden>
                {item.label.charAt(0)}
              </span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {/* Header */}
        <header className="topbar">
          <div className="topbar-left hstack">
            <div className="search-wrapper">
              <input className="input" placeholder="Search..." aria-label="search" />
            </div>
          </div>

          <div className="topbar-right hstack">
            <button className="btn btn-ghost" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.64 5.36 6 7.93 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="user-info">
              <div className="avatar">{user?.email ? user.email.charAt(0).toUpperCase() : 'U'}</div>
            </div>

            <button className="btn btn-ghost" onClick={logout} title="Logout">
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

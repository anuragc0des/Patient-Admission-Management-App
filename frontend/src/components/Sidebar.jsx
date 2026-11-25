import { LayoutDashboard, Users, UserPlus, HeartPulse } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><HeartPulse size={22} /></div>
        <div><strong>DScribe</strong><span>Hospital Admin</span></div>
      </div>
      <nav className="nav-list" aria-label="Main navigation">
        <NavLink to="/" end><LayoutDashboard size={19} />Dashboard</NavLink>
        <NavLink to="/patients"><Users size={19} />All Patients</NavLink>
        <NavLink to="/patients/new"><UserPlus size={19} />Add Patient</NavLink>
      </nav>
      <div className="sidebar-footer">
        <span className="avatar">AD</span>
        <div><strong>Admin</strong><small>Staff account</small></div>
      </div>
    </aside>
  );
}

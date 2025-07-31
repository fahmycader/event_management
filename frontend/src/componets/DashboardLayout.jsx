import Sidebar from "./sidebar";

export default function DashboardLayout({ children, onLogout }) {
  return (
    <div className="d-flex">
      {/* ✅ Sidebar */}
      <Sidebar onLogout={onLogout || (() => {})} />
     
      {/* ✅ Main Content */}
      <div style={{ marginLeft: "260px", padding: "20px" , backgroundColor: "#f9f9f9" }}>
        {children}
      </div>
    </div>
  );
}

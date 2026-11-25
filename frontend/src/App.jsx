import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import PatientFormPage from "./pages/PatientFormPage";
import PatientViewPage from "./pages/PatientViewPage";

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/patients" element={<DashboardPage />} />
        <Route path="/patients/new" element={<PatientFormPage mode="new" />} />
        <Route path="/patients/:id" element={<PatientViewPage />} />
        <Route path="/patients/:id/edit" element={<PatientFormPage mode="edit" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

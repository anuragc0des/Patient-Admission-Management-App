import { useEffect, useState } from "react";
import { Search, Plus, Users, Activity, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import PatientTable from "../components/PatientTable";
import {
  fetchOptions,
  fetchPatients,
  deletePatient,
  dischargePatient,
} from "../services/patientService";

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [options, setOptions] = useState({ gender: [], ward: [], department: [], doctor: [] });
  const [filters, setFilters] = useState({ search: "", ward: "", department: "", doctor: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [stats, setStats] = useState({ total: 0, admitted: 0, discharged: 0 });

  async function refreshStats() {
    try {
      const allPatients = await fetchPatients();
      setStats({
        total: allPatients.length,
        admitted: allPatients.filter((patient) => patient.status === "Admitted").length,
        discharged: allPatients.filter((patient) => patient.status === "Discharged").length,
      });
    } catch {
      setError("Could not load patient statistics.");
    }
  }

  async function loadPatients(activeFilters = filters) {
    setLoading(true);
    setError("");
    try {
      const params = Object.fromEntries(Object.entries(activeFilters).filter(([, value]) => value));
      setPatients(await fetchPatients(params));
    } catch {
      setError("Could not load patients. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOptions().then(setOptions).catch(() => setError("Could not load dropdown options."));
    loadPatients({});
    refreshStats();
  }, []);

  function updateFilter(event) {
    const next = { ...filters, [event.target.name]: event.target.value };
    setFilters(next);
  }

  function applyFilters(event) {
    event.preventDefault();
    loadPatients(filters);
  }

  function clearFilters() {
    const cleared = { search: "", ward: "", department: "", doctor: "" };
    setFilters(cleared);
    loadPatients(cleared);
  }

  async function handleDelete(patient) {
    if (!window.confirm(`Delete ${patient.name}? This action cannot be undone.`)) return;
    try {
      await deletePatient(patient.id);
      setToast("Patient deleted successfully.");
      await loadPatients(filters);
      await refreshStats();
    } catch (error) {
      setError(error.response?.data?.detail || "Could not delete the patient.");
    }
  }

  async function handleDischarge(patient) {
    if (patient.status === "Discharged") return;
    if (!window.confirm(`Mark ${patient.name} as discharged?`)) return;
    try {
      const updated = await dischargePatient(patient.id);
      setPatients((current) => current.map((item) => item.id === updated.id ? updated : item));
      setToast("Patient marked as discharged.");
      await refreshStats();
    } catch (error) {
      setError(error.response?.data?.detail || "Could not discharge the patient.");
    }
  }

  return (
    <main className="content">
      <header className="page-header">
        <div><p className="eyebrow">Hospital overview</p><h1>Patient Dashboard</h1></div>
        <Link className="button primary" to="/patients/new"><Plus size={18} />Add Patient</Link>
      </header>

      {toast && <div className="toast" role="status" onAnimationEnd={() => setToast("")}>{toast}</div>}
      {error && <div className="alert error" role="alert">{error}</div>}

      <section className="stats-grid" aria-label="Patient statistics">
        <StatCard icon={<Users />} label="Total Patients" value={stats.total} className="blue" />
        <StatCard icon={<Activity />} label="Admitted" value={stats.admitted} className="teal" />
        <StatCard icon={<LogOut />} label="Discharged" value={stats.discharged} className="gray" />
      </section>

      <section className="records-card">
        <div className="records-heading">
          <div><h2>Patient Records</h2><p>Manage and review admissions</p></div>
        </div>
        <form className="filters" onSubmit={applyFilters}>
          <label className="search-field">
            <Search size={18} />
            <input name="search" value={filters.search} onChange={updateFilter} placeholder="Search patient name..." aria-label="Search patient name" />
          </label>
          <select name="ward" value={filters.ward} onChange={updateFilter} aria-label="Filter by ward">
            <option value="">All Wards</option>
            {options.ward.map((value) => <option key={value}>{value}</option>)}
          </select>
          <select name="department" value={filters.department} onChange={updateFilter} aria-label="Filter by department">
            <option value="">All Departments</option>
            {options.department.map((value) => <option key={value}>{value}</option>)}
          </select>
          <select name="doctor" value={filters.doctor} onChange={updateFilter} aria-label="Filter by doctor">
            <option value="">All Doctors</option>
            {options.doctor.map((value) => <option key={value}>{value}</option>)}
          </select>
          <button className="button secondary" type="submit">Apply</button>
          <button className="text-button" type="button" onClick={clearFilters}>Clear filters</button>
        </form>
        {loading ? <div className="loading">Loading patients...</div> :
          <PatientTable patients={patients} onDischarge={handleDischarge} onDelete={handleDelete} />}
      </section>
    </main>
  );
}

function StatCard({ icon, label, value, className }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${className}`}>{icon}</div>
      <div><p>{label}</p><strong>{value}</strong></div>
    </article>
  );
}

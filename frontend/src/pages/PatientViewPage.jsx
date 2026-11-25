import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { fetchPatient } from "../services/patientService";

export default function PatientViewPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatient(id).then(setPatient).catch((requestError) => {
      setError(requestError.response?.data?.detail || "Could not load this patient.");
    });
  }, [id]);

  if (error) return <main className="content"><div className="alert error">{error}</div></main>;
  if (!patient) return <main className="content"><div className="loading">Loading patient...</div></main>;

  const fields = [
    ["Patient Name", patient.name], ["Age", patient.age], ["Gender", patient.gender],
    ["Ward", patient.ward], ["Department", patient.department], ["Doctor", patient.doctor],
    ["Admission Date", patient.admission_date], ["Status", patient.status],
  ];

  return (
    <main className="content">
      <header className="page-header">
        <div><p className="eyebrow">Patient #{patient.id}</p><h1>Patient Details</h1></div>
        <div className="header-actions">
          <Link className="button secondary" to="/patients"><ArrowLeft size={17} />Back</Link>
          <Link className="button primary" to={`/patients/${patient.id}/edit`}><Pencil size={17} />Edit Patient</Link>
        </div>
      </header>
      <section className="form-card details-card">
        <div className="details-header">
          <div className="details-avatar">{patient.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
          <div><h2>{patient.name}</h2><span className={`status ${patient.status.toLowerCase()}`}>{patient.status}</span></div>
        </div>
        <div className="details-grid">
          {fields.map(([label, value]) => (
            <div className="detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>
          ))}
        </div>
      </section>
    </main>
  );
}

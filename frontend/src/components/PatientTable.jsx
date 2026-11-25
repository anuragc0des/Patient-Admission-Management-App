import { Eye, Pencil, LogOut, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function PatientTable({ patients, onDischarge, onDelete }) {
  if (!patients.length) {
    return (
      <div className="empty-state">
        <UsersIcon />
        <h3>No patients found</h3>
        <p>Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Patient Name</th><th>Age</th><th>Gender</th>
            <th>Ward</th><th>Department</th><th>Doctor</th>
            <th>Admission Date</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td><span className="patient-id">#{patient.id}</span></td>
              <td><strong>{patient.name}</strong></td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.ward}</td>
              <td>{patient.department}</td>
              <td>{patient.doctor}</td>
              <td>{patient.admission_date}</td>
              <td><span className={`status ${patient.status.toLowerCase()}`}>{patient.status}</span></td>
              <td>
                <div className="actions">
                  <Link className="icon-button" to={`/patients/${patient.id}`} title="View" aria-label={`View ${patient.name}`}><Eye size={16} /></Link>
                  <Link className="icon-button" to={`/patients/${patient.id}/edit`} title="Edit" aria-label={`Edit ${patient.name}`}><Pencil size={16} /></Link>
                  <button className="icon-button discharge" type="button" title="Discharge" aria-label={`Discharge ${patient.name}`}
                    disabled={patient.status === "Discharged"} onClick={() => onDischarge(patient)}>
                    <LogOut size={16} />
                  </button>
                  <button className="icon-button danger" type="button" title="Delete" aria-label={`Delete ${patient.name}`} onClick={() => onDelete(patient)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersIcon() {
  return <div className="empty-icon"><UsersIconSvg /></div>;
}

function UsersIconSvg() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

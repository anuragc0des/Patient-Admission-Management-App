import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PatientForm from "../components/PatientForm";
import { getApiErrorMessage } from "../services/api";
import { createPatient, fetchOptions, fetchPatient, updatePatient } from "../services/patientService";

export default function PatientFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [options, setOptions] = useState({ gender: [], ward: [], department: [], doctor: [] });
  const [patient, setPatient] = useState(null);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [error, setError] = useState("");

  function retryOptions() {
    setOptionsLoading(true);
    setOptionsError("");
    fetchOptions()
      .then(setOptions)
      .catch((requestError) => setOptionsError(getApiErrorMessage(requestError, "form options")))
      .finally(() => setOptionsLoading(false));
  }

  useEffect(() => {
    let active = true;
    setOptionsLoading(true);
    setOptionsError("");
    fetchOptions()
      .then((loadedOptions) => {
        if (active) setOptions(loadedOptions);
      })
      .catch((requestError) => {
        if (active) setOptionsError(getApiErrorMessage(requestError, "form options"));
      })
      .finally(() => {
        if (active) setOptionsLoading(false);
      });

    if (mode === "edit") {
      fetchPatient(id).then(setPatient).catch((requestError) => {
        setError(getApiErrorMessage(requestError, "this patient"));
      }).finally(() => setLoading(false));
    }
    return () => {
      active = false;
    };
  }, [id, mode]);

  async function handleSubmit(values) {
    if (mode === "edit") {
      await updatePatient(id, values);
    } else {
      await createPatient(values);
    }
    navigate("/patients", { state: { notice: mode === "edit" ? "Patient updated successfully." : "Patient added successfully." } });
  }

  if (loading) return <main className="content"><div className="loading">Loading patient...</div></main>;

  return (
    <main className="content">
      <header className="page-header">
        <div><p className="eyebrow">Patient management</p><h1>{mode === "edit" ? "Edit Patient" : "Add New Patient"}</h1></div>
      </header>
      {error && <div className="alert error" role="alert">{error}</div>}
      {optionsLoading && <div className="loading" role="status">Loading form options...</div>}
      {!optionsLoading && optionsError && (
        <div className="alert error" role="alert">
          <p>{optionsError}</p>
          <button className="button secondary" type="button" onClick={retryOptions}>Retry</button>
        </div>
      )}
      {!optionsLoading && !optionsError && (mode === "new" || patient) ? (
        <section className="form-card">
          <div className="form-card-heading">
            <h2>{mode === "edit" ? "Patient Information" : "Admission Details"}</h2>
            <p>{mode === "edit" ? "Update the patient's registered information." : "Enter all required details to register a patient."}</p>
          </div>
          <PatientForm
            initialPatient={patient}
            options={options}
            onSubmit={handleSubmit}
            submitLabel={mode === "edit" ? "Update Patient" : "Add Patient"}
          />
        </section>
      ) : null}
    </main>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePatient } from "../utils/validation";

const emptyPatient = {
  name: "",
  age: "",
  gender: "",
  ward: "",
  department: "",
  doctor: "",
  admission_date: "",
  status: "Admitted",
};

export default function PatientForm({ initialPatient, options, onSubmit, submitLabel }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialPatient ? { ...initialPatient, age: String(initialPatient.age) } : emptyPatient);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (initialPatient) setForm({ ...initialPatient, age: String(initialPatient.age) });
  }, [initialPatient]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validatePatient(form, options);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    setServerError("");
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        age: Number(form.age),
      });
    } catch (error) {
      const detail = error.response?.data?.detail;
      setServerError(Array.isArray(detail)
        ? detail.map((item) => item.msg).join(" ")
        : detail || "The patient could not be saved.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="patient-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="alert error" role="alert">{serverError}</div>}
      <div className="form-grid">
        <Field label="Patient Name" name="name" error={errors.name}>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" />
        </Field>
        <Field label="Age" name="age" error={errors.age}>
          <input id="age" name="age" type="number" min="0" max="120" value={form.age} onChange={handleChange} placeholder="Enter age" />
        </Field>
        <Field label="Gender" name="gender" error={errors.gender}>
          <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            {options.gender.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </Field>
        <Field label="Ward" name="ward" error={errors.ward}>
          <select id="ward" name="ward" value={form.ward} onChange={handleChange}>
            <option value="">Select ward</option>
            {options.ward.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </Field>
        <Field label="Department" name="department" error={errors.department}>
          <select id="department" name="department" value={form.department} onChange={handleChange}>
            <option value="">Select department</option>
            {options.department.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </Field>
        <Field label="Doctor" name="doctor" error={errors.doctor}>
          <select id="doctor" name="doctor" value={form.doctor} onChange={handleChange}>
            <option value="">Select doctor</option>
            {options.doctor.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </Field>
        <Field label="Admission Date" name="admission_date" error={errors.admission_date}>
          <input id="admission_date" name="admission_date" type="date" max={new Date().toISOString().slice(0, 10)} value={form.admission_date} onChange={handleChange} />
        </Field>
        {initialPatient && (
          <Field label="Status" name="status">
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              <option>Admitted</option>
              <option>Discharged</option>
            </select>
          </Field>
        )}
      </div>
      <div className="form-actions">
        <button type="button" className="button secondary" onClick={() => navigate(-1)}>Cancel</button>
        <button type="submit" className="button primary" disabled={submitting}>{submitting ? "Saving..." : submitLabel}</button>
      </div>
    </form>
  );
}

function Field({ label, name, error, children }) {
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      {children}
      {error && <small>{error}</small>}
    </div>
  );
}

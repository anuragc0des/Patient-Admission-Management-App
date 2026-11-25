import api from "./api";

export async function fetchOptions() {
  const response = await api.get("/api/options");
  const options = response.data;
  const requiredKeys = ["gender", "ward", "department", "doctor"];
  const isValid = options && requiredKeys.every(
    (key) => Array.isArray(options[key]) && options[key].length > 0,
  );

  if (!isValid) {
    throw new Error("The API returned an invalid options response. Expected non-empty gender, ward, department, and doctor lists.");
  }

  return options;
}

export async function fetchPatients(filters = {}) {
  const response = await api.get("/api/patients", { params: filters });
  return response.data;
}

export async function fetchPatient(id) {
  const response = await api.get(`/api/patients/${id}`);
  return response.data;
}

export async function createPatient(patient) {
  const response = await api.post("/api/patients", patient);
  return response.data;
}

export async function updatePatient(id, patient) {
  const response = await api.put(`/api/patients/${id}`, patient);
  return response.data;
}

export async function deletePatient(id) {
  await api.delete(`/api/patients/${id}`);
}

export async function dischargePatient(id) {
  const response = await api.patch(`/api/patients/${id}/discharge`);
  return response.data;
}

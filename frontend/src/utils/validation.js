export function validatePatient(form, options) {
  const errors = {};
  const name = form.name.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (!/^[A-Za-z ]+$/.test(name)) {
    errors.name = "Name must contain only alphabetic letters.";
  }

  if (form.age === "") {
    errors.age = "Age is required.";
  } else if (!Number.isInteger(Number(form.age)) || Number(form.age) < 0 || Number(form.age) > 120) {
    errors.age = "Age must be a whole number between 0 and 120.";
  }

  if (!options.gender.includes(form.gender)) errors.gender = "Please select a valid gender.";
  if (!options.ward.includes(form.ward)) errors.ward = "Please select a valid ward.";
  if (!options.department.includes(form.department)) errors.department = "Please select a valid department.";
  if (!options.doctor.includes(form.doctor)) errors.doctor = "Please select a valid doctor.";

  if (!form.admission_date) {
    errors.admission_date = "Admission date is required.";
  } else {
    const today = new Date().toISOString().slice(0, 10);
    if (form.admission_date > today) {
      errors.admission_date = "Admission date cannot be in the future.";
    }
  }

  return errors;
}

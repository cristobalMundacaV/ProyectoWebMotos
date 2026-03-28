export function clearInvalidFieldStyle(target) {
  if (!target || typeof target.classList?.remove !== "function") return;
  target.classList.remove("admin-field-invalid");
}

export function validateFormWithToast(formElement, pushToast) {
  if (!formElement) return true;
  const fields = Array.from(formElement.querySelectorAll("input, select, textarea"));
  fields.forEach((field) => field.classList.remove("admin-field-invalid"));
  if (formElement.checkValidity()) return true;

  const invalidFields = fields.filter((field) => !field.checkValidity());
  invalidFields.forEach((field) => field.classList.add("admin-field-invalid"));

  const firstInvalid = invalidFields[0];
  const labelText = firstInvalid?.closest("label")?.childNodes?.[0]?.textContent?.trim();
  const message = firstInvalid?.validationMessage
    ? labelText
      ? `${labelText}: ${firstInvalid.validationMessage}`
      : firstInvalid.validationMessage
    : "Completa los campos obligatorios.";

  if (typeof pushToast === "function") pushToast(message, "error");
  firstInvalid?.focus();
  return false;
}

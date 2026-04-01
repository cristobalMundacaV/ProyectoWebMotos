export const CHILE_PHONE_PREFIX = "+56";
export const CHILE_PHONE_DIGITS = 9;

export function normalizeChilePhoneInput(rawValue, { allowEmpty = false } = {}) {
  const digitsOnly = String(rawValue || "").replace(/\D/g, "");
  let localDigits = digitsOnly;

  if (localDigits.startsWith("56")) {
    localDigits = localDigits.slice(2);
  }

  localDigits = localDigits.slice(0, CHILE_PHONE_DIGITS);

  if (allowEmpty && localDigits.length === 0) {
    return "";
  }

  return `${CHILE_PHONE_PREFIX}${localDigits}`;
}

export function isValidChilePhone(value) {
  return /^\+56\d{9}$/.test(String(value || "").trim());
}

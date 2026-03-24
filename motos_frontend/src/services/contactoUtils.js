export function normalizePhoneForWhatsApp(phone) {
  return String(phone || "").replace(/\D/g, "");
}

export function buildWhatsAppUrl(phone, message) {
  const normalizedPhone = normalizePhoneForWhatsApp(phone);

  if (!normalizedPhone) {
    return "";
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message || "")}`;
}

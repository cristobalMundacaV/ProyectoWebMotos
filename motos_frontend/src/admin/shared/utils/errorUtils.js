export function translateBackendMessage(message) {
  if (!message) return "";
  const text = String(message).trim();
  const normalized = text.toLowerCase();
  const maxLengthMatch = normalized.match(/ensure this field has no more than (\d+) characters/);

  if (normalized.includes("this field is required")) return "Este campo es obligatorio.";
  if (maxLengthMatch) return `Este campo no puede superar ${maxLengthMatch[1]} caracteres.`;
  if (normalized.includes("already exists")) return "Ya existe un registro con ese valor.";
  if (normalized.includes("slug")) return "El slug ya existe. Cambia el nombre para generar uno diferente.";
  if (normalized.includes("not found")) return "No se encontro el recurso solicitado.";
  if (normalized.includes("invalid")) return "El dato ingresado no es valido.";
  if (normalized.includes("must be a number")) return "Debe ingresar un numero valido.";
  if (normalized.includes("permission denied")) return "No tienes permisos para realizar esta accion.";
  if (normalized.includes("authentication credentials were not provided")) return "Debes iniciar sesion para continuar.";

  return text;
}

export function getErrorText(error, fallback = "No se pudo completar la solicitud.") {
  const fieldLabels = {
    marca: "Marca",
    modelo: "Modelo",
    modelo_id: "Modelo",
    modelo_moto: "Modelo",
    slug: "Slug",
    precio: "Precio",
    precio_lista: "Precio de lista",
    precio_con_maletas: "Precio con maletas",
    precio_lista_con_maletas: "Precio de lista con maletas",
    imagen_con_maletas: "Imagen con maletas",
    anio: "Anio",
    orden_carrusel: "Orden carrusel",
  };

  const data = error?.response?.data;
  if (!data) return fallback;

  if (typeof data === "string") {
    const raw = String(data).trim();
    if (/^\s*<!doctype html>/i.test(raw) || /<html/i.test(raw)) {
      return "Error interno del servidor. Intenta nuevamente en unos segundos.";
    }
    return translateBackendMessage(raw);
  }

  if (data.error) return translateBackendMessage(data.error);
  if (data.detail) return translateBackendMessage(data.detail);

  const firstFieldEntry = Object.entries(data).find(([, value]) => Array.isArray(value) && value.length);
  if (firstFieldEntry) {
    const [fieldName, fieldErrors] = firstFieldEntry;
    const translated = translateBackendMessage(fieldErrors[0]);
    const label = fieldLabels[fieldName] || fieldName;
    return `${label}: ${translated}`;
  }

  const [firstError] = Object.values(data).find((value) => Array.isArray(value) && value.length) || [];
  return translateBackendMessage(firstError) || fallback;
}

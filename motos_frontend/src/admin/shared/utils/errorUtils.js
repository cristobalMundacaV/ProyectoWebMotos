export function translateBackendMessage(message) {
  if (!message) return "";
  const text = String(message).trim();
  const normalized = text.toLowerCase();
  const maxLengthMatch = normalized.match(/ensure this field has no more than (\d+) characters/);

  if (normalized.includes("this field is required")) return "Este campo es obligatorio.";
  if (maxLengthMatch) return `Este campo no puede superar ${maxLengthMatch[1]} caracteres.`;
  if (normalized.includes("already exists")) return "Ya existe un registro con ese valor.";
  if (
    normalized.includes("cannot delete this item because it has related records") ||
    normalized.includes("has related records") ||
    normalized.includes("tiene productos asociados") ||
    normalized.includes("tiene motos asociadas")
  ) {
    return "No se puede eliminar porque tiene registros asociados.";
  }
  if (normalized.includes("slug")) return "El slug ya existe. Cambia el nombre para generar uno diferente.";
  if (normalized.includes("not found")) return "No se encontro el recurso solicitado.";
  if (normalized.includes("invalid")) return "El dato ingresado no es valido.";
  if (normalized.includes("must be a number")) return "Debe ingresar un numero valido.";
  if (normalized.includes("permission denied")) return "No tienes permisos para realizar esta accion.";
  if (normalized.includes("authentication credentials were not provided")) return "Debes iniciar sesion para continuar.";

  return text;
}

export function getErrorText(error, fallback = "No se pudo completar la solicitud.") {
  const humanizedFieldMessages = {
    marca: "Debes seleccionar una marca valida.",
    modelo: "Debes seleccionar un modelo valido.",
    modelo_id: "Debes seleccionar un modelo valido.",
    modelo_moto: "Debes seleccionar un modelo valido.",
    subcategoria: "Debes seleccionar una categoria valida.",
    categoria: "Debes seleccionar una categoria valida.",
    compatibilidad_motos: "Selecciona al menos una moto compatible.",
    orden_carrusel: "Debes indicar un orden de carrusel valido.",
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
  if (data.detail) {
    const detailText = translateBackendMessage(data.detail);
    if (/username|nombre de usuario/i.test(detailText)) {
      return "El nombre de usuario ingresado ya esta en uso.";
    }
    return detailText;
  }

  const firstFieldEntry = Object.entries(data).find(([, value]) => Array.isArray(value) && value.length);
  if (firstFieldEntry) {
    const [fieldName, fieldErrors] = firstFieldEntry;
    const rawFieldError = String(fieldErrors[0] || "");
    const rawLower = rawFieldError.toLowerCase();
    if (fieldName === "username" && /(already exists|ya existe|ya esta en uso)/i.test(rawFieldError)) {
      return "El nombre de usuario ingresado ya esta en uso.";
    }
    if (fieldName === "nombre_modelo") {
      if (/(this field is required|este campo es requerido|obligatorio)/i.test(rawFieldError)) {
        return "Debes ingresar el nombre del modelo.";
      }
      return translateBackendMessage(rawFieldError);
    }
    if (fieldName === "slug") {
      if (/(this field is required|este campo es requerido|obligatorio)/i.test(rawFieldError)) {
        return "No se pudo generar el identificador del registro. Intenta nuevamente.";
      }
      if (/(already exists|ya existe|unique|duplicado)/i.test(rawLower)) {
        return "Ya existe un registro con ese nombre. Cambia el nombre e intenta nuevamente.";
      }
      return translateBackendMessage(rawFieldError);
    }
    if (/(this field is required|este campo es requerido|obligatorio)/i.test(rawFieldError)) {
      const requiredByField = {
        username: "Debes ingresar un nombre de usuario.",
        email: "Debes ingresar un correo.",
        telefono: "Debes ingresar un telefono.",
        nombre: "Debes ingresar un nombre.",
        precio: "Debes ingresar un precio valido.",
      };
      if (requiredByField[fieldName]) return requiredByField[fieldName];
    }
    if (humanizedFieldMessages[fieldName]) {
      return humanizedFieldMessages[fieldName];
    }
    const translated = translateBackendMessage(rawFieldError);
    return translated;
  }

  const [firstError] = Object.values(data).find((value) => Array.isArray(value) && value.length) || [];
  return translateBackendMessage(firstError) || fallback;
}

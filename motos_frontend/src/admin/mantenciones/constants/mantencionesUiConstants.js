export const ESTADO_OPTIONS = [
  { value: "en_proceso", label: "En proceso" },
  { value: "en_espera", label: "En espera" },
  { value: "finalizado", label: "Finalizado" },
  { value: "entregada", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
  { value: "inasistencia", label: "Inasistencia" },
  { value: "no_aceptado", label: "No aceptado" },
  { value: "reagendacion", label: "Reagendacion" },
];

export const SOLICITUDES_TABS = [
  { value: "por_aprobar", label: "Solicitud", estado: "solicitud" },
  { value: "aprobadas", label: "Aprobadas", estado: "aprobado" },
];

export const ESTADOS_SOLICITUD = ["solicitud", "aprobado"];
export const ESTADOS_TALLER = ["en_proceso", "en_espera", "finalizado"];
export const ESTADOS_EN_TALLER = ["en_proceso", "en_espera", "finalizado"];

export const TALLER_ESTADO_FILTERS = [
  { value: "en_proceso", label: "En proceso" },
  { value: "en_espera", label: "En espera" },
  { value: "por_entregar", label: "Por Entregar" },
];

export const WEEK_DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

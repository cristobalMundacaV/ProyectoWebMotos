export const initialMotoForm = {
  marca: "",
  modelo: "",
  slug: "",
  descripcion: "",
  precio: "",
  precio_lista: "",
  permite_variante_maletas: false,
  precio_con_maletas: "",
  precio_lista_con_maletas: "",
  anio: "",
  color: "",
  estado: "disponible",
  es_destacada: false,
  orden_carrusel: "1",
  activa: true,
  imagen_principal: null,
  imagenes_galeria: [],
  imagen_con_maletas: null,
  video_presentacion: "",
};

export const initialModeloMotoForm = {
  marca: "",
  categoria: "",
  nombre: "",
  cilindrada: "",
  slug: "",
  descripcion: "",
  activo: true,
};

export const initialCategoriaMotoForm = {
  nombre: "",
  slug: "",
  descripcion: "",
  activa: true,
};

export const initialMarcaForm = {
  nombre: "",
  slug: "",
  descripcion: "",
  activa: true,
};

export const initialCategoriaAccMotosForm = {
  nombre: "",
  slug: "",
  descripcion: "",
  activa: true,
};

export const initialAccesorioMotoForm = {
  subcategoria: "",
  marca: "",
  nombre: "",
  slug: "",
  descripcion: "",
  precio: "",
  orden_carrusel: "1",
  imagen_principal: null,
  imagenes_galeria: [],
  es_destacado: false,
  activo: true,
  requiere_compatibilidad: false,
  compatibilidad_motos: [],
};

export const initialAccesorioRiderForm = {
  subcategoria: "",
  marca: "",
  nombre: "",
  slug: "",
  descripcion: "",
  precio: "",
  orden_carrusel: "1",
  imagen_principal: null,
  imagenes_galeria: [],
  es_destacado: false,
  activo: true,
};

export const initialCategoriaAccRiderForm = {
  nombre: "",
  slug: "",
  descripcion: "",
  activa: true,
};

export const initialContactoForm = {
  instagram: "",
  telefono: "+56",
  ubicacion: "",
};

export const initialCreateUserForm = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  telefono: "+56",
  rol: "",
  password: "",
  confirm_password: "",
};

export const initialHorarioMantencionForm = {
  dia_inicio: "0",
  dia_fin: "4",
  hora_inicio: "09:00",
  hora_fin: "18:00",
  intervalo_minutos: "60",
  cupos_por_bloque: "1",
};

export const MOTO_COLOR_PALETTE = [
  "Negro",
  "Blanco",
  "Rojo",
  "Azul",
  "Verde",
  "Amarillo",
  "Naranjo",
  "Gris",
  "Plateado",
  "Dorado",
];

export function buildAccesorioMotoPayload(form) {
  const payload = new FormData();
  payload.append("subcategoria", form.subcategoria);
  payload.append("marca", form.marca);
  payload.append("nombre", form.nombre);
  payload.append("slug", form.slug);
  payload.append("descripcion", form.descripcion);
  payload.append("precio", form.precio);
  payload.append("orden_carrusel", form.orden_carrusel || "1");
  payload.append("es_destacado", String(form.es_destacado));
  payload.append("activo", String(form.activo));
  payload.append("requiere_compatibilidad", String(form.requiere_compatibilidad));

  const galleryFiles = Array.isArray(form.imagenes_galeria) ? form.imagenes_galeria.filter(Boolean) : [];
  const primaryImageFromGallery = galleryFiles[0] || null;
  if (form.imagen_principal || primaryImageFromGallery) {
    payload.append("imagen_principal", form.imagen_principal || primaryImageFromGallery);
  }
  galleryFiles.forEach((file) => payload.append("imagenes", file));
  if (form.remove_imagen_principal) {
    payload.append("remove_primary_image", "true");
  }
  const imageIdsToDelete = Array.isArray(form.imagenes_eliminar) ? form.imagenes_eliminar : [];
  imageIdsToDelete.forEach((imageId) => payload.append("imagenes_eliminar", String(imageId)));

  if (form.requiere_compatibilidad) {
    form.compatibilidad_motos.forEach((motoId) => {
      payload.append("compatibilidad_motos", String(motoId));
    });
  }
  return payload;
}

export function buildAccesorioRiderPayload(form) {
  const payload = new FormData();
  payload.append("subcategoria", form.subcategoria);
  payload.append("marca", form.marca);
  payload.append("nombre", form.nombre);
  payload.append("slug", form.slug);
  payload.append("descripcion", form.descripcion);
  payload.append("precio", form.precio);
  payload.append("orden_carrusel", form.orden_carrusel || "1");
  payload.append("es_destacado", String(form.es_destacado));
  payload.append("activo", String(form.activo));

  const galleryFiles = Array.isArray(form.imagenes_galeria) ? form.imagenes_galeria.filter(Boolean) : [];
  const primaryImageFromGallery = galleryFiles[0] || null;
  if (form.imagen_principal || primaryImageFromGallery) {
    payload.append("imagen_principal", form.imagen_principal || primaryImageFromGallery);
  }
  galleryFiles.forEach((file) => payload.append("imagenes", file));
  if (form.remove_imagen_principal) {
    payload.append("remove_primary_image", "true");
  }
  const imageIdsToDelete = Array.isArray(form.imagenes_eliminar) ? form.imagenes_eliminar : [];
  imageIdsToDelete.forEach((imageId) => payload.append("imagenes_eliminar", String(imageId)));
  return payload;
}

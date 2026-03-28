import { useCallback } from "react";

export default function useAdminCatalogBridge({ setMarcasAccMotosAdmin, setAccesoriosMotosMeta, setMarcasAccRiderAdmin, setAccesoriosRiderMeta }) {
  const onCreateMarcaForProductoDomain = useCallback(
    ({ tipo, marca }) => {
      if (!marca) return;

      if (tipo === "accesorio_moto") {
        setMarcasAccMotosAdmin((prev) => [marca, ...prev]);
        if (marca.activa) {
          setAccesoriosMotosMeta((prev) => ({
            ...prev,
            marcas: [{ id: marca.id, nombre: marca.nombre }, ...prev.marcas],
          }));
        }
        return;
      }

      if (tipo === "accesorio_rider") {
        setMarcasAccRiderAdmin((prev) => [marca, ...prev]);
        if (marca.activa) {
          setAccesoriosRiderMeta((prev) => ({
            ...prev,
            marcas: [{ id: marca.id, nombre: marca.nombre }, ...prev.marcas],
          }));
        }
      }
    },
    [setAccesoriosMotosMeta, setAccesoriosRiderMeta, setMarcasAccMotosAdmin, setMarcasAccRiderAdmin]
  );

  return {
    onCreateMarcaForProductoDomain,
  };
}

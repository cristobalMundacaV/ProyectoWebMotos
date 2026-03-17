import { useEffect, useState } from "react";
import { getMotos } from "../services/motosService";

/** Hook que centraliza el fetch del catálogo de motos */
export function useMotos() {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMotos()
      .then(setMotos)
      .catch((err) => {
        console.error("Error loading motos catalog:", err);
        setError("No se pudieron cargar las motos.");
        setMotos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { motos, setMotos, loading, error };
}

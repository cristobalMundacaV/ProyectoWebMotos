import { useEffect, useState } from "react";
import { getMotos } from "../services/motosService";

/** Hook que centraliza el fetch del catálogo de motos */
export function useMotos() {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMotos()
      .then(setMotos)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { motos, setMotos, loading, error };
}

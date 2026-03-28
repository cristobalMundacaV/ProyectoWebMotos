import { useCallback, useEffect, useState } from "react";
import {
  createHorarioMantencionAdmin,
  deleteHorarioMantencionAdmin,
  getHorariosMantencionAdmin,
  updateHorarioMantencionAdmin,
} from "../services/mantencionesAdminService";
import { initialHorarioMantencionForm } from "../../shared/constants/adminInitialState";

const HORARIOS_SECTIONS = new Set(["horarios_operativos", "mantenciones_horarios"]);

export default function useHorariosAdmin({ activeSection, pushToast, getErrorText }) {
  const [horariosMantencion, setHorariosMantencion] = useState([]);
  const [horariosMantencionLoading, setHorariosMantencionLoading] = useState(false);
  const [horarioMantencionSaving, setHorarioMantencionSaving] = useState(false);
  const [horarioMantencionForm, setHorarioMantencionForm] = useState(initialHorarioMantencionForm);

  const fetchHorariosMantencionList = useCallback(async () => {
    const rows = await getHorariosMantencionAdmin();
    setHorariosMantencion(rows);
    return rows;
  }, []);

  useEffect(() => {
    if (!HORARIOS_SECTIONS.has(activeSection)) return;
    let isMounted = true;
    setHorariosMantencionLoading(true);

    getHorariosMantencionAdmin()
      .then((rows) => {
        if (!isMounted) return;
        setHorariosMantencion(rows);
      })
      .catch((error) => {
        if (!isMounted) return;
        setHorariosMantencion([]);
        pushToast(getErrorText(error, "No se pudo cargar la configuracion de horarios."), "error");
      })
      .finally(() => {
        if (isMounted) setHorariosMantencionLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeSection, getErrorText, pushToast]);

  const handleHorarioMantencionInputChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setHorarioMantencionForm((prev) => {
      const nextValue = type === "checkbox" ? checked : value;
      const next = { ...prev, [name]: nextValue };

      if (name === "cupos_por_bloque") {
        next.cupos_por_bloque = String(nextValue ?? "").replace(/[^\d]/g, "");
        return next;
      }

      if (String(prev.cupos_por_bloque ?? "").trim() === "") {
        next.cupos_por_bloque = "1";
      }

      return next;
    });
  }, []);

  const handleHorarioMantencionSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (horarioMantencionSaving) return;
      setHorarioMantencionSaving(true);

      try {
        const diaInicio = Number.parseInt(horarioMantencionForm.dia_inicio, 10);
        const diaFin = Number.parseInt(horarioMantencionForm.dia_fin, 10);

        if (!Number.isFinite(diaInicio) || !Number.isFinite(diaFin) || diaInicio < 0 || diaFin > 6) {
          throw new Error("Selecciona un rango de dias valido.");
        }
        if (diaFin < diaInicio) {
          throw new Error("El dia fin no puede ser menor al dia inicio.");
        }

        const payloadBase = {
          hora_inicio: horarioMantencionForm.hora_inicio,
          hora_fin: horarioMantencionForm.hora_fin,
          intervalo_minutos: Number(horarioMantencionForm.intervalo_minutos),
          cupos_por_bloque: Math.max(1, Number.parseInt(horarioMantencionForm.cupos_por_bloque, 10) || 1),
          activo: true,
        };

        for (let diaSemana = diaInicio; diaSemana <= diaFin; diaSemana += 1) {
          const existentes = horariosMantencion
            .filter((item) => Number(item.dia_semana) === diaSemana)
            .sort((a, b) => Number(a.id) - Number(b.id));

          if (existentes.length > 0) {
            const [principal, ...duplicados] = existentes;
            await updateHorarioMantencionAdmin(principal.id, {
              ...payloadBase,
              dia_semana: diaSemana,
            });

            if (duplicados.length > 0) {
              await Promise.all(duplicados.map((item) => deleteHorarioMantencionAdmin(item.id)));
            }
            continue;
          }

          await createHorarioMantencionAdmin({
            ...payloadBase,
            dia_semana: diaSemana,
          });
        }

        const fueraDeRango = horariosMantencion.filter((item) => {
          const dia = Number(item.dia_semana);
          return Number.isFinite(dia) && (dia < diaInicio || dia > diaFin);
        });

        if (fueraDeRango.length > 0) {
          await Promise.all(fueraDeRango.map((item) => deleteHorarioMantencionAdmin(item.id)));
        }

        await fetchHorariosMantencionList();
        pushToast("Horario operativo guardado correctamente.", "success");
      } catch (error) {
        pushToast(getErrorText(error, "No se pudo crear el horario operativo."), "error");
      } finally {
        setHorarioMantencionSaving(false);
      }
    },
    [fetchHorariosMantencionList, getErrorText, horarioMantencionForm, horarioMantencionSaving, horariosMantencion, pushToast]
  );

  const handleDeleteHorarioMantencion = useCallback(
    async (horarioId) => {
      try {
        await deleteHorarioMantencionAdmin(horarioId);
        setHorariosMantencion((prev) => prev.filter((item) => item.id !== horarioId));
        pushToast("Horario eliminado correctamente.", "success");
      } catch (error) {
        pushToast(getErrorText(error, "No se pudo eliminar el horario."), "error");
      }
    },
    [getErrorText, pushToast]
  );

  const handleUpdateHorarioMantencion = useCallback(
    async (horarioId, payload) => {
      try {
        const updated = await updateHorarioMantencionAdmin(horarioId, payload);

        const targetDia = Number(updated?.dia_semana ?? payload?.dia_semana ?? 0);
        const duplicados = horariosMantencion.filter(
          (item) => Number(item.dia_semana) === targetDia && Number(item.id) !== Number(updated.id)
        );

        if (duplicados.length > 0) {
          await Promise.all(duplicados.map((item) => deleteHorarioMantencionAdmin(item.id)));
        }

        await fetchHorariosMantencionList();
        pushToast("Horario actualizado correctamente.", "success");
      } catch (error) {
        pushToast(getErrorText(error, "No se pudo actualizar el horario."), "error");
      }
    },
    [fetchHorariosMantencionList, getErrorText, horariosMantencion, pushToast]
  );

  return {
    horariosMantencion,
    setHorariosMantencion,
    horariosMantencionLoading,
    setHorariosMantencionLoading,
    horarioMantencionSaving,
    horarioMantencionForm,
    handleHorarioMantencionInputChange,
    handleHorarioMantencionSubmit,
    handleDeleteHorarioMantencion,
    handleUpdateHorarioMantencion,
    fetchHorariosMantencionList,
  };
}

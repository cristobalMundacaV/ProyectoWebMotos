import { useCallback, useEffect, useState } from "react";
import {
  activarDiaCalendarioMantencion,
  createHorarioMantencionAdmin,
  deleteHorarioMantencionAdmin,
  getHorariosMantencionAdmin,
  updateHorarioMantencionAdmin,
} from "../services/mantencionesAdminService";
import { initialHorarioMantencionForm } from "../../shared/constants/adminInitialState";

const HORARIOS_SECTIONS = new Set(["horarios_operativos", "mantenciones_horarios"]);
const HORARIO_HORIZON_DAYS = 31;

function formatLocalISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toBackendWeekday(localJsDate) {
  return (localJsDate.getDay() + 6) % 7;
}

export default function useHorariosAdmin({ activeSection, pushToast, getErrorText }) {
  const [horariosMantencion, setHorariosMantencion] = useState([]);
  const [horariosMantencionLoading, setHorariosMantencionLoading] = useState(false);
  const [horariosLoadError, setHorariosLoadError] = useState("");
  const [horarioMantencionSaving, setHorarioMantencionSaving] = useState(false);
  const [horarioMantencionForm, setHorarioMantencionForm] = useState(initialHorarioMantencionForm);

  const fetchHorariosMantencionList = useCallback(async () => {
    try {
      const rows = await getHorariosMantencionAdmin();
      setHorariosMantencion(rows);
      setHorariosLoadError("");
      return rows;
    } catch (error) {
      setHorariosLoadError(getErrorText(error, "No se pudo cargar la configuracion de horarios."));
      throw error;
    }
  }, [getErrorText]);

  useEffect(() => {
    if (!HORARIOS_SECTIONS.has(activeSection)) return;
    let isMounted = true;
    setHorariosMantencionLoading(true);

    getHorariosMantencionAdmin()
      .then((rows) => {
        if (!isMounted) return;
        setHorariosMantencion(rows);
        setHorariosLoadError("");
      })
      .catch((error) => {
        if (!isMounted) return;
        setHorariosMantencion([]);
        setHorariosLoadError(getErrorText(error, "No se pudo cargar la configuracion de horarios."));
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

        const hoy = new Date();
        const diasActivaciones = [];
        for (let offset = 0; offset < HORARIO_HORIZON_DAYS; offset += 1) {
          const fecha = new Date(hoy);
          fecha.setHours(0, 0, 0, 0);
          fecha.setDate(hoy.getDate() + offset);

          const diaSemana = toBackendWeekday(fecha);
          if (diaSemana < diaInicio || diaSemana > diaFin) continue;

          diasActivaciones.push(
            activarDiaCalendarioMantencion({
              fecha: formatLocalISODate(fecha),
              hora_inicio: payloadBase.hora_inicio,
              hora_fin: payloadBase.hora_fin,
              intervalo_minutos: payloadBase.intervalo_minutos,
              cupos_por_bloque: payloadBase.cupos_por_bloque,
            })
          );
        }

        if (diasActivaciones.length > 0) {
          await Promise.all(diasActivaciones);
        }

        await fetchHorariosMantencionList();
        pushToast(`Horario operativo guardado para los proximos ${HORARIO_HORIZON_DAYS} dias.`, "success");
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
        return true;
      } catch (error) {
        pushToast(getErrorText(error, "No se pudo actualizar el horario."), "error");
        return false;
      }
    },
    [fetchHorariosMantencionList, getErrorText, horariosMantencion, pushToast]
  );

  return {
    horariosMantencion,
    setHorariosMantencion,
    horariosMantencionLoading,
    horariosLoadError,
    setHorariosLoadError,
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

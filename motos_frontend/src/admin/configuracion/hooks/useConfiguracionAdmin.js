import { useCallback, useState } from "react";
import { updateContactoAdmin } from "../services/configuracionAdminService";
import { initialContactoForm } from "../../shared/constants/adminInitialState";

export default function useConfiguracionAdmin({ pushToast, getErrorText, clearInvalidFieldStyle, validateFormWithToast }) {
  const [contactoForm, setContactoForm] = useState(initialContactoForm);
  const [contactoSaving, setContactoSaving] = useState(false);

  const bootstrapContacto = useCallback((contacto = {}) => {
    setContactoForm({
      instagram: contacto.instagram || "",
      telefono: contacto.telefono || "",
      ubicacion: contacto.ubicacion || "",
    });
  }, []);

  const handleContactoInputChange = useCallback(
    (event) => {
      clearInvalidFieldStyle(event.target);
      const { name, value } = event.target;
      setContactoForm((prev) => ({ ...prev, [name]: value }));
    },
    [clearInvalidFieldStyle]
  );

  const handleContactoSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validateFormWithToast(event.currentTarget)) return;
      setContactoSaving(true);

      try {
        const data = await updateContactoAdmin(contactoForm);
        bootstrapContacto(data);
        pushToast("Datos de contacto actualizados correctamente.", "success");
      } catch (error) {
        pushToast(getErrorText(error, "No se pudo actualizar el contacto."), "error");
      } finally {
        setContactoSaving(false);
      }
    },
    [bootstrapContacto, contactoForm, getErrorText, pushToast, validateFormWithToast]
  );

  return {
    contactoForm,
    contactoSaving,
    setContactoForm,
    bootstrapContacto,
    handleContactoInputChange,
    handleContactoSubmit,
  };
}

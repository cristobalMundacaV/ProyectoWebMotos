import { useCallback, useState } from "react";
import { updateContactoAdmin } from "../services/configuracionAdminService";
import { getContactoAdmin } from "../../../services/productosService";
import { initialContactoForm } from "../../shared/constants/adminInitialState";
import { isValidChilePhone, normalizeChilePhoneInput } from "../../../services/phoneUtils";

export default function useConfiguracionAdmin({ pushToast, getErrorText, clearInvalidFieldStyle, validateFormWithToast }) {
  const [contactoForm, setContactoForm] = useState(initialContactoForm);
  const [contactoSaving, setContactoSaving] = useState(false);
  const [contactoLoading, setContactoLoading] = useState(false);
  const [contactoLoadError, setContactoLoadError] = useState("");

  const bootstrapContacto = useCallback((contacto = {}, options = {}) => {
    const hasLoadError = Boolean(options?.loadError);
    if (hasLoadError) {
      setContactoLoadError("No se pudieron cargar los datos actuales de contacto.");
      return;
    }
    setContactoLoadError("");
    setContactoForm({
      instagram: contacto.instagram || "",
      telefono: normalizeChilePhoneInput(contacto.telefono || ""),
      ubicacion: contacto.ubicacion || "",
    });
  }, []);

  const handleContactoInputChange = useCallback(
    (event) => {
      clearInvalidFieldStyle(event.target);
      const { name, value } = event.target;
      if (name === "telefono") {
        setContactoForm((prev) => ({ ...prev, telefono: normalizeChilePhoneInput(value) }));
        return;
      }
      setContactoForm((prev) => ({ ...prev, [name]: value }));
    },
    [clearInvalidFieldStyle]
  );

  const handleContactoSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validateFormWithToast(event.currentTarget)) return;
      const normalizedTelefono = normalizeChilePhoneInput(contactoForm.telefono, { allowEmpty: true });
      if (!isValidChilePhone(normalizedTelefono)) {
        pushToast("El telefono debe comenzar con +56 y contener 9 digitos adicionales.", "error");
        return;
      }
      setContactoSaving(true);

      try {
        const data = await updateContactoAdmin({ ...contactoForm, telefono: normalizedTelefono });
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

  const reloadContacto = useCallback(async () => {
    setContactoLoading(true);
    setContactoLoadError("");
    try {
      const data = await getContactoAdmin();
      bootstrapContacto(data);
      pushToast("Datos de contacto cargados correctamente.", "success");
      return true;
    } catch (error) {
      const message = getErrorText(error, "No se pudieron cargar los datos de contacto.");
      setContactoLoadError(message);
      pushToast(message, "error");
      return false;
    } finally {
      setContactoLoading(false);
    }
  }, [bootstrapContacto, getErrorText, pushToast]);

  return {
    contactoForm,
    contactoSaving,
    contactoLoading,
    contactoLoadError,
    setContactoForm,
    bootstrapContacto,
    handleContactoInputChange,
    handleContactoSubmit,
    reloadContacto,
  };
}

import { useCallback, useMemo, useState } from "react";
import { createAdminUser, deleteAdminUser, listAdminUsers, updateAdminUser } from "../../../services/authService";
import { paginateItems } from "../../shared/components/AdminPagination";
import { initialCreateUserForm } from "../../shared/constants/adminInitialState";
import { normalizeAdminUsersResponse } from "../../shared/utils/adminText";

export default function useAdminUsers({
  pushToast,
  getErrorText,
  clearInvalidFieldStyle,
  validateFormWithToast,
}) {
  const [createUserForm, setCreateUserForm] = useState(initialCreateUserForm);
  const [createUserSaving, setCreateUserSaving] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(true);
  const [adminUsersLoadError, setAdminUsersLoadError] = useState("");
  const [adminUsersPage, setAdminUsersPage] = useState(1);
  const [adminUserEditModal, setAdminUserEditModal] = useState(null);
  const [adminUserDeleteModal, setAdminUserDeleteModal] = useState(null);
  const [adminUserModalSaving, setAdminUserModalSaving] = useState(false);
  const [adminUserModalError, setAdminUserModalError] = useState("");

  const fetchUsersList = useCallback(async () => {
    try {
      const payload = await listAdminUsers();
      const users = normalizeAdminUsersResponse(payload);
      setAdminUsers(users);
      setAdminUsersLoadError("");
      return users;
    } catch (error) {
      setAdminUsersLoadError(getErrorText(error, "No se pudo cargar la lista de usuarios."));
      throw error;
    }
  }, [getErrorText]);

  const handleCreateUserInputChange = useCallback(
    (event) => {
      clearInvalidFieldStyle(event.target);
      const { name, value } = event.target;
      setCreateUserForm((prev) => ({ ...prev, [name]: value }));
    },
    [clearInvalidFieldStyle]
  );

  const handleCreateUserSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validateFormWithToast(event.currentTarget)) return;
      if (createUserForm.password !== createUserForm.confirm_password) {
        pushToast("Las contrasenas no coinciden.", "error");
        return;
      }

      setCreateUserSaving(true);
      try {
        await createAdminUser({
          first_name: createUserForm.first_name,
          last_name: createUserForm.last_name,
          username: createUserForm.username,
          email: createUserForm.email,
          telefono: createUserForm.telefono,
          rol: createUserForm.rol,
          password: createUserForm.password,
          confirm_password: createUserForm.confirm_password,
        });
        await fetchUsersList().catch(() => {});
        setCreateUserForm(initialCreateUserForm);
        pushToast("Usuario creado correctamente.", "success");
      } catch (error) {
        pushToast(getErrorText(error, "No se pudo crear el usuario."), "error");
      } finally {
        setCreateUserSaving(false);
      }
    },
    [createUserForm, fetchUsersList, getErrorText, pushToast, validateFormWithToast]
  );

  const openAdminUserEditModal = useCallback((user) => {
    setAdminUserModalError("");
    setAdminUserEditModal({
      id: user?.id,
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      username: user?.username || "",
      email: user?.email || "",
      telefono: user?.telefono || "",
      rol: user?.rol || "",
    });
  }, []);

  const closeAdminUserEditModal = useCallback(
    (forceClose = false) => {
      if (adminUserModalSaving && !forceClose) return;
      setAdminUserEditModal(null);
      setAdminUserModalError("");
    },
    [adminUserModalSaving]
  );

  const openAdminUserDeleteModal = useCallback((user) => {
    setAdminUserModalError("");
    const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    setAdminUserDeleteModal({
      id: user?.id,
      name: fullName || user?.username || "este usuario",
    });
  }, []);

  const closeAdminUserDeleteModal = useCallback(
    (forceClose = false) => {
      if (adminUserModalSaving && !forceClose) return;
      setAdminUserDeleteModal(null);
      setAdminUserModalError("");
    },
    [adminUserModalSaving]
  );

  const handleAdminUserEditInputChange = useCallback(
    (event) => {
      clearInvalidFieldStyle(event.target);
      const { name, value } = event.target;
      setAdminUserEditModal((prev) => (prev ? { ...prev, [name]: value } : prev));
    },
    [clearInvalidFieldStyle]
  );

  const submitAdminUserEdit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!adminUserEditModal) return;
      if (!validateFormWithToast(event.currentTarget)) return;
      setAdminUserModalSaving(true);
      setAdminUserModalError("");
      try {
        const updated = await updateAdminUser(adminUserEditModal.id, {
          first_name: adminUserEditModal.first_name,
          last_name: adminUserEditModal.last_name,
          username: adminUserEditModal.username,
          email: adminUserEditModal.email,
          telefono: adminUserEditModal.telefono,
          rol: adminUserEditModal.rol,
        });
        const nextUser = updated?.user || updated;
        setAdminUsers((prev) => prev.map((item) => (item.id === adminUserEditModal.id ? { ...item, ...nextUser } : item)));
        pushToast("Usuario actualizado correctamente.", "success");
        closeAdminUserEditModal(true);
      } catch (error) {
        const message = getErrorText(error, "No se pudo actualizar el usuario.");
        setAdminUserModalError(message);
        pushToast(message, "error");
      } finally {
        setAdminUserModalSaving(false);
      }
    },
    [adminUserEditModal, closeAdminUserEditModal, getErrorText, pushToast, validateFormWithToast]
  );

  const submitAdminUserDelete = useCallback(async () => {
    if (!adminUserDeleteModal) return;
    setAdminUserModalSaving(true);
    setAdminUserModalError("");
    try {
      await deleteAdminUser(adminUserDeleteModal.id);
      setAdminUsers((prev) => prev.filter((item) => item.id !== adminUserDeleteModal.id));
      pushToast("Usuario eliminado correctamente.", "success");
      closeAdminUserDeleteModal(true);
    } catch (error) {
      const message = getErrorText(error, "No se pudo eliminar el usuario.");
      setAdminUserModalError(message);
      pushToast(message, "error");
    } finally {
      setAdminUserModalSaving(false);
    }
  }, [adminUserDeleteModal, closeAdminUserDeleteModal, getErrorText, pushToast]);

  const paginatedAdminUsers = useMemo(() => paginateItems(adminUsers, adminUsersPage, 10), [adminUsers, adminUsersPage]);

  return {
    createUserForm,
    setCreateUserForm,
    createUserSaving,
    adminUsers,
    setAdminUsers,
    adminUsersLoading,
    adminUsersLoadError,
    setAdminUsersLoadError,
    setAdminUsersLoading,
    adminUsersPage,
    setAdminUsersPage,
    adminUserEditModal,
    adminUserDeleteModal,
    adminUserModalSaving,
    adminUserModalError,
    fetchUsersList,
    handleCreateUserInputChange,
    handleCreateUserSubmit,
    openAdminUserEditModal,
    closeAdminUserEditModal,
    openAdminUserDeleteModal,
    closeAdminUserDeleteModal,
    handleAdminUserEditInputChange,
    submitAdminUserEdit,
    submitAdminUserDelete,
    paginatedAdminUsers,
  };
}

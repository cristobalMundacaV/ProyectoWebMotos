import { useEffect, useMemo, useState } from "react";
import {
  createTipoAtributo,
  createValorAtributoMoto,
  getTiposAtributo,
  getValoresAtributoMoto,
  updateValorAtributoMoto,
} from "../services/motosAdminService";
import AdminToastStack from "../../shared/components/AdminToastStack";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeText(value) {
  return String(value ?? "");
}

const FICHA_PLACEHOLDER_BY_ITEM = {
  tipo: "Motor de 4 cilindros en linea, 16 valvulas y doble arbol de levas (DOHC)",
  refrigeracion: "Liquida",
  alimentacion: "EFI inyeccion electronica",
  "diametro x carrera": "67 mm x 47 mm",
  cilindrada: "662,8 cc",
  "relacion de compresion": "11,8:1",
  "potencia maxima": "99 HP (74 kW) / 11500 rpm",
  "par maximo": "64 Nm / 10000 rpm",
  embrague: "Tipo antirrebote",
  cambio: "6 velocidades",
  "consumo homologado": "5,5 L/100 km",
  bateria: "12V 10AH",
  chasis: "Perimetral de acero",
  "suspension delantera": "Horquilla invertida KYB de 43 mm",
  "suspension trasera": "Monoamortiguador central",
  "neumatico delantero": "120/70 ZR17",
  "neumatico trasero": "180/55 ZR17",
  "freno delantero": "Doble disco, pinza fija de cuatro pistones, diametro de disco de 298 mm",
  "freno trasero": "Disco de 240 mm con pinza Nissin de 1 piston",
  abs: "Doble via",
  largo: "2090 mm",
  ancho: "950 mm",
  alto: "1210 mm",
  "distancia entre ejes": "1450 mm",
  "distancia al suelo": "130 mm",
  "altura asiento": "800 mm ajustable",
  "peso neto": "215 kg",
  "capacidad deposito": "15,5 L",
  "velocidad maxima": "235 km/h",
  "iluminacion led": "Si",
  "display 100% digital": "Si",
  "cuentakilometros total y parcial": "Si",
  "parabrisas regulable en altura": "Si",
  "medidor de combustible": "Si",
  reloj: "Si",
  "indicador de averia de inyeccion": "Si",
  "indicador de averia del abs bosch": "Si",
  "indicador de marcha engranada": "Si",
  "pantalla tft": "Si",
  "indicador de temperatura alta de motor": "Si",
  "sensor de presion neumaticos": "Si",
  "iluminacion full led": "Si",
  "arranque sin llave": "Si",
  "control crucero": "Si",
  "cubre punos": "Si",
  bluetooth: "Si",
  "conectividad bluetooth y navegacion": "Si",
  "luces de emergencia (hazard)": "Si",
  "calefaccion en asiento": "Si",
  "calefaccion en punos": "Si",
  "toma 12v, usb y usb-c": "Si",
  "camara frontal": "Si",
  "tcs desconectable": "Si",
  "parrilla trasera": "Si",
  "neblineros integrados": "Si",
  "defensas laterales": "Si",
  "juego de herramientas": "Si",
  "faros auxiliares": "Si",
  "interruptor de caballete lateral": "Si",
  radar: "Si",
  "anti shimmy": "Si",
  "instrumentacion tft a color": "Si",
  "sistema de frenos brembo y nissin": "Si",
  "sistema de control de traccion": "Si",
  "sistema quick shift": "Si",
  "toma usb": "Si",
  "dos modos de conduccion": "Si",
  "computadora de viaje": "Si",
  "launch control": "Si",
  "accionamiento valvula de salida de escape": "Si",
  frenos: "Brembo / Nissin",
};

function normalizeItemKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getFichaItemPlaceholder(itemName) {
  const key = normalizeItemKey(itemName);
  return FICHA_PLACEHOLDER_BY_ITEM[key] || `Ingresar valor para ${itemName}`;
}

function getFichaItemLabel(itemName) {
  const key = normalizeItemKey(itemName);
  if (key === "cubre punos") return "Cubre Puños";
  return itemName;
}

function isTruthyToggleValue(value) {
  const normalized = normalizeText(value).trim().toLowerCase();
  return ["si", "true", "1", "on", "activo"].includes(normalized);
}

function isFalsyToggleValue(value) {
  const normalized = normalizeText(value).trim().toLowerCase();
  return ["", "no", "false", "0", "off", "inactivo"].includes(normalized);
}

function isBooleanToggleCandidate({ sectionName, itemName, currentValue }) {
  const section = normalizeText(sectionName).trim().toUpperCase();
  if (section !== "EQUIPAMIENTO") return false;

  const placeholder = getFichaItemPlaceholder(itemName).trim().toLowerCase();
  const isSiDefault = placeholder === "si";
  return isSiDefault || isTruthyToggleValue(currentValue) || isFalsyToggleValue(currentValue);
}

export default function FichasTecnicasPage({ activeSection, motos = [] }) {
  const [selectedMotoId, setSelectedMotoId] = useState("");
  const [selectedSectionName, setSelectedSectionName] = useState("");
  const [valores, setValores] = useState([]);
  const [tiposAtributo, setTiposAtributo] = useState([]);
  const [draftById, setDraftById] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creatingSection, setCreatingSection] = useState(false);
  const [showCreateSectionModal, setShowCreateSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [creatingItem, setCreatingItem] = useState(false);
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemValue, setNewItemValue] = useState("");
  const [toasts, setToasts] = useState([]);

  function dismissToast(id) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  function showToast(message, variant = "success") {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }

  const isFichaSection =
    activeSection === "fichas_resumen" ||
    activeSection === "fichas_secciones" ||
    activeSection === "fichas_items";

  const motosDisponibles = useMemo(() => normalizeArray(motos), [motos]);

  useEffect(() => {
    if (!isFichaSection) return;
    if (selectedMotoId) return;
    if (motosDisponibles.length === 0) return;
    setSelectedMotoId(String(motosDisponibles[0].id));
  }, [isFichaSection, selectedMotoId, motosDisponibles]);

  useEffect(() => {
    if (!isFichaSection || !selectedMotoId) return;

    let mounted = true;
    setLoading(true);
    setSaving(false);

    Promise.all([getValoresAtributoMoto({ moto: selectedMotoId }), getTiposAtributo()])
      .then(([rows, tipos]) => {
        if (!mounted) return;
        const list = normalizeArray(rows);
        setTiposAtributo(normalizeArray(tipos));
        setValores(list);
        const nextDraft = {};
        list.forEach((item) => {
          nextDraft[item.id] = normalizeText(item.valor);
        });
        setDraftById(nextDraft);
      })
      .catch(() => {
        if (!mounted) return;
        setTiposAtributo([]);
        setValores([]);
        setDraftById({});
        showToast("No se pudieron cargar los items de ficha tecnica para esta moto.", "error");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isFichaSection, selectedMotoId]);

  const groupedSections = useMemo(() => {
    const map = new Map();

    normalizeArray(tiposAtributo).forEach((tipo) => {
      const key = tipo.nombre || "GENERAL";
      if (!map.has(key)) {
        map.set(key, {
          nombre: key,
          orden: Number(tipo.orden ?? 9999),
          tipoAtributoId: tipo.id ?? null,
          items: [],
        });
      }
    });

    normalizeArray(valores).forEach((item) => {
      const key = item.tipo_atributo_nombre || "GENERAL";
      if (!map.has(key)) {
        map.set(key, {
          nombre: key,
          orden: Number(item.tipo_atributo_orden ?? 9999),
          tipoAtributoId: item.tipo_atributo ?? null,
          items: [],
        });
      }
      if (!map.get(key).tipoAtributoId && item.tipo_atributo) {
        map.get(key).tipoAtributoId = item.tipo_atributo;
      }
      map.get(key).items.push(item);
    });

    const sections = Array.from(map.values())
      .map((section) => ({
        ...section,
        items: section.items.sort(
          (a, b) =>
            Number(a.orden ?? 0) - Number(b.orden ?? 0) ||
            String(a.nombre || "").localeCompare(String(b.nombre || ""), "es")
        ),
      }))
      .sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, "es"));

    return sections;
  }, [valores, tiposAtributo]);

  const selectedMoto = useMemo(
    () => motosDisponibles.find((moto) => String(moto.id) === String(selectedMotoId)) || null,
    [motosDisponibles, selectedMotoId]
  );

  const selectedSection = useMemo(() => {
    if (groupedSections.length === 0) return null;
    return groupedSections.find((section) => section.nombre === selectedSectionName) || groupedSections[0];
  }, [groupedSections, selectedSectionName]);

  useEffect(() => {
    if (groupedSections.length === 0) {
      setSelectedSectionName("");
      return;
    }
    if (!groupedSections.some((section) => section.nombre === selectedSectionName)) {
      setSelectedSectionName(groupedSections[0].nombre);
    }
  }, [groupedSections, selectedSectionName]);

  const hasChanges = useMemo(
    () =>
      normalizeArray(valores).some((item) => normalizeText(item.valor) !== normalizeText(draftById[item.id])),
    [valores, draftById]
  );

  function handleDraftChange(id, value) {
    setDraftById((prev) => ({ ...prev, [id]: value }));
  }

  async function handleCreateSection(event) {
    event.preventDefault();
    const nombre = normalizeText(newSectionName).trim();
    if (!nombre || creatingSection) return;

    const exists = groupedSections.some(
      (section) => normalizeItemKey(section.nombre) === normalizeItemKey(nombre)
    );
    if (exists) {
      showToast("Ya existe una seccion con ese nombre.", "error");
      return;
    }

    const nextOrden = groupedSections.reduce((max, section) => Math.max(max, Number(section.orden || 0)), 0) + 1;

    try {
      setCreatingSection(true);
      const created = await createTipoAtributo({
        nombre,
        orden: nextOrden,
        activo: true,
      });
      setTiposAtributo((prev) => [...prev, created]);
      setSelectedSectionName(created?.nombre || nombre);
      setNewSectionName("");
      setShowCreateSectionModal(false);
      showToast(`Seccion creada: ${created?.nombre || nombre}.`, "success");
    } catch (err) {
      const backendMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.nombre?.[0] ||
        err?.response?.data?.slug?.[0] ||
        err?.message ||
        "No se pudo crear la seccion.";
      showToast(String(backendMessage), "error");
    } finally {
      setCreatingSection(false);
    }
  }

  async function handleSave() {
    if (!hasChanges || saving) return;
    setSaving(true);

    const changed = normalizeArray(valores).filter(
      (item) => normalizeText(item.valor) !== normalizeText(draftById[item.id])
    );

    try {
      const successUpdates = [];
      const failed = [];

      // Guardado secuencial para evitar fallos intermitentes por saturacion en servidor.
      for (const item of changed) {
        try {
          const updated = await updateValorAtributoMoto(item.id, {
            valor: normalizeText(draftById[item.id]),
          });
          successUpdates.push(updated);
        } catch (err) {
          const backendMessage =
            err?.response?.data?.detail ||
            err?.response?.data?.valor?.[0] ||
            err?.response?.data?.non_field_errors?.[0] ||
            err?.message ||
            "Error desconocido";

          failed.push({
            item: item?.nombre || `ID ${item?.id ?? "?"}`,
            message: String(backendMessage),
          });
        }
      }

      if (successUpdates.length > 0) {
        const updatedById = new Map(successUpdates.map((item) => [item.id, item]));
        setValores((prev) => prev.map((item) => updatedById.get(item.id) || item));
      }

      if (failed.length === 0) {
        showToast(`Ficha tecnica guardada. Se actualizaron ${successUpdates.length} items.`, "success");
      } else if (successUpdates.length === 0) {
        showToast(
          `No se pudo guardar la ficha tecnica. Error en ${failed[0].item}: ${failed[0].message}`,
          "error"
        );
      } else {
        showToast(
          `Se guardaron ${successUpdates.length} items y fallaron ${failed.length}. Primer error: ${failed[0].item}: ${failed[0].message}`,
          "error"
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateItem(event) {
    event.preventDefault();
    if (creatingItem || !selectedMoto || !selectedSection) return;

    const itemName = normalizeText(newItemName).trim();
    const itemValue = normalizeText(newItemValue).trim();
    if (!itemName) return;

    const existsInSection = normalizeArray(selectedSection.items).some(
      (item) => normalizeItemKey(item.nombre) === normalizeItemKey(itemName)
    );
    if (existsInSection) {
      showToast("Ya existe un item con ese nombre en esta seccion.", "error");
      return;
    }

    const tipoAtributoId =
      selectedSection.tipoAtributoId ||
      normalizeArray(tiposAtributo).find(
        (tipo) => normalizeItemKey(tipo.nombre) === normalizeItemKey(selectedSection.nombre)
      )?.id;

    if (!tipoAtributoId) {
      showToast("No se encontro la seccion activa para crear el item.", "error");
      return;
    }

    const nextOrden =
      normalizeArray(selectedSection.items).reduce((max, item) => Math.max(max, Number(item.orden || 0)), 0) + 1;

    try {
      setCreatingItem(true);
      const created = await createValorAtributoMoto({
        moto: selectedMoto.id,
        tipo_atributo: tipoAtributoId,
        nombre: itemName,
        valor: itemValue,
        orden: nextOrden,
      });

      setValores((prev) => [...prev, created]);
      setDraftById((prev) => ({ ...prev, [created.id]: normalizeText(created.valor) }));
      setNewItemName("");
      setNewItemValue("");
      setShowCreateItemModal(false);
      showToast(`Item creado: ${created?.nombre || itemName}.`, "success");
    } catch (err) {
      const backendMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.nombre?.[0] ||
        err?.response?.data?.non_field_errors?.[0] ||
        err?.message ||
        "No se pudo crear el item.";
      showToast(String(backendMessage), "error");
    } finally {
      setCreatingItem(false);
    }
  }

  if (!isFichaSection) return null;

  return (
    <section className="admin-content-grid admin-content-grid-mantenciones admin-content-grid-mantenciones-fichas">
      <AdminToastStack toasts={toasts} onDismiss={dismissToast} />

      <article className="admin-panel-card">
        <div className="admin-card-header">
          <h2>Fichas tecnicas</h2>
          <span>Modelos a la izquierda y formulario editable a la derecha</span>
        </div>

        <div className="admin-mantencion-fichas-layout admin-ficha-layout">
          <aside className="admin-mantencion-fichas-list admin-ficha-motos-list">
            {motosDisponibles.map((moto) => {
              const isActive = String(moto.id) === String(selectedMotoId);
              return (
                <button
                  key={moto.id}
                  type="button"
                  className={isActive ? "admin-mantencion-ficha-item active" : "admin-mantencion-ficha-item"}
                  onClick={() => setSelectedMotoId(String(moto.id))}
                >
                  <div className="admin-mantencion-ficha-item-top">
                    <strong>{moto.modelo || "-"}</strong>
                    <span className="admin-status-pill status-aceptada">MODELO</span>
                  </div>
                  <span>{moto.marca_nombre || "Sin marca"}</span>
                  <small>{moto.categoria_nombre || "Sin categoria"}</small>
                </button>
              );
            })}
            {motosDisponibles.length === 0 && <p className="admin-empty">No hay motos disponibles.</p>}
          </aside>

          <div className="admin-mantencion-ficha-detail admin-ficha-form-panel">
            {!selectedMoto && <p className="admin-empty">Selecciona una moto para editar su ficha tecnica.</p>}

            {selectedMoto && (
              <>
                <div className="admin-ficha-model-head">
                  <h3>{selectedMoto.modelo || "Ficha tecnica"}</h3>
                  <span className="admin-status-pill status-aceptada">
                    {selectedMoto.marca_nombre || "MOTO"}
                  </span>
                </div>

                {loading && <p className="admin-empty">Cargando items de ficha tecnica...</p>}
                {!loading && groupedSections.length === 0 && (
                  <p className="admin-empty">
                    Esta moto no tiene items de ficha tecnica. Ejecuta migraciones o revisa la carga inicial.
                  </p>
                )}

                {!loading && groupedSections.length > 0 && (
                  <>
                    <div className="admin-ficha-section-tabs admin-mantencion-tabs" role="tablist" aria-label="Secciones de ficha tecnica">
                      {groupedSections.map((section) => {
                        const isActive = section.nombre === selectedSection?.nombre;
                        return (
                          <button
                            key={section.nombre}
                            type="button"
                            className={isActive ? "admin-mantencion-tab active" : "admin-mantencion-tab"}
                            onClick={() => setSelectedSectionName(section.nombre)}
                            role="tab"
                            aria-selected={isActive}
                          >
                            {section.nombre}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        className="admin-mantencion-tab admin-ficha-add-tab"
                        onClick={() => setShowCreateSectionModal(true)}
                        aria-label="Agregar nueva seccion"
                        title="Agregar nueva seccion"
                      >
                        +
                      </button>
                    </div>

                    <div className="admin-ficha-sections">
                      {selectedSection && (
                        <section key={selectedSection.nombre} className="admin-ficha-section-card">
                          <header className="admin-ficha-section-head">
                            <h4>{selectedSection.nombre}</h4>
                            <span>{selectedSection.items.length} items</span>
                          </header>

                          <div className="admin-ficha-items-grid">
                            {selectedSection.items.map((item) => (
                              <label key={item.id} className="admin-ficha-item-field">
                                <span>{getFichaItemLabel(item.nombre)}</span>
                                {isBooleanToggleCandidate({
                                  sectionName: selectedSection.nombre,
                                  itemName: item.nombre,
                                  currentValue: draftById[item.id],
                                }) ? (
                                  <button
                                    type="button"
                                    className={
                                      isTruthyToggleValue(draftById[item.id])
                                        ? "admin-ficha-toggle is-on"
                                        : "admin-ficha-toggle is-off"
                                    }
                                    onClick={() =>
                                      handleDraftChange(
                                        item.id,
                                        isTruthyToggleValue(draftById[item.id]) ? "" : "Si"
                                      )
                                    }
                                    aria-pressed={isTruthyToggleValue(draftById[item.id])}
                                  >
                                    <span className="admin-ficha-toggle-pill" aria-hidden="true">
                                      <span className="admin-ficha-toggle-dot" />
                                    </span>
                                    <span className="admin-ficha-toggle-label">
                                      {isTruthyToggleValue(draftById[item.id]) ? "ACTIVO" : "SIN DEFINIR"}
                                    </span>
                                  </button>
                                ) : (
                                  <input
                                    value={normalizeText(draftById[item.id])}
                                    onChange={(event) => handleDraftChange(item.id, event.target.value)}
                                    placeholder={getFichaItemPlaceholder(item.nombre)}
                                  />
                                )}
                              </label>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  </>
                )}

                <div className="admin-mantencion-ficha-actions admin-ficha-save-actions">
                  <button
                    type="button"
                    className="admin-ficha-outline-action"
                    onClick={() => setShowCreateItemModal(true)}
                    disabled={loading || !selectedSection || !selectedMoto}
                  >
                    Agregar item
                  </button>
                  <button
                    type="button"
                    className="admin-primary-action admin-mantencion-action-btn admin-mantencion-save-btn"
                    onClick={handleSave}
                    disabled={!hasChanges || saving || loading || groupedSections.length === 0}
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </article>

      {showCreateSectionModal && (
        <div
          className="admin-ficha-modal-overlay"
          role="presentation"
          onClick={() => {
            if (creatingSection) return;
            setShowCreateSectionModal(false);
          }}
        >
          <div
            className="admin-ficha-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-section-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-ficha-modal-head">
              <h3 id="create-section-title">Nueva seccion</h3>
              <button
                type="button"
                onClick={() => setShowCreateSectionModal(false)}
                disabled={creatingSection}
                aria-label="Cerrar modal"
              >
                X
              </button>
            </div>

            <form
              className="admin-ficha-modal-form"
              onSubmit={handleCreateSection}
            >
              <p>Ingresa el nombre de la nueva seccion para crear una pestana adicional.</p>
              <label>
                Nombre de la seccion
                <input
                  value={newSectionName}
                  onChange={(event) => setNewSectionName(event.target.value)}
                  placeholder="Ej: Seguridad"
                  autoFocus
                  disabled={creatingSection}
                />
              </label>

              <div className="admin-ficha-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-action"
                  onClick={() => setShowCreateSectionModal(false)}
                  disabled={creatingSection}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="admin-primary-action"
                  disabled={creatingSection || normalizeText(newSectionName).trim().length < 2}
                >
                  {creatingSection ? "Creando..." : "Crear seccion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateItemModal && (
        <div
          className="admin-ficha-modal-overlay"
          role="presentation"
          onClick={() => {
            if (creatingItem) return;
            setShowCreateItemModal(false);
          }}
        >
          <div
            className="admin-ficha-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-item-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-ficha-modal-head">
              <h3 id="create-item-title">Nuevo item</h3>
              <button
                type="button"
                onClick={() => setShowCreateItemModal(false)}
                disabled={creatingItem}
                aria-label="Cerrar modal"
              >
                X
              </button>
            </div>

            <form className="admin-ficha-modal-form" onSubmit={handleCreateItem}>
              <p>
                Agrega un item nuevo a la seccion <strong>{selectedSection?.nombre || "-"}</strong>.
              </p>

              <label>
                Nombre del item
                <input
                  value={newItemName}
                  onChange={(event) => setNewItemName(event.target.value)}
                  placeholder="Ej: Control de estabilidad"
                  autoFocus
                  disabled={creatingItem}
                />
              </label>

              <label>
                Valor inicial (opcional)
                <input
                  value={newItemValue}
                  onChange={(event) => setNewItemValue(event.target.value)}
                  placeholder="Ej: Si / 120 HP / N/A"
                  disabled={creatingItem}
                />
              </label>

              <div className="admin-ficha-modal-actions">
                <button
                  type="button"
                  className="admin-ficha-outline-action"
                  onClick={() => setShowCreateItemModal(false)}
                  disabled={creatingItem}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="admin-primary-action"
                  disabled={creatingItem || normalizeText(newItemName).trim().length < 2}
                >
                  {creatingItem ? "Creando..." : "Crear item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

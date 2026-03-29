function getFichaMobileLabel(item) {
  const moto = item?.moto_cliente_detalle || {};
  return `${moto.marca || "-"} ${moto.modelo || "-"} - ${moto.cliente_nombre || "Cliente"}`;
}

export default function FichaMobilePicker({
  loading,
  items,
  selectedId,
  onSelect,
  emptyText,
  pickerKey,
  mobilePickerOpen,
  onToggle,
  onClose,
}) {
  if (loading) {
    return null;
  }

  if (!items.length) {
    return <p className="admin-empty admin-mantencion-ficha-mobile-picker-empty">{emptyText}</p>;
  }

  const selectedValue = selectedId != null ? String(selectedId) : String(items[0].id);
  const selectedItem = items.find((item) => String(item.id) === selectedValue);
  const isOpen = Boolean(mobilePickerOpen[pickerKey]);

  return (
    <div className="admin-mantencion-ficha-mobile-picker">
      <label>Seleccionar ficha</label>
      <button
        type="button"
        className={isOpen ? "admin-mantencion-mobile-trigger is-open" : "admin-mantencion-mobile-trigger"}
        onClick={() => onToggle(pickerKey)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{getFichaMobileLabel(selectedItem || items[0])}</span>
        <span aria-hidden="true">{isOpen ? "^" : "v"}</span>
      </button>

      {isOpen && (
        <div className="admin-mantencion-mobile-options" role="listbox" aria-label="Fichas disponibles">
          {items.map((item) => {
            const isActive = String(item.id) === selectedValue;
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={isActive}
                className={isActive ? "admin-mantencion-mobile-option active" : "admin-mantencion-mobile-option"}
                onClick={() => {
                  onSelect(item.id);
                  onClose(pickerKey);
                }}
              >
                {getFichaMobileLabel(item)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


import { useEffect, useMemo, useRef, useState } from "react";

function buildSyntheticSelectEvent(name, value) {
  return {
    target: {
      name,
      value,
      type: "select-one",
      checked: false,
      classList: { remove: () => {} },
    },
  };
}

export default function AdminYearDropdown({
  name = "anio",
  value = "",
  options = [],
  placeholder = `Selecciona un A${String.fromCharCode(241)}o`,
  required = false,
  disabled = false,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const normalizedOptions = useMemo(
    () => options.map((item) => String(item)),
    [options]
  );

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedValue = String(value || "");

  function applyYear(nextValue) {
    if (typeof onChange === "function") {
      onChange(buildSyntheticSelectEvent(name, String(nextValue || "")));
    }
    setOpen(false);
  }

  return (
    <div className="admin-year-select" ref={rootRef}>
      <button
        type="button"
        className={open ? "admin-year-select-trigger open" : "admin-year-select-trigger"}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selectedValue || placeholder}</span>
        <span aria-hidden="true">{"\u25BE"}</span>
      </button>

      {open && !disabled && (
        <div className="admin-year-select-menu" role="listbox" aria-label={name}>
          <button
            type="button"
            role="option"
            className={!selectedValue ? "admin-year-select-option active" : "admin-year-select-option"}
            aria-selected={!selectedValue}
            onClick={() => applyYear("")}
          >
            {placeholder}
          </button>
          {normalizedOptions.map((year) => (
            <button
              key={year}
              type="button"
              role="option"
              className={selectedValue === year ? "admin-year-select-option active" : "admin-year-select-option"}
              aria-selected={selectedValue === year}
              onClick={() => applyYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      <select
        className="admin-year-select-native-proxy"
        name={name}
        value={selectedValue}
        onChange={onChange}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
      >
        <option value="">{placeholder}</option>
        {normalizedOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

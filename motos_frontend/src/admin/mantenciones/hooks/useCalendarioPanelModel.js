import { useMemo } from "react";

export default function useCalendarioPanelModel(calendar) {
  return useMemo(
    () => ({
      loading: calendar.calendarLoading,
      error: calendar.calendarError,
      month: {
        label: calendar.calendarMonthLabel,
        cells: calendar.calendarCells,
        summary: calendar.monthSummary,
        prev: calendar.goToPrevMonth,
        next: calendar.goToNextMonth,
      },
      day: {
        selectedDate: calendar.selectedCalendarDate,
        setSelectedDate: calendar.setSelectedCalendarDate,
        selected: calendar.selectedCalendarDay,
        isHoliday: calendar.selectedCalendarIsHoliday,
        openActivate: calendar.openActivateDayModal,
        block: calendar.executeDayBlocking,
        activate: calendar.executeDayActivation,
        toggleSlot: calendar.executeSlotToggle,
      },
      state: {
        dayBlockSaving: calendar.dayBlockSaving,
        dayBlockError: calendar.dayBlockError,
        dayActivateSaving: calendar.dayActivateSaving,
        dayActivateError: calendar.dayActivateError,
        dayActivateForm: calendar.dayActivateForm,
        slotToggleSaving: calendar.slotToggleSaving,
        slotToggleError: calendar.slotToggleError,
      },
      modals: {
        dayBlockConfirm: calendar.dayBlockConfirm,
        slotToggleConfirm: calendar.slotToggleConfirm,
        dayActivateModalOpen: calendar.dayActivateModalOpen,
        closeDayBlock: calendar.closeDayBlockConfirm,
        closeSlotToggle: calendar.closeSlotToggleConfirm,
        closeDayActivate: calendar.closeDayActivateModal,
        setDayActivateField: calendar.handleDayActivateFieldChange,
      },
    }),
    [calendar]
  );
}


import React, { useState, useEffect, useRef } from "react";
import { LuCalendar, LuX } from "react-icons/lu";
import moment from "moment";

const CustomCalendar = ({ value, onChange, placeholder = "Select Date" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(value ? moment(value) : null);
  const containerRef = useRef(null);


  useEffect(() => {
    if (value) {
      const m = moment(value);
      setSelectedDate(m);
      setCurrentDate(m.clone());
    } else {
      setSelectedDate(null);
    }
  }, [value]);


  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside, true);
    return () =>
      document.removeEventListener("pointerdown", handleOutside, true);
  }, []);


  useEffect(() => {
    const key = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);

  const daysInMonth = currentDate.daysInMonth();
  const startOfMonth = currentDate.clone().startOf("month");
  const startDay = startOfMonth.day();

  const months = moment.months();
  const weekDays = moment.weekdaysShort();

  const handleDateClick = (day) => {
    const newDate = currentDate.clone().date(day);
    setSelectedDate(newDate);
    onChange?.(newDate.format("YYYY-MM-DD"));
    setIsOpen(false);
  };

  const handleMonthChange = (monthIndex) => {
    setCurrentDate(currentDate.clone().month(monthIndex));
  };

  const handleYearChange = (year) => {
    setCurrentDate(currentDate.clone().year(year));
  };

  const isToday = (day) =>
    moment().isSame(currentDate.clone().date(day), "day");
  const isSelected = (day) =>
    selectedDate?.isSame(currentDate.clone().date(day), "day");

  const clearDate = () => {
    setSelectedDate(null);
    onChange?.("");
  };

  const renderCalendarDays = () => {
    const cells = [];

    for (let i = 0; i < startDay; i++)
      cells.push(<div key={`empty-${i}`} className="w-8 h-8" />);

    for (let day = 1; day <= daysInMonth; day++) {
      const current = isToday(day);
      const chosen = isSelected(day);
      cells.push(
        <button
          key={day}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDateClick(day);
          }}
          aria-selected={chosen}
          className={`
            w-8 h-8 text-sm rounded-lg transition-all duration-150
            ${chosen
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : current
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}
          `}
        >
          {day}
        </button>
      );
    }
    return cells;
  };


  const yearOptions = [];
  const thisYear = moment().year();
  for (let y = thisYear - 50; y <= thisYear + 50; y++) {
    yearOptions.push(y);
  }

  return (
    <div className="relative" ref={containerRef}>

      <div
        onMouseDown={(e) => {
          e.preventDefault();
          setIsOpen((o) => !o);
        }}
        className="calendar-input cursor-pointer flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 transition-all duration-150"
      >
        <span className={selectedDate ? "text-gray-900" : "text-gray-400"}>
          {selectedDate
            ? selectedDate.format("MMM DD, YYYY")
            : placeholder}
        </span>

        <div className="flex items-center gap-2">
          {selectedDate && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearDate();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear date"
            >
              <LuX className="w-4 h-4" />
            </button>
          )}
          <LuCalendar className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-transparent">
          <div
            role="dialog"
            aria-label="Calendar"
            aria-modal="true"
            className="relative bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 w-80 
                       transform origin-top transition-all duration-200 scale-100 opacity-100"
            onMouseDown={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between mb-4 gap-2">
              <select
                value={currentDate.year()}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                value={currentDate.month()}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                {months.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((d) => (
                <div
                  key={d}
                  className="text-xs font-medium text-gray-500 text-center py-2"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  const today = moment();
                  setSelectedDate(today);
                  setCurrentDate(today);
                  onChange?.(today.format("YYYY-MM-DD"));
                  setIsOpen(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Today
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;

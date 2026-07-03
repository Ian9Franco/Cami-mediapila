"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";

interface DateTimeStepProps {
  onBack: () => void;
  onNext: (selections: { date: Date; time: string }[]) => void;
  initialSelections?: { date: Date; time: string }[];
}

interface CalendarEvent {
  day: number;
  month: number; // 0-indexed (July is 6)
  year: number;
  label: string;
  type: "match" | "holiday";
  badge: string;
}

const SPECIAL_EVENTS: CalendarEvent[] = [
  { day: 7, month: 6, year: 2026, label: "Octavos de Final - Atlanta (13:00 hs)", type: "match", badge: "⚽" },
  { day: 11, month: 6, year: 2026, label: "Cuartos de Final (Mundial)", type: "match", badge: "⚽" },
  { day: 14, month: 6, year: 2026, label: "Semifinal (Mundial)", type: "match", badge: "⚽" },
  { day: 15, month: 6, year: 2026, label: "Semifinal (Mundial)", type: "match", badge: "⚽" },
  { day: 18, month: 6, year: 2026, label: "Tercer Puesto - Miami (Mundial)", type: "match", badge: "⚽" },
  { day: 19, month: 6, year: 2026, label: "Gran Final - Nueva York/Nueva Jersey", type: "match", badge: "🏆" },
  { day: 20, month: 6, year: 2026, label: "Día del Amigo", type: "holiday", badge: "🧑‍🤝‍🧑" },
];

export default function DateTimeStep({ onBack, onNext, initialSelections }: DateTimeStepProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selections, setSelections] = useState<{ date: Date; time: string }[]>(initialSelections || []);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  // Auto-dismiss the custom toast warning after 3.5 seconds
  useEffect(() => {
    if (showLimitWarning) {
      const timer = setTimeout(() => {
        setShowLimitWarning(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showLimitWarning]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const prevMonth = () => {
    const targetMonth = new Date(year, month - 1, 1);
    if (targetMonth.getMonth() >= today.getMonth() || targetMonth.getFullYear() > today.getFullYear()) {
      setCurrentDate(targetMonth);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (dayNum: number) => {
    const clickedDate = new Date(year, month, dayNum);
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedClicked = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());

    if (normalizedClicked >= normalizedToday) {
      setSelections((prev) => {
        const exists = prev.some(
          (s) =>
            s.date.getDate() === clickedDate.getDate() &&
            s.date.getMonth() === clickedDate.getMonth() &&
            s.date.getFullYear() === clickedDate.getFullYear()
        );

        if (exists) {
          // Remove if already selected (deselect)
          return prev.filter(
            (s) =>
              !(
                s.date.getDate() === clickedDate.getDate() &&
                s.date.getMonth() === clickedDate.getMonth() &&
                s.date.getFullYear() === clickedDate.getFullYear()
              )
          );
        } else {
          // Add if not selected, limit to 6 options
          if (prev.length >= 6) {
            setShowLimitWarning(true);
            return prev;
          }
          return [...prev, { date: clickedDate, time: "elegi-vos-hora" }];
        }
      });
    }
  };

  const isSelected = (dayNum: number) => {
    return selections.some(
      (s) =>
        s.date.getDate() === dayNum &&
        s.date.getMonth() === month &&
        s.date.getFullYear() === year
    );
  };

  const isPast = (dayNum: number) => {
    const targetDate = new Date(year, month, dayNum);
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    return normalizedTarget < normalizedToday;
  };

  const getSpecialEvent = (dayNum: number) => {
    return SPECIAL_EVENTS.find(
      (e) => e.day === dayNum && e.month === month && e.year === year
    );
  };

  const blanks = Array.from({ length: firstDayIndex });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const daysOfWeek = ["L", "M", "M", "J", "V", "S", "D"];

  const handleContinue = () => {
    if (selections.length > 0) {
      onNext(selections);
    }
  };

  const handleTimeChange = (index: number, timeValue: string) => {
    setSelections((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, time: timeValue } : s))
    );
  };

  // Get dynamic slots based on the date rules
  const getTimeSlotsForDate = (date: Date) => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const baseSlots = isWeekend
      ? [
          { value: "10:30", label: "10:30 hs - Mañana" },
          { value: "13:30", label: "13:30 hs - Almuerzo" },
          { value: "16:00", label: "16:00 hs - Tarde / Café" },
          { value: "18:30", label: "18:30 hs - Tarde / Atardecer" },
          { value: "21:30", label: "21:30 hs - Noche / Cena" },
          { value: "23:30", label: "23:30 hs - Noche / Tragos" }
        ]
      : [
          { value: "08:30", label: "08:30 hs - Mañana" },
          { value: "10:00", label: "10:00 hs - Mañana" },
          { value: "11:30", label: "11:30 hs - Mañana" },
          { value: "19:00", label: "19:00 hs - Noche" },
          { value: "20:30", label: "20:30 hs - Noche" },
          { value: "22:00", label: "22:00 hs - Noche" }
        ];

    // Add "Elegí vos" option at the end
    return [
      ...baseSlots,
      { value: "elegi-vos-hora", label: "🤷‍♀️ Elegí vos (El que prefieras)" }
    ];
  };

  const getFormattedDateLabel = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };
    const formatted = date.toLocaleDateString("es-AR", options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const selectedDates = selections.map((s) => s.date);
  const activeDate = selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null;
  const selectedDateEvent = activeDate ? SPECIAL_EVENTS.find(
    (e) => e.day === activeDate.getDate() && e.month === activeDate.getMonth() && e.year === activeDate.getFullYear()
  ) : null;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-indigo-50 rounded-3xl p-6 md:p-8 shadow-romantic-lg glass-panel relative overflow-hidden"
        style={{
          backgroundImage: "url('/2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Animated semi-transparent overlay to ensure text readability */}
        <motion.div 
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 0.8, backdropFilter: "blur(1.5px)" }}
          transition={{ duration: 1.0, delay: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 bg-white z-0 pointer-events-none"
        />

        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-2 rounded-t-3xl chroma-border z-10" />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
          className="relative z-10 flex flex-col w-full h-full"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-love-dark text-center mb-1 flex items-center justify-center gap-2">
            ¿Cuándo nos vemos? 📅
          </h2>
          <p className="text-sm text-love-dark/70 text-center mb-6">
            Elegí los días (marcar hasta 6) y el horario de cada uno.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            {/* Calendar Section (Left) */}
            <div className="md:col-span-7 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  disabled={month === today.getMonth() && year === today.getFullYear()}
                  className="p-2 text-love-accent hover:bg-love-light rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-serif text-lg font-bold text-love-dark">
                  {monthNames[month]} {year}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-2 text-love-accent hover:bg-love-light rounded-full transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {daysOfWeek.map((day, idx) => (
                  <div key={idx} className="text-xs font-bold text-love-accent/60 uppercase">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {blanks.map((_, idx) => (
                  <div key={`blank-${idx}`} className="aspect-square" />
                ))}
                
                {days.map((dayNum) => {
                  const dayIsPast = isPast(dayNum);
                  const dayIsSelected = isSelected(dayNum);
                  const event = getSpecialEvent(dayNum);

                  return (
                    <button
                      key={`day-${dayNum}`}
                      type="button"
                      disabled={dayIsPast}
                      onClick={() => handleDateSelect(dayNum)}
                      className={`aspect-square flex flex-col items-center justify-center rounded-full text-sm font-semibold transition-all relative cursor-pointer
                        ${dayIsPast ? "text-gray-200 cursor-not-allowed" : ""}
                        ${!dayIsPast && !dayIsSelected ? "text-love-dark hover:bg-love-light" : ""}
                        ${dayIsSelected ? "bg-love-primary text-white shadow-romantic" : ""}
                      `}
                    >
                      <span>{dayNum}</span>
                      
                      {/* Event indicators */}
                      {event && !dayIsPast && (
                        <span className={`absolute bottom-0.5 text-[8px] ${dayIsSelected ? "text-white" : "text-love-gold"}`}>
                          {event.badge}
                        </span>
                      )}

                      {dayIsSelected && (
                        <motion.div
                          layoutId="active-day-glow"
                          className="absolute inset-0 border-2 border-love-gold rounded-full scale-110 pointer-events-none"
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Caption */}
              <p className="text-[11px] md:text-xs font-bold text-love-accent/80 italic mt-4 text-center">
                Tenemos que vernos antes que termine el mundial o terminamos mal 😤
              </p>
            </div>

            {/* Time Slots Section (Right) */}
            <div className="md:col-span-5 flex flex-col justify-start">
              <h3 className="text-sm font-bold text-love-dark/80 mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-love-primary" />
                Horarios por día:
              </h3>

              <AnimatePresence mode="wait">
                {selections.length > 0 ? (
                  <motion.div
                    key="slots-container"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col gap-3"
                  >
                    {/* Special Event warning */}
                    {selectedDateEvent && (
                      <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-start gap-2
                        ${selectedDateEvent.type === "match"
                          ? "bg-sky-50 border-sky-100 text-sky-800"
                          : "bg-amber-50 border-amber-100 text-amber-800"
                        }
                      `}>
                        <span className="text-base leading-none">{selectedDateEvent.badge}</span>
                        <div>
                          <p className="font-bold">
                            {selectedDateEvent.type === "match" ? "¡Hoy juega Argentina! 🇦🇷" : "¡Feriado Especial!"}
                          </p>
                          <p className="font-medium opacity-90">{selectedDateEvent.label}</p>
                        </div>
                      </div>
                    )}

                    {/* Slots list */}
                    <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {selections.map((sel, idx) => {
                        const slots = getTimeSlotsForDate(sel.date);
                        return (
                          <div key={idx} className="flex flex-col gap-1 p-2.5 bg-white/60 backdrop-blur-xs border border-indigo-50/50 rounded-2xl shadow-xs">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[11px] font-bold text-love-dark flex items-center gap-1">
                                📅 {getFormattedDateLabel(sel.date)}
                              </span>
                            </div>
                            
                            <div className="relative mt-1">
                              <select
                                value={sel.time}
                                onChange={(e) => handleTimeChange(idx, e.target.value)}
                                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-indigo-50 hover:border-love-secondary bg-white text-love-dark/80 focus:border-love-primary focus:outline-none transition-all cursor-pointer appearance-none pr-8 shadow-xs"
                              >
                                {slots.map((slot) => (
                                  <option key={slot.value} value={slot.value}>
                                    {slot.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-love-primary/70">
                                <ChevronDown className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-date-selected"
                    className="p-8 border border-dashed border-indigo-100 rounded-2xl text-center text-xs text-love-dark/50 font-medium flex flex-col items-center justify-center gap-2 h-44"
                  >
                    <CalendarIcon className="w-8 h-8 text-love-primary/30" />
                    <span>Seleccioná un día del calendario para definir su horario.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selection Summary */}
              {selections.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-2.5 bg-love-light/20 border border-indigo-50 rounded-2xl text-center text-xs text-love-dark font-medium"
                >
                  Elegiste:{" "}
                  <div className="flex flex-col gap-0.5 mt-1 font-bold text-love-accent max-h-[80px] overflow-y-auto">
                    {selections.map((s, idx) => (
                      <div key={idx}>
                        • {getFormattedDateLabel(s.date)} a las {s.time === "elegi-vos-hora" ? "el que prefieras" : `${s.time} hs`}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="mt-8 flex justify-between items-center border-t border-indigo-50 pt-4 relative z-10">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-love-accent hover:text-love-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
            
            <button
              type="button"
              disabled={selections.length === 0}
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-3 bg-love-primary hover:bg-love-accent disabled:opacity-40 disabled:hover:bg-love-primary text-white font-bold rounded-2xl shadow-romantic hover:shadow-romantic-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed text-sm"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Custom Toast Warning Modal */}
          <AnimatePresence>
            {showLimitWarning && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-16 inset-x-6 bg-slate-900/90 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between z-50 border border-slate-700/50 backdrop-blur-sm"
              >
                <span>Podés elegir hasta 6 opciones de días para coordinar 😊</span>
                <button
                  type="button"
                  onClick={() => setShowLimitWarning(false)}
                  className="ml-3 text-love-gold hover:text-white font-bold cursor-pointer text-sm px-2 py-1 transition-colors"
                >
                  Listo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

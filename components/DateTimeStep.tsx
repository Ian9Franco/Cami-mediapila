"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, Trophy, Users } from "lucide-react";

interface DateTimeStepProps {
  onBack: () => void;
  onNext: (date: Date, time: string) => void;
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

export default function DateTimeStep({ onBack, onNext }: DateTimeStepProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Clear selected time if selected date changes (since available slots will change)
  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

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
      setSelectedDate(clickedDate);
    }
  };

  const isSelected = (dayNum: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === dayNum &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
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
    if (selectedDate && selectedTime) {
      onNext(selectedDate, selectedTime);
    }
  };

  // Get dynamic time slots based on the selected date rules
  const getTimeSlots = () => {
    if (!selectedDate) return [];
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      // Sábado y Domingo: Libre (Todo el día)
      return [
        { value: "10:30", label: "10:30 hs - Mañana" },
        { value: "13:30", label: "13:30 hs - Almuerzo" },
        { value: "16:00", label: "16:00 hs - Tarde / Café" },
        { value: "18:30", label: "18:30 hs - Tarde / Atardecer" },
        { value: "21:30", label: "21:30 hs - Noche / Cena" },
        { value: "23:30", label: "23:30 hs - Noche / Tragos" }
      ];
    } else {
      // Lunes a Viernes: Solo mañana (06:00 a 12:00) y noche (18:00 a 06:00)
      return [
        { value: "08:30", label: "08:30 hs - Mañana" },
        { value: "10:00", label: "10:00 hs - Mañana" },
        { value: "11:30", label: "11:30 hs - Mañana" },
        { value: "19:00", label: "19:00 hs - Noche" },
        { value: "20:30", label: "20:30 hs - Noche" },
        { value: "22:00", label: "22:00 hs - Noche" }
      ];
    }
  };

  const currentSlots = getTimeSlots();
  const selectedDateEvent = selectedDate ? SPECIAL_EVENTS.find(
    (e) => e.day === selectedDate.getDate() && e.month === selectedDate.getMonth() && e.year === selectedDate.getFullYear()
  ) : null;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-indigo-50 rounded-3xl p-6 md:p-8 shadow-romantic-lg glass-panel relative overflow-hidden"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-love-primary via-love-secondary to-love-gold" />

        <h2 className="font-serif text-2xl md:text-3xl font-bold text-love-dark text-center mb-1 flex items-center justify-center gap-2">
          ¿Cuándo nos vemos? 📅
        </h2>
        <p className="text-sm text-love-dark/70 text-center mb-6">
          Elegí el día y la hora que te queden mejor.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
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
          </div>

          {/* Time Slots Section (Right) */}
          <div className="md:col-span-5 flex flex-col justify-start">
            <h3 className="text-sm font-bold text-love-dark/80 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-love-primary" />
              Horarios disponibles:
            </h3>

            <AnimatePresence mode="wait">
              {selectedDate ? (
                <motion.div
                  key="slots-container"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col gap-2"
                >
                  {/* Special Event warning */}
                  {selectedDateEvent && (
                    <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-start gap-2 mb-2
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
                  <div className="flex flex-col gap-2 max-h-[190px] overflow-y-auto pr-1">
                    {currentSlots.map((slot) => {
                      const timeIsSelected = selectedTime === slot.value;
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => setSelectedTime(slot.value)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between
                            ${timeIsSelected 
                              ? "border-love-primary bg-love-light/40 text-love-accent shadow-sm font-bold" 
                              : "border-indigo-50 hover:border-love-secondary bg-white text-love-dark/80"
                            }
                          `}
                        >
                          <span>{slot.label}</span>
                          {timeIsSelected && <span className="text-love-primary">✨</span>}
                        </button>
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
                  <span>Seleccioná un día del calendario para ver los horarios.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selection Summary */}
            {selectedDate && selectedTime && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-2.5 bg-love-light/20 border border-indigo-50 rounded-2xl text-center text-xs text-love-dark font-medium"
              >
                Elegiste el{" "}
                <span className="font-bold text-love-accent">
                  {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
                </span>{" "}
                a las{" "}
                <span className="font-bold text-love-accent">
                  {selectedTime} hs
                </span>.
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex justify-between items-center border-t border-indigo-50 pt-4">
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
            disabled={!selectedDate || !selectedTime}
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-3 bg-love-primary hover:bg-love-accent disabled:opacity-40 disabled:hover:bg-love-primary text-white font-bold rounded-2xl shadow-romantic hover:shadow-romantic-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed text-sm"
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle, Calendar, Clock, MapPin, Smile } from "lucide-react";
import confetti from "canvas-confetti";
import { invitationConfig } from "@/config/invitation";

interface SuccessStepProps {
  selectedDates: Date[];
  selectedTime: string;
  selectedLocation: string;
}

export default function SuccessStep({
  selectedDates,
  selectedTime,
  selectedLocation,
}: SuccessStepProps) {
  useEffect(() => {
    // Fire confetti when component mounts
    const duration = 6 * 1000;
    const end = Date.now() + duration;

    // Custom theme colors (Indigo, Violet, Gold)
    const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#f59e0b", "#4f46e5"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const formatDates = (dates: Date[]) => {
    if (dates.length === 0) return "A convenir";
    return dates
      .map((date) => {
        const options: Intl.DateTimeFormatOptions = {
          weekday: "short",
          day: "numeric",
          month: "short",
        };
        const formatted = date.toLocaleDateString("es-AR", options);
        // Capitalize first letter
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
      })
      .join(" / ");
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 z-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="bg-white border border-indigo-100 rounded-3xl p-6 md:p-8 shadow-romantic-lg glass-panel relative overflow-hidden"
        style={{
          backgroundImage: "url('/imagen.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Semi-transparent overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1.5px] z-0 pointer-events-none" />

        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-2 rounded-t-3xl chroma-border z-10" />

        {/* Success Icon */}
        <div className="flex justify-center mb-6 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-emerald-50 p-4 rounded-full text-emerald-500 relative"
          >
            <CheckCircle className="w-12 h-12" />
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute -top-1 -right-1 text-love-gold"
            >
              <Sparkles className="w-6 h-6 fill-current animate-pulse" />
            </motion.div>
          </motion.div>
        </div>

        <h2 className="font-serif text-3xl font-bold text-love-dark mb-2 relative z-10">
          ¡Hecho! 🥂
        </h2>
        <p className="text-sm font-semibold text-love-accent/80 mb-6 relative z-10">
          El plan quedó confirmado y se envió por correo.
        </p>

        {/* Summary Details */}
        <div className="bg-white/70 backdrop-blur-[2px] border border-indigo-50/60 rounded-2xl p-5 mb-6 text-left space-y-4 relative z-10">
          <h3 className="text-xs font-bold text-love-accent/70 tracking-widest uppercase mb-1">
            Resumen del Plan
          </h3>
          
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-love-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-love-dark/50 font-medium">Fecha(s)</p>
              <p className="text-sm font-bold text-love-dark">{formatDates(selectedDates)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-love-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-love-dark/50 font-medium">Horario</p>
              <p className="text-sm font-bold text-love-dark">
                {selectedTime === "elegi-vos-hora" ? "A definir por Ian (el que prefieras)" : `${selectedTime} hs`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-love-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-love-dark/50 font-medium">Lugar</p>
              <p className="text-sm font-bold text-love-dark">{selectedLocation}</p>
            </div>
          </div>
        </div>

        {/* Closing Note */}
        <div className="space-y-4 relative z-10">
          <p className="text-xs md:text-sm font-medium text-love-dark/70 italic px-4 leading-relaxed">
            "¡Listo Cami! Ya me llegó todo. Agendadísimo... Tengo muchas ganas de que nos veamos para charlar un rato. Te escribo en estos días. ¡Un abrazo!" ✨
          </p>
          
          <div className="pt-2 flex justify-center gap-1.5 items-center text-xs font-bold text-love-accent">
            <span>Creado por {invitationConfig.senderName}</span>
            <Smile className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

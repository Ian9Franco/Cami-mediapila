"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeartBackground from "@/components/HeartBackground";
import InvitationStep from "@/components/InvitationStep";
import DateTimeStep from "@/components/DateTimeStep";
import LocationStep from "@/components/LocationStep";
import SuccessStep from "@/components/SuccessStep";
import { invitationConfig } from "@/config/invitation";

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [customModalMessage, setCustomModalMessage] = useState<string | null>(null);

  const handleAcceptInvitation = () => {
    setStep(2);
  };

  const handleSelectDateTime = (dates: Date[], time: string) => {
    setSelectedDates(dates);
    setSelectedTime(time);
    setStep(3);
  };

  const handleSelectLocation = async (location: string, isCustom: boolean) => {
    setSelectedLocation(location);
    setIsSending(true);

    // Format all selected dates (DD/MM/YYYY)
    const formattedDates = selectedDates
      .map(
        (date) =>
          `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      )
      .join(", ");

    try {
      const response = await fetch("/api/send-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDates,
          time: selectedTime === "elegi-vos-hora" ? "Elegí vos (El que prefieras)" : `${selectedTime} hs`,
          location: location,
          receiverName: invitationConfig.receiverName,
          senderName: invitationConfig.senderName,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar correo");
      }

      setStep(4);
    } catch (error) {
      console.error("Form submission error:", error);
      // Instead of generic alert, trigger our custom modal notification
      setCustomModalMessage(
        `¡Oops! Hubo un problemita de red al enviar tus elecciones por mail, pero no te preocupes, ¡la cita sigue en pie! 💖`
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="relative flex flex-col flex-1 items-center justify-center min-h-screen py-10 w-full overflow-y-auto">
      {/* Animated Heart Background */}
      <HeartBackground />

      {/* Main Form container with smooth transitions */}
      <div className="relative w-full z-10 flex items-center justify-center flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <InvitationStep onAccept={handleAcceptInvitation} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <DateTimeStep
                onBack={() => setStep(1)}
                onNext={handleSelectDateTime}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <LocationStep
                onBack={() => setStep(2)}
                onNext={handleSelectLocation}
                isSending={isSending}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <SuccessStep
                selectedDates={selectedDates}
                selectedTime={selectedTime}
                selectedLocation={selectedLocation}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Modal Notification Overlay */}
      <AnimatePresence>
        {customModalMessage && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-rose-50 rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-love-primary to-love-gold" />
              <div className="text-3xl pt-2">💌</div>
              <p className="text-xs md:text-sm font-semibold text-love-dark leading-relaxed">
                {customModalMessage}
              </p>
              <button
                type="button"
                onClick={() => {
                  setCustomModalMessage(null);
                  setStep(4); // Advance to Success step
                }}
                className="w-full py-3 bg-love-primary hover:bg-love-accent text-white font-bold rounded-2xl shadow-romantic hover:shadow-romantic-lg cursor-pointer transition-all text-sm"
              >
                ¡Buenísimo!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

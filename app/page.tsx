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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const handleAcceptInvitation = () => {
    setStep(2);
  };

  const handleSelectDateTime = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(3);
  };

  const handleSelectLocation = async (location: string, isCustom: boolean) => {
    setSelectedLocation(location);
    setIsSending(true);

    // Format date (DD/MM/YYYY)
    const formattedDate = selectedDate
      ? `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
      : "";

    try {
      const response = await fetch("/api/send-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          time: selectedTime,
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
      // Even if email fails (network down/missing config), we want to make the experience smooth for her.
      // So we will alert and then show success details anyway, avoiding frustration.
      alert(
        `¡Oops! Hubo un problemita de red al enviar tus elecciones por mail, pero no te preocupes, ¡la cita sigue en pie! 💖`
      );
      setStep(4);
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
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedLocation={selectedLocation}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

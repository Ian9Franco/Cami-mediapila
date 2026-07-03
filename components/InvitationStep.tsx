"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Compass, Check } from "lucide-react";
import { invitationConfig } from "@/config/invitation";

interface InvitationStepProps {
  onAccept: () => void;
}

export default function InvitationStep({ onAccept }: InvitationStepProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [isSwapped, setIsSwapped] = useState(false);

  const handleNoHover = () => {
    // Jump in a random angle (0 to 360 degrees) by a distance of 70px to 150px
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 80 + 70; // min 70px, max 150px
    const newX = Math.cos(angle) * distance;
    const newY = Math.sin(angle) * distance;

    setNoButtonPosition({ x: newX, y: newY });
  };

  const handleNoClick = () => {
    // Swap buttons and reset current evasion coordinates so they swap cleanly
    setIsSwapped((prev) => !prev);
    setNoButtonPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 z-10 w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* STEP 1A: Envelope Closed & Intriguing */
          <motion.div
            key="envelope-closed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="flex flex-col items-center space-y-6 text-center"
          >
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative cursor-pointer group"
              onClick={() => setIsOpen(true)}
            >
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-love-secondary rounded-2xl filter blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              
              {/* Envelope Body */}
              <div className="relative bg-white border border-indigo-100 p-10 rounded-2xl shadow-romantic-lg flex flex-col items-center justify-center w-72 h-48 border-t-[12px] border-t-love-primary">
                <Mail className="w-16 h-16 text-love-secondary animate-pulse" />
                <span className="mt-4 text-xs font-semibold tracking-wider text-love-accent uppercase group-hover:scale-105 transition-transform duration-300">
                  Hacé click para abrirlo
                </span>
              </div>

              {/* Padlock Sticker */}
              <div className="absolute top-[4px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-love-gold text-white p-2.5 rounded-full shadow-md group-hover:scale-125 transition-transform">
                <Lock className="w-4.5 h-4.5" />
              </div>
            </motion.div>
            
            <div className="max-w-xs">
              <h1 className="font-serif text-3xl text-love-dark font-bold leading-tight">
                Hola Camila
              </h1>
              <p className="mt-2 text-love-dark/70 font-semibold text-sm">
                Te llegó un mensaje misterioso
              </p>
            </div>
          </motion.div>
        ) : (
          /* STEP 1B: Envelope Opened & Card Slid Out */
          <motion.div
            key="envelope-opened"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center"
          >
            {/* The Letter Card */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-full bg-white border border-indigo-50 rounded-3xl p-6 md:p-8 shadow-romantic-lg glass-panel relative overflow-visible"
            >
              {/* Top Decorative Border */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-love-primary via-love-secondary to-love-gold" />
              
              <div className="flex justify-between items-center mb-6">
                <Compass className="w-5 h-5 text-love-gold animate-bounce" />
                <span className="text-xs font-bold text-love-accent/65 tracking-widest uppercase">
                  Propuesta
                </span>
                <Compass className="w-5 h-5 text-love-gold animate-bounce delay-100" />
              </div>

              <div className="font-serif text-lg md:text-xl text-love-dark leading-relaxed whitespace-pre-line text-center px-2 py-4 italic">
                {invitationConfig.cardMessage}
              </div>

              {/* Action Buttons Container */}
              <div className="mt-8 relative w-full h-16 max-w-sm mx-auto">
                {/* BUTTON A (Left by default) */}
                <motion.button
                  animate={{
                    x: isSwapped ? noButtonPosition.x : 0,
                    y: isSwapped ? noButtonPosition.y : 0,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                  onMouseEnter={isSwapped ? handleNoHover : undefined}
                  onTouchStart={isSwapped ? handleNoHover : undefined}
                  onClick={isSwapped ? handleNoClick : onAccept}
                  className={`absolute left-1/2 -translate-x-[115%] px-6 py-3.5 rounded-2xl transition-colors duration-200 text-md cursor-pointer select-none whitespace-nowrap
                    ${isSwapped 
                      ? "bg-slate-50 hover:bg-slate-100 text-love-primary border border-indigo-100 font-semibold z-0" 
                      : "bg-love-primary hover:bg-love-accent text-white font-bold shadow-romantic hover:shadow-romantic-lg z-10"
                    }
                  `}
                >
                  {!isSwapped && <Check className="w-4.5 h-4.5 inline-block mr-1.5 align-text-bottom" />}
                  {isSwapped ? "no quiero" : "¡Sí, de una!"}
                </motion.button>

                {/* BUTTON B (Right by default) */}
                <motion.button
                  animate={{
                    x: !isSwapped ? noButtonPosition.x : 0,
                    y: !isSwapped ? noButtonPosition.y : 0,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                  onMouseEnter={!isSwapped ? handleNoHover : undefined}
                  onTouchStart={!isSwapped ? handleNoHover : undefined}
                  onClick={!isSwapped ? handleNoClick : onAccept}
                  className={`absolute left-1/2 translate-x-[15%] px-6 py-3.5 rounded-2xl transition-colors duration-200 text-md cursor-pointer select-none whitespace-nowrap
                    ${!isSwapped 
                      ? "bg-slate-50 hover:bg-slate-100 text-love-primary border border-indigo-100 font-semibold z-0" 
                      : "bg-love-primary hover:bg-love-accent text-white font-bold shadow-romantic hover:shadow-romantic-lg z-10"
                    }
                  `}
                >
                  {isSwapped && <Check className="w-4.5 h-4.5 inline-block mr-1.5 align-text-bottom" />}
                  {!isSwapped ? "no quiero" : "¡Sí, de una!"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

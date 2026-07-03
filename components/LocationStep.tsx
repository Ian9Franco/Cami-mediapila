"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowLeft, ArrowRight, Sparkles, Map } from "lucide-react";
import { invitationConfig, PlaceOption } from "@/config/invitation";

interface LocationStepProps {
  onBack: () => void;
  onNext: (location: string, isCustom: boolean) => void;
  isSending: boolean;
}

export default function LocationStep({ onBack, onNext, isSending }: LocationStepProps) {
  const [selectedPlace, setSelectedPlace] = useState<PlaceOption | null>(invitationConfig.places[0]);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customText, setCustomText] = useState("");
  const [mapLoading, setMapLoading] = useState(false);

  const handleSelectPlace = (place: PlaceOption) => {
    setIsCustomLocation(false);
    setSelectedPlace(place);
    setMapLoading(true);
  };

  const handleSelectCustom = () => {
    setIsCustomLocation(true);
    setSelectedPlace(null);
  };

  const handleContinue = () => {
    if (isCustomLocation) {
      if (customText.trim()) {
        onNext(customText.trim(), true);
      }
    } else if (selectedPlace) {
      onNext(selectedPlace.name + " (" + selectedPlace.address + ")", false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-rose-100 rounded-3xl p-4 sm:p-6 md:p-8 shadow-romantic-lg glass-panel relative overflow-hidden"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-love-primary via-love-secondary to-love-accent" />

        <h2 className="font-serif text-2xl md:text-3xl font-bold text-love-dark text-center mb-1 flex items-center justify-center gap-2">
          ¿A dónde vamos? 📍
        </h2>
        <p className="text-sm text-love-dark/70 text-center mb-6">
          Elegí la opción que más te cope o proponé una nueva.
        </p>

        {/* Place Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
          {invitationConfig.places.map((place) => {
            const isSelected = selectedPlace?.id === place.id && !isCustomLocation;
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => handleSelectPlace(place)}
                className={`text-left p-2.5 md:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group
                  ${isSelected
                    ? "border-love-primary bg-love-light/60 text-love-accent shadow-romantic font-bold"
                    : "border-rose-100 hover:border-love-secondary bg-white text-love-dark/85"
                  }
                `}
              >
                <div className="text-xl md:text-2xl mb-0.5 md:mb-1">{place.emoji}</div>
                <div>
                  <h3 className="font-serif text-xs md:text-sm font-bold leading-tight group-hover:text-love-accent transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-[9px] md:text-[11px] text-love-dark/60 mt-0.5 md:mt-1 line-clamp-2 font-medium">
                    {place.description}
                  </p>
                </div>
                {isSelected && (
                  <span className="absolute top-2 right-2 text-love-primary text-xs">✨</span>
                )}
              </button>
            );
          })}

          {/* Custom place option */}
          <button
            type="button"
            onClick={handleSelectCustom}
            className={`text-left p-2.5 md:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group
              ${isCustomLocation
                ? "border-love-primary bg-love-light/60 text-love-accent shadow-romantic font-bold"
                : "border-rose-100 hover:border-love-secondary bg-white text-love-dark/85"
              }
            `}
          >
            <div className="text-xl md:text-2xl mb-0.5 md:mb-1">✨</div>
            <div>
              <h3 className="font-serif text-xs md:text-sm font-bold leading-tight group-hover:text-love-accent transition-colors">
                Proponer otro lugar
              </h3>
              <p className="text-[9px] md:text-[11px] text-love-dark/60 mt-0.5 md:mt-1 line-clamp-2 font-medium">
                ¿Tenés algún lugar preferido en mente? ¡Escribilo acá!
              </p>
            </div>
            {isCustomLocation && (
              <span className="absolute top-2 right-2 text-love-primary text-xs">✨</span>
            )}
          </button>
        </div>

        {/* View / Embed Map or Custom Input */}
        <div className="min-h-[260px] flex flex-col border border-rose-100 rounded-2xl overflow-hidden bg-rose-50/20 relative shadow-inner">
          <AnimatePresence mode="wait">
            {!isCustomLocation && selectedPlace ? (
              /* Google Maps Preview */
              <motion.div
                key={selectedPlace.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-[260px] relative flex flex-col"
              >
                {mapLoading && (
                  <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <MapPin className="w-8 h-8 text-love-primary animate-bounce" />
                    </motion.div>
                    <span className="text-xs font-semibold text-love-dark/70">
                      Cargando mapa...
                    </span>
                  </div>
                )}
                
                {/* Embed Map Iframe */}
                <iframe
                  src={selectedPlace.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapLoading(false)}
                  className="w-full h-full flex-grow"
                />
                
                {/* Map Footer Bar with address info */}
                <div className="bg-white border-t border-rose-100 p-3 px-4 flex items-center justify-between text-xs font-medium text-love-dark/80">
                  <span className="flex items-center gap-1.5 truncate">
                    <Map className="w-3.5 h-3.5 text-love-primary flex-shrink-0" />
                    <span className="truncate">{selectedPlace.address}</span>
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-love-accent hover:underline text-[11px] font-bold flex-shrink-0 ml-2"
                  >
                    Ver en Google Maps ↗
                  </a>
                </div>
              </motion.div>
            ) : (
              /* Custom Location Input */
              <motion.div
                key="custom-location-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-6 md:p-8 flex flex-col justify-center items-center h-full flex-grow text-center"
              >
                <div className="bg-love-light/60 p-4 rounded-full mb-4 shadow-sm">
                  <Sparkles className="w-8 h-8 text-love-primary animate-pulse" />
                </div>
                <h3 className="font-serif text-lg font-bold text-love-dark mb-2">
                  ¿A dónde te gustaría ir?
                </h3>
                <p className="text-xs text-love-dark/60 max-w-sm mb-4">
                  Escribí el nombre del lugar, cafetería o zona que prefieras. ¡Yo me encargo de organizar el resto!
                </p>
                <input
                  type="text"
                  placeholder="Ej: El barcito de jazz de Colegiales, La Cabrera..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full max-w-md px-4 py-3 rounded-xl border border-rose-200 focus:border-love-primary focus:ring-1 focus:ring-love-primary outline-none text-sm bg-white text-love-dark font-medium shadow-sm transition-all"
                  maxLength={100}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="mt-8 flex justify-between items-center border-t border-rose-50 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-love-accent hover:text-love-primary transition-colors cursor-pointer"
            disabled={isSending}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <button
            type="button"
            disabled={isSending || (isCustomLocation && !customText.trim()) || (!isCustomLocation && !selectedPlace)}
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-3 bg-love-primary hover:bg-love-accent disabled:opacity-40 disabled:hover:bg-love-primary text-white font-bold rounded-2xl shadow-romantic hover:shadow-romantic-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed text-sm"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando propuesta...
              </>
            ) : (
              <>
                Confirmar y enviar
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

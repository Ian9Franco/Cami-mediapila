/**
 * 🗺️ GUÍA PARA CAMBIAR LAS LOCACIONES FÁCILMENTE:
 * 
 * Para cambiar o agregar un lugar en la lista de opciones (places):
 * 1. Buscá la propiedad `places` dentro de `invitationConfig` (abajo).
 * 2. Editá los valores de cada opción o agregá una nueva con esta estructura:
 *    - `name`: Nombre del lugar (ej: "Cafecito de Especialidad").
 *    - `description`: Una breve descripción atractiva.
 *    - `address`: La dirección física del lugar.
 *    - `emoji`: Un emoji representativo (ej: "☕", "🍻", "🍕").
 *    - `mapEmbedUrl`: El enlace para embeber el mapa de Google Maps.
 * 
 * 📌 CÓMO OBTENER EL `mapEmbedUrl` DE GOOGLE MAPS:
 * 1. Entrá a Google Maps (https://maps.google.com) y buscá el lugar que querés.
 * 2. Hacé click en el botón "Compartir" (Share).
 * 3. Seleccioná la pestaña "Incorporar un mapa" (Embed a map).
 * 4. Copiá únicamente el enlace que está dentro del atributo `src="..."` de la etiqueta `<iframe>`.
 *    (Debe empezar con "https://www.google.com/maps/embed?...").
 * 5. Pegá ese enlace en la propiedad `mapEmbedUrl` de la locación.
 */

export interface PlaceOption {
  id: string;
  name: string;
  description: string;
  address: string;
  mapEmbedUrl: string;
  emoji: string;
}

export interface TimeOption {
  value: string;
  label: string;
}

export interface InvitationConfig {
  senderName: string;
  receiverName: string;
  title: string;
  subtitle: string;
  cardMessage: string;
  places: PlaceOption[];
  timeSlots: TimeOption[];
  defaultEmailTo: string;
}

export const invitationConfig: InvitationConfig = {
  senderName: "Ian",
  receiverName: "Camila",
  title: "Camila, ¿te sumás a este plan?",
  subtitle: "Preparé esta página para hacerte una propuesta. Elegí la opción que prefieras.",
  cardMessage: "Hola Cami,\n\nHace bastante no charlamos. Armé esto para invitarte a hacer algo. Vos elegís el plan.\n\nAbrazo,\nIan",
  places: [
    {
      id: "cafe",
      name: "Tarde de Café Especial",
      description: "Un cafecito de especialidad en un lugar lindo para charlar tranquilos.",
      address: "Cuervo Café - El Salvador 4580, Palermo, CABA",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.8587127116744!2d-58.42831202476569!3d-34.58243685637255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb580b06b9b3f%3A0xe54e668c66e288e2!2sCuervo%20Caf%C3%A9!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar",
      emoji: "☕"
    },
    {
      id: "cena",
      name: "Salir a Comer",
      description: "Comida rica, tragos o cerveza en un lugar piola con buena música.",
      address: "La Alacena Trattoria - Gascón 1401, Palermo, CABA",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.148564024823!2d-58.42250282476505!3d-34.599104057329584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca7e335f492b%3A0xb3ab20c52bb7f52a!2sLa%20Alacena%20Trattoria!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar",
      emoji: "🍻"
    },
    {
      id: "picnic",
      name: "Picnic al Aire Libre",
      description: "Unos mates, algo rico para comer y charlas rodeados de verde al sol.",
      address: "El Rosedal de Palermo - Av. Infanta Isabel, CABA",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.3402636287955!2d-58.4206587247662!3d-34.570258165682855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb56ff8b59e79%3A0x8681ee72ee020c02!2sEl%20Rosedal%20de%20Palermo!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar",
      emoji: "🧺"
    }
  ],
  timeSlots: [
    { value: "16:00", label: "16:00 hs - Merienda / Café" },
    { value: "18:30", label: "18:30 hs - Tarde / Atardecer" },
    { value: "21:00", label: "21:00 hs - Cena / Tragos" }
  ],
  defaultEmailTo: "ian9franco@gmail.com"
};

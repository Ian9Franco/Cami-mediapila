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
  title: "¿Qué hacemos, cuándo y dónde?",
  subtitle: "Preparé esta página para hacerte una propuesta. Elegí la opción que prefieras.",
  cardMessage: "Hola Cami, soy yo, ian a\n\nY viendo que sos re vueltera, no tuve opcion. Armé esto para que elijas el plan que más te guste.\n\nVos decís qué hacemos, cuándo y dónde. O nada mas elegis un dia.\n\n Cuando lo completes, me va a llegar un mail con todo lo que hayas puesto.\n\n con <3 Ian",
  places: [
    {
      id: "casa-ian",
      name: "Venir a mi casa",
      description: " :) ",
      address: "Ituzaingó 5458, Villa Luzuriaga, Provincia de Buenos Aires",
      mapEmbedUrl: "https://maps.google.com/maps?q=Ituzaing%C3%B3%205458,%20Villa%20Luzuriaga&t=&z=15&ie=UTF8&iwloc=&output=embed",
      emoji: "💤"
    },
    {
      id: "cafe-reca",
      name: "Cafecito en RECA (Ramos)",
      description: "Café de especialidad riquísimo y excelente pastelería en Ramos.",
      address: "RECA CAFE - Necochea 212, Ramos Mejía, Provincia de Buenos Aires",
      mapEmbedUrl: "https://maps.google.com/maps?q=RECA%20CAFE,%20Ramos%20Mej%C3%ADa&t=&z=15&ie=UTF8&iwloc=&output=embed",
      emoji: "☕"
    },
    {
      id: "bar-rocky",
      name: "Cena en Rocky (Ramos)",
      description: "Tragos con onda, cervezas y hamburguesas en un ambiente rockero.",
      address: "Rocky Restaurant & Bar - Av. de Mayo 394, Ramos Mejía, Provincia de Buenos Aires",
      mapEmbedUrl: "https://maps.google.com/maps?q=Rocky%20Restaurant%20%26%20Bar,%20Ramos%20Mej%C3%ADa&t=&z=15&ie=UTF8&iwloc=&output=embed",
      emoji: "🍻"
    },
    {
      id: "bar-ditta",
      name: "Cena en Ditta (Ramos)",
      description: "Pizza napolitana, tragos ricos y plantas en un hermoso ambiente botánico.",
      address: "Ditta Bar Botánico - Rosales 215, Ramos Mejía, Provincia de Buenos Aires",
      mapEmbedUrl: "https://maps.google.com/maps?q=Ditta%20Bar%20Bot%C3%A1nico,%20Ramos%20Mej%C3%ADa&t=&z=15&ie=UTF8&iwloc=&output=embed",
      emoji: "🌿"
    },
    {
      id: "cafe-palermo",
      name: "Cafecito en Palermo",
      description: "Un café de especialidad y caminata por Palermo Soho.",
      address: "Cuervo Café - El Salvador 4580, Palermo, CABA",
      mapEmbedUrl: "https://maps.google.com/maps?q=Cuervo%20Caf%C3%A9%20El%20Salvador%204580%20CABA&t=&z=15&ie=UTF8&iwloc=&output=embed",
      emoji: "☕"
    },
    {
      id: "bar-palermo",
      name: "Cena o Tragos en Palermo",
      description: "Tapas y buenos gin tonics en el hermoso jardín de la Biblioteca Nacional.",
      address: "Invernadero - Av. Las Heras 2555, Recoleta/Palermo, CABA",
      mapEmbedUrl: "https://maps.google.com/maps?q=Invernadero%20Biblioteca%20Nacional%20CABA&t=&z=15&ie=UTF8&iwloc=&output=embed",
      emoji: "🍸"
    },
    {
      id: "cafe-barracas",
      name: "Café al salir (Barracas)",
      description: "Un cafecito al paso al salir de trabajar para cortar la semana.",
      address: "La Flor de Barracas - Av. Suárez 2095, Barracas, CABA",
      mapEmbedUrl: "https://maps.google.com/maps?q=La%20Flor%20de%20Barracas%20Av%20Suarez%202095%20CABA&t=&z=15&ie=UTF8&iwloc=&output=embed",
      emoji: "💼"
    },
    {
      id: "cafe-sur",
      name: "Café en Lomas (Zona Sur)",
      description: "Merienda de especialidad cerca de tu zona.",
      address: "Duro Café - Italia 412, Lomas de Zamora, Provincia de Buenos Aires",
      mapEmbedUrl: "https://maps.google.com/maps?q=Duro%20Cafe%20Lomas%20de%20Zamora&t=&z=15&ie=UTF8&iwloc=&output=embed",
      emoji: "🏡"
    },
    {
      id: "elegi-vos-lugar",
      name: "Elegí vos 🤔",
      description: "¡Sorprendeme! Dejo la elección del lugar en tus manos.",
      address: "Lugar a definir por Ian",
      mapEmbedUrl: "https://maps.google.com/maps?q=Ramos%20Mej%C3%ADa&t=&z=14&ie=UTF8&iwloc=&output=embed",
      emoji: "🎲"
    }
  ],
  timeSlots: [
    { value: "16:00", label: "16:00 hs - Merienda / Café" },
    { value: "18:30", label: "18:30 hs - Tarde / Atardecer" },
    { value: "21:00", label: "21:00 hs - Cena / Tragos" }
  ],
  defaultEmailTo: "ian9franco@gmail.com"
};

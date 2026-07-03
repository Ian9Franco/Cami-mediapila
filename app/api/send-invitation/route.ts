import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const { date, time, location, receiverName, senderName } = await request.json();

    if (!date || !time || !location) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (fecha, hora o locación)" },
        { status: 400 }
      );
    }

    const emailTo = process.env.RESEND_TO_EMAIL || "tu-email@correo.com";
    const emailFrom = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const apiKey = process.env.RESEND_API_KEY;

    // Simulation/Demo mode check
    if (!apiKey || apiKey === "re_your_api_key_here" || apiKey.trim() === "") {
      console.log("\n=============================================");
      console.log("📨 [PLAN DE SALIDA - MODO SIMULACIÓN] 📨");
      console.log(`De parte de: ${senderName}`);
      console.log(`Para: ${receiverName}`);
      console.log(`Enviar alerta a: ${emailTo}`);
      console.log("---------------------------------------------");
      console.log(`📅 FECHA: ${date}`);
      console.log(`⏰ HORA:  ${time} hs`);
      console.log(`📍 LUGAR: ${location}`);
      console.log("=============================================\n");

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return NextResponse.json({
        success: true,
        demo: true,
        message: "Simulacro exitoso. Detalles impresos en la consola del servidor.",
      });
    }

    // Real Resend Integration
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: `Propuesta de Plan <${emailFrom}>`,
      to: [emailTo],
      subject: `¡${receiverName} se sumó al plan! 🥂`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #6366f1; border-radius: 20px; background-color: #fbfaf8; color: #1e1b4b;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 50px;">🥂</span>
          </div>
          <h2 style="color: #4f46e5; text-align: center; margin-top: 0; font-family: Georgia, serif;">¡Plan confirmado! 🎉</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #1e1b4b;">
            ¡Hola, <strong>${senderName}</strong>! Te tengo excelentes noticias.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #1e1b4b;">
            <strong>${receiverName}</strong> aceptó tu propuesta, propuso un plan y completó los detalles en tu sitio web.
          </p>
          
          <div style="background-color: #ffffff; border: 1px solid #e0e7ff; border-radius: 15px; padding: 20px; margin: 25px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
            <h3 style="color: #1e1b4b; margin-top: 0; border-bottom: 1px solid #e0e7ff; padding-bottom: 10px; font-family: Georgia, serif;">Resumen del Plan:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #fbfaf8; font-weight: bold; width: 120px; color: #4f46e5;">📅 Fecha:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #fbfaf8; color: #1e1b4b; font-size: 15px;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #fbfaf8; font-weight: bold; color: #4f46e5;">⏰ Horario:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #fbfaf8; color: #1e1b4b; font-size: 15px;">${time} hs</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #4f46e5;">📍 Lugar:</td>
                <td style="padding: 10px 0; color: #1e1b4b; font-size: 15px;">${location}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 14px; color: #8b5cf6; text-align: center; margin-top: 30px; font-weight: bold;">
            ¡Que disfruten de una gran salida! ✨
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Internal Server Error in /api/send-invitation:", err);
    return NextResponse.json(
      { error: err.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}

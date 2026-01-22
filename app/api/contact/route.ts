import nodemailer from "nodemailer";

import config from "@/backend/config";
import logger from "@/logger";

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { name, fromEmail, subject, message } = await request.json();

    if (!fromEmail || !message) {
      return new Response(
        JSON.stringify({ error: "Email and message are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const text = [
      `From: ${name || "Unknown"} <${fromEmail}>`,
      "",
      message,
    ].join("\n");

    await transporter.sendMail({
      from: `"Portfolio Contact" <${config.SMTP_USER}>`,
      to: config.CONTACT_EMAIL,
      secure: config.SMTP_PORT === 465,
      subject,
      text,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error(error, "Error while sending contact email");

    return new Response(
      JSON.stringify({ error: "Failed to send message." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


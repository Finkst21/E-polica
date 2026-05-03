import nodemailer from "nodemailer";

import { prisma } from "@/lib/prisma";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  type: "MANUAL" | "WELCOME" | "REVIEW_APPROVED";
  triggeredById?: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });
}

export async function sendTrackedEmail(input: SendEmailInput) {
  const from = process.env.SMTP_FROM ?? "E-polica <noreply@example.com>";
  const transporter = getTransporter();

  if (!transporter) {
    return prisma.emailLog.create({
      data: {
        toEmail: input.to,
        subject: input.subject,
        body: input.html,
        status: "SIMULATED",
        type: input.type,
        triggeredById: input.triggeredById,
        sentAt: new Date()
      }
    });
  }

  try {
    await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text
    });

    return prisma.emailLog.create({
      data: {
        toEmail: input.to,
        subject: input.subject,
        body: input.html,
        status: "SENT",
        type: input.type,
        triggeredById: input.triggeredById,
        sentAt: new Date()
      }
    });
  } catch (error) {
    return prisma.emailLog.create({
      data: {
        toEmail: input.to,
        subject: input.subject,
        body: input.html,
        status: "FAILED",
        type: input.type,
        errorMessage: error instanceof Error ? error.message : "Neznana napaka",
        triggeredById: input.triggeredById
      }
    });
  }
}

export function wrapEmailTemplate(title: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#0f172a">
      <div style="padding:20px 24px;border-radius:20px;background:#e0f2fe;color:#0c4a6e;font-weight:700">E-polica</div>
      <h1 style="font-size:24px;margin:24px 0 12px">${title}</h1>
      <div style="font-size:15px;line-height:1.7;color:#334155">${body}</div>
    </div>
  `;
}

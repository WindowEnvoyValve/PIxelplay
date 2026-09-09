import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export interface EmailTransport {
  send(message: EmailMessage): Promise<void>;
}

class DevelopmentEmailTransport implements EmailTransport {
  async send(message: EmailMessage) {
    console.info("Development email queued", {
      to: message.to,
      subject: message.subject,
    });
  }
}

let smtpTransport: Transporter | undefined;

function getSmtpConfig() {
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM;
  if (!user || !password || !from) {
    throw new Error("SMTP email transport is not configured.");
  }
  if (from !== user) {
    throw new Error("EMAIL_FROM must match SMTP_USER for Mail.ru SMTP.");
  }
  const port = Number(process.env.SMTP_PORT || "465");
  if (!Number.isInteger(port) || port !== 465) {
    throw new Error("SMTP_PORT must be 465 for Mail.ru SMTP.");
  }
  return {
    host: process.env.SMTP_HOST || "smtp.mail.ru",
    port,
    user,
    password,
    from,
  };
}

function getSmtpTransport() {
  if (smtpTransport) return smtpTransport;
  const config = getSmtpConfig();
  smtpTransport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: true,
    auth: { user: config.user, pass: config.password },
  });
  return smtpTransport;
}

class MailRuSmtpTransport implements EmailTransport {
  async send(message: EmailMessage) {
    const config = getSmtpConfig();
    try {
      await getSmtpTransport().sendMail({
        from: `PixelPlay <${config.from}>`,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
    } catch (error) {
      const diagnostic = error instanceof Error ? error.name : "UnknownError";
      console.error("SMTP email delivery failed", { diagnostic });
      throw new Error("SMTP email delivery failed.");
    }
  }
}

export function getEmailTransport(): EmailTransport {
  if (process.env.NODE_ENV !== "production") return new DevelopmentEmailTransport();
  getSmtpConfig();
  return new MailRuSmtpTransport();
}

export function getPublicAppUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

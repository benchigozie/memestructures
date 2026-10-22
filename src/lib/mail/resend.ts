import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY environment variable.");
}

export const resend = new Resend(process.env.RESEND_API_KEY);
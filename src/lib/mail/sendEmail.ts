import { resend } from "./resend";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Memestructures <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend delivery error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent to:", to);
    console.log("Email sent ID:", data?.id);

    return data;
  } catch (err) {
    console.error("Email error:", err);
    throw new Error("Failed to send email");
  }
}
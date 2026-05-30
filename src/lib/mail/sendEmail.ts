import { transporter } from "./transporter";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: `"Memestructures" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent to:", to);

    console.log("Email sent:", info.messageId);

    return info;

  } catch (err) {
    console.error("Email error:", err);

    throw new Error("Failed to send email");
  }
}
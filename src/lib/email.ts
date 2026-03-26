import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, link: string) {
  const mailOptions = {
    from: `"Memestructures" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify Your Email Address",
    html: `
      <p>!</p>
      <p>Your Memestructures account was successfully created. Click the link below to verify your email address</p>
      <a href="${link}" style="background:#006de2;color:white;padding:10px 20px;border-radius:10px;text-decoration:none;">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw new Error("Could not send verification email");
  }
}
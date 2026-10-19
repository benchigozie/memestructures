// lib/mail/sendOtpEmail.ts
import { sendEmail } from "./sendEmail";
import { notificationTemplate } from "./templates/notificationTemplate";

export async function sendOtpEmail(email: string, otpCode: string) {
    try {
        await sendEmail({
            to: email,
            subject: "Your Login Verification Code",
            html: notificationTemplate({
                title: "Security Verification Code",
                message: `
                    You requested to log in to your account. Please use the verification code below to complete your sign-in:<br /><br />
                    
                    <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #006de2; margin: 20px 0; text-align: center;">
                        ${otpCode}
                    </div>
                    
                    This code is valid for <strong>5 minutes</strong>. If you did not request this code, please secure your account immediately.<br /><br />
                `,
                buttonText: "Go to Login",
                buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
            }),
        });
        console.log(`OTP email successfully sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send OTP email to ${email}:`, error);
        throw error;
    }
}
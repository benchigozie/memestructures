type TempPasswordTemplateProps = {
    name: string;
    loginLink: string;
    temporaryPassword: string;
  };
  
  export function tempPasswordTemplate({
    name,
    loginLink,
    temporaryPassword,
  }: TempPasswordTemplateProps) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Memestructures Account</title>
  </head>
  
  <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;background:#f5f7fb;">
  <tr>
  <td align="center">
  
  <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
  
  <tr>
  <td style="background:#0f172a;padding:32px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:28px;">
  Memestructures
  </h1>
  </td>
  </tr>
  
  
  <tr>
  <td style="padding:40px;">
  
  <h2 style="margin-top:0;color:#111827;">
  Welcome ${name}
  </h2>
  
  
  <p style="line-height:1.7;">
  An administrator has created an investor account for you on Memestructures.
  </p>
  
  
  <p style="line-height:1.7;">
  Use the temporary password below to sign in to your account.
  </p>
  
  
  <div style="margin:32px 0;padding:18px;background:#f3f4f6;border-radius:8px;text-align:center;">
  
  <p style="margin:0;font-size:14px;color:#6b7280;">
  Temporary Password
  </p>
  
  
  <p style="margin:12px 0 0;font-size:26px;font-weight:bold;letter-spacing:2px;color:#111827;">
  ${temporaryPassword}
  </p>
  
  </div>
  
  
  <div style="text-align:center;margin:36px 0;">
  
  <a
  href="${loginLink}"
  style="
  display:inline-block;
  background:#111827;
  color:#ffffff;
  text-decoration:none;
  padding:14px 28px;
  border-radius:8px;
  font-weight:bold;
  "
  >
  Sign In
  </a>
  
  </div>
  
  
  <p style="line-height:1.7;">
  <strong>Important:</strong> Please change your password immediately after your first login.
  </p>
  
  
  <p style="line-height:1.7;">
  If you did not expect this account creation, please contact Memestructures support.
  </p>
  
  
  </td>
  </tr>
  
  
  <tr>
  <td style="background:#f9fafb;padding:24px;text-align:center;font-size:13px;color:#6b7280;">
  
  © ${new Date().getFullYear()} Memestructures. All rights reserved.
  
  </td>
  </tr>
  
  
  </table>
  
  </td>
  </tr>
  </table>
  
  </body>
  
  </html>
  `;
  }
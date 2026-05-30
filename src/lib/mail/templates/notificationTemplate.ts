
type NotificationTemplateParams = {
    title: string;
    message: string;
    buttonText?: string;
    buttonLink?: string;
  };
  
  export function notificationTemplate({
    title,
    message,
    buttonText,
    buttonLink,
  }: NotificationTemplateParams) {
    return `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 24px;
          background: #ffffff;
        "
      >
        <h1 style="color:#0F172A;">
          ${title}
        </h1>
  
        <p
          style="
            color:#334155;
            line-height:1.6;
            font-size:16px;
          "
        >
          ${message}
        </p>
  
        ${
          buttonLink && buttonText
            ? `
              <a
                href="${buttonLink}"
                style="
                  display:inline-block;
                  margin-top:20px;
                  padding:12px 20px;
                  background:#006de2;
                  color:white;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:bold;
                "
              >
                ${buttonText}
              </a>
            `
            : ""
        }
  
        <p
          style="
            margin-top:30px;
            color:#94A3B8;
            font-size:14px;
          "
        >
          Memestructures
        </p>
      </div>
    `;
  }
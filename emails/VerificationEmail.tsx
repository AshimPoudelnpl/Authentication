interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <html lang="en">
      <head>
        <title>Verification Code</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: "24px",
          backgroundColor: "#f4f4f5",
          fontFamily: "Arial, sans-serif",
          color: "#18181b",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
          }}
        >
          <p style={{ fontSize: "14px", color: "#52525b", margin: "0 0 16px" }}>
            Here&apos;s your verification code: {otp}
          </p>
          <h2 style={{ margin: "0 0 16px", fontSize: "24px" }}>Hello {username},</h2>
          <p style={{ margin: "0 0 16px", lineHeight: 1.6 }}>
            Thank you for registering. Please use the following verification code to
            complete your registration:
          </p>
          <div
            style={{
              margin: "0 0 16px",
              padding: "16px",
              textAlign: "center",
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "8px",
              backgroundColor: "#f4f4f5",
              borderRadius: "10px",
            }}
          >
            {otp}
          </div>
          <p style={{ margin: 0, lineHeight: 1.6, color: "#52525b" }}>
            If you did not request this code, please ignore this email.
          </p>
        </div>
      </body>
    </html>
  );
}

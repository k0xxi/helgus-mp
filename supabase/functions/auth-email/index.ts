// Supabase Auth Hook "Send Email" - sendet Auth-E-Mails via Resend
// Wird von Supabase aufgerufen statt der Standard-E-Mail
// Konfiguration: Supabase Dashboard > Authentication > Hooks > Send Email

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = "https://marktplatz.helgus.at";

// Template IDs aus Environment (optional - Fallback-HTML wenn nicht gesetzt)
const TEMPLATES = {
  signup: Deno.env.get("RESEND_TEMPLATE_SIGNUP_CONFIRMATION"),
  recovery: Deno.env.get("RESEND_TEMPLATE_PASSWORD_RESET"),
};

interface AuthHookPayload {
  user: {
    id: string;
    email: string;
    user_metadata: {
      name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: "signup" | "recovery" | "magic_link" | "email_change" | "invite";
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

async function sendViaResend(payload: {
  to: string;
  subject: string;
  html?: string;
  templateId?: string;
  templateVariables?: Record<string, string>;
}): Promise<void> {
  const body: Record<string, unknown> = {
    from: "HELGUS Marktplatz <no-reply@mp.helgus.at>",
    to: [payload.to],
    subject: payload.subject,
  };

  if (payload.templateId) {
    body.template = {
      id: payload.templateId,
      variables: payload.templateVariables || {},
    };
  } else {
    body.html = payload.html;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Resend Fehler (${res.status}): ${error}`);
  }

  const data = await res.json();
  console.log("[auth-email] E-Mail gesendet:", { id: data.id, to: payload.to });
}

function signupHtml(userName: string, confirmUrl: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;background-color:#f1f5f9;">
  <tbody><tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:14px;border:1px solid #e5e7eb;overflow:hidden;">
        <tbody><tr>
          <td style="background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);padding:20px 24px;">
            <span style="display:inline-block;background:rgba(255,255,255,0.2);color:#ffffff;font-size:12px;padding:4px 10px;border-radius:999px;">Registrierung</span>
            <h1 style="margin:8px 0 0 0;font-size:20px;font-weight:600;color:#ffffff;">&#9993;&#65039; E-Mail best&#228;tigen</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;line-height:1.6;">
            <p>Hallo ${userName},</p>
            <p>willkommen bei <strong>HELGUS Marktplatz</strong>! Bitte best&#228;tige deine E-Mail-Adresse, um dein Konto zu aktivieren.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
              <tbody><tr>
                <td align="center">
                  <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:10px;">E-Mail best&#228;tigen</a>
                </td>
              </tr></tbody>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e5e7eb;border-left:4px solid #ef4444;border-radius:10px;padding:16px 20px;margin:20px 0;">
              <tbody><tr>
                <td>
                  <p style="margin:0 0 4px 0;font-size:12px;color:#64748b;">Oder kopiere diesen Link in deinen Browser:</p>
                  <p style="margin:0;font-size:12px;color:#94a3b8;word-break:break-all;">${confirmUrl}</p>
                </td>
              </tr></tbody>
            </table>
            <p style="font-size:14px;color:#64748b;">Falls du dich nicht bei HELGUS Marktplatz registriert hast, kannst du diese E-Mail ignorieren.</p>
            <p><br>Viele Gr&#252;&#223;e<br>Dein HELGUS Team</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f8fafc;padding:16px 24px;font-size:12px;color:#64748b;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            HELGUS Marktplatz · <a href="https://marktplatz.helgus.at" style="color:#ef4444;text-decoration:none;">marktplatz.helgus.at</a>
          </td>
        </tr>
      </tbody></table>
      <div style="height:24px;"></div>
    </td>
  </tr></tbody>
</table>`;
}

function recoveryHtml(userName: string, confirmUrl: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;background-color:#f1f5f9;">
  <tbody><tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:14px;border:1px solid #e5e7eb;overflow:hidden;">
        <tbody><tr>
          <td style="background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);padding:20px 24px;">
            <span style="display:inline-block;background:rgba(255,255,255,0.2);color:#ffffff;font-size:12px;padding:4px 10px;border-radius:999px;">Sicherheit</span>
            <h1 style="margin:8px 0 0 0;font-size:20px;font-weight:600;color:#ffffff;">&#128274; Passwort zur&#252;cksetzen</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;line-height:1.6;">
            <p>Hallo ${userName},</p>
            <p>du hast eine Anfrage zum Zur&#252;cksetzen deines Passworts f&#252;r deinen <strong>HELGUS Marktplatz</strong> Account gestellt.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
              <tbody><tr>
                <td align="center">
                  <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:10px;">Passwort zur&#252;cksetzen</a>
                </td>
              </tr></tbody>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e5e7eb;border-left:4px solid #ef4444;border-radius:10px;padding:16px 20px;margin:20px 0;">
              <tbody><tr>
                <td>
                  <p style="margin:0 0 4px 0;font-size:12px;color:#64748b;">Oder kopiere diesen Link in deinen Browser:</p>
                  <p style="margin:0;font-size:12px;color:#94a3b8;word-break:break-all;">${confirmUrl}</p>
                </td>
              </tr></tbody>
            </table>
            <p style="font-size:14px;color:#64748b;">Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren. Dein Passwort wird nicht ge&#228;ndert.</p>
            <p><br>Viele Gr&#252;&#223;e<br>Dein HELGUS Team</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f8fafc;padding:16px 24px;font-size:12px;color:#64748b;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            HELGUS Marktplatz · <a href="https://marktplatz.helgus.at" style="color:#ef4444;text-decoration:none;">marktplatz.helgus.at</a>
          </td>
        </tr>
      </tbody></table>
      <div style="height:24px;"></div>
    </td>
  </tr></tbody>
</table>`;
}

function genericHtml(userName: string, confirmUrl: string, title: string, badge: string, buttonText: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;background-color:#f1f5f9;">
  <tbody><tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:14px;border:1px solid #e5e7eb;overflow:hidden;">
        <tbody><tr>
          <td style="background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);padding:20px 24px;">
            <span style="display:inline-block;background:rgba(255,255,255,0.2);color:#ffffff;font-size:12px;padding:4px 10px;border-radius:999px;">${badge}</span>
            <h1 style="margin:8px 0 0 0;font-size:20px;font-weight:600;color:#ffffff;">${title}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;line-height:1.6;">
            <p>Hallo ${userName},</p>
            <p>Bitte klicke auf den folgenden Button, um fortzufahren:</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
              <tbody><tr>
                <td align="center">
                  <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:10px;">${buttonText}</a>
                </td>
              </tr></tbody>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e5e7eb;border-left:4px solid #ef4444;border-radius:10px;padding:16px 20px;margin:20px 0;">
              <tbody><tr>
                <td>
                  <p style="margin:0 0 4px 0;font-size:12px;color:#64748b;">Oder kopiere diesen Link in deinen Browser:</p>
                  <p style="margin:0;font-size:12px;color:#94a3b8;word-break:break-all;">${confirmUrl}</p>
                </td>
              </tr></tbody>
            </table>
            <p><br>Viele Gr&#252;&#223;e<br>Dein HELGUS Team</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f8fafc;padding:16px 24px;font-size:12px;color:#64748b;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            HELGUS Marktplatz · <a href="https://marktplatz.helgus.at" style="color:#ef4444;text-decoration:none;">marktplatz.helgus.at</a>
          </td>
        </tr>
      </tbody></table>
      <div style="height:24px;"></div>
    </td>
  </tr></tbody>
</table>`;
}

Deno.serve(async (req): Promise<Response> => {
  try {
    const payload = (await req.json()) as AuthHookPayload;
    const { user, email_data } = payload;
    const { email_action_type, token_hash } = email_data;

    console.log("[auth-email] Hook empfangen:", {
      type: email_action_type,
      email: user.email,
    });

    if (!RESEND_API_KEY) {
      console.error("[auth-email] RESEND_API_KEY nicht konfiguriert");
      // Non-200 = Supabase fällt auf Default-E-Mail zurück
      return new Response(JSON.stringify({ error: "RESEND_API_KEY nicht konfiguriert" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userName = user.user_metadata?.name || "Nutzer";
    // Immer SITE_URL verwenden - site_url aus dem Payload ist die Supabase-URL, nicht die App-URL
    const confirmUrl = `${SITE_URL}/auth/confirm?token_hash=${token_hash}&type=${email_action_type}`;

    switch (email_action_type) {
      case "signup": {
        const templateId = TEMPLATES.signup;
        if (templateId) {
          await sendViaResend({
            to: user.email,
            subject: "Bestätige deine E-Mail-Adresse",
            templateId,
            templateVariables: {
              userName,
              confirmUrl,
              email: user.email,
            },
          });
        } else {
          await sendViaResend({
            to: user.email,
            subject: "Bestätige deine E-Mail-Adresse",
            html: signupHtml(userName, confirmUrl),
          });
        }
        break;
      }

      case "recovery": {
        const templateId = TEMPLATES.recovery;
        if (templateId) {
          await sendViaResend({
            to: user.email,
            subject: "Passwort zurücksetzen",
            templateId,
            templateVariables: {
              userName,
              confirmUrl,
              email: user.email,
            },
          });
        } else {
          await sendViaResend({
            to: user.email,
            subject: "Passwort zurücksetzen",
            html: recoveryHtml(userName, confirmUrl),
          });
        }
        break;
      }

      // Generischer Fallback für andere E-Mail-Typen
      default: {
        const subjectMap: Record<string, string> = {
          magic_link: "Dein Anmeldelink",
          email_change: "Bestätige deine neue E-Mail-Adresse",
          invite: "Du wurdest eingeladen",
        };
        const badgeMap: Record<string, string> = {
          magic_link: "Anmeldung",
          email_change: "Konto",
          invite: "Einladung",
        };
        const subject = subjectMap[email_action_type] || "HELGUS Marktplatz";
        const badge = badgeMap[email_action_type] || "Info";

        await sendViaResend({
          to: user.email,
          subject,
          html: genericHtml(userName, confirmUrl, subject, badge, "Bestätigen"),
        });
        break;
      }
    }

    // 200 mit leerem JSON = Supabase betrachtet den Hook als erfolgreich
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[auth-email] Fehler:", errorMessage);
    if (error instanceof Error) {
      console.error("[auth-email] Stack:", error.stack);
    }

    // Non-200 = Supabase fällt auf Default-E-Mail zurück (Fallback-Verhalten)
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

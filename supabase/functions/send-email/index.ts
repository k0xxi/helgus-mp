// Supabase Edge Function für E-Mail-Versand mit Resend
// https://resend.com/docs/send-with-supabase-edge-functions

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// CORS Headers für Frontend-Requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "new_message" | "counter_offer" | "counter_offer_accepted" | "counter_offer_refused" | "purchase_buyer" | "purchase_seller";
  to: string;
  productTitle: string;
  productId: string;
  buyerName?: string;
  sellerName?: string;
  message?: string;
  counterOffer?: number;
  offerAmount?: number;
  productPrice?: number;
  buyerEmail?: string;
  sellerEmail?: string;
}

Deno.serve(async (req): Promise<Response> => {
  let templateMailSent = false;

  console.log('[send-email] Request received:', { method: req.method, headers: Object.fromEntries(req.headers) });

  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Body nur einmal parsen
  let body: EmailRequest;
  try {
    body = await req.json() as EmailRequest;
    console.log('[send-email] Body parsed:', { type: body.type, to: body.to });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.error('[send-email] Body parse error:', errorMessage);
    return new Response(JSON.stringify({ success: false, error: 'Body konnte nicht gelesen werden', details: errorMessage }), { status: 400, headers: corsHeaders });
  }

  // Validiere dass "to" eine gültige Email ist
  if (!body.to || !body.to.includes('@')) {
    console.error('[send-email] Invalid recipient email');
    return new Response(JSON.stringify({ success: false, error: 'Ungültige Empfänger-Email' }), { status: 400, headers: corsHeaders });
  }
  console.log('[send-email] Request validation passed');

  try {
    if (!RESEND_API_KEY) {
      console.error('[send-email] RESEND_API_KEY is not configured');
      throw new Error("RESEND_API_KEY nicht konfiguriert");
    }
    console.log('[send-email] RESEND_API_KEY is configured');

    const {
      type,
      to,
      productTitle,
      productId,
      buyerName,
      sellerName,
      message,
      counterOffer,
      offerAmount,
      productPrice,
      buyerEmail
    } = body;

    // E-Mail Validierung
    if (!to || typeof to !== "string" || !to.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      return new Response(JSON.stringify({ success: false, error: "Empfänger-E-Mail fehlt oder ist ungültig.", to }), { status: 400, headers: corsHeaders });
    }

    // Reply-To validieren
    let replyTo: string | undefined = undefined;
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    function isValidEmail(email: unknown): boolean {
      return typeof email === "string" && email.trim().length > 0 && emailRegex.test(email.trim());
    }
    if (isValidEmail(buyerEmail)) {
      replyTo = (buyerEmail as string).trim();
      console.log('[send-email] reply_to set to:', replyTo);
    } else if (buyerEmail) {
      console.warn('[send-email] Invalid reply_to email:', buyerEmail);
    }

    // Produktlink
    const productUrl = `https://marktplatz.helgus.at/produkt/${productId}`;

    let emailSubject = "";
    let emailHtml = "";

    // Template IDs aus Environment laden
    const TEMPLATES = {
      new_message: Deno.env.get("RESEND_TEMPLATE_NEW_MESSAGE"),
      counter_offer: Deno.env.get("RESEND_TEMPLATE_COUNTER_OFFER"),
      counter_offer_accepted: Deno.env.get("RESEND_TEMPLATE_COUNTER_OFFER_ACCEPTED"),
      counter_offer_refused: Deno.env.get("RESEND_TEMPLATE_COUNTER_OFFER_REFUSED"),
      purchase_buyer: Deno.env.get("RESEND_TEMPLATE_PURCHASE_BUYER"),
      purchase_seller: Deno.env.get("RESEND_TEMPLATE_PURCHASE_SELLER"),
    };

    // E-Mail Templates basierend auf Typ
    switch (type) {
      case "new_message": {
        const templateId = TEMPLATES.new_message;
        if (templateId) {
          const templatePayload: any = {
            from: "HELGUS Marktplatz <no-reply@mp.helgus.at>",
            to: [to],
            subject: `Neue Nachricht zu: ${productTitle}`,
            template: {
              id: templateId,
              variables: {
                recipientName: buyerName || "Nutzer",
                senderName: sellerName || "Ein Nutzer",
                productTitle: productTitle || "",
                productUrl: productUrl,
                messagePreview: message?.substring(0, 150) || "",
              },
            },
          };
          if (replyTo) {
            templatePayload.reply_to = replyTo;
          }
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify(templatePayload),
          });
          if (!res.ok) {
            const error = await res.text();
            throw new Error(`Resend Fehler: ${error}`);
          }
          const data = await res.json();
          templateMailSent = true;
          return new Response(
            JSON.stringify({ success: true, id: data.id }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }
        // Fallback HTML
        emailSubject = `Neue Nachricht zu: ${productTitle}`;
        emailHtml = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2>Neue Nachricht</h2>
            <p>Hallo ${buyerName || "Nutzer"},</p>
            <p><strong>${sellerName || "Ein Nutzer"}</strong> hat dir eine Nachricht zu <strong>${productTitle}</strong> gesendet:</p>
            <blockquote style="margin:20px 0;padding:15px;background:#f3f4f6;border-left:4px solid #ef4444;">
              ${message || ""}
            </blockquote>
            <p><a href="${productUrl}" style="display:inline-block;padding:10px 20px;background:#ef4444;color:white;text-decoration:none;border-radius:6px;">Zum Produkt</a></p>
            <p>Viele Grüße,<br>Dein HELGUS Team</p>
          </div>
        `;
        break;
      }

      case "counter_offer": {
        const templateId = TEMPLATES.counter_offer;
        console.log('[send-email] counter_offer - templateId:', templateId);
        if (templateId) {
          const templatePayload: any = {
            from: "HELGUS Marktplatz <no-reply@mp.helgus.at>",
            to: [to],
            subject: `Neues Gegenangebot für ${productTitle}`,
            template: {
              id: templateId,
              variables: {
                sellerName: sellerName || "Verkäufer",
                productTitle: productTitle || "",
                productUrl: productUrl,
                counterOffer: counterOffer?.toString() || "",
                buyerName: buyerName || "Ein Käufer",
                buyerEmail: buyerEmail || "",
                message: message || "",
              },
            },
          };
          // Only set reply_to if we have a valid email address
          if (replyTo && isValidEmail(replyTo)) {
            templatePayload.reply_to = replyTo;
            console.log('[send-email] Setting reply_to:', replyTo);
          }
          console.log('[send-email] Sending email via Resend (template):', { to, templateId });
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify(templatePayload),
          });
          if (!res.ok) {
            const error = await res.text();
            console.error('[send-email] Resend error:', { status: res.status, error });
            throw new Error(`Resend Fehler: ${error}`);
          }
          const data = await res.json();
          console.log('[send-email] Email sent successfully:', { id: data.id });
          templateMailSent = true;
          return new Response(
            JSON.stringify({ success: true, id: data.id }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }
        console.log('[send-email] counter_offer - no templateId, using fallback HTML');
        // Fallback HTML
        emailSubject = `Neues Gegenangebot für ${productTitle}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .offer-box { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
              .price { font-size: 20px; font-weight: bold; color: #ef4444; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💸 Neues Gegenangebot</h1>
              </div>
              <div class="content">
                <p>Hallo ${sellerName || "Verkäufer"},</p>
                <p>Du hast ein Gegenangebot für <strong>${productTitle}</strong> erhalten.</p>
                <div class="offer-box">
                  <p><strong>Preisvorschlag:</strong> <span class="price">€ ${counterOffer?.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</span></p>
                  <p><strong>Von:</strong> ${buyerName || "Ein Käufer"} (${buyerEmail || "-"})</p>
                  ${message ? `<div style='margin-top:10px;'><strong>Nachricht:</strong><br>${message}</div>` : ""}
                </div>
                <p><a href="${productUrl}" style="display:inline-block;padding:10px 20px;background:#ef4444;color:white;text-decoration:none;border-radius:6px;">Zum Produkt</a></p>
                <p>Viele Grüße,<br>Dein HELGUS Team</p>
              </div>
              <div class="footer">
                <p>HELGUS Marktplatz</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
      }

      case "counter_offer_accepted": {
        const templateId = TEMPLATES.counter_offer_accepted;
        console.log('[send-email] counter_offer_accepted - templateId:', templateId);
        if (templateId) {
          const templatePayload: any = {
            from: "HELGUS Marktplatz <no-reply@mp.helgus.at>",
            to: [to],
            subject: "Dein Gegenangebot wurde angenommen",
            template: {
              id: templateId,
              variables: {
                buyerName: buyerName || "Käufer",
                productTitle: productTitle || "",
                productUrl: productUrl,
                offerAmount: offerAmount?.toString() || "",
                sellerName: sellerName || "Der Verkäufer",
              },
            },
          };
          // Only set reply_to if we have a valid email address
          if (replyTo && isValidEmail(replyTo)) {
            templatePayload.reply_to = replyTo;
            console.log('[send-email] Setting reply_to:', replyTo);
          }
          console.log('[send-email] Sending email via Resend (template):', { to, templateId });
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify(templatePayload),
          });
          if (!res.ok) {
            const error = await res.text();
            console.error('[send-email] Resend error:', { status: res.status, error });
            throw new Error(`Resend Fehler: ${error}`);
          }
          const data = await res.json();
          console.log('[send-email] Email sent successfully:', { id: data.id });
          templateMailSent = true;
          return new Response(
            JSON.stringify({ success: true, id: data.id }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }
        console.log('[send-email] counter_offer_accepted - no templateId, using fallback HTML');
        // Fallback HTML
        emailSubject = "Dein Gegenangebot wurde angenommen";
        emailHtml = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2>🎉 Gegenangebot angenommen</h2>
            <p>Hallo ${buyerName || "Käufer"},</p>
            <p>Großartig! Dein Gegenangebot für <strong>${productTitle}</strong> zum Preis von <strong>€ ${offerAmount?.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</strong> wurde <strong>angenommen</strong>.</p>
            <p>${sellerName || "Der Verkäufer"} wird sich in Kürze bei dir melden.</p>
            <p><a href="${productUrl}" style="display:inline-block;padding:10px 20px;background:#ef4444;color:white;text-decoration:none;border-radius:6px;">Zum Produkt</a></p>
            <p>Viele Grüße,<br>Dein HELGUS Team</p>
          </div>
        `;
        break;
      }

      case "counter_offer_refused": {
        const templateId = TEMPLATES.counter_offer_refused;
        console.log('[send-email] counter_offer_refused - templateId:', templateId);
        if (templateId) {
          const templatePayload: any = {
            from: "HELGUS Marktplatz <no-reply@mp.helgus.at>",
            to: [to],
            subject: "Dein Gegenangebot wurde abgelehnt",
            template: {
              id: templateId,
              variables: {
                buyerName: buyerName || "Käufer",
                productTitle: productTitle || "",
                productUrl: productUrl,
                offerAmount: offerAmount?.toString() || "",
              },
            },
          };
          // Only set reply_to if we have a valid email address
          if (replyTo && isValidEmail(replyTo)) {
            templatePayload.reply_to = replyTo;
            console.log('[send-email] Setting reply_to:', replyTo);
          }
          console.log('[send-email] Sending email via Resend (template):', { to, templateId });
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify(templatePayload),
          });
          if (!res.ok) {
            const error = await res.text();
            console.error('[send-email] Resend error:', { status: res.status, error });
            throw new Error(`Resend Fehler: ${error}`);
          }
          const data = await res.json();
          console.log('[send-email] Email sent successfully:', { id: data.id });
          templateMailSent = true;
          return new Response(
            JSON.stringify({ success: true, id: data.id }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }
        console.log('[send-email] counter_offer_refused - no templateId, using fallback HTML');
        // Fallback HTML
        emailSubject = "Dein Gegenangebot wurde abgelehnt";
        emailHtml = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2>Gegenangebot abgelehnt</h2>
            <p>Hallo ${buyerName || "Käufer"},</p>
            <p>Dein Gegenangebot für <strong>${productTitle}</strong> zum Preis von <strong>€ ${offerAmount?.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</strong> wurde leider <strong>abgelehnt</strong>.</p>
            <p><a href="${productUrl}" style="display:inline-block;padding:10px 20px;background:#ef4444;color:white;text-decoration:none;border-radius:6px;">Ähnliche Produkte ansehen</a></p>
            <p>Viele Grüße,<br>Dein HELGUS Team</p>
          </div>
        `;
        break;
      }

      case "purchase_buyer": {
        const templateId = TEMPLATES.purchase_buyer;
        console.log('[send-email] purchase_buyer - templateId:', templateId);
        if (templateId) {
          const templatePayload: any = {
            from: "HELGUS Marktplatz <no-reply@mp.helgus.at>",
            to: [to],
            subject: `Bestellung bestätigt: ${productTitle}`,
            template: {
              id: templateId,
              variables: {
                buyerName: buyerName || "Käufer",
                productTitle: productTitle || "",
                productPrice: productPrice?.toString() || "",
                productUrl: productUrl,
              },
            },
          };
          // Set reply_to in request body (not template variable)
          if (body.sellerEmail && isValidEmail(body.sellerEmail)) {
            templatePayload.reply_to = [body.sellerEmail];
            console.log('[send-email] Setting reply_to in request body:', body.sellerEmail);
          }
          console.log('[send-email] Sending email via Resend (template):', { to, templateId });
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify(templatePayload),
          });
          if (!res.ok) {
            const error = await res.text();
            console.error('[send-email] Resend error:', { status: res.status, error });
            throw new Error(`Resend Fehler: ${error}`);
          }
          const data = await res.json();
          console.log('[send-email] Email sent successfully:', { id: data.id });
          templateMailSent = true;
          return new Response(
            JSON.stringify({ success: true, id: data.id }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }
        console.log('[send-email] purchase_buyer - no templateId, using fallback HTML');
        // Fallback HTML
        emailSubject = `Bestellung bestätigt: ${productTitle}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .product-box { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
              .price { font-size: 24px; font-weight: bold; color: #16a34a; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Bestellung bestätigt!</h1>
              </div>
              <div class="content">
                <p>Hallo ${buyerName || "Käufer"},</p>
                <p>Vielen Dank für deinen Kauf auf HELGUS Marktplatz!</p>

                <div class="product-box">
                  <h3 style="margin-top: 0;">${productTitle}</h3>
                  <p class="price">€ ${productPrice?.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</p>
                </div>

                <p>Der Verkäufer wurde benachrichtigt und wird sich in Kürze bei dir melden.</p>
                <p><a href="${productUrl}" style="display:inline-block;padding:10px 20px;background:#16a34a;color:white;text-decoration:none;border-radius:6px;">Zur Bestellung</a></p>

                <p>Viele Grüße,<br>Dein HELGUS Team</p>
              </div>
              <div class="footer">
                <p>HELGUS Marktplatz - Dein lokaler Marktplatz</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
      }

      case "purchase_seller": {
        const templateId = TEMPLATES.purchase_seller;
        console.log('[send-email] purchase_seller - templateId:', templateId);
        if (templateId) {
          const templatePayload: any = {
            from: "HELGUS Marktplatz <no-reply@mp.helgus.at>",
            to: [to],
            subject: `🎉 Verkauf: ${productTitle}`,
            template: {
              id: templateId,
              variables: {
                sellerName: sellerName || "Verkäufer",
                productTitle: productTitle || "",
                productPrice: productPrice?.toString() || "",
                productUrl: productUrl,
                buyerName: buyerName || "Der Käufer",
              },
            },
          };
          // Set reply_to in request body (not template variable)
          if (buyerEmail && isValidEmail(buyerEmail)) {
            templatePayload.reply_to = [buyerEmail];
            console.log('[send-email] Setting reply_to in request body:', buyerEmail);
          }
          console.log('[send-email] Sending email via Resend (template):', { to, templateId });
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify(templatePayload),
          });
          if (!res.ok) {
            const error = await res.text();
            console.error('[send-email] Resend error:', { status: res.status, error });
            throw new Error(`Resend Fehler: ${error}`);
          }
          const data = await res.json();
          console.log('[send-email] Email sent successfully:', { id: data.id });
          templateMailSent = true;
          return new Response(
            JSON.stringify({ success: true, id: data.id }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }
        console.log('[send-email] purchase_seller - no templateId, using fallback HTML');
        // Fallback HTML
        emailSubject = `🎉 Verkauf: ${productTitle}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .product-box { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
              .price { font-size: 24px; font-weight: bold; color: #16a34a; }
              .buyer-info { background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💰 Dein Artikel wurde verkauft!</h1>
              </div>
              <div class="content">
                <p>Hallo ${sellerName || "Verkäufer"},</p>
                <p>Großartig! Jemand hat deinen Artikel gekauft.</p>

                <div class="product-box">
                  <h3 style="margin-top: 0;">${productTitle}</h3>
                  <p class="price">€ ${productPrice?.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</p>
                </div>

                <div class="buyer-info">
                  <strong>Käufer:</strong> ${buyerName || "Ein Käufer"}
                </div>

                <p>Bitte kontaktiere den Käufer zeitnah, um die Übergabe zu vereinbaren.</p>
                <p><a href="${productUrl}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">Zur Bestellung</a></p>

                <p>Viele Grüße,<br>Dein HELGUS Team</p>
              </div>
              <div class="footer">
                <p>HELGUS Marktplatz - Dein lokaler Marktplatz</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
      }
    }

    // Sende E-Mail (außer bei Resend-Template, das schon returnt wurde)
    if (!templateMailSent) {
      // Validierung: html MUSS gesetzt sein
      if (!emailHtml || typeof emailHtml !== "string" || emailHtml.trim() === "") {
        return new Response(
          JSON.stringify({ success: false, error: "Das Feld 'html' (E-Mail-Inhalt) fehlt oder ist leer." }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Sende E-Mail via Resend API (HTML)
      const emailPayload: {
        from: string;
        to: string[];
        subject: string;
        html: string;
        "reply_to"?: string;
      } = {
        from: "HELGUS Marktplatz <no-reply@mp.helgus.at>",
        to: [to],
        subject: emailSubject,
        html: emailHtml,
      };
      if (replyTo) {
        emailPayload["reply_to"] = replyTo;
      }

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(emailPayload),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Resend Fehler: ${error}`);
      }

      const data = await res.json();
      return new Response(
        JSON.stringify({ success: true, id: data.id }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (error instanceof Error) {
      console.error("Fehler-Stack:", error.stack);
    }
    console.error("Fehler-Objekt:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage, details: String(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }

  // Fallback Response
  return new Response(
    JSON.stringify({ success: false, error: "Unbekannter Fehler" }),
    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

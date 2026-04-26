import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RequestData {
  source_form: string;
  name: string;
  phone: string;
  vehicle_category?: string | null;
  plate_number?: string | null;
  desired_date?: string | null;
  desired_time?: string | null;
  comment?: string | null;
}

const SOURCE_LABELS: Record<string, string> = {
  online_booking: "Онлайн-запись",
  contact: "Контакты",
  legal_entity: "Юр. лица",
};

function buildEmailHtml(data: RequestData): string {
  const rows: [string, string | null | undefined][] = [
    ["Источник", SOURCE_LABELS[data.source_form] || data.source_form],
    ["Имя", data.name],
    ["Телефон", data.phone],
    ["Категория ТС", data.vehicle_category],
    ["Госномер", data.plate_number],
    ["Желаемая дата", data.desired_date],
    ["Желаемое время", data.desired_time],
    ["Комментарий", data.comment],
  ];

  const tableRows = rows
    .filter(([, val]) => val != null && val !== "")
    .map(
      ([label, val]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e5e7eb;background:#f9fafb;width:180px">${label}</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${val}</td></tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;margin:0;padding:20px;background:#ffffff">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
    <div style="background:#1a1a2e;color:#ffffff;padding:20px 24px">
      <h1 style="margin:0;font-size:20px">Новая заявка — Техосмотр Брянск</h1>
    </div>
    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${tableRows}
      </table>
      <p style="margin-top:20px;font-size:12px;color:#6b7280">Это автоматическое уведомление. Заявка сохранена в базе данных.</p>
    </div>
  </div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data: RequestData = await req.json();
    const html = buildEmailHtml(data);

    // Fetch active recipients from notification_emails
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: emailRows, error: emailError } = await supabase
      .from("notification_emails")
      .select("email")
      .eq("is_active", true);

    if (emailError) {
      console.error("Failed to fetch notification emails:", emailError);
    }

    const recipients = emailRows && emailRows.length > 0
      ? emailRows.map((r: any) => r.email)
      : [];

    if (recipients.length === 0) {
      console.error("No active notification emails found. Skipping send.");
      return new Response(
        JSON.stringify({ success: false, error: "No active recipients" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Техосмотр Брянск <onboarding@resend.dev>",
        to: recipients,
        subject: "Новая заявка — Техосмотр Брянск",
        html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: result }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error("send-notification error:", e);
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

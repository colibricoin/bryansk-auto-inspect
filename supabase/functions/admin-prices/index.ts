import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_ADMIN_EMAILS = new Set([
  "suvorovalud@yandex.ru",
  "info@tyumen.info",
]);

function normalizeEmail(email: unknown): string {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function getAdminPassword(): string {
  const password = Deno.env.get("ADMIN_PASSWORD");
  if (!password) throw new Error("ADMIN_PASSWORD is not configured");
  return password;
}

async function verifyAdmin(token: string, email: string): Promise<boolean> {
  if (!ALLOWED_ADMIN_EMAILS.has(email)) return false;

  const adminPassword = getAdminPassword();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(adminPassword),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const payload = `admin-session:${email}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expectedToken = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return token === expectedToken;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, token, updates, email } = await req.json();
    const normalizedEmail = normalizeEmail(email);

    if (!token || !(await verifyAdmin(token, normalizedEmail))) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "list") {
      const { data, error } = await supabase
        .from("prices")
        .select("*")
        .order("category_code");
      if (error) throw error;
      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "update") {
      if (!Array.isArray(updates) || updates.length === 0) {
        return new Response(
          JSON.stringify({ error: "No updates provided" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      for (const u of updates) {
        if (typeof u.price_rub !== "number" || u.price_rub < 0) {
          return new Response(
            JSON.stringify({ error: `Invalid price for ${u.id}` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const { error } = await supabase
          .from("prices")
          .update({
            price_rub: u.price_rub,
            updated_at: new Date().toISOString(),
            updated_by: normalizedEmail,
          })
          .eq("id", u.id);
        if (error) throw error;
      }

      const { data, error } = await supabase
        .from("prices")
        .select("*")
        .order("category_code");
      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

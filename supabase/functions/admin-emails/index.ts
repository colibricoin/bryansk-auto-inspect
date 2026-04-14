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

async function listEmails(supabase: any) {
  const { data, error } = await supabase
    .from("notification_emails")
    .select("*")
    .order("created_at");
  if (error) throw error;
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, token, email } = body;
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
      const data = await listEmails(supabase);
      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "add") {
      const addEmail = normalizeEmail(body.addEmail);
      if (!addEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addEmail)) {
        return new Response(
          JSON.stringify({ error: "Некорректный email" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const { error } = await supabase
        .from("notification_emails")
        .insert({ email: addEmail });
      if (error) {
        if (error.code === "23505") {
          return new Response(
            JSON.stringify({ error: "Этот email уже добавлен" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw error;
      }
      const data = await listEmails(supabase);
      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "toggle") {
      const { toggleId, is_active } = body;
      const { error } = await supabase
        .from("notification_emails")
        .update({ is_active })
        .eq("id", toggleId);
      if (error) throw error;
      const data = await listEmails(supabase);
      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "delete") {
      const { deleteId } = body;
      const { error } = await supabase
        .from("notification_emails")
        .delete()
        .eq("id", deleteId);
      if (error) throw error;
      const data = await listEmails(supabase);
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

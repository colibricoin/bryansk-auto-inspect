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

async function listPrices(supabase: any) {
  const { data, error } = await supabase
    .from("prices")
    .select("*")
    .order("category_code");
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
      const data = await listPrices(supabase);
      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "update") {
      const { updates } = body;
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

      const data = await listPrices(supabase);
      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "add") {
      const { category_code, category_name, description, details, price_rub } = body;
      if (!category_code || !category_name) {
        return new Response(
          JSON.stringify({ error: "category_code и category_name обязательны" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (typeof price_rub !== "number" || price_rub < 0) {
        return new Response(
          JSON.stringify({ error: "Некорректная цена" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const { error } = await supabase
        .from("prices")
        .insert({
          category_code,
          category_name,
          description: description || "",
          details: details || "",
          price_rub,
          updated_by: normalizedEmail,
        });
      if (error) throw error;

      const data = await listPrices(supabase);
      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "delete") {
      const { deleteId } = body;
      if (!deleteId) {
        return new Response(
          JSON.stringify({ error: "deleteId required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const { error } = await supabase
        .from("prices")
        .delete()
        .eq("id", deleteId);
      if (error) throw error;

      const data = await listPrices(supabase);
      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

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
    const { action, token, id, status, admin_note, filters, email } = await req.json();
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
      let query = supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters?.source_form && filters.source_form !== "all") {
        query = query.eq("source_form", filters.source_form);
      }
      if (filters?.search) {
        const s = `%${filters.search}%`;
        query = query.or(`name.ilike.${s},phone.ilike.${s},plate_number.ilike.${s}`);
      }
      if (filters?.date_from) {
        query = query.gte("created_at", filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte("created_at", filters.date_to + "T23:59:59");
      }

      const { data, error } = await query;
      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "get") {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "update") {
      const updates: Record<string, unknown> = {};
      if (status !== undefined) updates.status = status;
      if (admin_note !== undefined) updates.admin_note = admin_note;

      const { data, error } = await supabase
        .from("requests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "stats") {
      const { data, error } = await supabase
        .from("requests")
        .select("status");
      if (error) throw error;

      const stats = {
        total: data.length,
        new: data.filter((r: any) => r.status === "new").length,
        in_progress: data.filter((r: any) => r.status === "in_progress").length,
        confirmed: data.filter((r: any) => r.status === "confirmed").length,
        completed: data.filter((r: any) => r.status === "completed").length,
        canceled: data.filter((r: any) => r.status === "canceled").length,
      };

      return new Response(
        JSON.stringify({ data: stats }),
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

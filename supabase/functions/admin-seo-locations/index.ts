import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") || "admin123";
const ALLOWED_EMAILS = new Set(
  (Deno.env.get("ADMIN_EMAILS") || "suvorovalud@yandex.ru,info@tyumen.info")
    .split(",")
    .map((e) => e.trim().toLowerCase())
);

function verifyToken(req: Request): boolean {
  const token = req.headers.get("x-admin-token") || "";
  const email = (req.headers.get("x-admin-email") || "").toLowerCase();
  if (!ALLOWED_EMAILS.has(email)) return false;
  const encoder = new TextEncoder();
  const data = encoder.encode(email + ":" + ADMIN_PASSWORD);
  const hex = Array.from(new Uint8Array(data))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return token === hex;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!verifyToken(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("seo_locations")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { action, id, data: payload } = body;

      if (action === "create") {
        const { error } = await supabase.from("seo_locations").insert({
          slug: payload.slug,
          location_name: payload.location_name,
          h1: payload.h1,
          seo_title: payload.seo_title,
          seo_description: payload.seo_description || "",
          keywords: payload.keywords || "",
          page_type: payload.page_type || "district",
          route_path: payload.route_path || null,
          intro_text: payload.intro_text || "",
          seo_text: payload.seo_text || "",
          is_active: payload.is_active ?? true,
          sort_order: payload.sort_order ?? 0,
        });
        if (error) throw error;
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "update") {
        const updateData: Record<string, unknown> = { ...payload, updated_at: new Date().toISOString() };
        delete updateData.id;
        delete updateData.created_at;
        const { error } = await supabase.from("seo_locations").update(updateData).eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "delete") {
        const { error } = await supabase.from("seo_locations").delete().eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

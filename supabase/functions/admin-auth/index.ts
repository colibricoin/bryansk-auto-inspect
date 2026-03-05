import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function makeToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode("admin-session"));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, login, password, token, email } = await req.json();

    const adminPassword = Deno.env.get("ADMIN_PASSWORD") || "admin123";
    const adminEmailsRaw = Deno.env.get("ADMIN_EMAILS") || "";
    const allowedEmails = adminEmailsRaw
      .split(",")
      .map((e: string) => e.trim().toLowerCase())
      .filter(Boolean);

    if (action === "login") {
      const inputEmail = (email || login || "").trim().toLowerCase();

      // Check email is in allowed list
      if (allowedEmails.length > 0 && !allowedEmails.includes(inputEmail)) {
        return new Response(
          JSON.stringify({ error: "Доступ запрещён" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check password
      if (password !== adminPassword) {
        return new Response(
          JSON.stringify({ error: "Неверный пароль" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const signedToken = await makeToken(adminPassword);
      const usingDefault = !Deno.env.get("ADMIN_PASSWORD");

      return new Response(
        JSON.stringify({ token: signedToken, usingDefault, email: inputEmail }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      const expectedToken = await makeToken(adminPassword);
      const usingDefault = !Deno.env.get("ADMIN_PASSWORD");

      if (token !== expectedToken) {
        return new Response(
          JSON.stringify({ error: "Invalid session" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ valid: true, usingDefault }),
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

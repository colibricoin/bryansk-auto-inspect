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

function isAllowedAdminEmail(email: string): boolean {
  return ALLOWED_ADMIN_EMAILS.has(email);
}

function getAdminPassword(): string {
  const password = Deno.env.get("ADMIN_PASSWORD");
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured");
  }
  return password;
}

async function makeToken(password: string, email: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const payload = `admin-session:${email}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, login, password, token, email } = await req.json();
    const adminPassword = getAdminPassword();

    if (action === "login") {
      const inputEmail = normalizeEmail(email || login);

      if (!isAllowedAdminEmail(inputEmail)) {
        return new Response(
          JSON.stringify({ error: "Доступ запрещён" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (password !== adminPassword) {
        return new Response(
          JSON.stringify({ error: "Неверный пароль" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const signedToken = await makeToken(adminPassword, inputEmail);

      return new Response(
        JSON.stringify({ token: signedToken, usingDefault: false, email: inputEmail }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      const inputEmail = normalizeEmail(email);

      if (!isAllowedAdminEmail(inputEmail)) {
        return new Response(
          JSON.stringify({ error: "Доступ запрещён" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const expectedToken = await makeToken(adminPassword, inputEmail);
      if (token !== expectedToken) {
        return new Response(
          JSON.stringify({ error: "Invalid session" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ valid: true, usingDefault: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message || "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, login, password, token } = await req.json();

    if (action === "login") {
      const adminPassword = Deno.env.get("ADMIN_PASSWORD") || "admin123";
      const usingDefault = !Deno.env.get("ADMIN_PASSWORD");

      if (login !== "admin" || password !== adminPassword) {
        return new Response(
          JSON.stringify({ error: "Неверный логин или пароль" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate a simple session token
      const sessionToken = crypto.randomUUID() + "-" + crypto.randomUUID();
      
      // Store token in a simple KV-like approach using Supabase
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // We'll use a simple approach: store session in memory isn't persistent,
      // so we'll encode the token with a signature
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(adminPassword),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode("admin-session")
      );
      const signedToken = btoa(String.fromCharCode(...new Uint8Array(signature)));

      return new Response(
        JSON.stringify({ token: signedToken, usingDefault }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      const adminPassword = Deno.env.get("ADMIN_PASSWORD") || "admin123";
      const usingDefault = !Deno.env.get("ADMIN_PASSWORD");

      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(adminPassword),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode("admin-session")
      );
      const expectedToken = btoa(String.fromCharCode(...new Uint8Array(signature)));

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

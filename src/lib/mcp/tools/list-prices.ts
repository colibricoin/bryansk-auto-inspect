import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_prices",
  title: "Список цен на техосмотр",
  description:
    "Возвращает актуальные цены на техосмотр по всем категориям ТС (или по одной категории, если указан category_code, например M1, N1, L).",
  inputSchema: {
    category_code: z
      .string()
      .trim()
      .min(1)
      .max(10)
      .optional()
      .describe("Опциональный код категории ТС, например: L, M1, M2, M3, N1, N2, N3, O1, O2, O3, O4."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category_code }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let query = supabase
      .from("prices")
      .select("category_code, category_name, description, details, price_rub, updated_at")
      .order("category_code");
    if (category_code) query = query.eq("category_code", category_code.toUpperCase());
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { prices: data ?? [] },
    };
  },
});
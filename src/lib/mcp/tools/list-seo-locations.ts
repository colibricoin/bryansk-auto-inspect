import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_seo_locations",
  title: "Список SEO-страниц (районы и услуги)",
  description:
    "Возвращает активные SEO-страницы сайта: районы Брянска и тематические страницы (цены, диагностическая карта, для ОСАГО и т.д.) с их slug, заголовками и путями.",
  inputSchema: {
    page_type: z
      .string()
      .trim()
      .min(1)
      .max(50)
      .optional()
      .describe("Опциональный фильтр по типу страницы, например: district, service."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ page_type }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let query = supabase
      .from("seo_locations")
      .select("slug, location_name, page_type, h1, seo_title, seo_description, route_path, sort_order")
      .eq("is_active", true)
      .order("sort_order");
    if (page_type) query = query.eq("page_type", page_type);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { locations: data ?? [] },
    };
  },
});
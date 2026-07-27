import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "create_inspection_request",
  title: "Создать заявку на техосмотр",
  description:
    "Создаёт заявку клиента на прохождение техосмотра. Оператор перезвонит по указанному телефону для подтверждения даты и времени.",
  inputSchema: {
    name: z.string().trim().min(1).max(100).describe("Имя клиента."),
    phone: z.string().trim().min(5).max(20).describe("Контактный телефон клиента."),
    vehicle_category: z
      .string()
      .trim()
      .min(1)
      .max(10)
      .optional()
      .describe("Код категории ТС: L, M1, M2, M3, N1, N2, N3, O1, O2, O3, O4."),
    plate_number: z.string().trim().max(15).optional().describe("Госномер автомобиля."),
    desired_date: z.string().trim().max(20).optional().describe("Желаемая дата в формате YYYY-MM-DD."),
    comment: z.string().trim().max(500).optional().describe("Дополнительный комментарий."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async ({ name, phone, vehicle_category, plate_number, desired_date, comment }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const payload = {
      source_form: "mcp",
      name,
      phone,
      vehicle_category: vehicle_category ? vehicle_category.toUpperCase() : null,
      plate_number: plate_number ?? null,
      desired_date: desired_date ?? null,
      comment: comment ?? null,
    };
    const { data, error } = await supabase.from("requests").insert(payload).select("id, created_at").single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    // Fire-and-forget email notification to admins
    try {
      await supabase.functions.invoke("send-notification", { body: payload });
    } catch (_) { /* ignore */ }
    return {
      content: [{ type: "text", text: `Заявка создана. ID: ${data.id}. Мы свяжемся с клиентом по телефону ${phone}.` }],
      structuredContent: { id: data.id, created_at: data.created_at },
    };
  },
});
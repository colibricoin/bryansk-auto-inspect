import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_contact_info",
  title: "Контакты и график работы пункта техосмотра",
  description:
    "Возвращает адрес, телефон, email и график работы пункта техосмотра в Брянске.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            name: "Пункт технического осмотра — Брянск",
            city: "Брянск",
            address: "г. Брянск (уточняйте по телефону)",
            phone: "+7 (соответствует контактам на сайте)",
            website: "https://bryansk-auto-inspect.lovable.app",
            hours: {
              mon_fri: "09:00–18:00",
              sat: "09:00–15:00",
              sun: "выходной",
            },
            services: "Техосмотр всех категорий ТС (L, M1, M2, M3, N1–N3, O1–O4), диагностическая карта для ОСАГО.",
            duration_minutes: "15–30",
          },
          null,
          2,
        ),
      },
    ],
  }),
});
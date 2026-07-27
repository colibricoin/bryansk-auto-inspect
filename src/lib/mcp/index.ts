import { defineMcp } from "@lovable.dev/mcp-js";
import listPricesTool from "./tools/list-prices";
import listSeoLocationsTool from "./tools/list-seo-locations";
import createInspectionRequestTool from "./tools/create-inspection-request";
import getContactInfoTool from "./tools/get-contact-info";

export default defineMcp({
  name: "bryansk-tehosmotr-mcp",
  title: "Техосмотр Брянск — MCP",
  version: "0.1.0",
  instructions:
    "Инструменты пункта техосмотра в Брянске: получить актуальные цены (list_prices), список районов и SEO-страниц (list_seo_locations), контакты и график работы (get_contact_info), создать заявку на техосмотр от клиента (create_inspection_request).",
  tools: [listPricesTool, listSeoLocationsTool, getContactInfoTool, createInspectionRequestTool],
});
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { PriceItem } from "@/hooks/usePrices";
import { COMPANY } from "@/data/company";
import { PRICE_SOURCE } from "@/hooks/usePrices";

// Roboto Regular (Cyrillic-capable) — загружается с jsDelivr и кэшируется в памяти
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.13/files/roboto-cyrillic-400-normal.woff";
const FONT_URL_TTF =
  "https://cdn.jsdelivr.net/gh/googlefonts/roboto@main/src/hinted/Roboto-Regular.ttf";

let cachedFont: string | null = null;

async function fetchFontBase64(): Promise<string> {
  if (cachedFont) return cachedFont;
  // Используем TTF — jsPDF поддерживает только TTF
  const res = await fetch(FONT_URL_TTF);
  if (!res.ok) throw new Error("Не удалось загрузить шрифт для PDF");
  const buf = await res.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)) as any);
  }
  cachedFont = btoa(binary);
  return cachedFont;
}

export interface PdfOptions {
  prices: PriceItem[];
  filterLabel?: string; // например "Все" или "Легковые"
  fileName?: string;
}

export async function generatePricesPdf({ prices, filterLabel = "Все категории", fileName }: PdfOptions) {
  const fontBase64 = await fetchFontBase64();

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto", "normal");

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString("ru-RU");

  // Шапка
  doc.setFontSize(16);
  doc.text(COMPANY.name, 40, 50);
  doc.setFontSize(10);
  doc.text(COMPANY.legalName, 40, 68);
  doc.text(`ИНН ${COMPANY.inn}  ·  ОГРН ${COMPANY.ogrn}`, 40, 82);
  doc.text(COMPANY.address, 40, 96);
  doc.text(`Тел.: ${COMPANY.phone}`, 40, 110);

  doc.setFontSize(14);
  doc.text("Прейскурант на технический осмотр ТС", 40, 140);
  doc.setFontSize(10);
  doc.text(`Категория фильтра: ${filterLabel}`, 40, 158);
  doc.text(`Дата формирования: ${today}`, 40, 172);

  const totalText = doc.splitTextToSize(`Источник: ${PRICE_SOURCE}`, pageWidth - 80);
  doc.text(totalText, 40, 186);

  const startY = 186 + totalText.length * 12 + 10;

  autoTable(doc, {
    startY,
    head: [["Категория", "Код", "Описание", "Цена, ₽"]],
    body: prices.map((p) => [p.category_name, p.category_code, p.description, String(p.price_rub)]),
    styles: {
      font: "Roboto",
      fontSize: 10,
      cellPadding: 6,
      lineColor: [220, 220, 220],
      lineWidth: 0.5,
    },
    headStyles: {
      font: "Roboto",
      fillColor: [225, 6, 0],
      textColor: 255,
      fontStyle: "normal",
    },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { cellWidth: 50, halign: "center" },
      2: { cellWidth: "auto" },
      3: { cellWidth: 70, halign: "right" },
    },
    didDrawPage: () => {
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setFont("Roboto", "normal");
      doc.text(
        `${COMPANY.name} · ${COMPANY.phone} · ${COMPANY.address}`,
        40,
        pageHeight - 20,
      );
    },
  });

  const safeFilter = filterLabel.replace(/\s+/g, "_");
  doc.save(fileName ?? `Прейскурант_${safeFilter}_${today}.pdf`);
}
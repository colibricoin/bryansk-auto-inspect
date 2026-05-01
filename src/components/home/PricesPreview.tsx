import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrices, PRICE_SOURCE } from "@/hooks/usePrices";
import { generatePricesPdf } from "@/lib/pricesPdf";
import { toast } from "@/hooks/use-toast";

const FILTER_GROUPS = [
  { label: "Все", value: "all" },
  { label: "Легковые", value: "Легковые" },
  { label: "Грузовые", value: "Грузовые" },
  { label: "Автобусы", value: "Автобусы" },
  { label: "Мотоциклы", value: "Мотоциклы" },
  { label: "Прицепы", value: "Прицепы" },
];

export default function PricesPreview() {
  const { prices, loading } = usePrices();
  const [filter, setFilter] = useState("all");
  const [pdfLoading, setPdfLoading] = useState(false);
  const filtered = filter === "all" ? prices : prices.filter((p) => p.category_name === filter);
  const filterLabel = FILTER_GROUPS.find((g) => g.value === filter)?.label ?? "Все";

  const handleDownloadPdf = async () => {
    if (!filtered.length) return;
    try {
      setPdfLoading(true);
      await generatePricesPdf({ prices: filtered, filterLabel });
    } catch (e) {
      console.error(e);
      toast({
        title: "Не удалось сформировать PDF",
        variant: "destructive",
      });
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <section id="prices" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-8">
          <div className="accent-line mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Стоимость техосмотра</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Цены установлены {PRICE_SOURCE}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {FILTER_GROUPS.map((g) => (
            <button
              key={g.value}
              onClick={() => setFilter(g.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === g.value
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Загрузка...</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-card border rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold">Категория</th>
                    <th className="text-left py-3 px-4 font-semibold">Код</th>
                    <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">Описание</th>
                    <th className="text-right py-3 px-4 font-semibold">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">{item.category_name}</td>
                      <td className="py-3 px-4 font-mono text-accent font-semibold">{item.category_code}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{item.description}</td>
                      <td className="py-3 px-4 text-right font-bold whitespace-nowrap">{item.price_rub} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <Link to="/prices">
            <Button variant="outline" className="font-semibold w-full sm:w-auto">
              Все цены и подробности
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Button
            onClick={handleDownloadPdf}
            disabled={pdfLoading || loading}
            className="bg-accent text-accent-foreground hover:bg-accent-hover font-semibold w-full sm:w-auto"
          >
            {pdfLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Скачать PDF ({filterLabel})
          </Button>
        </div>
      </div>
    </section>
  );
}

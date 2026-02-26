import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRICES, PRICE_SOURCE } from "@/data/prices";
import BookingForm from "@/components/home/BookingForm";

const FILTERS = [
  { label: "Все", value: "all" },
  { label: "Легковые", value: "Легковые" },
  { label: "Грузовые", value: "Грузовые" },
  { label: "Автобусы", value: "Автобусы" },
  { label: "Мотоциклы", value: "Мотоциклы" },
  { label: "Прицепы", value: "Прицепы" },
];

export default function Prices() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = PRICES.filter((p) => {
    const matchCat = filter === "all" || p.category === filter;
    const matchSearch =
      !search ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.details.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div className="section-padding">
        <div className="container-narrow">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Цены</span>
          </nav>

          <div className="text-center mb-8">
            <div className="accent-line mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Стоимость техосмотра</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Предельные размеры платы установлены {PRICE_SOURCE}
            </p>
          </div>

          {/* Search & filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по категории, коду..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f.value
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full price table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border rounded-xl overflow-hidden mb-8"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold">Категория</th>
                    <th className="text-left py-3 px-4 font-semibold">Код</th>
                    <th className="text-left py-3 px-4 font-semibold">Описание</th>
                    <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Подробности</th>
                    <th className="text-right py-3 px-4 font-semibold">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.code} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{item.category}</td>
                      <td className="py-3 px-4 font-mono text-accent font-semibold">{item.code}</td>
                      <td className="py-3 px-4">{item.description}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs hidden md:table-cell">{item.details}</td>
                      <td className="py-3 px-4 text-right font-bold text-lg whitespace-nowrap">{item.price} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">Ничего не найдено</div>
            )}
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
            <a
              href="https://tehosmotr32.ru/wp-content/uploads/2025/02/preyskurant-tsen-na-2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="font-semibold w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Скачать прайс PDF
              </Button>
            </a>
          </div>

          {/* For legal entities */}
          <div className="bg-card border rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Для юридических лиц</h2>
            <p className="text-muted-foreground mb-4">
              Работаем с организациями и ИП. Оплата по реквизитам, заключение договора, выставление счёта.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Для запроса счёта свяжитесь с нами по телефону или оставьте заявку с указанием реквизитов организации.
            </p>
            <Link to="/booking">
              <Button className="bg-accent text-accent-foreground hover:bg-accent-hover font-semibold">
                Запросить счёт
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

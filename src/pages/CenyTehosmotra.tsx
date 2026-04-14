import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { usePrices, PRICE_SOURCE } from "@/hooks/usePrices";
import { Button } from "@/components/ui/button";
import { ChevronRight, Phone } from "lucide-react";
import { COMPANY } from "@/data/company";

export default function CenyTehosmotra() {
  const { prices, loading } = usePrices();

  return (
    <>
      <Helmet>
        <title>Цены на техосмотр в Брянске 2025 — прейскурант для всех категорий ТС</title>
        <meta name="description" content="Актуальные цены на техосмотр в Брянске на 2025 год. От 359 ₽ для мотоциклов до 1742 ₽ для грузовых. Официальные тарифы Брянской области." />
        <link rel="canonical" href="https://bryansk-auto-inspect.lovable.app/ceny-tehosmotra-bryansk" />
      </Helmet>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Цены техосмотра Брянск</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Цены на техосмотр в Брянске</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Стоимость техосмотра установлена {PRICE_SOURCE}. Цены являются фиксированными и одинаковыми для всех пунктов ТО Брянской области.
          </p>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Загрузка цен...</div>
          ) : (
            <div className="bg-card border rounded-xl overflow-hidden mb-8">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-semibold">Код</th>
                    <th className="text-left p-4 font-semibold">Категория</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">Описание</th>
                    <th className="text-right p-4 font-semibold">Цена, ₽</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="p-4 font-mono font-semibold">{p.category_code}</td>
                      <td className="p-4 font-semibold">{p.category_name}</td>
                      <td className="p-4 hidden md:table-cell text-muted-foreground">{p.description}</td>
                      <td className="p-4 text-right font-bold text-lg">{p.price_rub.toLocaleString("ru")} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 mb-10">
            <h2 className="text-foreground">От чего зависит стоимость техосмотра в Брянске</h2>
            <p>
              Цена техосмотра в Брянске определяется категорией транспортного средства. Самый доступный техосмотр —
              для мотоциклов категории L. Стоимость техосмотра легковых автомобилей (M1) составляет 913 ₽.
              Для грузовых автомобилей и автобусов цена зависит от массы транспортного средства.
            </p>
            <p>
              Все цены на техосмотр в Брянске регулируются региональным законодательством и едины для всех
              аккредитованных пунктов ТО на территории Брянской области. Дополнительные сборы не взимаются.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/booking">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent-hover font-bold text-base px-8 h-12">
                Записаться <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <a href={`tel:${COMPANY.phoneRaw}`}>
              <Button size="lg" variant="outline" className="font-semibold text-base px-8 h-12">
                <Phone className="w-4 h-4 mr-2" /> {COMPANY.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

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
        <title>Цены на техосмотр в Брянске — прейскурант на 2025 год</title>
        <meta name="description" content="Актуальные цены на техосмотр в Брянске для всех категорий ТС. Тарифы утверждены регионом и одинаковы для всех аккредитованных пунктов." />
        <link rel="canonical" href="https://bryansk-auto-inspect.lovable.app/ceny-tehosmotra-bryansk" />
      </Helmet>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Цены</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Цены на техосмотр в Брянске</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Стоимость утверждена {PRICE_SOURCE} и одинакова для всех аккредитованных пунктов области.
            Никаких доплат «за срочность» или «за оформление» — вы платите ровно столько, сколько указано в таблице.
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
            <h2 className="text-foreground">От чего зависит стоимость</h2>
            <p>
              Цена определяется только категорией транспортного средства. Для мотоциклов и лёгких
              прицепов — самые низкие тарифы, для тяжёлых грузовиков и автобусов — выше, потому
              что осмотр сложнее и занимает больше времени.
            </p>
            <p>
              Для физических лиц — оплата наличными или картой на месте. Для организаций — счёт
              по безналу и пакет закрывающих документов: акт, договор по запросу. Если у вас
              несколько машин в парке, удобно договориться о времени заранее, чтобы провести их подряд.
            </p>
            <p>
              Если вы из Бежицкого, Советского, Володарского или Фокинского района — цена для
              вас точно такая же. Стоимость не меняется в зависимости от района или дня недели.
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

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { COMPANY } from "@/data/company";
import { Button } from "@/components/ui/button";
import { ChevronRight, Phone, FileText, CheckCircle2 } from "lucide-react";

export default function DiagnosticheskayaKarta() {
  return (
    <>
      <Helmet>
        <title>Диагностическая карта в Брянске — оформление для ОСАГО</title>
        <meta name="description" content="Электронная диагностическая карта в Брянске. Регистрация в ЕАИСТО сразу после осмотра. Подходит для оформления ОСАГО в любой страховой." />
        <link rel="canonical" href="https://bryansk-auto-inspect.lovable.app/diagnosticheskaya-karta-bryansk" />
      </Helmet>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Диагностическая карта</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Диагностическая карта в Брянске</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">Что это такое</h2>
              <p className="text-muted-foreground text-lg mb-4">
                Это электронный документ, который подтверждает, что машина прошла технический
                осмотр и соответствует требованиям безопасности. Без неё страховая не оформит
                ОСАГО на транспортные средства, для которых техосмотр обязателен.
              </p>
              <p className="text-muted-foreground text-lg">
                Бумажный экземпляр больше не нужен — все данные хранятся в государственной
                системе ЕАИСТО, и любая страховая видит карту по номеру автомобиля.
              </p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <FileText className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-bold text-lg mb-3">Что взять с собой</h3>
              <ul className="space-y-3">
                {[
                  "Паспорт владельца",
                  "СТС или ПТС",
                  "Водительское удостоверение",
                  "Чистую машину — без особой подготовки",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 mb-10">
            <h2 className="text-foreground">Как мы оформляем</h2>
            <p>
              Принимаем по записи и без неё. Эксперт проверяет машину по официальному регламенту,
              после чего карта формируется в электронном виде и сразу регистрируется в ЕАИСТО.
              На всё уходит около 20–30 минут для легкового автомобиля.
            </p>
            <p>
              Работаем с {COMPANY.experience}, аккредитованы РСА. Адрес — {COMPANY.address}.
              Если удобнее — звоните по {COMPANY.phone}, подскажем ближайшее свободное время.
            </p>
            <p>
              Стоимость зависит только от категории ТС и едина для всей Брянской области —
              никаких надбавок «за оформление» или «срочность». После осмотра можно сразу идти
              в страховую и оформлять полис.
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

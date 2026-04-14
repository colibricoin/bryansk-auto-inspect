import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { COMPANY } from "@/data/company";
import { Button } from "@/components/ui/button";
import { ChevronRight, Phone, FileText, CheckCircle2 } from "lucide-react";

export default function DiagnosticheskayaKarta() {
  return (
    <>
      <Helmet>
        <title>Диагностическая карта Брянск — получить для ОСАГО, официально</title>
        <meta name="description" content="Получите диагностическую карту в Брянске для оформления ОСАГО. Официальный пункт ТО. Данные вносятся в ЕАИСТО. Быстро, от 359 ₽." />
        <link rel="canonical" href="https://bryansk-auto-inspect.lovable.app/diagnosticheskaya-karta-bryansk" />
      </Helmet>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Диагностическая карта Брянск</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Диагностическая карта в Брянске</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">Что такое диагностическая карта</h2>
              <p className="text-muted-foreground text-lg mb-4">
                Диагностическая карта — это электронный документ, подтверждающий прохождение технического осмотра
                транспортного средства. Она необходима для оформления полиса ОСАГО и содержит информацию о
                техническом состоянии автомобиля.
              </p>
              <p className="text-muted-foreground text-lg">
                Данные диагностической карты вносятся в единую автоматизированную информационную систему
                технического осмотра (ЕАИСТО), что гарантирует их подлинность и юридическую силу.
              </p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <FileText className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-bold text-lg mb-3">Для получения диагностической карты нужно:</h3>
              <ul className="space-y-3">
                {[
                  "Паспорт владельца ТС",
                  "Свидетельство о регистрации ТС (СТС)",
                  "Водительское удостоверение",
                  "Транспортное средство в чистом виде",
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
            <h2 className="text-foreground">Где получить диагностическую карту в Брянске</h2>
            <p>
              Пункт техосмотра {COMPANY.legalName} в Брянске выдаёт диагностические карты для всех категорий
              транспортных средств. Наш пункт техосмотра аккредитован РСА и работает {COMPANY.experience}.
              Адрес: {COMPANY.address}.
            </p>
            <p>
              Процедура получения диагностической карты в Брянске занимает от 20 до 40 минут. Записаться можно
              онлайн или по телефону {COMPANY.phone}. После прохождения техосмотра диагностическая карта
              формируется автоматически и вносится в ЕАИСТО — вы сразу можете оформлять ОСАГО.
            </p>
            <p>
              Стоимость получения диагностической карты в Брянске зависит от категории ТС и составляет
              от 359 ₽ до 1 742 ₽. Цены регулируются Постановлением Правительства Брянской области.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/booking">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent-hover font-bold text-base px-8 h-12">
                Записаться на техосмотр <ChevronRight className="w-5 h-5 ml-1" />
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

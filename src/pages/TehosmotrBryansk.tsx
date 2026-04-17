import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { COMPANY } from "@/data/company";
import { Button } from "@/components/ui/button";
import { ChevronRight, Phone, MapPin, Clock, Shield } from "lucide-react";

export default function TehosmotrBryansk() {
  return (
    <>
      <Helmet>
        <title>Техосмотр Брянск — официальный пункт ТО, диагностическая карта для ОСАГО</title>
        <meta name="description" content="Аккредитованная станция техосмотра в Брянске. Все категории транспорта, единые цены региона, электронная карта в ЕАИСТО. Запись онлайн или по телефону." />
        <link rel="canonical" href="https://bryansk-auto-inspect.lovable.app/tehosmotr-bryansk" />
      </Helmet>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Техосмотр Брянск</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Техосмотр в Брянске</h1>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-card border rounded-xl p-6">
              <Shield className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">Официально</h3>
              <p className="text-muted-foreground">Аккредитация РСА, данные сразу в ЕАИСТО. Карта подходит для оформления ОСАГО в любой страховой.</p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <Clock className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">Без очередей</h3>
              <p className="text-muted-foreground">По записи легковая машина проходит осмотр за 20–30 минут. Грузовой транспорт — до часа.</p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <MapPin className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">Удобный заезд</h3>
              <p className="text-muted-foreground">{COMPANY.address}. Подъезд свободный, места для разворота хватает любому транспорту.</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 mb-10">
            <h2 className="text-foreground">Как у нас всё устроено</h2>
            <p>
              Мы — обычная рабочая станция техосмотра. Никакого «маркетинга» и навязывания —
              приезжаете в назначенное время, эксперт принимает машину и проводит проверку
              по официальному регламенту. Всё по закону № 170-ФЗ и Правилам ПП-1008.
            </p>
            <p>
              Из документов нужны паспорт владельца, СТС и водительское удостоверение. Машина
              должна быть просто чистой — никаких особых требований к подготовке. Если по итогам
              есть замечания, объясним, что именно нужно поправить, и примем повторно без оплаты
              второго полного осмотра.
            </p>
            <p>
              Карту получаете в электронном виде сразу после проверки — она попадает в ЕАИСТО,
              и страховая увидит её моментально. Работаем со всеми категориями: легковые, грузовые,
              автобусы, мотоциклы, прицепы. Для организаций — счёт по безналу и закрывающие документы.
            </p>

            <h2 className="text-foreground">Контакты</h2>
            <p>
              <strong>Адрес:</strong> {COMPANY.address}<br />
              <strong>Телефон:</strong> {COMPANY.phone}<br />
              <strong>График:</strong> {COMPANY.schedule.weekdays}, {COMPANY.schedule.saturday}, {COMPANY.schedule.sunday}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/booking">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent-hover font-bold text-base px-8 h-12">
                Записаться на осмотр <ChevronRight className="w-5 h-5 ml-1" />
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

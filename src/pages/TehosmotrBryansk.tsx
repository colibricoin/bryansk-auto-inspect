import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { COMPANY } from "@/data/company";
import { Button } from "@/components/ui/button";
import { ChevronRight, Phone, MapPin, Clock, Shield } from "lucide-react";

export default function TehosmotrBryansk() {
  return (
    <>
      <Helmet>
        <title>Техосмотр Брянск — пункт ТО, диагностическая карта для ОСАГО</title>
        <meta name="description" content="Пройдите техосмотр в Брянске быстро и официально. Аккредитованный пункт ТО. Все категории ТС. Диагностическая карта для ОСАГО. Запись онлайн." />
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
              <h3 className="font-bold text-lg mb-2">Аккредитация РСА</h3>
              <p className="text-muted-foreground">Официальный пункт техосмотра, зарегистрированный в ЕАИСТО. Диагностическая карта имеет полную юридическую силу.</p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <Clock className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">Быстрая процедура</h3>
              <p className="text-muted-foreground">Техосмотр в Брянске занимает от 20 до 40 минут. Без очередей при онлайн-записи.</p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <MapPin className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">Удобное расположение</h3>
              <p className="text-muted-foreground">{COMPANY.address}. Удобный подъезд для любого транспорта.</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 mb-10">
            <h2 className="text-foreground">Как пройти техосмотр в Брянске</h2>
            <p>
              Пункт техосмотра {COMPANY.legalName} предлагает услуги технического осмотра для всех категорий
              транспортных средств. Техосмотр в Брянске проводится в соответствии с Федеральным законом № 170-ФЗ
              и Правилами технического осмотра (ПП-1008).
            </p>
            <p>
              Для прохождения техосмотра в Брянске вам потребуется: паспорт владельца, свидетельство о регистрации ТС,
              водительское удостоверение. Транспортное средство должно быть в чистом состоянии. По результатам осмотра
              выдаётся электронная диагностическая карта, данные которой вносятся в ЕАИСТО.
            </p>
            <p>
              Диагностическая карта необходима для оформления полиса ОСАГО. Наш пункт техосмотра в Брянске
              имеет аккредитацию РСА и более {COMPANY.experience} опыта работы. Все цены на техосмотр в Брянске
              регулируются Постановлением Правительства Брянской области.
            </p>

            <h2 className="text-foreground">Контакты пункта техосмотра</h2>
            <p>
              <strong>Адрес:</strong> {COMPANY.address}<br />
              <strong>Телефон:</strong> {COMPANY.phone}<br />
              <strong>График:</strong> {COMPANY.schedule.weekdays}, {COMPANY.schedule.saturday}, {COMPANY.schedule.sunday}
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

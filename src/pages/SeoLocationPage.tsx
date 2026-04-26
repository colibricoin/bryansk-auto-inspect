import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ChevronRight, Phone, MapPin, Clock, Shield, FileCheck, Car, Bus, Truck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeoLocation, useSeoLocations } from "@/hooks/useSeoLocations";
import { usePrices, PRICE_SOURCE } from "@/hooks/usePrices";
import { COMPANY } from "@/data/company";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NotFound from "./NotFound";

const ADVANTAGES = [
  { icon: Shield, title: "Официальная аккредитация", desc: "Пункт аккредитован РСА, диагностическая карта в ЕАИСТО" },
  { icon: FileCheck, title: "Прозрачные цены", desc: "Стоимость утверждена постановлением Правительства Брянской области" },
  { icon: Clock, title: "Быстрое прохождение", desc: "Техосмотр занимает от 20 минут, запись онлайн" },
  { icon: Car, title: "Все категории ТС", desc: "Легковые, грузовые, автобусы, мотоциклы, прицепы" },
];

const STEPS = [
  { num: "1", title: "Запись", desc: "Запишитесь онлайн или по телефону" },
  { num: "2", title: "Приезд", desc: "Приезжайте с документами в назначенное время" },
  { num: "3", title: "Осмотр", desc: "Проходите технический осмотр на линии" },
  { num: "4", title: "Карта", desc: "Получаете диагностическую карту в ЕАИСТО" },
];

const CATEGORIES = [
  { code: "M1", name: "Легковые автомобили", icon: Car },
  { code: "N1–N3", name: "Грузовые автомобили", icon: Truck },
  { code: "M2, M3", name: "Автобусы", icon: Bus },
  { code: "L", name: "Мотоциклы и мопеды", icon: Car },
  { code: "O1–O4", name: "Прицепы и полуприцепы", icon: Truck },
];

export default function SeoLocationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { location, loading } = useSeoLocation(slug || "");
  const { locations: allLocations } = useSeoLocations();
  const { prices, loading: pricesLoading } = usePrices();
  const otherLocations = allLocations.filter((l) => l.slug !== slug);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-lg text-muted-foreground">Загрузка...</p></div>;
  }

  if (!location) {
    return <NotFound />;
  }

  const faqItems = [
    { q: `Где пройти техосмотр в районе «${location.location_name}»?`, a: `Наш пункт техосмотра расположен по адресу: ${COMPANY.address}. От ${location.location_name} — удобный подъезд на автомобиле.` },
    { q: `Сколько стоит техосмотр для жителей ${location.location_name}?`, a: `Стоимость техосмотра одинакова для всех районов Брянска и утверждена ${PRICE_SOURCE}. Актуальные цены — в таблице выше.` },
    { q: "Нужна ли диагностическая карта для ОСАГО?", a: "Да, диагностическая карта обязательна для оформления полиса ОСАГО на транспортные средства определённых категорий и возраста." },
    { q: "Как записаться на техосмотр в Брянске?", a: "Записаться можно онлайн через форму на сайте или по телефону. Выберите удобную дату и время." },
    { q: "Какие документы нужны для техосмотра?", a: "Паспорт или права владельца, свидетельство о регистрации ТС (СТС). Для юрлиц — доверенность." },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: `Техосмотр ${location.location_name} — ${COMPANY.name}`,
    description: location.seo_description,
    url: `https://bryansk-auto-inspect.lovable.app/${location.slug}`,
    telephone: COMPANY.phoneRaw,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Лермонтова, 1Б",
      addressLocality: "Брянск",
      addressRegion: "Брянская область",
      postalCode: "241520",
      addressCountry: "RU",
    },
    geo: { "@type": "GeoCoordinates", latitude: "53.220", longitude: "34.380" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "15:00" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{location.seo_title}</title>
        <meta name="description" content={location.seo_description} />
        {location.keywords && <meta name="keywords" content={location.keywords} />}
        <link rel="canonical" href={`https://bryansk-auto-inspect.lovable.app/${location.slug}`} />
        <meta property="og:title" content={location.seo_title} />
        <meta property="og:description" content={location.seo_description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://bryansk-auto-inspect.lovable.app/${location.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={location.seo_title} />
        <meta name="twitter:description" content={location.seo_description} />
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="bg-muted/50 border-b">
        <div className="container-narrow py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Главная</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/rayony-bryanska">Районы Брянска</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><span className="font-medium">{location.location_name}</span></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-narrow">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            {location.h1}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl opacity-80 max-w-2xl mb-8">
            Официальный техосмотр для автомобилей, автобусов, грузовых машин и прицепов
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-base opacity-70 max-w-2xl mb-8">
            {location.intro_text}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-3">
            <Link to="/booking">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent-hover font-bold text-base px-8 h-12">
                Записаться онлайн <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <a href={`tel:${COMPANY.phoneRaw}`}>
              <Button size="lg" variant="outline" className="border-2 border-primary-foreground/30 text-primary-foreground font-semibold text-base px-8 h-12 hover:bg-primary-foreground/10">
                <Phone className="w-4 h-4 mr-2" /> Позвонить
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Advantages */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Почему к нам обращаются из района «{location.location_name}»</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((a) => (
              <div key={a.title} className="p-6 rounded-xl border bg-card">
                <a.icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-bold text-lg mb-2">{a.title}</h3>
                <p className="text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Категории транспортных средств</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((c) => (
              <div key={c.code} className="flex items-center gap-3 p-4 bg-card rounded-xl border">
                <c.icon className="w-6 h-6 text-accent shrink-0" />
                <div>
                  <div className="font-bold">{c.code}</div>
                  <div className="text-sm text-muted-foreground">{c.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prices */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Цены на техосмотр</h2>
          <p className="text-muted-foreground mb-6">{PRICE_SOURCE}</p>
          {pricesLoading ? (
            <p className="text-muted-foreground">Загрузка цен...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-bold">Код</th>
                    <th className="py-3 px-4 font-bold">Категория</th>
                    <th className="py-3 px-4 font-bold text-right">Цена, ₽</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4 font-semibold">{p.category_code}</td>
                      <td className="py-3 px-4">{p.category_name}</td>
                      <td className="py-3 px-4 text-right font-bold text-accent">{p.price_rub} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-6">
            <Link to="/prices"><Button variant="outline">Все цены →</Button></Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Как пройти техосмотр</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.num} className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.num}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO text */}
      <section className="section-padding bg-background">
        <div className="container-narrow max-w-3xl">
          <div className="prose prose-lg max-w-none text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: location.seo_text.replace(/\n/g, "<br/>") }} />
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Частые вопросы</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-6 bg-card">
                  <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-accent text-accent-foreground">
        <div className="container-narrow text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Запишитесь на техосмотр прямо сейчас</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Официальный техосмотр для жителей района «{location.location_name}». Быстро, без очередей, по доступным ценам.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/booking">
              <Button size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 h-12">
                Записаться онлайн <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <a href={`tel:${COMPANY.phoneRaw}`}>
              <Button size="lg" variant="outline" className="border-2 border-accent-foreground/30 text-accent-foreground font-semibold text-base px-8 h-12">
                <Phone className="w-4 h-4 mr-2" /> {COMPANY.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Контакты и маршрут</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <div className="font-bold mb-1">Адрес</div>
                  <div className="text-muted-foreground">{COMPANY.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <div className="font-bold mb-1">Телефон</div>
                  <a href={`tel:${COMPANY.phoneRaw}`} className="text-accent font-semibold">{COMPANY.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <div className="font-bold mb-1">Режим работы</div>
                  <div className="text-muted-foreground">{COMPANY.schedule.weekdays}</div>
                  <div className="text-muted-foreground">{COMPANY.schedule.saturday}</div>
                  <div className="text-muted-foreground">{COMPANY.schedule.sunday}</div>
                </div>
              </div>
              <a href={COMPANY.mapLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="mt-4">Построить маршрут →</Button>
              </a>
            </div>
            <div className="rounded-xl overflow-hidden border h-[300px]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=34.380%2C53.220&z=14&pt=34.380%2C53.220%2Cpm2rdm"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title={`Карта: техосмотр ${location.location_name}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <h2 className="text-xl font-bold mb-6">Техосмотр в других районах Брянска</h2>
          <div className="flex flex-wrap gap-3">
            {otherLocations.map((loc) => (
              <Link key={loc.slug} to={`/${loc.slug}`} className="px-4 py-2 bg-card border rounded-lg text-sm font-medium hover:border-accent transition-colors">
                {loc.location_name}
              </Link>
            ))}
            <Link to="/prices" className="px-4 py-2 bg-card border rounded-lg text-sm font-medium hover:border-accent transition-colors">Цены</Link>
            <Link to="/diagnosticheskaya-karta-bryansk" className="px-4 py-2 bg-card border rounded-lg text-sm font-medium hover:border-accent transition-colors">Диагностическая карта</Link>
            <Link to="/booking" className="px-4 py-2 bg-card border rounded-lg text-sm font-medium hover:border-accent transition-colors">Онлайн-запись</Link>
          </div>
        </div>
      </section>
    </>
  );
}

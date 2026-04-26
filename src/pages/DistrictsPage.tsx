import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeoLocations } from "@/hooks/useSeoLocations";
import { COMPANY } from "@/data/company";
import DynamicMeta from "@/components/seo/DynamicMeta";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DistrictsPage() {
  const { locations, loading } = useSeoLocations();

  return (
    <>
      <DynamicMeta
        routePath="/rayony-bryanska"
        defaultTitle="Техосмотр по районам Брянска — все районы и локации"
        defaultDescription="Пункт техосмотра в Брянске обслуживает все районы: Бежицкий, Володарский, Советский, Фокинский, Большое Полпино. Запись онлайн."
        defaultKeywords="техосмотр районы Брянска, техосмотр Бежицкий район, техосмотр Советский район, техосмотр Володарский район, техосмотр Фокинский район"
        canonical="https://bryansk-auto-inspect.lovable.app/rayony-bryanska"
      />

      <div className="bg-muted/50 border-b">
        <div className="container-narrow py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Главная</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><span className="font-medium">Районы Брянска</span></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-narrow">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">Техосмотр по районам Брянска</h1>
          <p className="text-lg opacity-80 max-w-2xl">
            Наш аккредитованный пункт техосмотра удобно расположен для жителей всех районов города Брянска. Выберите свой район для подробной информации.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          {loading ? (
            <p className="text-muted-foreground text-center">Загрузка...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((loc, i) => (
                <motion.div
                  key={loc.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border rounded-xl p-6 flex flex-col hover:border-accent/50 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-bold text-lg">{loc.location_name}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{loc.intro_text}</p>
                  <div className="flex gap-2">
                    <Link to={`/${loc.slug}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Подробнее <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                    <Link to="/booking">
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent-hover">
                        Записаться
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Map */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Расположение пункта техосмотра</h2>
          <div className="rounded-xl overflow-hidden border h-[400px]">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=34.380%2C53.220&z=12&pt=34.380%2C53.220%2Cpm2rdm"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Карта охвата — техосмотр Брянск"
            />
          </div>
          <p className="text-center text-muted-foreground mt-4">{COMPANY.address}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-accent text-accent-foreground">
        <div className="container-narrow text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Запишитесь на техосмотр</h2>
          <p className="text-lg opacity-90 mb-8">Обслуживаем все районы Брянска. Удобная запись, официальная диагностическая карта.</p>
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
    </>
  );
}

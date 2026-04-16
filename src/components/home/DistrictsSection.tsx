import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeoLocations } from "@/hooks/useSeoLocations";

const DISTRICT_SLUGS = [
  "tehosmotr-bezhickiy-rayon",
  "tehosmotr-volodarskiy-rayon",
  "tehosmotr-sovetskiy-rayon",
  "tehosmotr-fokinskiy-rayon",
  "tehosmotr-bolshoe-polpino",
];

const SHORT_DESC: Record<string, string> = {
  "tehosmotr-bezhickiy-rayon": "15–20 минут от центра района. Удобный подъезд, минимум ожидания.",
  "tehosmotr-volodarskiy-rayon": "10–15 минут на автомобиле. Официальная диагностическая карта.",
  "tehosmotr-sovetskiy-rayon": "20 минут из центра Советского района. Все категории ТС.",
  "tehosmotr-fokinskiy-rayon": "15 минут езды. Ближайший аккредитованный пункт.",
  "tehosmotr-bolshoe-polpino": "Пункт расположен прямо здесь. Без лишних поездок!",
};

export default function DistrictsSection() {
  const { locations, loading } = useSeoLocations();

  if (loading) return null;

  const districts = locations.filter((l) => DISTRICT_SLUGS.includes(l.slug));

  if (districts.length === 0) return null;

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <div className="accent-line mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Обслуживаем весь Брянск</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Наш пункт техосмотра удобно расположен для жителей всех районов Брянска
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {districts.map((d, i) => (
            <motion.div
              key={d.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border rounded-xl p-6 flex flex-col hover:border-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-bold text-lg">{d.location_name}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4 flex-1">
                {SHORT_DESC[d.slug] || d.intro_text}
              </p>
              <div className="flex gap-2">
                <Link to={`/${d.slug}`} className="flex-1">
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

        <div className="text-center mt-8">
          <Link to="/rayony-bryanska">
            <Button variant="outline" size="lg">
              Все районы и локации <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

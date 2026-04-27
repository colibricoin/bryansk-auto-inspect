import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeoLocations } from "@/hooks/useSeoLocations";
import iconMap from "@/assets/icon-district-map.png";
import iconNav from "@/assets/icon-district-nav.png";
import iconCity from "@/assets/icon-district-city.png";
import iconRoute from "@/assets/icon-district-route.png";
import iconPin from "@/assets/icon-district-pin.png";

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

const DISTRICT_ICON: Record<string, string> = {
  "tehosmotr-bezhickiy-rayon": iconMap,
  "tehosmotr-volodarskiy-rayon": iconNav,
  "tehosmotr-sovetskiy-rayon": iconCity,
  "tehosmotr-fokinskiy-rayon": iconRoute,
  "tehosmotr-bolshoe-polpino": iconPin,
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
              whileHover={{ y: -4 }}
              className="bg-card border rounded-xl p-6 flex flex-col hover:border-accent/50 hover:shadow-[0_12px_28px_-10px_hsl(var(--accent)/0.25)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={DISTRICT_ICON[d.slug] || iconPin}
                  alt={d.location_name}
                  width={112}
                  height={112}
                  loading="lazy"
                  className="w-12 h-12 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)]"
                />
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

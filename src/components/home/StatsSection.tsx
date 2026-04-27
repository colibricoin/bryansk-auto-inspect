import { motion } from "framer-motion";
import shieldIcon from "@/assets/stat-shield.png";
import checklistIcon from "@/assets/stat-checklist.png";
import carIcon from "@/assets/stat-car.png";
import clockIcon from "@/assets/stat-clock.png";

const STATS = [
  { icon: shieldIcon, alt: "Щит — гарантия надёжности", value: "8+", label: "лет работы", sub: "аккредитация РСА" },
  { icon: checklistIcon, alt: "Чек-лист пройденных техосмотров", value: "1000+", label: "техосмотров", sub: "за время работы" },
  { icon: carIcon, alt: "Автомобиль — все категории ТС", value: "Все", label: "категории ТС", sub: "от мото до автобусов" },
  { icon: clockIcon, alt: "Часы — время осмотра", value: "15–30", label: "минут на осмотр", sub: "легковой автомобиль" },
];

export default function StatsSection() {
  return (
    <section className="pt-8 pb-10 lg:pt-10 lg:pb-12 bg-background">
      <div className="container-narrow">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="group bg-card rounded-[10px] border border-border/60 px-4 py-4 lg:px-5 lg:py-5 text-center shadow-[0_2px_8px_-2px_hsl(var(--foreground)/0.06)] hover:shadow-[0_10px_28px_-6px_hsl(var(--accent)/0.22)] transition-shadow"
            >
              <div className="flex justify-center mb-2">
                <img
                  src={s.icon}
                  alt={s.alt}
                  width={128}
                  height={128}
                  loading="lazy"
                  className="w-14 h-14 lg:w-16 lg:h-16 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold text-foreground leading-none tracking-tight mb-1.5">
                {s.value}
              </div>
              <div className="font-semibold text-foreground text-sm leading-tight">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

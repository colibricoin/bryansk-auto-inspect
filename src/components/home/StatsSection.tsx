import { motion } from "framer-motion";
import { ShieldCheck, ClipboardList, Car, Clock } from "lucide-react";

const STATS = [
  { icon: ShieldCheck, value: "8+", label: "лет работы", sub: "аккредитация РСА" },
  { icon: ClipboardList, value: "1000+", label: "техосмотров", sub: "за время работы" },
  { icon: Car, value: "Все", label: "категории ТС", sub: "от мото до автобусов" },
  { icon: Clock, value: "15–30", label: "минут на осмотр", sub: "легковой автомобиль" },
];

export default function StatsSection() {
  return (
    <section className="pt-8 pb-10 lg:pt-10 lg:pb-12 bg-background">
      <div className="container-narrow">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="bg-card rounded-[10px] border border-border/60 px-4 py-4 lg:px-5 lg:py-5 shadow-[0_2px_8px_-2px_hsl(var(--foreground)/0.06)] hover:shadow-[0_8px_24px_-6px_hsl(var(--accent)/0.18)] transition-shadow"
              >
                <div className="mb-2.5 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent/10 text-accent shadow-sm">
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="text-3xl lg:text-4xl font-extrabold text-foreground leading-none tracking-tight mb-1.5">
                  {s.value}
                </div>
                <div className="font-semibold text-foreground text-sm leading-tight">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{s.sub}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

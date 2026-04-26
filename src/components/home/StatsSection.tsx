import { motion } from "framer-motion";

const STATS = [
  { value: "8+", label: "лет работы", sub: "официально с аккредитацией РСА" },
  { value: "1000+", label: "пройденных техосмотров", sub: "за всё время работы станции" },
  { value: "Все", label: "категории ТС", sub: "от мотоциклов до автобусов" },
  { value: "15–30", label: "минут на осмотр", sub: "для легкового автомобиля" },
];

export default function StatsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card p-4 lg:p-6"
            >
              <div className="text-3xl lg:text-4xl font-extrabold text-foreground mb-1 tracking-tight">
                {s.value}
              </div>
              <div className="font-semibold text-foreground mb-0.5">{s.label}</div>
              <div className="text-sm text-muted-foreground">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

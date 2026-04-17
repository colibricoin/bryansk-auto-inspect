import { motion } from "framer-motion";
import { Camera, Wrench, Car, MapPin } from "lucide-react";

const SLOTS = [
  { icon: Wrench, label: "Линия техосмотра" },
  { icon: Car, label: "Зона осмотра" },
  { icon: Wrench, label: "Оборудование" },
  { icon: MapPin, label: "Въезд и территория" },
];

export default function StationSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <div className="mb-10">
          <div className="accent-line mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Реальная станция техосмотра в Брянске</h2>
          <p className="text-muted-foreground max-w-2xl">
            Наш пункт работает по официальной аккредитации. Ниже — фотографии линии, оборудования
            и территории. Скоро мы обновим этот раздел реальными снимками станции.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SLOTS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="aspect-[4/3] rounded-xl border bg-card flex flex-col items-center justify-center gap-3 p-6"
            >
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <s.icon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-sm font-semibold text-foreground text-center">{s.label}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Camera className="w-3.5 h-3.5" />
                <span>фото скоро</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

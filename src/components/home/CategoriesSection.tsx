import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import vehicleMoto from "@/assets/vehicles/moto.png";
import vehicleSedan from "@/assets/vehicles/sedan.png";
import vehicleTruck from "@/assets/vehicles/truck.png";
import vehicleBus from "@/assets/vehicles/bus.png";
import vehicleTrailer from "@/assets/vehicles/trailer.png";

const CATEGORIES = [
  {
    image: vehicleMoto,
    title: "Мотоциклы",
    codes: "L",
    description: "Мототранспортные средства всех типов",
    anchor: "moto",
  },
  {
    image: vehicleSedan,
    title: "Легковые автомобили",
    codes: "M1",
    description: "Легковые автомобили и микроавтобусы до 8 пассажирских мест",
    anchor: "m1",
  },
  {
    image: vehicleTruck,
    title: "Грузовые автомобили",
    codes: "N1, N2, N3",
    description: "Грузовой транспорт от 3,5 до 12,5 тонн и свыше",
    anchor: "cargo",
  },
  {
    image: vehicleBus,
    title: "Автобусы",
    codes: "M2, M3",
    description: "ТС для перевозки более 8 пассажиров. ТО совместно с ГИБДД",
    anchor: "bus",
  },
  {
    image: vehicleTrailer,
    title: "Прицепы",
    codes: "O1–O4",
    description: "Прицепы и полуприцепы всех категорий",
    anchor: "trailer",
  },
];

export default function CategoriesSection() {
  return (
    <section className="section-padding bg-muted/40">
      <div className="container-narrow">
        <div className="text-center mb-8">
          <div className="accent-line mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Категории ТС, которые мы обслуживаем
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Полный технический осмотр и оформление диагностической карты для всех категорий
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.anchor}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Link
                to={`/services#${cat.anchor}`}
                className="bg-card rounded-[10px] border border-border/60 shadow-[0_2px_10px_-2px_hsl(var(--foreground)/0.08)] hover:shadow-[0_18px_40px_-12px_hsl(var(--accent)/0.2)] transition-shadow duration-300 flex flex-col p-5 group h-full"
              >
                <div className="relative w-full pt-4 pb-6 mb-3 flex items-end justify-center">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="relative z-10 w-auto max-w-[80%] h-36 object-contain transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  {/* Мягкая овальная тень под машиной */}
                  <div
                    aria-hidden
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[55%] h-3 rounded-[50%] bg-foreground/15 blur-lg transition-all duration-300 ease-out group-hover:w-[65%] group-hover:bg-foreground/10 group-hover:blur-xl"
                  />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground">{cat.title}</h3>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <div className="text-xs font-mono text-accent mb-1">{cat.codes}</div>
                <p className="text-sm text-muted-foreground">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

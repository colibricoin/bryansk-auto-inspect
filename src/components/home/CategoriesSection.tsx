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
        <div className="text-center mb-12">
          <div className="accent-line mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Категории ТС, которые мы обслуживаем
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Полный технический осмотр и оформление диагностической карты для всех категорий
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.anchor}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={`/services#${cat.anchor}`}
                className="card-premium flex flex-col p-5 group h-full"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-40 object-contain drop-shadow-lg mb-5 group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground">{cat.title}</h3>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <div className="text-xs font-mono text-accent mb-2">{cat.codes}</div>
                <p className="text-sm text-muted-foreground">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

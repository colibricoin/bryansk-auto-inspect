import { motion } from "framer-motion";

import trustShield from "@/assets/icons/trust-shield.png";
import trustSpeed from "@/assets/icons/trust-speed.png";
import trustDocument from "@/assets/icons/trust-document.png";
import trustCalendar from "@/assets/icons/trust-calendar.png";
import trustContract from "@/assets/icons/trust-contract.png";
import trustVehicles from "@/assets/icons/trust-vehicles.png";

const TRUST_ITEMS = [
  {
    image: trustShield,
    title: "Аккредитация РСА",
    description: "Официальный пункт ТО, аккредитованный Российским союзом автостраховщиков",
  },
  {
    image: trustSpeed,
    title: "Быстрое прохождение",
    description: "Техосмотр легкового автомобиля — от 20 минут без лишних ожиданий",
  },
  {
    image: trustDocument,
    title: "Прозрачные цены",
    description: "Стоимость строго по тарифам, установленным Правительством Брянской области",
  },
  {
    image: trustCalendar,
    title: "Удобный график",
    description: "Пн–Пт: 09:00–18:00, Сб: 09:00–15:00. Предварительная запись по телефону и онлайн",
  },
  {
    image: trustContract,
    title: "Оплата для юрлиц",
    description: "Оплата в кассе и по реквизитам. Работаем с организациями и ИП",
  },
  {
    image: trustVehicles,
    title: "Для всех категорий",
    description: "Легковые, грузовые, автобусы, мотоциклы, прицепы — все категории ТС",
  },
];

export default function TrustSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-8">
          <div className="accent-line mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Почему нам доверяют</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Более 8 лет безупречной работы. Официальный техосмотр с гарантией качества.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-premium p-5"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-contain drop-shadow-md mb-3"
                loading="lazy"
              />
              <h3 className="font-semibold mb-1 text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

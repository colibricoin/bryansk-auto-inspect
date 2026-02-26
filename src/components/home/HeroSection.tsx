import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/data/company";
import heroImage from "@/assets/hero-inspection.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Линия технического осмотра"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-narrow section-padding w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border border-accent/20">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Аккредитован РСА · Работаем {COMPANY.experience}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-foreground"
          >
            Официальный техосмотр
            <br />
            <span className="text-accent">в Брянске</span>
            <br />
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-foreground">
              Диагностическая карта для ОСАГО
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg mb-8 leading-relaxed max-w-xl text-muted-foreground"
          >
            Пункт технического осмотра {COMPANY.legalName}. Все категории ТС: легковые, грузовые, автобусы, мотоциклы, прицепы. Прозрачные цены, удобный график, современное оборудование.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link to="/booking">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent-hover font-bold text-base px-8 h-12 w-full sm:w-auto shadow-lg shadow-accent/20"
              >
                Записаться онлайн
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link to="/prices">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-border font-semibold text-base px-8 h-12 w-full sm:w-auto text-foreground bg-card/80 backdrop-blur-sm hover:bg-card"
              >
                Узнать цену
              </Button>
            </Link>
            <a href={`tel:${COMPANY.phoneRaw}`} className="sm:hidden">
              <Button
                size="lg"
                variant="outline"
                className="font-semibold text-base px-8 h-12 w-full border-border text-foreground"
              >
                <Phone className="w-4 h-4 mr-2" />
                Позвонить
              </Button>
            </a>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-8 mt-10"
          >
            {[
              { value: "8+", label: "лет работы" },
              { value: "11", label: "категорий ТС" },
              { value: "от 359₽", label: "стоимость" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-extrabold text-accent">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

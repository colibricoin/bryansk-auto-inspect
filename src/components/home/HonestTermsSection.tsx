import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/data/company";

const TERMS = [
  {
    title: "Без навязывания услуг",
    text: "Проверяем только то, что требует регламент. Никаких «допов» и платных «рекомендаций».",
  },
  {
    title: "Прозрачные цены",
    text: "Тарифы утверждены регионом. Стоимость для вашей категории ТС видна заранее — на сайте.",
  },
  {
    title: "Оплата по факту",
    text: "Платите после осмотра. Наличные, карта или безналичный расчёт для организаций.",
  },
  {
    title: "Работаем официально",
    text: "Аккредитация РСА. Карта сразу попадает в ЕАИСТО — её увидит любая страховая.",
  },
];

export default function HonestTermsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="accent-line mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Честные условия</h2>
            <p className="text-muted-foreground mb-6">
              Мы работаем как обычная станция техосмотра — без агрессивных продаж и скрытых платежей.
              Если что-то непонятно, спрашивайте напрямую.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/booking">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground font-bold h-12 px-6">
                  Записаться
                </Button>
              </Link>
              <a href={`tel:${COMPANY.phoneRaw}`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold h-12 px-6">
                  <Phone className="w-4 h-4 mr-2" /> {COMPANY.phone}
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {TERMS.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-card border rounded-xl p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-accent" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{t.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

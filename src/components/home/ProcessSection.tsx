import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import processDocs from "@/assets/icons/process-docs.png";
import processInspection from "@/assets/icons/process-inspection.png";
import processResult from "@/assets/icons/process-result.png";
import processCard from "@/assets/icons/process-card.png";

const STEPS = [
  {
    image: processDocs,
    title: "Подготовка документов",
    description: "Возьмите паспорт и СТС (или ПТС). Для юрлиц — доверенность.",
  },
  {
    image: processInspection,
    title: "Заезд и осмотр",
    description: "Подъезжайте на пункт ТО. Специалист проведёт диагностику на современном оборудовании.",
  },
  {
    image: processResult,
    title: "Результат и оформление",
    description: "По результатам осмотра формируется протокол проверки.",
  },
  {
    image: processCard,
    title: "Диагностическая карта",
    description: "Получите диагностическую карту для оформления полиса ОСАГО.",
  },
];

const CHECKLIST = [
  "Исправность тормозной системы",
  "Работа всех световых приборов",
  "Состояние шин и колёс",
  "Работа стеклоочистителей",
  "Наличие аптечки, огнетушителя, знака аварийной остановки",
  "Чистота и читаемость госномеров",
];

export default function ProcessSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <div className="accent-line mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Как проходит техосмотр</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Простая и понятная процедура — от подготовки до получения результата
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative text-center group"
            >
              <div className="relative w-28 h-28 mx-auto mb-6">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border rounded-lg p-6 md:p-8 shadow-sm"
        >
          <h3 className="font-semibold text-lg mb-4 text-foreground">Что проверить перед приездом</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHECKLIST.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

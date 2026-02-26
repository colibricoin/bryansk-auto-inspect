import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bike, Car, Truck, Bus, ChevronRight, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SERVICES = [
  {
    id: "moto",
    icon: Bike,
    title: "Мотоциклы и прицепы",
    codes: "L, O1, O2, O3, O4",
    description: "Мототранспортные средства (мотоциклы, мопеды, квадрициклы) и прицепы всех категорий.",
    included: [
      "Проверка тормозной системы",
      "Проверка внешних световых приборов",
      "Проверка рулевого управления",
      "Проверка колёс и шин",
      "Проверка стёкол и зеркал",
      "Оформление диагностической карты",
    ],
    docs: ["Паспорт владельца (или доверенность)", "СТС или ПТС"],
  },
  {
    id: "m1",
    icon: Car,
    title: "Легковые автомобили",
    codes: "M1",
    description:
      "Легковые автомобили и микроавтобусы — транспортные средства для перевозки помимо места водителя не более 8 мест.",
    included: [
      "Проверка тормозной системы (стенд)",
      "Проверка рулевого управления",
      "Проверка внешних световых приборов (стенд)",
      "Проверка стеклоочистителей и стеклоомывателей",
      "Проверка колёс, шин, дисков",
      "Проверка двигателя и систем",
      "Проверка кузова и остекления",
      "Оформление диагностической карты",
    ],
    docs: ["Паспорт владельца (или доверенность)", "СТС или ПТС"],
  },
  {
    id: "cargo",
    icon: Truck,
    title: "Грузовые автомобили",
    codes: "N1, N2, N3",
    description:
      "Транспортные средства, предназначенные для перевозки грузов. Категории: N1 (до 3,5т), N2 (3,5–12т), N3 (свыше 12т).",
    included: [
      "Полная диагностика тормозной системы",
      "Проверка рулевого управления",
      "Проверка световых приборов",
      "Проверка пневматических систем",
      "Проверка подвески и ходовой",
      "Проверка систем безопасности",
      "Проверка тахографа (при наличии)",
      "Оформление диагностической карты",
    ],
    docs: ["Паспорт владельца / доверенность", "СТС или ПТС", "Путевой лист (для юрлиц)"],
  },
  {
    id: "bus",
    icon: Bus,
    title: "Автобусы",
    codes: "M2, M3",
    description:
      "Транспортные средства для перевозки помимо места водителя более 8 мест. M2 (до 5т), M3 (свыше 5т). Технический осмотр проводится совместно с ГИБДД по отдельному графику.",
    included: [
      "Полная диагностика тормозной системы",
      "Проверка рулевого управления",
      "Проверка аварийных выходов",
      "Проверка световых приборов",
      "Проверка систем безопасности пассажиров",
      "Проверка тахографа",
      "Совместный осмотр с ГИБДД",
      "Оформление диагностической карты",
    ],
    docs: [
      "Паспорт владельца / доверенность",
      "СТС или ПТС",
      "Путевой лист",
      "Лицензия на перевозку пассажиров (при наличии)",
    ],
  },
];

export default function Services() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <div className="section-padding">
      <div className="container-narrow">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Услуги и категории ТС</span>
        </nav>

        <div className="text-center mb-12">
          <div className="accent-line mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Услуги и категории ТС</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Полный технический осмотр всех категорий транспортных средств с оформлением диагностической карты
          </p>
        </div>

        <div className="space-y-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border rounded-xl p-6 md:p-8 scroll-mt-24"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <service.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{service.title}</h2>
                  <div className="text-sm font-mono text-accent">{service.codes}</div>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{service.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Что входит в осмотр
                  </h3>
                  <ul className="space-y-2">
                    {service.included.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    Необходимые документы
                  </h3>
                  <ul className="space-y-2">
                    {service.docs.map((doc) => (
                      <li key={doc} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0 mt-1.5" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/booking">
            <Button className="bg-accent text-accent-foreground hover:bg-accent-hover font-bold text-base px-8 h-12">
              Записаться на техосмотр
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

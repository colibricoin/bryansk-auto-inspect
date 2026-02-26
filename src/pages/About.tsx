import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, Clock, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/data/company";

export default function About() {
  return (
    <div className="section-padding">
      <div className="container-narrow">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">О компании</span>
        </nav>

        <div className="text-center mb-12">
          <div className="accent-line mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">О компании</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-lg p-6 md:p-8 mb-8 shadow-sm"
        >
          <p className="text-lg leading-relaxed mb-6 text-foreground">{COMPANY.description}</p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Мы проводим полный технический осмотр всех категорий транспортных средств: легковых, грузовых автомобилей, автобусов, мотоциклов и прицепов. По результатам осмотра оформляем диагностическую карту, необходимую для получения полиса ОСАГО.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Наш пункт ТО оснащён современным диагностическим оборудованием, позволяющим проводить осмотр качественно и в кратчайшие сроки. Мы ценим время наших клиентов и гарантируем прозрачность на всех этапах прохождения техосмотра.
          </p>
        </motion.div>

        {/* Key facts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: ShieldCheck, label: "Аккредитация РСА", value: "Действующая" },
            { icon: Clock, label: "Опыт работы", value: COMPANY.experience },
            { icon: Users, label: "Категории ТС", value: "11 категорий" },
            { icon: CreditCard, label: "Оплата", value: "Касса / реквизиты" },
          ].map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border rounded-lg p-5 text-center shadow-sm"
            >
              <fact.icon className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="font-bold text-lg text-foreground">{fact.value}</div>
              <div className="text-sm text-muted-foreground">{fact.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Requisites */}
        <div className="bg-card border rounded-lg p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-foreground">Реквизиты</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Наименование:</span>
              <p className="font-medium text-foreground">{COMPANY.legalName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">ИНН:</span>
              <p className="font-medium text-foreground">{COMPANY.inn}</p>
            </div>
            <div>
              <span className="text-muted-foreground">ОГРН:</span>
              <p className="font-medium text-foreground">{COMPANY.ogrn}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Адрес:</span>
              <p className="font-medium text-foreground">{COMPANY.address}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Телефон:</span>
              <p className="font-medium">
                <a href={`tel:${COMPANY.phoneRaw}`} className="text-accent hover:underline">
                  {COMPANY.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/booking">
            <Button className="bg-accent text-accent-foreground hover:bg-accent-hover font-bold text-base px-8 h-12 shadow-lg shadow-accent/20">
              Записаться на техосмотр
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

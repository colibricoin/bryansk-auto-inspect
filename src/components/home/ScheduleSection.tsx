import { motion } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import { COMPANY } from "@/data/company";

export default function ScheduleSection() {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <div className="accent-line mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">График работы</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Общий график</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Понедельник – Пятница</span>
                <span className="font-semibold">09:00 – 18:00</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Суббота</span>
                <span className="font-semibold">09:00 – 15:00</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Воскресенье</span>
                <span className="font-semibold text-accent">выходной</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{COMPANY.payment}</p>
          </motion.div>

          {/* Bus schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Автобусы М2/М3</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{COMPANY.busSchedule.title}</p>
            <div className="space-y-2">
              {COMPANY.busSchedule.days.map((d) => (
                <div key={d.day} className="flex justify-between py-1.5 border-b last:border-0">
                  <span className="text-muted-foreground text-sm">{d.day}</span>
                  <span
                    className={`text-sm font-semibold ${
                      d.time === "выходной" ? "text-accent" : ""
                    }`}
                  >
                    {d.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

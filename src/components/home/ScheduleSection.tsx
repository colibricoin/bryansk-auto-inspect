import { motion } from "framer-motion";
import { COMPANY } from "@/data/company";
import scheduleIcon from "@/assets/icon-schedule.png";
import busIcon from "@/assets/icon-bus.png";

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
              <img
                src={scheduleIcon}
                alt="Календарь графика работы"
                width={112}
                height={112}
                loading="lazy"
                className="w-12 h-12 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
              />
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
              <img
                src={busIcon}
                alt="Автобус с предупреждением"
                width={112}
                height={112}
                loading="lazy"
                className="w-12 h-12 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
              />
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

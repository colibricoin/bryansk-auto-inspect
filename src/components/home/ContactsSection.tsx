import { motion } from "framer-motion";
import { Phone, MapPin, Clock, ExternalLink, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/data/company";

export default function ContactsSection() {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <div className="accent-line mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Контакты</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-card border rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold mb-1">Адрес</div>
                  <p className="text-sm text-muted-foreground">{COMPANY.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold mb-1">Телефон</div>
                  <a href={`tel:${COMPANY.phoneRaw}`} className="text-sm text-accent hover:underline font-medium">
                    {COMPANY.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold mb-1">Режим работы</div>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p>{COMPANY.schedule.weekdays}</p>
                    <p>{COMPANY.schedule.saturday}</p>
                    <p>{COMPANY.schedule.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={`tel:${COMPANY.phoneRaw}`} className="flex-1">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent-hover font-semibold">
                  <Phone className="w-4 h-4 mr-2" />
                  Позвонить
                </Button>
              </a>
              <a href={COMPANY.mapLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full font-semibold">
                  <Navigation className="w-4 h-4 mr-2" />
                  Построить маршрут
                </Button>
              </a>
              <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full font-semibold">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-xl overflow-hidden border h-[350px] lg:h-full min-h-[350px]"
          >
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=34.380,53.220&z=15&text=Брянск%2C+Большое+Полпино%2C+ул.+Лермонтова%2C+1Б"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Карта расположения пункта ТО"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

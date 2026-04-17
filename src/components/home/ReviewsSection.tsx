import { motion } from "framer-motion";
import { Star, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/data/company";

// Внешние ссылки на карточки организации.
// При необходимости замените URL на реальные карточки на Яндекс.Картах и 2ГИС.
const YANDEX_LINK = COMPANY.mapLink;
const GIS2_LINK = "https://2gis.ru/bryansk/search/Техосмотр%20Большое%20Полпино";

export default function ReviewsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <div className="accent-line mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Отзывы клиентов</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Мы не публикуем отзывы, которые нельзя проверить. Реальные мнения о нашей работе —
            на Яндекс.Картах и 2ГИС.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-card border rounded-2xl p-8 md:p-10"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Посмотрите отзывы на картах</h3>
              <p className="text-muted-foreground">
                Все отзывы оставлены реальными клиентами через свои аккаунты Яндекса или 2ГИС.
                Это значит — они проверяемые, и мы не можем их редактировать.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <a href={YANDEX_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="w-full h-14 font-semibold justify-between">
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4" /> Отзывы на Яндекс.Картах
                </span>
                <ExternalLink className="w-4 h-4 opacity-60" />
              </Button>
            </a>
            <a href={GIS2_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="w-full h-14 font-semibold justify-between">
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4" /> Отзывы в 2ГИС
                </span>
                <ExternalLink className="w-4 h-4 opacity-60" />
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Уже были у нас? Будем благодарны за честный отзыв на любой из площадок.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

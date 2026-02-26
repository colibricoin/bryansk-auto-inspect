import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { COMPANY } from "@/data/company";

export default function Privacy() {
  return (
    <div className="section-padding">
      <div className="container-narrow">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Политика конфиденциальности</span>
        </nav>

        <h1 className="text-3xl font-bold mb-8">Политика конфиденциальности</h1>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
          <p>
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта {COMPANY.legalName} (далее — Оператор).
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-6">1. Общие положения</h2>
          <p>
            Используя данный сайт и предоставляя свои персональные данные через формы обратной связи, пользователь выражает согласие на обработку персональных данных в соответствии с настоящей Политикой.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-6">2. Какие данные собираются</h2>
          <p>Оператор может собирать следующие персональные данные:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Имя</li>
            <li>Номер телефона</li>
            <li>Сведения о транспортном средстве (тип, госномер)</li>
            <li>Иные данные, добровольно предоставленные пользователем</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6">3. Цели обработки</h2>
          <p>Персональные данные обрабатываются в целях:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Обработки заявок на прохождение техосмотра</li>
            <li>Связи с пользователем для подтверждения записи</li>
            <li>Улучшения качества обслуживания</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6">4. Защита данных</h2>
          <p>
            Оператор принимает необходимые организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-6">5. Контакты</h2>
          <p>
            По вопросам, связанным с обработкой персональных данных, вы можете обратиться по телефону{" "}
            <a href={`tel:${COMPANY.phoneRaw}`} className="text-accent hover:underline">{COMPANY.phone}</a> или по адресу: {COMPANY.address}.
          </p>
        </div>
      </div>
    </div>
  );
}

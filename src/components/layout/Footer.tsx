import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, FileText, ExternalLink } from "lucide-react";
import { COMPANY } from "@/data/company";

export default function Footer() {
  return (
    <footer className="bg-surface-dark text-sm">
      <div className="container-narrow section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-base text-primary-foreground block leading-tight" style={{ color: "hsl(0 0% 95%)" }}>
                  Техосмотр Брянск
                </span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">{COMPANY.description}</p>
            <p className="text-muted-foreground text-xs">{COMPANY.legalName}</p>
            <p className="text-muted-foreground text-xs">ИНН {COMPANY.inn} · ОГРН {COMPANY.ogrn}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "hsl(0 0% 95%)" }}>Навигация</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Главная", path: "/" },
                { label: "Услуги и категории ТС", path: "/services" },
                { label: "Цены", path: "/prices" },
                { label: "Онлайн-запись", path: "/booking" },
                { label: "Документы", path: "/documents" },
                { label: "О компании", path: "/about" },
                { label: "Контакты", path: "/contacts" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "hsl(0 0% 95%)" }}>Контакты</h4>
            <div className="flex flex-col gap-3">
              <a href={`tel:${COMPANY.phoneRaw}`} className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                {COMPANY.phone}
              </a>
              <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
                <ExternalLink className="w-4 h-4 shrink-0" />
                WhatsApp
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{COMPANY.address}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p>{COMPANY.schedule.weekdays}</p>
                  <p>{COMPANY.schedule.saturday}</p>
                  <p>{COMPANY.schedule.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "hsl(0 0% 95%)" }}>Документы</h4>
            <div className="flex flex-col gap-2">
              {COMPANY.documents.map((doc) => (
                <a
                  key={doc.shortTitle}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  {doc.shortTitle}
                </a>
              ))}
              <Link to="/privacy" className="text-muted-foreground hover:text-accent transition-colors mt-2">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-muted-foreground text-xs">
          <p>© {new Date().getFullYear()} {COMPANY.legalName}. Все права защищены.</p>
          <div className="flex items-center gap-4">
            <p>Пункт ТО аккредитован РСА</p>
            <Link to="/admin/login" className="opacity-40 hover:opacity-70 transition-opacity">Админ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

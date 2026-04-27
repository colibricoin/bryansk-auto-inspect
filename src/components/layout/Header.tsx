import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, MapPin, ChevronRight } from "lucide-react";
import { COMPANY } from "@/data/company";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "О компании", path: "/about" },
  { label: "Услуги", path: "/services" },
  { label: "Цены", path: "/prices" },
  { label: "Онлайн-запись", path: "/booking" },
  { label: "Документы", path: "/documents" },
  { label: "Отзывы", path: "/#reviews" },
  { label: "Контакты", path: "/contacts" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top bar */}
      <div className="bg-muted/60 border-b text-sm hidden md:block">
        <div className="container-narrow flex items-center justify-between py-2 px-4">
          <div className="flex items-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {COMPANY.address}
            </span>
            <span>{COMPANY.schedule.weekdays}</span>
            <span>{COMPANY.schedule.saturday}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY.phoneRaw}`}
              className="font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              {COMPANY.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b shadow-sm">
        <div className="container-narrow flex items-center justify-between py-3 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-accent-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="font-bold text-base tracking-tight block">Техосмотр</span>
              <span className="text-xs text-muted-foreground font-medium">Брянск</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-accent after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-accent after:rounded-full"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${COMPANY.phoneRaw}`}
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
            <a
              href={COMPANY.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground"
            >
              <MapPin className="w-4 h-4" />
              Маршрут
            </a>
            <Link to="/booking">
              <Button className="bg-accent text-accent-foreground hover:bg-accent-hover font-semibold text-sm px-4 hidden sm:flex">
                Записаться
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-card">
            <nav className="flex flex-col py-2 px-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-3 text-sm font-medium transition-colors border-l-2 ${
                    location.pathname === item.path
                      ? "text-accent border-accent"
                      : "text-foreground/80 border-transparent hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t">
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  {COMPANY.phone}
                </a>
                <Link to="/booking" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent-hover font-semibold">
                    Записаться онлайн
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

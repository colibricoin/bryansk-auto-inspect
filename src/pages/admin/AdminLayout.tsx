import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { verifyAdminSession, clearAdminToken } from "@/lib/admin";
import { LayoutDashboard, List, Settings, LogOut, AlertTriangle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Дашборд", path: "/admin", icon: LayoutDashboard },
  { label: "Заявки", path: "/admin/requests", icon: List },
  { label: "Цены", path: "/admin/prices", icon: DollarSign },
  { label: "Настройки", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [usingDefault, setUsingDefault] = useState(false);

  useEffect(() => {
    verifyAdminSession().then(({ valid, usingDefault: def }) => {
      if (!valid) {
        navigate("/admin/login", { replace: true });
      } else {
        setUsingDefault(def);
        setLoading(false);
      }
    });
  }, [navigate]);

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {usingDefault && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-800 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Используется временный пароль. Задайте переменную ADMIN_PASSWORD для безопасности.</span>
        </div>
      )}

      <header className="bg-card border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-bold text-sm">
              Панель управления
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((item) => {
                const active = location.pathname === item.path ||
                  (item.path === "/admin/requests" && location.pathname.startsWith("/admin/requests"));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      active
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

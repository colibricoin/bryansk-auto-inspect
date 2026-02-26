import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, STATUS_LABELS } from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    adminApi("stats").then(setStats).catch(console.error);
  }, []);

  const cards = [
    { key: "total", label: "Всего заявок", icon: FileText, color: "text-foreground" },
    { key: "new", label: STATUS_LABELS.new, icon: Clock, color: "text-blue-600" },
    { key: "in_progress", label: STATUS_LABELS.in_progress, icon: Clock, color: "text-amber-600" },
    { key: "confirmed", label: STATUS_LABELS.confirmed, icon: CheckCircle2, color: "text-emerald-600" },
    { key: "completed", label: STATUS_LABELS.completed, icon: CheckCircle2, color: "text-slate-500" },
    { key: "canceled", label: STATUS_LABELS.canceled, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Дашборд</h1>
        <Link
          to="/admin/requests"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          Все заявки <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c) => (
          <Card key={c.key}>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
                {c.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className={`text-2xl font-bold ${c.color}`}>
                {stats ? stats[c.key] ?? 0 : "—"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

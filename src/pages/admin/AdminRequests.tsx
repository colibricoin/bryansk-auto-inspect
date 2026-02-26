import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { adminApi, STATUS_LABELS, STATUS_COLORS, SOURCE_LABELS } from "@/lib/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Eye } from "lucide-react";

interface Request {
  id: string;
  created_at: string;
  source_form: string;
  name: string;
  phone: string;
  vehicle_category: string | null;
  plate_number: string | null;
  desired_date: string | null;
  desired_time: string | null;
  comment: string | null;
  status: string;
  admin_note: string | null;
}

const DATE_PRESETS = [
  { value: "all", label: "Все даты" },
  { value: "today", label: "Сегодня" },
  { value: "7days", label: "7 дней" },
  { value: "30days", label: "30 дней" },
];

function getDateRange(preset: string) {
  const now = new Date();
  if (preset === "today") {
    return { date_from: now.toISOString().split("T")[0], date_to: now.toISOString().split("T")[0] };
  }
  if (preset === "7days") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return { date_from: d.toISOString().split("T")[0] };
  }
  if (preset === "30days") {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    return { date_from: d.toISOString().split("T")[0] };
  }
  return {};
}

export default function AdminRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {
        status: statusFilter,
        source_form: sourceFilter,
        search,
        ...getDateRange(datePreset),
      };
      const data = await adminApi("list", { filters });
      setRequests(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, sourceFilter, datePreset]);

  const handleSearch = () => fetchData();

  const exportCSV = () => {
    const headers = ["Дата", "Источник", "Имя", "Телефон", "Категория ТС", "Госномер", "Желаемая дата", "Время", "Статус", "Комментарий", "Заметка"];
    const rows = requests.map((r) => [
      new Date(r.created_at).toLocaleString("ru"),
      SOURCE_LABELS[r.source_form] || r.source_form,
      r.name,
      r.phone,
      r.vehicle_category || "",
      r.plate_number || "",
      r.desired_date || "",
      r.desired_time || "",
      STATUS_LABELS[r.status] || r.status,
      r.comment || "",
      r.admin_note || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `requests_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Заявки</h1>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-1" />
          Экспорт CSV
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Поиск по имени, телефону, госномеру..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={handleSearch}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все источники</SelectItem>
              {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={datePreset} onValueChange={setDatePreset}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_PRESETS.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Загрузка...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Заявки не найдены</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Источник</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Дата/время</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString("ru")}
                  </TableCell>
                  <TableCell className="text-xs">
                    {SOURCE_LABELS[r.source_form] || r.source_form}
                  </TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-sm">{r.phone}</TableCell>
                  <TableCell className="text-xs">{r.vehicle_category || "—"}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    {r.desired_date || "—"}{r.desired_time ? ` ${r.desired_time}` : ""}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || ""}`}>
                      {STATUS_LABELS[r.status] || r.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/requests/${r.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

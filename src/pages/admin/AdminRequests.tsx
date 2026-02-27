import { useEffect, useState, useCallback, useRef } from "react";
import { adminApi, STATUS_LABELS, STATUS_COLORS, SOURCE_LABELS } from "@/lib/admin";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Phone, Copy, Save, RefreshCw } from "lucide-react";

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
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("all");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  // Detail dialog state
  const [selectedReq, setSelectedReq] = useState<Request | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailStatus, setDetailStatus] = useState("");
  const [detailNote, setDetailNote] = useState("");
  const [saving, setSaving] = useState(false);

  const knownIdsRef = useRef<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {
        status: statusFilter,
        source_form: sourceFilter,
        search,
        ...getDateRange(datePreset),
      };
      const data: Request[] = (await adminApi("list", { filters })) || [];
      // detect new ids
      const incoming = new Set(data.map((r) => r.id));
      if (knownIdsRef.current.size > 0) {
        const fresh = data.filter((r) => !knownIdsRef.current.has(r.id));
        if (fresh.length > 0) {
          setNewIds((prev) => {
            const next = new Set(prev);
            fresh.forEach((r) => next.add(r.id));
            return next;
          });
          toast({ title: `Новая заявка (${fresh.length})` });
        }
      }
      knownIdsRef.current = incoming;
      setRequests(data);
      setLastUpdate(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter, datePreset, search, toast]);

  // initial + filter change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // auto-refresh every 25s
  useEffect(() => {
    const id = setInterval(fetchData, 25000);
    return () => clearInterval(id);
  }, [fetchData]);

  // realtime
  useEffect(() => {
    const channel = supabase
      .channel("admin-requests-rt")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "requests" }, () => {
        fetchData();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const handleSearch = () => fetchData();

  // new count
  const newCount = requests.filter((r) => r.status === "new").length;

  // open detail
  const openDetail = (r: Request) => {
    setSelectedReq(r);
    setDetailStatus(r.status);
    setDetailNote(r.admin_note || "");
    setDetailOpen(true);
    // remove highlight
    setNewIds((prev) => {
      const next = new Set(prev);
      next.delete(r.id);
      return next;
    });
  };

  const handleSaveStatus = async () => {
    if (!selectedReq) return;
    setSaving(true);
    try {
      const data = await adminApi("update", { id: selectedReq.id, status: detailStatus });
      setSelectedReq(data);
      setRequests((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      toast({ title: "Статус обновлён" });
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedReq) return;
    setSaving(true);
    try {
      const data = await adminApi("update", { id: selectedReq.id, admin_note: detailNote });
      setSelectedReq(data);
      setRequests((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      toast({ title: "Заметка сохранена" });
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const copyPhone = () => {
    if (selectedReq) {
      navigator.clipboard.writeText(selectedReq.phone);
      toast({ title: "Телефон скопирован" });
    }
  };

  // CSV export
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Заявки</h1>
          <div className="flex items-center gap-3 mt-1">
            {newCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                Новые: {newCount}
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              Обновлено: {lastUpdate.toLocaleTimeString("ru")}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Обновить
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-1" />
            CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Поиск: имя, телефон, госномер..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 text-base h-11"
            />
            <Button variant="outline" size="icon" onClick={handleSearch} className="h-11 w-11">
              <Search className="w-5 h-5" />
            </Button>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[170px] h-11 text-base">
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
            <SelectTrigger className="w-[170px] h-11 text-base">
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
            <SelectTrigger className="w-[150px] h-11 text-base">
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

      {/* Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        {loading && requests.length === 0 ? (
          <div className="p-12 text-center text-lg text-muted-foreground">Загрузка...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-lg text-muted-foreground">Заявки не найдены</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-semibold">Дата</TableHead>
                <TableHead className="text-base font-semibold">Источник</TableHead>
                <TableHead className="text-base font-semibold">Имя</TableHead>
                <TableHead className="text-base font-semibold">Телефон</TableHead>
                <TableHead className="text-base font-semibold">Категория</TableHead>
                <TableHead className="text-base font-semibold">Госномер</TableHead>
                <TableHead className="text-base font-semibold">Дата/время</TableHead>
                <TableHead className="text-base font-semibold">Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow
                  key={r.id}
                  onClick={() => openDetail(r)}
                  className={`cursor-pointer h-14 text-base transition-colors ${
                    newIds.has(r.id) ? "bg-blue-50 dark:bg-blue-950/30" : ""
                  } ${selectedReq?.id === r.id ? "bg-accent" : ""}`}
                >
                  <TableCell className="whitespace-nowrap font-medium">
                    {new Date(r.created_at).toLocaleDateString("ru")}{" "}
                    <span className="text-muted-foreground">
                      {new Date(r.created_at).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </TableCell>
                  <TableCell>{SOURCE_LABELS[r.source_form] || r.source_form}</TableCell>
                  <TableCell className="font-semibold">{r.name}</TableCell>
                  <TableCell className="font-mono">{r.phone}</TableCell>
                  <TableCell>{r.vehicle_category || "—"}</TableCell>
                  <TableCell className="font-mono uppercase">{r.plate_number || "—"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {r.desired_date || "—"}{r.desired_time ? ` ${r.desired_time}` : ""}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[r.status] || ""}`}>
                      {STATUS_LABELS[r.status] || r.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Заявка от {selectedReq?.name}</DialogTitle>
          </DialogHeader>
          {selectedReq && (
            <div className="space-y-5 mt-2">
              {/* Fields */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { label: "ID", value: selectedReq.id.slice(0, 8) },
                  { label: "Дата", value: new Date(selectedReq.created_at).toLocaleString("ru") },
                  { label: "Источник", value: SOURCE_LABELS[selectedReq.source_form] || selectedReq.source_form },
                  { label: "Имя", value: selectedReq.name },
                  { label: "Телефон", value: selectedReq.phone },
                  { label: "Категория ТС", value: selectedReq.vehicle_category || "—" },
                  { label: "Госномер", value: selectedReq.plate_number || "—" },
                  { label: "Желаемая дата", value: `${selectedReq.desired_date || "—"} ${selectedReq.desired_time || ""}`.trim() },
                  { label: "Комментарий", value: selectedReq.comment || "—" },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-sm text-muted-foreground">{f.label}</p>
                    <p className="text-base font-medium">{f.value}</p>
                  </div>
                ))}
              </div>

              {/* Phone actions */}
              <div className="flex gap-2">
                <a href={`tel:${selectedReq.phone}`}>
                  <Button variant="outline" className="h-11 text-base">
                    <Phone className="w-4 h-4 mr-2" /> Позвонить
                  </Button>
                </a>
                <Button variant="outline" className="h-11 text-base" onClick={copyPhone}>
                  <Copy className="w-4 h-4 mr-2" /> Скопировать
                </Button>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Статус</p>
                <div className="flex gap-2">
                  <Select value={detailStatus} onValueChange={setDetailStatus}>
                    <SelectTrigger className="flex-1 h-11 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSaveStatus} disabled={saving || detailStatus === selectedReq.status} className="h-11">
                    <Save className="w-4 h-4 mr-1" /> Сохранить
                  </Button>
                </div>
              </div>

              {/* Admin note */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Заметка администратора</p>
                <Textarea
                  value={detailNote}
                  onChange={(e) => setDetailNote(e.target.value)}
                  placeholder="Внутренние заметки..."
                  rows={3}
                  className="text-base"
                />
                <Button onClick={handleSaveNote} disabled={saving} className="h-11">
                  <Save className="w-4 h-4 mr-1" /> Сохранить заметку
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi, STATUS_LABELS, STATUS_COLORS, SOURCE_LABELS } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Phone, Copy, Save } from "lucide-react";

interface RequestData {
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

export default function AdminRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [req, setReq] = useState<RequestData | null>(null);
  const [status, setStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminApi("get", { id }).then((data) => {
      setReq(data);
      setStatus(data.status);
      setAdminNote(data.admin_note || "");
    }).catch(console.error);
  }, [id]);

  const handleSaveStatus = async () => {
    setSaving(true);
    try {
      const data = await adminApi("update", { id, status });
      setReq(data);
      toast({ title: "Статус обновлён" });
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      const data = await adminApi("update", { id, admin_note: adminNote });
      setReq(data);
      toast({ title: "Заметка сохранена" });
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const copyPhone = () => {
    if (req) {
      navigator.clipboard.writeText(req.phone);
      toast({ title: "Телефон скопирован" });
    }
  };

  if (!req) {
    return <div className="p-8 text-center text-muted-foreground">Загрузка...</div>;
  }

  const fields = [
    { label: "Источник", value: SOURCE_LABELS[req.source_form] || req.source_form },
    { label: "Дата заявки", value: new Date(req.created_at).toLocaleString("ru") },
    { label: "Имя", value: req.name },
    { label: "Телефон", value: req.phone },
    { label: "Категория ТС", value: req.vehicle_category || "—" },
    { label: "Госномер", value: req.plate_number || "—" },
    { label: "Желаемая дата", value: req.desired_date || "—" },
    { label: "Время", value: req.desired_time || "—" },
    { label: "Комментарий", value: req.comment || "—" },
  ];

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate("/admin/requests")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Назад к списку
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Заявка от {req.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-muted-foreground mb-0.5">{f.label}</p>
                    <p className="text-sm font-medium">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-6">
                <a href={`tel:${req.phone}`}>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-1" /> Позвонить
                  </Button>
                </a>
                <Button variant="outline" size="sm" onClick={copyPhone}>
                  <Copy className="w-4 h-4 mr-1" /> Скопировать телефон
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Статус</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[req.status]}`}>
                {STATUS_LABELS[req.status] || req.status}
              </span>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleSaveStatus} disabled={saving || status === req.status} className="w-full">
                <Save className="w-4 h-4 mr-1" /> Сохранить статус
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Заметка администратора</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Внутренние заметки..."
                rows={4}
              />
              <Button size="sm" onClick={handleSaveNote} disabled={saving} className="w-full">
                <Save className="w-4 h-4 mr-1" /> Сохранить заметку
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

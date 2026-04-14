import { useEffect, useState } from "react";
import { adminEmailsApi } from "@/lib/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EmailRow {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminEmails() {
  const { toast } = useToast();
  const [emails, setEmails] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EmailRow | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const data = await adminEmailsApi("list");
      setEmails(data || []);
    } catch (e) {
      console.error(e);
      toast({ title: "Ошибка загрузки", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleAdd = async () => {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: "Введите корректный email", variant: "destructive" });
      return;
    }
    if (emails.some((e) => e.email === trimmed)) {
      toast({ title: "Этот email уже добавлен", variant: "destructive" });
      return;
    }
    setAdding(true);
    try {
      const data = await adminEmailsApi("add", { addEmail: trimmed });
      setEmails(data || []);
      setNewEmail("");
      toast({ title: "Email добавлен" });
    } catch (e: any) {
      toast({ title: e.message || "Ошибка", variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id: string, is_active: boolean) => {
    try {
      const data = await adminEmailsApi("toggle", { toggleId: id, is_active });
      setEmails(data || []);
      toast({ title: is_active ? "Email активирован" : "Email деактивирован" });
    } catch (e: any) {
      toast({ title: e.message || "Ошибка", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const data = await adminEmailsApi("delete", { deleteId: deleteTarget.id });
      setEmails(data || []);
      toast({ title: "Email удалён" });
    } catch (e: any) {
      toast({ title: e.message || "Ошибка", variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email-уведомления</h1>
          <p className="text-muted-foreground mt-1">Заявки с сайта отправляются на все активные адреса</p>
        </div>
      </div>

      {/* Add email */}
      <div className="flex gap-2 mb-6 max-w-lg">
        <div className="relative flex-1">
          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Введите email..."
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="pl-10 h-11 text-base"
          />
        </div>
        <Button onClick={handleAdd} disabled={adding} className="h-11">
          <Plus className="w-4 h-4 mr-1" />
          Добавить
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-lg text-muted-foreground">Загрузка...</div>
        ) : emails.length === 0 ? (
          <div className="p-12 text-center text-lg text-muted-foreground">Нет адресов. Добавьте первый email.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-semibold">Email</TableHead>
                <TableHead className="text-base font-semibold w-32">Активен</TableHead>
                <TableHead className="text-base font-semibold hidden md:table-cell">Добавлен</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((row) => (
                <TableRow key={row.id} className="h-14">
                  <TableCell className="font-semibold text-base">{row.email}</TableCell>
                  <TableCell>
                    <Switch
                      checked={row.is_active}
                      onCheckedChange={(checked) => handleToggle(row.id, checked)}
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {new Date(row.created_at).toLocaleDateString("ru")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(row)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить email?</AlertDialogTitle>
            <AlertDialogDescription>
              Адрес <strong>{deleteTarget?.email}</strong> больше не будет получать уведомления о заявках.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

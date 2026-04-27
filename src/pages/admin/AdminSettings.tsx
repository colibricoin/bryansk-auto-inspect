import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Database, Key, Download, Copy, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SUPABASE_SCHEMA_SQL } from "@/lib/schemaSql";

export default function AdminSettings() {
  const { toast } = useToast();

  const handleDownload = () => {
    const blob = new Blob([SUPABASE_SCHEMA_SQL], { type: "text/sql;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tehosmotr-bryansk-schema.sql";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Файл скачан", description: "tehosmotr-bryansk-schema.sql" });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      toast({ title: "Скопировано", description: "SQL-схема в буфере обмена" });
    } catch {
      toast({ title: "Не удалось скопировать", variant: "destructive" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Настройки</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" /> Безопасность
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Пароль администратора задаётся через переменную окружения <code className="bg-muted px-1 py-0.5 rounded text-xs">ADMIN_PASSWORD</code>.</p>
            <p>Для изменения пароля обновите значение секрета в настройках проекта.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4" /> База данных
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Заявки хранятся в таблице <code className="bg-muted px-1 py-0.5 rounded text-xs">requests</code>.</p>
            <p>Все формы сайта (онлайн-запись, контакты) сохраняют данные в единую таблицу.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="w-4 h-4" /> Доступ
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Логин: <code className="bg-muted px-1 py-0.5 rounded text-xs">admin</code></p>
            <p>Ссылка на вход: <code className="bg-muted px-1 py-0.5 rounded text-xs">/admin/login</code></p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileCode className="w-4 h-4" /> Экспорт схемы базы данных (SQL DDL + RLS)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Готовый SQL-скрипт со структурой таблиц (<code className="bg-muted px-1 rounded text-xs">bookings</code>,{" "}
            <code className="bg-muted px-1 rounded text-xs">requests</code>,{" "}
            <code className="bg-muted px-1 rounded text-xs">prices</code>,{" "}
            <code className="bg-muted px-1 rounded text-xs">notification_emails</code>,{" "}
            <code className="bg-muted px-1 rounded text-xs">seo_locations</code>) и RLS-политиками.
            Применяйте в SQL Editor вашего Supabase-проекта при миграции.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Скачать schema.sql
            </Button>
            <Button onClick={handleCopy} variant="outline" className="gap-2">
              <Copy className="w-4 h-4" />
              Скопировать SQL
            </Button>
          </div>

          <details className="border rounded-md">
            <summary className="cursor-pointer px-3 py-2 text-sm font-medium bg-muted/40">
              Предпросмотр SQL
            </summary>
            <pre className="p-3 text-xs overflow-auto max-h-96 bg-muted/20">
              <code>{SUPABASE_SCHEMA_SQL}</code>
            </pre>
          </details>

          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p className="font-medium text-foreground">Как применить:</p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Откройте свой проект в Supabase Dashboard</li>
              <li>SQL Editor → New query</li>
              <li>Вставьте содержимое и нажмите Run</li>
              <li>Данные (контент таблиц) переносятся отдельно — этот файл создаёт только структуру</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

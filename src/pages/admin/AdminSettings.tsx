import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database, Key } from "lucide-react";

export default function AdminSettings() {
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
    </div>
  );
}

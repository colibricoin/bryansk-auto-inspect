import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { adminApiFetch } from "@/lib/admin";

interface SeoLocation {
  id: string;
  slug: string;
  location_name: string;
  h1: string;
  seo_title: string;
  seo_description: string;
  keywords: string;
  page_type: "district" | "static";
  route_path: string | null;
  intro_text: string;
  seo_text: string;
  is_active: boolean;
  sort_order: number;
}

const EMPTY: Omit<SeoLocation, "id"> = {
  slug: "",
  location_name: "",
  h1: "",
  seo_title: "",
  seo_description: "",
  keywords: "",
  page_type: "district",
  route_path: null,
  intro_text: "",
  seo_text: "",
  is_active: true,
  sort_order: 0,
};

export default function AdminSeoLocations() {
  const [locations, setLocations] = useState<SeoLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SeoLocation | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApiFetch("admin-seo-locations", { method: "GET" });
      setLocations(data);
    } catch (e: any) {
      toast({ title: "Ошибка загрузки", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = () => {
    setEditing({ id: "", ...EMPTY, sort_order: locations.length + 1 });
    setIsNew(true);
  };

  const handleEdit = (loc: SeoLocation) => {
    setEditing({ ...loc });
    setIsNew(false);
  };

  const handleCancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.location_name || !editing.h1 || !editing.seo_title) {
      toast({ title: "Заполните обязательные поля", description: "Slug, название, H1, title", variant: "destructive" });
      return;
    }
    try {
      if (isNew) {
        await adminApiFetch("admin-seo-locations", {
          method: "POST",
          body: JSON.stringify({ action: "create", data: editing }),
        });
        toast({ title: "Страница создана" });
      } else {
        await adminApiFetch("admin-seo-locations", {
          method: "POST",
          body: JSON.stringify({ action: "update", id: editing.id, data: editing }),
        });
        toast({ title: "Страница обновлена" });
      }
      setEditing(null);
      setIsNew(false);
      load();
    } catch (e: any) {
      toast({ title: "Ошибка", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить страницу «${name}»?`)) return;
    try {
      await adminApiFetch("admin-seo-locations", {
        method: "POST",
        body: JSON.stringify({ action: "delete", id }),
      });
      toast({ title: "Страница удалена" });
      load();
    } catch (e: any) {
      toast({ title: "Ошибка", description: e.message, variant: "destructive" });
    }
  };

  const handleToggle = async (loc: SeoLocation) => {
    try {
      await adminApiFetch("admin-seo-locations", {
        method: "POST",
        body: JSON.stringify({ action: "update", id: loc.id, data: { is_active: !loc.is_active } }),
      });
      load();
    } catch (e: any) {
      toast({ title: "Ошибка", description: e.message, variant: "destructive" });
    }
  };

  if (editing) {
    const previewUrl =
      editing.page_type === "static"
        ? editing.route_path || "/"
        : `/${editing.slug}`;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{isNew ? "Новая SEO-страница" : `Редактирование: ${editing.location_name}`}</h1>
          <Button variant="ghost" onClick={handleCancel}><X className="w-4 h-4 mr-1" /> Отмена</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Тип страницы *</label>
            <select
              className="w-full h-10 px-3 border rounded-md bg-background"
              value={editing.page_type}
              onChange={(e) =>
                setEditing({ ...editing, page_type: e.target.value as "district" | "static" })
              }
            >
              <option value="district">Район (динамическая /:slug)</option>
              <option value="static">Статичная страница</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">
              {editing.page_type === "static" ? "Путь страницы (например /prices) *" : "Slug (URL) *"}
            </label>
            {editing.page_type === "static" ? (
              <Input
                value={editing.route_path || ""}
                onChange={(e) => setEditing({ ...editing, route_path: e.target.value })}
                placeholder="/ceny-tehosmotra-bryansk"
              />
            ) : (
              <Input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="tehosmotr-rayon"
              />
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1">Название локации *</label>
            <Input value={editing.location_name} onChange={(e) => setEditing({ ...editing, location_name: e.target.value })} placeholder="Бежицкий район" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Порядок сортировки</label>
            <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">H1 *</label>
            <Input value={editing.h1} onChange={(e) => setEditing({ ...editing, h1: e.target.value })} placeholder="Техосмотр в Бежицком районе Брянска" />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">
              SEO Title * <span className="text-xs text-muted-foreground">({editing.seo_title.length}/60)</span>
            </label>
            <Input value={editing.seo_title} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">
              SEO Description <span className="text-xs text-muted-foreground">({editing.seo_description.length}/160)</span>
            </label>
            <Textarea value={editing.seo_description} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} rows={2} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Keywords (через запятую)</label>
            <Textarea
              value={editing.keywords}
              onChange={(e) => setEditing({ ...editing, keywords: e.target.value })}
              rows={2}
              placeholder="техосмотр Брянск, диагностическая карта, ОСАГО"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Intro текст</label>
            <Textarea value={editing.intro_text} onChange={(e) => setEditing({ ...editing, intro_text: e.target.value })} rows={3} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">SEO текст (основной)</label>
            <Textarea value={editing.seo_text} onChange={(e) => setEditing({ ...editing, seo_text: e.target.value })} rows={8} />
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
            <span className="font-medium">{editing.is_active ? "Активна" : "Скрыта"}</span>
          </div>

          <div className="md:col-span-2 border rounded-lg p-4 bg-muted/30">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
              Предпросмотр в Google
            </p>
            <p className="text-blue-700 text-base leading-tight truncate">
              {editing.seo_title || "Заголовок страницы"}
            </p>
            <p className="text-green-800 text-xs mt-1">
              bryansk-auto-inspect.lovable.app{previewUrl}
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {editing.seo_description || "Описание страницы появится здесь."}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent-hover">
            <Save className="w-4 h-4 mr-1" /> Сохранить
          </Button>
          <Button variant="outline" onClick={handleCancel}>Отмена</Button>
          {!isNew && (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost"><ExternalLink className="w-4 h-4 mr-1" /> Предпросмотр</Button>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SEO-страницы и мета-теги</h1>
        <Button onClick={handleAdd} className="bg-accent text-accent-foreground hover:bg-accent-hover">
          <Plus className="w-4 h-4 mr-1" /> Добавить страницу
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Загрузка...</p>
      ) : locations.length === 0 ? (
        <p className="text-muted-foreground">Нет SEO-страниц</p>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/50">
              <tr>
                <th className="py-3 px-4 font-bold">Название</th>
                <th className="py-3 px-4 font-bold">Тип / URL</th>
                <th className="py-3 px-4 font-bold">Title</th>
                <th className="py-3 px-4 font-bold text-center">Статус</th>
                <th className="py-3 px-4 font-bold text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id} className="border-t hover:bg-muted/20">
                  <td className="py-3 px-4 font-semibold">{loc.location_name}</td>
                  <td className="py-3 px-4 text-muted-foreground text-sm">
                    <span className="inline-block text-[10px] uppercase font-bold mr-2 px-1.5 py-0.5 rounded bg-muted">
                      {loc.page_type === "static" ? "стат." : "район"}
                    </span>
                    {loc.page_type === "static" ? (loc.route_path || "—") : `/${loc.slug}`}
                  </td>
                  <td className="py-3 px-4 text-sm max-w-xs truncate">{loc.seo_title}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleToggle(loc)} className="inline-flex items-center gap-1.5">
                      {loc.is_active ? (
                        <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-medium"><Eye className="w-3 h-3" /> Активна</span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded text-xs font-medium"><EyeOff className="w-3 h-3" /> Скрыта</span>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(loc)}><Pencil className="w-4 h-4" /></Button>
                      <a
                        href={loc.page_type === "static" ? (loc.route_path || "/") : `/${loc.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4" /></Button>
                      </a>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(loc.id, loc.location_name)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

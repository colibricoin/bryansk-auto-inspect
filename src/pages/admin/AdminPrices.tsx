import { useEffect, useState } from "react";
import { adminPricesApi } from "@/lib/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Save, Search, RotateCcw } from "lucide-react";

interface PriceRow {
  id: string;
  category_code: string;
  category_name: string;
  description: string;
  details: string;
  price_rub: number;
  updated_at: string;
  updated_by: string | null;
}

export default function AdminPrices() {
  const { toast } = useToast();
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await adminPricesApi("list");
      setPrices(data || []);
      setEdits({});
    } catch (e) {
      console.error(e);
      toast({ title: "Ошибка загрузки цен", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const filtered = prices.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.category_code.toLowerCase().includes(s) ||
      p.category_name.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s)
    );
  });

  const handlePriceChange = (id: string, value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return;
    setEdits((prev) => ({ ...prev, [id]: num }));
  };

  const hasChanges = Object.keys(edits).length > 0;

  const handleSaveAll = async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      const updates = Object.entries(edits).map(([id, price_rub]) => ({ id, price_rub }));
      const data = await adminPricesApi("update", { updates });
      setPrices(data || []);
      setEdits({});
      toast({ title: "Цены обновлены" });
    } catch (e: any) {
      toast({ title: e.message || "Ошибка сохранения", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRow = async (id: string) => {
    if (edits[id] === undefined) return;
    setSaving(true);
    try {
      const data = await adminPricesApi("update", { updates: [{ id, price_rub: edits[id] }] });
      setPrices(data || []);
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast({ title: "Цена обновлена" });
    } catch (e: any) {
      toast({ title: e.message || "Ошибка сохранения", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const resetEdits = () => setEdits({});

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Управление ценами</h1>
        <div className="flex gap-2">
          {hasChanges && (
            <>
              <Button variant="outline" size="sm" onClick={resetEdits}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Отмена
              </Button>
              <Button size="sm" onClick={handleSaveAll} disabled={saving}>
                <Save className="w-4 h-4 mr-1" />
                Сохранить все ({Object.keys(edits).length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по категории..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 text-base"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-lg text-muted-foreground">Загрузка...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-semibold w-24">Код</TableHead>
                <TableHead className="text-base font-semibold">Категория</TableHead>
                <TableHead className="text-base font-semibold hidden md:table-cell">Описание</TableHead>
                <TableHead className="text-base font-semibold w-40">Цена, ₽</TableHead>
                <TableHead className="text-base font-semibold hidden lg:table-cell">Обновлено</TableHead>
                <TableHead className="text-base font-semibold hidden lg:table-cell">Кем</TableHead>
                <TableHead className="w-28"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const isEdited = edits[p.id] !== undefined;
                const currentPrice = isEdited ? edits[p.id] : p.price_rub;
                return (
                  <TableRow key={p.id} className={`h-14 ${isEdited ? "bg-amber-50 dark:bg-amber-950/20" : ""}`}>
                    <TableCell className="font-mono font-semibold text-base">{p.category_code}</TableCell>
                    <TableCell className="font-semibold text-base">{p.category_name}</TableCell>
                    <TableCell className="hidden md:table-cell text-base">{p.description}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={currentPrice}
                        onChange={(e) => handlePriceChange(p.id, e.target.value)}
                        className="w-28 h-10 text-base font-bold"
                      />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(p.updated_at).toLocaleDateString("ru")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {p.updated_by || "—"}
                    </TableCell>
                    <TableCell>
                      {isEdited && (
                        <Button size="sm" onClick={() => handleSaveRow(p.id)} disabled={saving}>
                          <Save className="w-4 h-4 mr-1" />
                          Сохранить
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const VEHICLE_TYPES = [
  { value: "L", label: "Мотоцикл (L)" },
  { value: "M1", label: "Легковой (M1)" },
  { value: "M2", label: "Автобус до 5т (M2)" },
  { value: "M3", label: "Автобус от 5т (M3)" },
  { value: "N1", label: "Грузовой до 3,5т (N1)" },
  { value: "N2", label: "Грузовой 3,5–12т (N2)" },
  { value: "N3", label: "Грузовой от 12т (N3)" },
  { value: "O1", label: "Прицеп до 0,75т (O1)" },
  { value: "O2", label: "Прицеп 0,75–3,5т (O2)" },
  { value: "O3", label: "Прицеп 3,5–10т (O3)" },
  { value: "O4", label: "Прицеп от 10т (O4)" },
];

export default function BookingForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleCategory, setVehicleCategory] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypot) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("requests" as any).insert({
        source_form: "online_booking",
        name,
        phone,
        vehicle_category: vehicleCategory || null,
        plate_number: plateNumber || null,
        desired_date: desiredDate || null,
        comment: comment || null,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Заявка отправлена",
        description: "Мы свяжемся с вами в ближайшее время для подтверждения записи.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="booking" className="section-padding bg-muted/50">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center bg-card border rounded-xl p-8"
          >
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-2">Спасибо за заявку!</h3>
            <p className="text-muted-foreground mb-4">
              Мы получили вашу заявку и свяжемся с вами в ближайшее время для подтверждения записи на техосмотр.
            </p>
            <Button onClick={() => { setSubmitted(false); setName(""); setPhone(""); setVehicleCategory(""); setPlateNumber(""); setDesiredDate(""); setComment(""); }} variant="outline">
              Отправить ещё одну заявку
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="section-padding bg-muted/50">
      <div className="container-narrow">
        <div className="text-center mb-8">
          <div className="accent-line mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Онлайн-запись на техосмотр</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Оставьте заявку, и мы свяжемся с вами для подтверждения даты и времени
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-card border rounded-xl p-6 md:p-8 space-y-4"
        >
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Имя <span className="text-accent">*</span>
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" required maxLength={100} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Телефон <span className="text-accent">*</span>
              </label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" required maxLength={20} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Тип ТС <span className="text-accent">*</span>
            </label>
            <Select value={vehicleCategory} onValueChange={setVehicleCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Госномер</label>
              <Input value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} placeholder="А000АА 32" maxLength={15} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Желаемая дата</label>
              <Input type="date" value={desiredDate} onChange={(e) => setDesiredDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Комментарий</label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Дополнительная информация..." rows={3} maxLength={500} />
          </div>

          <div className="text-xs text-muted-foreground">
            Нажимая кнопку, вы соглашаетесь с{" "}
            <a href="/privacy" className="underline hover:text-foreground">
              политикой обработки персональных данных
            </a>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent-hover font-bold h-12 text-base"
          >
            {loading ? (
              "Отправка..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Отправить заявку
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}

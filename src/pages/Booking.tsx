import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import BookingForm from "@/components/home/BookingForm";

export default function Booking() {
  return (
    <div>
      <div className="container-narrow px-4 pt-8">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Онлайн-запись</span>
        </nav>
      </div>
      <BookingForm />
    </div>
  );
}

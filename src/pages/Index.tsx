import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import ProcessSection from "@/components/home/ProcessSection";
import ScheduleSection from "@/components/home/ScheduleSection";
import PricesPreview from "@/components/home/PricesPreview";
import BookingForm from "@/components/home/BookingForm";
import ReviewsSection from "@/components/home/ReviewsSection";
import FAQSection from "@/components/home/FAQSection";
import ContactsSection from "@/components/home/ContactsSection";

export default function Index() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <CategoriesSection />
      <ProcessSection />
      <ScheduleSection />
      <PricesPreview />
      <BookingForm />
      <ReviewsSection />
      <FAQSection />
      <ContactsSection />
    </>
  );
}

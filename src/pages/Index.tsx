import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import TrustSection from "@/components/home/TrustSection";
import StationSection from "@/components/home/StationSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import ProcessSection from "@/components/home/ProcessSection";
import HonestTermsSection from "@/components/home/HonestTermsSection";
import ScheduleSection from "@/components/home/ScheduleSection";
import PricesPreview from "@/components/home/PricesPreview";
import BookingForm from "@/components/home/BookingForm";
import ReviewsSection from "@/components/home/ReviewsSection";
import FAQSection from "@/components/home/FAQSection";
import ContactsSection from "@/components/home/ContactsSection";
import SeoTextSection from "@/components/home/SeoTextSection";
import DistrictsSection from "@/components/home/DistrictsSection";

export default function Index() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <TrustSection />
      <StationSection />
      <ProcessSection />
      <HonestTermsSection />
      <CategoriesSection />
      <DistrictsSection />
      <ScheduleSection />
      <PricesPreview />
      <BookingForm />
      <ReviewsSection />
      <FAQSection />
      <SeoTextSection />
      <ContactsSection />
    </>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PriceItem {
  id: string;
  category_code: string;
  category_name: string;
  description: string;
  details: string;
  price_rub: number;
}

export const PRICE_SOURCE =
  "Постановление Правительства Брянской области от 20.11.2023 № 563-п";

export function usePrices() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("prices")
      .select("id, category_code, category_name, description, details, price_rub")
      .order("category_code")
      .then(({ data, error }) => {
        if (!error && data) {
          setPrices(data as PriceItem[]);
        }
        setLoading(false);
      });
  }, []);

  return { prices, loading };
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SeoLocation {
  id: string;
  slug: string;
  location_name: string;
  h1: string;
  seo_title: string;
  seo_description: string;
  keywords?: string;
  page_type?: string;
  route_path?: string | null;
  intro_text: string;
  seo_text: string;
  is_active: boolean;
  sort_order: number;
}

export function useSeoLocations(activeOnly = true) {
  const [locations, setLocations] = useState<SeoLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = supabase
      .from("seo_locations")
      .select("*")
      .eq("page_type", "district")
      .order("sort_order");

    if (activeOnly) {
      query.eq("is_active", true);
    }

    query.then(({ data, error }) => {
      if (!error && data) {
        setLocations(data as SeoLocation[]);
      }
      setLoading(false);
    });
  }, [activeOnly]);

  return { locations, loading };
}

export function useSeoLocation(slug: string) {
  const [location, setLocation] = useState<SeoLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("seo_locations")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          setLocation(data as SeoLocation);
        }
        setLoading(false);
      });
  }, [slug]);

  return { location, loading };
}

/**
 * Fetch meta-tags for a static route (e.g. "/", "/ceny-tehosmotra-bryansk").
 * Returns null while loading or if not configured — pages should fall back
 * to their hardcoded defaults in that case.
 */
export function useRouteMeta(routePath: string) {
  const [meta, setMeta] = useState<SeoLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from("seo_locations")
      .select("*")
      .eq("route_path", routePath)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setMeta(data as SeoLocation);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [routePath]);

  return { meta, loading };
}

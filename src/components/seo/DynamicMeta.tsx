import { Helmet } from "react-helmet-async";
import { useRouteMeta } from "@/hooks/useSeoLocations";

interface DynamicMetaProps {
  /** Route path used as a key in seo_locations.route_path (e.g. "/", "/prices") */
  routePath: string;
  /** Fallback title when no admin override is configured */
  defaultTitle: string;
  /** Fallback description when no admin override is configured */
  defaultDescription: string;
  /** Fallback keywords (comma-separated) */
  defaultKeywords?: string;
  /** Canonical URL (absolute) */
  canonical?: string;
}

/**
 * Renders <title>, meta description, keywords and Open Graph tags,
 * preferring values managed via the admin panel (seo_locations table)
 * and falling back to component-level defaults.
 */
export default function DynamicMeta({
  routePath,
  defaultTitle,
  defaultDescription,
  defaultKeywords = "",
  canonical,
}: DynamicMetaProps) {
  const { meta } = useRouteMeta(routePath);

  const title = meta?.seo_title || defaultTitle;
  const description = meta?.seo_description || defaultDescription;
  const keywords = meta?.keywords || defaultKeywords;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
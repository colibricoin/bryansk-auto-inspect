-- Add new columns for full meta management
ALTER TABLE public.seo_locations
  ADD COLUMN IF NOT EXISTS keywords text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS page_type text NOT NULL DEFAULT 'district',
  ADD COLUMN IF NOT EXISTS route_path text;

-- Index for fast lookup by route
CREATE INDEX IF NOT EXISTS idx_seo_locations_route_path ON public.seo_locations(route_path);
CREATE INDEX IF NOT EXISTS idx_seo_locations_page_type ON public.seo_locations(page_type);

-- Seed static page meta entries (idempotent via slug uniqueness check)
INSERT INTO public.seo_locations (slug, location_name, h1, seo_title, seo_description, keywords, intro_text, seo_text, is_active, sort_order, page_type, route_path)
SELECT * FROM (VALUES
  (
    'home',
    'Главная',
    'Техосмотр в Брянске — официальный пункт',
    'Техосмотр Брянск — Официальный техосмотр для ОСАГО в Брянске',
    'Пройдите техосмотр в Брянске. Официальное прохождение техосмотра для всех категорий транспорта. Запись онлайн.',
    'техосмотр Брянск, пройти техосмотр Брянск, диагностическая карта Брянск, техосмотр для ОСАГО, пункт техосмотра Брянск, техосмотр цена Брянск',
    '',
    '',
    true,
    -100,
    'static',
    '/'
  ),
  (
    'static-tehosmotr-bryansk',
    'Техосмотр Брянск',
    'Техосмотр в Брянске',
    'Техосмотр в Брянске — официальный пункт, диагностическая карта для ОСАГО',
    'Аккредитованный пункт техосмотра в Брянске. Все категории ТС. Диагностическая карта для ОСАГО. Запись онлайн.',
    'техосмотр Брянск, пункт техосмотра Брянск, диагностическая карта Брянск, техосмотр ОСАГО, аккредитованный пункт техосмотра',
    '',
    '',
    true,
    -90,
    'static',
    '/tehosmotr-bryansk'
  ),
  (
    'static-ceny',
    'Цены на техосмотр',
    'Цены на техосмотр в Брянске',
    'Цены на техосмотр в Брянске — прозрачный прейскурант для всех категорий ТС',
    'Актуальные цены на техосмотр в Брянске для всех категорий транспорта. Прозрачный прейскурант, оплата по факту.',
    'цены на техосмотр Брянск, стоимость техосмотра Брянск, прейскурант техосмотра, техосмотр цена',
    '',
    '',
    true,
    -80,
    'static',
    '/ceny-tehosmotra-bryansk'
  ),
  (
    'static-karta',
    'Диагностическая карта',
    'Диагностическая карта в Брянске',
    'Диагностическая карта в Брянске — для ОСАГО, официальное оформление',
    'Получите диагностическую карту в Брянске для ОСАГО. Официальное оформление через ЕАИСТО, все категории ТС.',
    'диагностическая карта Брянск, диагностическая карта для ОСАГО, ЕАИСТО Брянск, оформить диагностическую карту',
    '',
    '',
    true,
    -70,
    'static',
    '/diagnosticheskaya-karta-bryansk'
  ),
  (
    'static-rayony',
    'Районы Брянска',
    'Техосмотр по районам Брянска',
    'Техосмотр в районах Брянска — Бежицкий, Советский, Володарский, Фокинский',
    'Адреса и информация по техосмотру для всех районов Брянска. Удобный выбор ближайшего пункта, запись онлайн.',
    'техосмотр районы Брянска, техосмотр Бежицкий район, техосмотр Советский район, техосмотр Володарский район, техосмотр Фокинский район',
    '',
    '',
    true,
    -60,
    'static',
    '/rayony-bryanska'
  )
) AS v(slug, location_name, h1, seo_title, seo_description, keywords, intro_text, seo_text, is_active, sort_order, page_type, route_path)
WHERE NOT EXISTS (
  SELECT 1 FROM public.seo_locations WHERE seo_locations.slug = v.slug
);
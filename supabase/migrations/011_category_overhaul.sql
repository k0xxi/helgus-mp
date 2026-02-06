-- ============================================================================
-- CATEGORY OVERHAUL: 10 Main Categories + 10 Subcategories Each
-- Willhaben-style categories for Kleinanzeigen (no real estate, jobs, cars)
-- ============================================================================

-- Step 1: Remove FK constraint temporarily, reassign existing products to 'Sonstiges'
-- We'll create a temp reference to map old categories to new ones

-- Step 2: Delete all existing categories (products will be reassigned after new categories are created)
-- First, store existing product-category mappings
CREATE TEMP TABLE product_category_backup AS
SELECT p.id as product_id, c.slug as old_category_slug
FROM products p
JOIN categories c ON p.category_id = c.id;

-- Remove FK constraint temporarily
ALTER TABLE products DROP CONSTRAINT products_category_id_fkey;

-- Delete all existing categories
DELETE FROM categories;

-- Step 3: Insert new main categories
INSERT INTO categories (id, name, slug, parent_id, sort_order) VALUES
  (gen_random_uuid(), 'Elektronik & Technik', 'elektronik-technik', NULL, 1),
  (gen_random_uuid(), 'Mode & Accessoires', 'mode-accessoires', NULL, 2),
  (gen_random_uuid(), 'Haus & Garten', 'haus-garten', NULL, 3),
  (gen_random_uuid(), 'Sport & Freizeit', 'sport-freizeit', NULL, 4),
  (gen_random_uuid(), 'Familie & Baby', 'familie-baby', NULL, 5),
  (gen_random_uuid(), 'Hobby & Kunst', 'hobby-kunst', NULL, 6),
  (gen_random_uuid(), 'Bücher & Medien', 'buecher-medien', NULL, 7),
  (gen_random_uuid(), 'Haustiere & Zubehör', 'haustiere-zubehoer', NULL, 8),
  (gen_random_uuid(), 'Sammeln & Seltenes', 'sammeln-seltenes', NULL, 9),
  (gen_random_uuid(), 'Sonstiges', 'sonstiges', NULL, 10);

-- Step 4: Insert subcategories for each main category

-- 1. Elektronik & Technik
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT sub.name, sub.slug, c.id, sub.sort_order FROM (VALUES
  ('Smartphones & Handys', 'smartphones-handys', 1),
  ('Laptops & PCs', 'laptops-pcs', 2),
  ('Tablets & E-Reader', 'tablets-ereader', 3),
  ('TV & Audio', 'tv-audio', 4),
  ('Kameras & Foto', 'kameras-foto', 5),
  ('Spielkonsolen & Games', 'spielkonsolen-games', 6),
  ('Smartwatches & Wearables', 'smartwatches-wearables', 7),
  ('Zubehör & Kabel', 'zubehoer-kabel', 8),
  ('Haushaltsgeräte', 'haushaltsgeraete', 9),
  ('Sonstige Elektronik', 'sonstige-elektronik', 10)
) AS sub(name, slug, sort_order)
CROSS JOIN categories c WHERE c.slug = 'elektronik-technik';

-- 2. Mode & Accessoires
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT sub.name, sub.slug, c.id, sub.sort_order FROM (VALUES
  ('Damenbekleidung', 'damenbekleidung', 1),
  ('Herrenbekleidung', 'herrenbekleidung', 2),
  ('Kinderbekleidung', 'kinderbekleidung', 3),
  ('Schuhe', 'schuhe', 4),
  ('Taschen & Rucksäcke', 'taschen-rucksaecke', 5),
  ('Schmuck & Uhren', 'schmuck-uhren', 6),
  ('Accessoires', 'accessoires', 7),
  ('Sportbekleidung', 'sportbekleidung', 8),
  ('Vintage & Retro', 'vintage-retro-mode', 9),
  ('Sonstige Mode', 'sonstige-mode', 10)
) AS sub(name, slug, sort_order)
CROSS JOIN categories c WHERE c.slug = 'mode-accessoires';

-- 3. Haus & Garten
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT sub.name, sub.slug, c.id, sub.sort_order FROM (VALUES
  ('Möbel', 'moebel', 1),
  ('Dekoration', 'dekoration', 2),
  ('Küche & Haushalt', 'kueche-haushalt', 3),
  ('Beleuchtung', 'beleuchtung', 4),
  ('Gartenmöbel & Zubehör', 'gartenmoebel-zubehoer', 5),
  ('Werkzeug', 'werkzeug', 6),
  ('Heimwerken & Renovieren', 'heimwerken-renovieren', 7),
  ('Badezimmer', 'badezimmer', 8),
  ('Textilien & Bettwäsche', 'textilien-bettwaesche', 9),
  ('Sonstiges Haus & Garten', 'sonstiges-haus-garten', 10)
) AS sub(name, slug, sort_order)
CROSS JOIN categories c WHERE c.slug = 'haus-garten';

-- 4. Sport & Freizeit
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT sub.name, sub.slug, c.id, sub.sort_order FROM (VALUES
  ('Fitnessgeräte', 'fitnessgeraete', 1),
  ('Fahrräder & Zubehör', 'fahrraeder-zubehoer', 2),
  ('Wintersport', 'wintersport', 3),
  ('Wassersport', 'wassersport', 4),
  ('Outdoor & Camping', 'outdoor-camping', 5),
  ('Ballsport', 'ballsport', 6),
  ('Laufen & Wandern', 'laufen-wandern', 7),
  ('Reiten', 'reiten', 8),
  ('Kampfsport', 'kampfsport', 9),
  ('Sonstiger Sport', 'sonstiger-sport', 10)
) AS sub(name, slug, sort_order)
CROSS JOIN categories c WHERE c.slug = 'sport-freizeit';

-- 5. Familie & Baby
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT sub.name, sub.slug, c.id, sub.sort_order FROM (VALUES
  ('Kinderwagen & Buggys', 'kinderwagen-buggys', 1),
  ('Babybekleidung', 'babybekleidung', 2),
  ('Spielzeug', 'spielzeug', 3),
  ('Kinderzimmer', 'kinderzimmer', 4),
  ('Stillen & Füttern', 'stillen-fuettern', 5),
  ('Wickeln & Baden', 'wickeln-baden', 6),
  ('Autositze & Zubehör', 'autositze-zubehoer', 7),
  ('Schule & Lernen', 'schule-lernen', 8),
  ('Schwangerschaft', 'schwangerschaft', 9),
  ('Sonstiges Familie', 'sonstiges-familie', 10)
) AS sub(name, slug, sort_order)
CROSS JOIN categories c WHERE c.slug = 'familie-baby';

-- 6. Hobby & Kunst
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT sub.name, sub.slug, c.id, sub.sort_order FROM (VALUES
  ('Musikinstrumente', 'musikinstrumente', 1),
  ('Basteln & Handarbeit', 'basteln-handarbeit', 2),
  ('Malerei & Zeichnen', 'malerei-zeichnen', 3),
  ('Modellbau', 'modellbau', 4),
  ('Fotografie', 'fotografie', 5),
  ('Kochen & Backen', 'kochen-backen', 6),
  ('Garten & Pflanzen', 'garten-pflanzen', 7),
  ('Nähen & Stoffe', 'naehen-stoffe', 8),
  ('Brettspiele & Puzzles', 'brettspiele-puzzles', 9),
  ('Sonstiges Hobby', 'sonstiges-hobby', 10)
) AS sub(name, slug, sort_order)
CROSS JOIN categories c WHERE c.slug = 'hobby-kunst';

-- 7. Bücher & Medien
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT sub.name, sub.slug, c.id, sub.sort_order FROM (VALUES
  ('Romane & Belletristik', 'romane-belletristik', 1),
  ('Sachbücher', 'sachbuecher', 2),
  ('Kinderbücher', 'kinderbuecher', 3),
  ('Comics & Manga', 'comics-manga', 4),
  ('Fachbücher & Studium', 'fachbuecher-studium', 5),
  ('DVDs & Blu-rays', 'dvds-blurays', 6),
  ('Musik CDs & Vinyl', 'musik-cds-vinyl', 7),
  ('Zeitschriften', 'zeitschriften', 8),
  ('Hörbücher', 'hoerbuecher', 9),
  ('Sonstige Medien', 'sonstige-medien', 10)
) AS sub(name, slug, sort_order)
CROSS JOIN categories c WHERE c.slug = 'buecher-medien';

-- 8. Haustiere & Zubehör
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT sub.name, sub.slug, c.id, sub.sort_order FROM (VALUES
  ('Hundezubehör', 'hundezubehoer', 1),
  ('Katzenzubehör', 'katzenzubehoer', 2),
  ('Aquaristik', 'aquaristik', 3),
  ('Vogelzubehör', 'vogelzubehoer', 4),
  ('Kleintierzubehör', 'kleintierzubehoer', 5),
  ('Terraristik', 'terraristik', 6),
  ('Tierfutter', 'tierfutter', 7),
  ('Tierpflege', 'tierpflege', 8),
  ('Tiertransport', 'tiertransport', 9),
  ('Sonstiges Tierbedarf', 'sonstiges-tierbedarf', 10)
) AS sub(name, slug, sort_order)
CROSS JOIN categories c WHERE c.slug = 'haustiere-zubehoer';

-- 9. Sammeln & Seltenes
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT sub.name, sub.slug, c.id, sub.sort_order FROM (VALUES
  ('Münzen', 'muenzen', 1),
  ('Briefmarken', 'briefmarken', 2),
  ('Antiquitäten', 'antiquitaeten', 3),
  ('Sammelkarten', 'sammelkarten', 4),
  ('Modellautos & -züge', 'modellautos-zuege', 5),
  ('Memorabilia & Fanartikel', 'memorabilia-fanartikel', 6),
  ('Vintage & Retro', 'vintage-retro', 7),
  ('Militaria', 'militaria', 8),
  ('Mineralien & Fossilien', 'mineralien-fossilien', 9),
  ('Sonstige Sammlerstücke', 'sonstige-sammlerstuecke', 10)
) AS sub(name, slug, sort_order)
CROSS JOIN categories c WHERE c.slug = 'sammeln-seltenes';

-- 10. Sonstiges
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT sub.name, sub.slug, c.id, sub.sort_order FROM (VALUES
  ('Dienstleistungen', 'dienstleistungen', 1),
  ('Geschenkideen', 'geschenkideen', 2),
  ('Gutscheine & Tickets', 'gutscheine-tickets', 3),
  ('Lebensmittel & Getränke', 'lebensmittel-getraenke', 4),
  ('Bürobedarf', 'buerobedarf', 5),
  ('Umzug & Transport', 'umzug-transport', 6),
  ('Tausch & Verschenken', 'tausch-verschenken', 7),
  ('Verloren & Gefunden', 'verloren-gefunden', 8),
  ('Flohmarkt & Trödel', 'flohmarkt-troedel', 9),
  ('Verschiedenes', 'verschiedenes', 10)
) AS sub(name, slug, sort_order)
CROSS JOIN categories c WHERE c.slug = 'sonstiges';

-- Step 5: Reassign existing products to best-matching new subcategory
-- Map old category slugs to new subcategory slugs
UPDATE products SET category_id = (
  SELECT sc.id FROM categories sc
  WHERE sc.slug = 'sonstige-elektronik'
  LIMIT 1
)
FROM product_category_backup pcb
WHERE products.id = pcb.product_id AND pcb.old_category_slug = 'elektronik';

UPDATE products SET category_id = (
  SELECT sc.id FROM categories sc
  WHERE sc.slug = 'sonstige-mode'
  LIMIT 1
)
FROM product_category_backup pcb
WHERE products.id = pcb.product_id AND pcb.old_category_slug = 'mode-accessoires';

UPDATE products SET category_id = (
  SELECT sc.id FROM categories sc
  WHERE sc.slug = 'sonstiges-haus-garten'
  LIMIT 1
)
FROM product_category_backup pcb
WHERE products.id = pcb.product_id AND pcb.old_category_slug = 'haus-garten';

UPDATE products SET category_id = (
  SELECT sc.id FROM categories sc
  WHERE sc.slug = 'sonstiger-sport'
  LIMIT 1
)
FROM product_category_backup pcb
WHERE products.id = pcb.product_id AND pcb.old_category_slug = 'sport-freizeit';

UPDATE products SET category_id = (
  SELECT sc.id FROM categories sc
  WHERE sc.slug = 'sonstiges-familie'
  LIMIT 1
)
FROM product_category_backup pcb
WHERE products.id = pcb.product_id AND pcb.old_category_slug = 'familie-baby';

UPDATE products SET category_id = (
  SELECT sc.id FROM categories sc
  WHERE sc.slug = 'sonstiges-tierbedarf'
  LIMIT 1
)
FROM product_category_backup pcb
WHERE products.id = pcb.product_id AND pcb.old_category_slug = 'haustiere';

-- Catch-all: any remaining products go to 'Verschiedenes' under 'Sonstiges'
UPDATE products SET category_id = (
  SELECT sc.id FROM categories sc
  WHERE sc.slug = 'verschiedenes'
  LIMIT 1
)
WHERE category_id NOT IN (SELECT id FROM categories);

-- Step 6: Re-add FK constraint
ALTER TABLE products ADD CONSTRAINT products_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories(id);

-- Clean up temp table
DROP TABLE product_category_backup;

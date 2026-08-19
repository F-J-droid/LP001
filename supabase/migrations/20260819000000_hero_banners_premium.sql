-- Add new premium fields to banners table
ALTER TABLE banners ADD COLUMN desktop_image_url text;
ALTER TABLE banners ADD COLUMN mobile_image_url text;
ALTER TABLE banners ADD COLUMN image_alt text;
ALTER TABLE banners ADD COLUMN highlight_text text;
ALTER TABLE banners ADD COLUMN secondary_cta_label text;
ALTER TABLE banners ADD COLUMN secondary_cta_url text;
ALTER TABLE banners ADD COLUMN theme text DEFAULT 'dark';
ALTER TABLE banners ADD COLUMN text_alignment text DEFAULT 'left';
ALTER TABLE banners ADD COLUMN overlay_strength text DEFAULT 'medium';

-- Migrate existing image_url to new columns
UPDATE banners SET desktop_image_url = image_url, mobile_image_url = image_url;

-- Make desktop_image_url NOT NULL and drop old column
ALTER TABLE banners ALTER COLUMN desktop_image_url SET NOT NULL;
ALTER TABLE banners DROP COLUMN image_url;

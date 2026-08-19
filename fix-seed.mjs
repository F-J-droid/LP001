import fs from 'fs';

const path = 'd:/Loja de pneus/supabase/seed.sql';
let sql = fs.readFileSync(path, 'utf-8');

// Remove all TRUNCATE statements
sql = sql.replace(/^TRUNCATE TABLE .* CASCADE;$/gm, '');

// Replace INSERT INTO with INSERT INTO ... ON CONFLICT (id) DO NOTHING
// But wait! product_categories table might have (tire_variant_id, category_id) as primary key.
// Let's check initial_schema.sql for product_categories primary key.
// Generally, we can just append ON CONFLICT DO NOTHING (if supported) or handle specific constraints.
// Let's just use ON CONFLICT DO NOTHING without specifying the target, which might require a unique constraint on the target in PG.
// In Postgres, ON CONFLICT DO NOTHING requires a conflict target ONLY IF it's ON CONFLICT DO UPDATE. For DO NOTHING, target is optional in newer PG versions? No, in PG 9.5+ ON CONFLICT DO NOTHING works without specifying the constraint, it catches any unique/exclusion constraint violation!
sql = sql.replace(/INSERT INTO (.*?) VALUES \((.*?)\);/g, 'INSERT INTO $1 VALUES ($2) ON CONFLICT DO NOTHING;');

fs.writeFileSync(path, sql);
console.log('Seed SQL made idempotent.');

import fs from 'fs';

const path = 'd:/Loja de pneus/supabase/migrations/20240101000002_seed.sql';
let sql = fs.readFileSync(path, 'utf-8');

// The duplicated EAN is '7890987654321', '7891112223334', '7894445556667'
// We can just replace the EAN field with a unique string like the sku or appending a counter.

let counter = 1;
sql = sql.replace(/(INSERT INTO tire_variants.*?VALUES \([^,]*,[^,]*,[^,]*, *'[^']*', *)'([^']*)'/g, (match, p1, p2) => {
  return `${p1}'${p2}${counter++}'`;
});

fs.writeFileSync(path, sql);
console.log('Seed SQL EANs made unique.');

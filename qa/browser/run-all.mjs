import { spawnSync } from 'child_process';
import path from 'path';

function runScript(script) {
  console.log(`\n======================================================`);
  console.log(`[QA] Running: ${script}`);
  console.log(`======================================================\n`);
  
  const result = spawnSync('node', [path.join('qa', 'browser', 'flows', script)], { stdio: 'inherit' });
  
  if (result.status !== 0) {
    console.error(`\n❌ Script ${script} failed.`);
    process.exit(1);
  }
}

console.log("Iniciando bateria completa do Agent Browser QA...\n");

runScript('smoke-storefront.mjs');
runScript('smoke-checkout.mjs');
runScript('smoke-mobile.mjs');
runScript('smoke-admin.mjs');
runScript('homologation-8.2.mjs');

console.log("\n✅ Toda a bateria QA Agent Browser passou com sucesso!");

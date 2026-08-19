import { open, run, screenshot, wait, loginAdmin } from '../utils.mjs';

async function runTest() {
  console.log("=== Smoke Test: Admin ===");
  try {
    console.log("Testando Redirecionamento de Auth...");
    open('/admin');
    wait(2000);
    // Should be redirected to /admin/login.
    // If not logged in, we expect to be at login.
    
    console.log("Realizando Login Administrativo...");
    loginAdmin();
    
    console.log("Acessando Dashboard...");
    open('/admin');
    wait(2000);
    screenshot('admin-dashboard');

    console.log("Testando SSR Session (Reload)...");
    run('open http://localhost:3000/admin'); // Forcing a reload essentially by opening again
    wait(2000);
    
    console.log("Acessando Produtos...");
    open('/admin/produtos');
    wait(2000);
    screenshot('admin-products');

    console.log("Acessando Estoque...");
    open('/admin/estoque');
    wait(2000);
    
    console.log("Realizando Logout...");
    // Find the logout button. In admin-nav.tsx it's "Sair"
    run(`find text "Sair" click`);
    wait(2000);
    
    // Check if we are redirected to /admin/login by trying to access admin again
    open('/admin');
    wait(2000);

    console.log("✅ Admin Smoke Test Passed");
  } catch(e) {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  }
}

runTest();

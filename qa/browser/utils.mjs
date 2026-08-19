import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SESSION = 'qa-e2e-session';
export const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

export function run(cmd) {
  try {
    const fullCmd = `agent-browser --session ${SESSION} ${cmd}`;
    const output = execSync(fullCmd, { 
      encoding: 'utf-8', 
      stdio: 'ignore',
      env: { ...process.env, AGENT_BROWSER_DEFAULT_TIMEOUT: '120000', AGENT_BROWSER_HEADED: 'true' }
    });
    return output ? output.toString().trim() : '';
  } catch (error) {
    throw new Error(`Command failed: ${cmd}\n${error.stdout ? error.stdout.toString() : ''}`);
  }
}

export function open(route) {
  return run(`open ${BASE_URL}${route}`);
}

export function wait(ms) {
  return run(`wait ${ms}`);
}

export function screenshot(name) {
  const dir = path.join(process.cwd(), 'qa', 'browser', 'screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return run(`screenshot "${path.join(dir, name + '.png')}"`);
}

export function loginAdmin() {
  const email = process.env.E2E_ADMIN_EMAIL;
  const pass = process.env.E2E_ADMIN_PASSWORD;
  
  open('/admin/login');
  wait(2000);

  if (!email || !pass) {
    console.log("⚠️ E2E_ADMIN_PASSWORD não configurada.");
    console.log("⏳ AGUARDANDO LOGIN MANUAL NO BROWSER CONTROLADO...");
    console.log("Por favor, faça o login na janela do navegador que se abriu.");
    console.log("O script continuará assim que a sessão for detectada no painel (30 seg).");
    wait(30000); // Wait 30 seconds for manual login
  } else {
    run(`find placeholder "e-mail" fill "${email}"`);
    run(`find placeholder "senha" fill "${pass}"`);
    run(`find role button click --name "Entrar"`);
    wait(3000);
  }
}

export function closeSession() {
  // If agent-browser has a close command, or just let the daemon idle out.
  // We can force kill the daemon if we want, but it's fine to leave it for subsequent tests.
}

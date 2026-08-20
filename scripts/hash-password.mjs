// Generates the value to put in the ADMIN_PASSWORD_HASH env var.
// Runs entirely locally -- the plaintext password never leaves your machine.
//
// Usage: node scripts/hash-password.mjs
// (you'll be prompted; nothing is written to shell history this way)

import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const rl = createInterface({ input: stdin, output: stdout });
const password = await rl.question("Admin password to hash: ");
rl.close();

if (!password) {
  console.error("No password entered.");
  process.exit(1);
}

const salt = randomBytes(16);
const derived = scryptSync(password, salt, 64);
const hash = `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;

console.log("\nSet this as ADMIN_PASSWORD_HASH in your Vercel project's environment variables:\n");
console.log(hash);
console.log("\nAlso set a random SESSION_SECRET, e.g. run:");
console.log('  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');

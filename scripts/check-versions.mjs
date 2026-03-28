#!/usr/bin/env node

/**
 * check-versions.mjs
 * Scans all workspace package.json files and reports outdated npm packages.
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── Package.json paths to scan (relative to root) ───────────────────────────
const MANIFESTS = [
  'package.json',
  'apps/client/package.json',
  'apps/server/package.json',
  'packages/kit/package.json',
  'packages/eslint-config/package.json',
  'packages/prettier-config/package.json',
  'packages/typescript-config/package.json',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseVersion(range) {
  // Strip semver range prefixes: ^, ~, >=, >, =
  return range.replace(/^[\^~>=<]+/, '').split(' ')[0];
}

function isWorkspaceRef(version) {
  return version === '*' || version.startsWith('workspace:');
}

function latestVersion(pkg) {
  try {
    return execSync(`npm show ${pkg} version --silent 2>/dev/null`, {
      encoding: 'utf8',
    }).trim();
  } catch {
    return null;
  }
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return -1;
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return 1;
  }
  return 0;
}

// ─── Collect all unique external packages ────────────────────────────────────

const packageMap = new Map(); // pkg → Set<source files>

for (const rel of MANIFESTS) {
  const path = resolve(ROOT, rel);
  let json;
  try {
    json = JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    console.warn(`⚠️  Could not read ${rel}`);
    continue;
  }

  const sections = [
    json.dependencies ?? {},
    json.devDependencies ?? {},
    json.peerDependencies ?? {},
  ];

  for (const section of sections) {
    for (const [name, version] of Object.entries(section)) {
      if (isWorkspaceRef(version)) continue;
      if (!packageMap.has(name)) packageMap.set(name, { version, sources: [] });
      packageMap.get(name).sources.push(rel);
    }
  }
}

const packages = [...packageMap.entries()].sort(([a], [b]) => a.localeCompare(b));

// ─── Check each package ───────────────────────────────────────────────────────

console.log(`\nChecking ${packages.length} packages...\n`);

const outdated = [];
const upToDate = [];
const failed = [];

for (const [name, { version, sources }] of packages) {
  const current = parseVersion(version);
  const latest = latestVersion(name);

  if (!latest) {
    failed.push({ name, current, sources });
    continue;
  }

  const status = compareVersions(current, latest);
  const entry = { name, current, latest, sources };

  if (status < 0) {
    outdated.push(entry);
  } else {
    upToDate.push(entry);
  }
}

// ─── Report ───────────────────────────────────────────────────────────────────

const RED   = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW= '\x1b[33m';
const DIM   = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD  = '\x1b[1m';

const col = (str, width) => str.padEnd(width);

if (outdated.length) {
  console.log(`${BOLD}${RED}● Outdated (${outdated.length})${RESET}`);
  console.log(`${DIM}${'Package'.padEnd(42)} ${'Current'.padEnd(12)} ${'Latest'.padEnd(12)} Source${RESET}`);
  console.log('─'.repeat(100));
  for (const { name, current, latest, sources } of outdated) {
    console.log(
      `${RED}${col(name, 42)}${RESET} ${col(current, 12)} ${GREEN}${col(latest, 12)}${RESET} ${DIM}${sources[0]}${RESET}`,
    );
  }
  console.log();
}

if (upToDate.length) {
  console.log(`${BOLD}${GREEN}✓ Up to date (${upToDate.length})${RESET}`);
  console.log(`${DIM}${'Package'.padEnd(42)} ${'Version'.padEnd(12)} Source${RESET}`);
  console.log('─'.repeat(80));
  for (const { name, current, sources } of upToDate) {
    console.log(`${GREEN}${col(name, 42)}${RESET} ${col(current, 12)} ${DIM}${sources[0]}${RESET}`);
  }
  console.log();
}

if (failed.length) {
  console.log(`${BOLD}${YELLOW}? Could not resolve (${failed.length})${RESET}`);
  for (const { name } of failed) {
    console.log(`  ${YELLOW}${name}${RESET}`);
  }
  console.log();
}

console.log(
  `${BOLD}Summary:${RESET} ${outdated.length} outdated · ${upToDate.length} up to date · ${failed.length} unresolved\n`,
);

if (outdated.length > 0) {
  process.exit(1);
}

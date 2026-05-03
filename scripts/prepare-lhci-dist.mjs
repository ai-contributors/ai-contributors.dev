import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const distRoot = path.join(repoRoot, 'dist');
const lhciRoot = path.join(repoRoot, '.lhci-dist');
const base = process.env.ASTRO_BASE || '/ai-contributor-spec/';
const basePath = base.replace(/^\/+|\/+$/g, '');
const targetRoot = basePath ? path.join(lhciRoot, basePath) : lhciRoot;

await rm(lhciRoot, { recursive: true, force: true });
await mkdir(targetRoot, { recursive: true });
await cp(distRoot, targetRoot, { recursive: true });

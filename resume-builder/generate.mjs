#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { dateRange, prepareResume, renderHtml, renderMarkdown } from './render.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(directory);
const readJson = (filename) => JSON.parse(readFileSync(filename, 'utf8').replace(/^\uFEFF/, ''));
function findBrowser() {
  if (process.env.RESUME_BROWSER) {
    if (!existsSync(process.env.RESUME_BROWSER)) throw new Error('RESUME_BROWSER must point to a Chrome, Chromium, or Edge executable.');
    return process.env.RESUME_BROWSER;
  }
  const candidates = process.platform === 'win32'
    ? [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean).flatMap((base) => [path.join(base, 'Microsoft/Edge/Application/msedge.exe'), path.join(base, 'Google/Chrome/Application/chrome.exe')])
    : ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/microsoft-edge', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'];
  const browser = candidates.find(existsSync);
  if (!browser) throw new Error('PDF generation needs Chrome, Chromium, or Edge. Set RESUME_BROWSER to its executable, or print the generated HTML to PDF.');
  return browser;
}

function generatePdf(htmlPath, pdfPath) {
  const browser = findBrowser();
  const temporary = mkdtempSync(path.join(tmpdir(), 'lucas-resume-'));
  try {
    const temporaryPdf = path.join(temporary, 'resume.pdf');
    const result = spawnSync(browser, [
      '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
      '--disable-extensions', '--disable-background-networking', '--no-pdf-header-footer',
      `--user-data-dir=${path.join(temporary, 'browser')}`, `--print-to-pdf=${temporaryPdf}`, pathToFileURL(htmlPath).href,
    ], { encoding: 'utf8', timeout: 60000, windowsHide: true });
    if (result.error || result.status !== 0 || !existsSync(temporaryPdf)) throw new Error(`PDF generation failed: ${result.error?.message || result.stderr?.trim() || `browser exit ${result.status}`}`);
    const pdf = readFileSync(temporaryPdf);
    if (pdf.subarray(0, 5).toString() !== '%PDF-') throw new Error('Browser did not produce a valid PDF file.');
    writeFileSync(pdfPath, pdf);
  } finally {
    // Only remove the unique directory created above, within the OS temp directory.
    const relative = path.relative(path.resolve(tmpdir()), path.resolve(temporary));
    if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) {
      try { rmSync(temporary, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); }
      catch { console.warn(`Temporary browser files could not be removed: ${temporary}`); }
    }
  }
}

function main() {
  const { values } = parseArgs({ options: {
    help: { type: 'boolean', short: 'h' },
    pdf: { type: 'boolean' },
    publish: { type: 'boolean' },
    'include-drafts': { type: 'boolean' },
    context: { type: 'string' },
    output: { type: 'string' },
  } });
  if (values.help) {
    console.log('Usage: node resume-builder/generate.mjs [--pdf] [--include-drafts] [--output DIR] [--context FILE] [--publish]\n\nCreates a concise resume from context.resume; --pdf also creates a PDF using a local browser.\n--publish creates a PDF and copies it to public/docs/cv.pdf.\nAll selected experience is included by default.\n--include-drafts writes a separately named review copy of the same concise content.\nPaths passed as options are relative to the working directory; defaults are relative to this script.');
    return;
  }
  const context = readJson(values.context ? path.resolve(values.context) : path.join(directory, 'context.json'));
  const experience = readJson(path.join(root, 'json/experience.json'));
  const resume = prepareResume(context, experience, readJson(path.join(root, 'json/data.json')).Projects);
  const output = values.output ? path.resolve(values.output) : path.join(directory, 'output');
  const slug = context.profile.name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'resume';
  const basename = `${slug}-resume${values['include-drafts'] ? '-draft' : ''}`;
  mkdirSync(output, { recursive: true });
  const htmlPath = path.join(output, `${basename}.html`);
  writeFileSync(htmlPath, renderHtml(resume, values['include-drafts']));
  writeFileSync(path.join(output, `${basename}.md`), renderMarkdown(resume, values['include-drafts']));
  writeFileSync(path.join(output, 'review-notes.txt'), [...context.reviewNotes, ...experience.filter((role) => role.reviewNeeded).map((role) => `${dateRange(role)} ${role.position}: ${role.reviewNeeded}`)].map((note) => `- ${note}`).join('\n') + '\n');
  console.log(`Generated ${basename}.html and ${basename}.md in ${output}`);
  if (values.pdf || values.publish) {
    const pdfPath = path.join(output, `${basename}.pdf`);
    generatePdf(htmlPath, pdfPath);
    console.log(`Generated ${pdfPath}`);
    if (values.publish) {
      const target = path.join(root, 'public/docs/cv.pdf');
      mkdirSync(path.dirname(target), { recursive: true });
      copyFileSync(pdfPath, target);
      console.log(`Updated ${target}`);
    }
  }
}

try { main(); }
catch (error) { console.error(`Resume generation failed: ${error.message}`); process.exitCode = 1; }

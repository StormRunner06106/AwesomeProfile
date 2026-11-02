import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const directory = path.dirname(fileURLToPath(import.meta.url));
const generator = path.join(directory, 'generate.mjs');
const context = JSON.parse(readFileSync(path.join(directory, 'context.json'), 'utf8'));
const career = JSON.parse(readFileSync(path.join(directory, '../json/experience.json'), 'utf8'));

function workspace(t) {
  const temporary = mkdtempSync(path.join(tmpdir(), 'resume-test-'));
  t.after(() => {
    const relative = path.relative(path.resolve(tmpdir()), path.resolve(temporary));
    assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative));
    rmSync(temporary, { recursive: true, force: true });
  });
  return temporary;
}

function run(temporary, args = []) {
  return spawnSync(process.execPath, [generator, '--output', path.join(temporary, 'output'), ...args], { cwd: temporary, encoding: 'utf8', windowsHide: true });
}

test('generates detailed experience, seven brief projects, and contact links', (t) => {
  const temporary = workspace(t);
  const projectsPath = path.join(directory, '../json/data.json');
  const sourceBefore = readFileSync(projectsPath, 'utf8');
  const result = run(temporary);
  assert.equal(result.status, 0, result.stderr);
  const markdown = readFileSync(path.join(temporary, 'output/lucas-huang-resume.md'), 'utf8');
  const html = readFileSync(path.join(temporary, 'output/lucas-huang-resume.html'), 'utf8');
  assert.match(markdown, /Lucas Huang/);
  assert.match(markdown, /Independent Software Developer/);
  assert.match(markdown, /Jun 2025 – Present/);
  assert.match(markdown, /Equity Funding Source/);
  assert.match(markdown, /IIPM\.ie/);
  for (const name of ['Upwork', 'RemotePeople', 'HeyMax', 'Portcast']) assert.ok(markdown.includes(name));
  for (const project of JSON.parse(sourceBefore).Projects) assert.ok(markdown.includes(project.title), `Missing ${project.title}`);
  assert.equal((html.match(/data-experience=/g) || []).length, 6);
  assert.equal((html.match(/data-project=/g) || []).length, 7);
  assert.match(html, /href="mailto:stormrunner06106@gmail\.com"/);
  assert.match(html, /href="https:\/\/lucas\.my\.id\/">Portfolio: https:\/\/lucas\.my\.id/);
  assert.doesNotMatch(markdown, /Draft experience|Elara AI|KK Stock|University IT Club|Lucas Taylor/);
  const roleSections = [...html.matchAll(/<article data-experience="([^"]+)">([\s\S]*?)<\/article>/g)];
  assert.deepEqual(roleSections.map(([, id]) => id), ['independent', 'upwork', 'freelancer', 'heymax', 'portcast', 'remotepeople']);
  for (const [, id, section] of roleSections) {
    const sharedRole = career.find((role) => role.id === id);
    assert.equal((section.match(/<li>/g) || []).length, sharedRole.highlights.length, `${id} must retain all shared experience highlights`);
  }
  assert.match(markdown, /D1 for relational data/);
  assert.match(markdown, /qualification reviews, course-progress tracking, annual payments/);
  assert.match(markdown, /WordPress sites to React applications and Android features/);
  assert.equal(readFileSync(projectsPath, 'utf8'), sourceBefore);
  assert.ok(existsSync(path.join(temporary, 'output/review-notes.txt')));
});

test('review copy keeps editing notes outside the resume and renders plain dates and locations', (t) => {
  const temporary = workspace(t);
  const fixture = structuredClone(context);
  fixture.profile.summary = 'FULL_CONTEXT_SUMMARY_SENTINEL';
  fixture.reviewNotes.push('PRIVATE_REVIEW_NOTE_SENTINEL');
  const contextPath = path.join(temporary, 'context.json');
  writeFileSync(contextPath, JSON.stringify(fixture));
  const cvPath = path.join(directory, '../public/docs/cv.pdf');
  const cvBefore = readFileSync(cvPath);
  const result = run(temporary, ['--include-drafts', '--context', contextPath]);
  assert.equal(result.status, 0, result.stderr);
  const html = readFileSync(path.join(temporary, 'output/lucas-huang-resume-draft.html'), 'utf8');
  assert.match(html, /Review copy/);
  assert.match(html, /Frontend Developer/);
  assert.match(html, /DevOps Developer/);
  assert.match(html, /RemotePeople/);
  assert.match(html, /HeyMax/);
  assert.match(html, /Portcast/);
  assert.match(html, /Jan 2023 – Dec 2023 · Remote · Singapore<\/p>/);
  assert.match(html, /Jan 2019 – Dec 2020 · Remote · China<\/p>/);
  assert.doesNotMatch(html, /Suggested responsibilities/i);
  assert.doesNotMatch(readFileSync(path.join(temporary, 'output/lucas-huang-resume-draft.md'), 'utf8'), /Suggested responsibilities/i);
  assert.doesNotMatch(html, /FULL_CONTEXT_SUMMARY_SENTINEL|PRIVATE_REVIEW_NOTE_SENTINEL|Review needed:|these are not actual employment dates/);
  assert.match(readFileSync(path.join(temporary, 'output/review-notes.txt'), 'utf8'), /PRIVATE_REVIEW_NOTE_SENTINEL/);
  assert.deepEqual(readFileSync(cvPath), cvBefore);
});

test('rejects a stale project reference before generating files', (t) => {
  const temporary = workspace(t);
  const fixture = structuredClone(context);
  fixture.resume.projects[0].slug = 'missing-project';
  const contextPath = path.join(temporary, 'context.json');
  writeFileSync(contextPath, JSON.stringify(fixture));
  const result = run(temporary, ['--context', contextPath]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown project slug: missing-project/);
  assert.equal(existsSync(path.join(temporary, 'output')), false);
});

test('renders editable text literally and rejects active URL schemes', (t) => {
  const temporary = workspace(t);
  const fixture = structuredClone(context);
  fixture.resume.summary = '<script>alert("hello")</script> & details';
  const contextPath = path.join(temporary, 'context.json');
  writeFileSync(contextPath, JSON.stringify(fixture));
  const result = run(temporary, ['--context', contextPath]);
  assert.equal(result.status, 0, result.stderr);
  const html = readFileSync(path.join(temporary, 'output/lucas-huang-resume.html'), 'utf8');
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  fixture.profile.website = 'javascript:alert(1)';
  writeFileSync(contextPath, JSON.stringify(fixture));
  const invalid = run(temporary, ['--context', contextPath]);
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /must use HTTP or HTTPS/);
});

const html = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const markdown = (value) => html(value).replace(/([\\`*_{}\[\]()#+!|])/g, '\\$1');

function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be a nonempty string.`);
}

function list(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  return value;
}

function webUrl(value, label) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`${label} must use HTTP or HTTPS.`);
  return url.href;
}

export function dateRange(role) {
  return role.startDate === role.endDate ? role.startDate : `${role.startDate} – ${role.endDate}`;
}

export function prepareResume(context, career, sourceProjects) {
  const profile = context.profile;
  for (const field of ['name', 'title', 'location', 'email']) text(profile?.[field], `profile.${field}`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) throw new Error('profile.email is invalid.');
  for (const field of ['website', 'github']) webUrl(profile[field], `profile.${field}`);
  const resume = context.resume;
  text(resume?.summary, 'resume.summary');
  if (!resume.skills || Array.isArray(resume.skills) || typeof resume.skills !== 'object') throw new Error('resume.skills must be an object of category arrays.');
  for (const [category, skills] of Object.entries(resume.skills)) list(skills, `skills.${category}`).forEach((skill) => text(skill, 'Skill'));
  const sourceIds = new Set();
  for (const role of list(career, 'Career')) {
    if (sourceIds.has(role.id)) throw new Error(`Duplicate experience id: ${role.id}`);
    sourceIds.add(role.id);
  }
  const selectedIds = new Set();
  const experience = list(resume.experience, 'resume.experience').map((selection) => {
    if (selectedIds.has(selection.id)) throw new Error(`Duplicate selected experience: ${selection.id}`);
    selectedIds.add(selection.id);
    const role = career.find((item) => item.id === selection.id);
    if (!role) throw new Error(`Unknown experience id: ${selection.id}`);
    for (const field of ['id', 'company', 'industry', 'position', 'startDate', 'endDate', 'type', 'location']) text(role[field], `Experience ${field}`);
    const bullets = list(role.highlights, `experience.${selection.id}.highlights`);
    if (!bullets.length) throw new Error(`Experience ${selection.id} needs at least one responsibility or achievement.`);
    bullets.forEach((bullet) => text(bullet, `experience.${selection.id}.highlight`));
    return { ...role, bullets };
  });
  const selectedSlugs = new Set();
  const projects = list(resume.projects, 'resume.projects').map((selection) => {
    if (selectedSlugs.has(selection.slug)) throw new Error(`Duplicate project slug: ${selection.slug}`);
    selectedSlugs.add(selection.slug);
    const project = sourceProjects.find((item) => item.slug === selection.slug);
    if (!project) throw new Error(`Unknown project slug: ${selection.slug}`);
    text(selection.summary, `resume.projects.${selection.slug}.summary`);
    for (const field of ['title', 'year']) text(project[field], `Project ${field}`);
    webUrl(project.preview, `projects.${selection.slug}.preview`);
    return { ...project, summary: selection.summary };
  });
  const education = list(resume.education ?? [], 'resume.education');
  for (const entry of education) {
    for (const field of ['institution', 'qualification', 'dates']) text(entry[field], `education.${field}`);
  }
  return { profile, summary: resume.summary, skills: resume.skills, experience, projects, education };
}

export function renderMarkdown(data, reviewCopy = false) {
  const m = markdown;
  const { profile, experience, projects } = data;
  const lines = [`# ${m(profile.name)}`, '', `${m(profile.title)} | ${m(profile.location)}`, '',
    `Email: [${m(profile.email)}](mailto:${encodeURIComponent(profile.email)})`, '',
    `Portfolio: <${profile.website}>`, '', `GitHub: <${profile.github}>`, ''];
  if (reviewCopy) lines.push('*Review copy*', '');
  lines.push('## Profile', '', m(data.summary), '', '## Core Skills', '');
  for (const [category, skills] of Object.entries(data.skills)) lines.push(`- **${m(category)}:** ${skills.map(m).join(', ')}`);
  lines.push('', '## Experience', '');
  for (const role of experience) {
    lines.push(`### ${m(role.position)} | ${m(role.company)}`, '', `${m(dateRange(role))} | ${m(role.type)} | ${m(role.location)}`, '');
    lines.push(`**Industry:** ${m(role.industry)}`, '');
    for (const bullet of role.bullets) lines.push(`- ${m(bullet)}`);
    lines.push('');
  }
  lines.push('## Projects', '');
  for (const project of projects) lines.push(`- **[${m(project.title)}](${webUrl(project.preview)})** (${m(project.year)}): ${m(project.summary)}`);
  if (data.education.length) lines.push('', '## Education', '');
  for (const entry of data.education) lines.push(`- ${m(entry.qualification)} | ${m(entry.institution)} | ${m(entry.dates)}`);
  return `${lines.join('\n').trim()}\n`;
}

export function renderHtml(data, reviewCopy = false) {
  const h = html;
  const { profile, experience, projects } = data;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${h(profile.name)} — Resume${reviewCopy ? ' (Review)' : ''}</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #17212b; font: 10.5pt/1.45 Arial, Helvetica, sans-serif; background: #eef1f4; }
  main { max-width: 210mm; margin: 24px auto; background: white; padding: 15mm; box-shadow: 0 4px 24px #17212b15; }
  header { border-bottom: 2px solid #213d51; padding-bottom: 9px; }
  h1 { font-size: 25pt; line-height: 1.1; margin: 0 0 4px; letter-spacing: -.6px; }
  .title { font-size: 11pt; margin: 0 0 6px; color: #36556b; }
  .contact, .meta, .year, .industry { color: #465563; font-size: 9pt; }
  .contact { display: flex; flex-wrap: wrap; gap: 3px 14px; }
  a { color: #213d51; text-decoration: none; overflow-wrap: anywhere; }
  h2 { font-size: 10.5pt; letter-spacing: .8px; text-transform: uppercase; color: #213d51; margin: 12px 0 6px; border-bottom: 1px solid #d9e0e5; padding-bottom: 3px; break-after: avoid; }
  h3 { font-size: 10.5pt; margin: 0; break-after: avoid; }
  h3 span { font-weight: 400; }
  p { margin: 3px 0; }
  article { margin-bottom: 14px; break-inside: avoid; }
  ul { margin: 0; padding: 0; list-style: none; }
  li { margin: 3px 0; break-inside: avoid; }
  .experience-bullets { list-style: disc; padding-left: 17px; margin-top: 6px; }
  .experience-bullets li { margin: 5px 0; }
  .review { font-size: 9pt; color: #704b00; margin-top: 6px; }
  @media print { body { background: white; } main { margin: 0; padding: 0; max-width: none; box-shadow: none; } }
  @media screen and (max-width: 650px) { main { margin: 0; padding: 22px; } h1 { font-size: 23pt; } }
</style></head><body><main>
<header><h1>${h(profile.name)}</h1><p class="title">${h(profile.title)} · ${h(profile.location)}</p>
<div class="contact"><a href="mailto:${h(profile.email)}">Email: ${h(profile.email)}</a><a href="${h(webUrl(profile.website))}">Portfolio: ${h(profile.website)}</a><a href="${h(webUrl(profile.github))}">GitHub: ${h(profile.github.replace('https://github.com/', ''))}</a></div>
${reviewCopy ? '<p class="review">Review copy</p>' : ''}</header>
<section><h2>Profile</h2><p>${h(data.summary)}</p></section>
<section><h2>Core Skills</h2><ul>${Object.entries(data.skills).map(([category, skills]) => `<li><strong>${h(category)}:</strong> ${h(skills.join(', '))}</li>`).join('')}</ul></section>
<section><h2>Experience</h2>${experience.map((role) => `<article data-experience="${h(role.id)}"><h3>${h(role.position)} <span>· ${h(role.company)}</span></h3><p class="meta">${h(dateRange(role))} · ${h(role.type)} · ${h(role.location)}</p><p class="industry"><strong>Industry:</strong> ${h(role.industry)}</p><ul class="experience-bullets">${role.bullets.map((bullet) => `<li>${h(bullet)}</li>`).join('')}</ul></article>`).join('')}</section>
<section><h2>Projects</h2><ul>${projects.map((project) => `<li data-project="${h(project.slug)}"><strong><a href="${h(webUrl(project.preview))}">${h(project.title)}</a></strong> <span class="year">(${h(project.year)})</span> — ${h(project.summary)}</li>`).join('')}</ul></section>
${data.education.length ? `<section><h2>Education</h2>${data.education.map((entry) => `<article><h3>${h(entry.qualification)}</h3><p>${h(entry.institution)} · ${h(entry.dates)}</p></article>`).join('')}</section>` : ''}
</main></body></html>\n`;
}

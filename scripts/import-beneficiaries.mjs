import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import mammoth from 'mammoth';
import { createClient } from '@supabase/supabase-js';

const defaultSource = path.resolve('docs/BASE DE DATOS MG ONG.docx');
const sourceArg = process.argv.find((arg) => arg.startsWith('--source='));
const source = sourceArg
  ? path.resolve(sourceArg.slice('--source='.length))
  : defaultSource;
const dryRun = process.argv.includes('--dry-run');

export function parseBeneficiaries(rawText) {
  const lines = rawText.split(/\r?\n/).map(cleanText).filter(Boolean);
  const blocks = [];
  let current = null;
  for (const line of lines) {
    const codeMatch = line.match(/^MG\s*[-–—]?\s*0*(\d{1,3})$/i);
    if (codeMatch) {
      if (current) blocks.push(current);
      current = { number: Number(codeMatch[1]), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) blocks.push(current);

  return blocks
    .filter((block) => block.number >= 1 && block.number <= 41)
    .map((block) => parseBlock(block));
}

const fieldRules = [
  ['full_name', /^(nombre(?: completo)?(?: del (?:niño|nino|beneficiario))?)/i],
  [
    'date_source',
    /^(fecha de nacimiento|fecha nacimiento|nacimiento|cumplo anos|cumpli anos)/i,
  ],
  ['age_source', /^(edad)/i],
  ['gender', /^(genero|genereo|sexo)/i],
  ['school_grade', /^(grado(?: escolar)?|gado|escolaridad)/i],
  ['favorite_subject', /^(asig\w* favorita|asignacion\b|materia favorita)/i],
  ['hobby', /^(pasa?\s*tiempo|pastiempo|pasatiepo|hobby|que le gusta hacer)/i],
  ['future_goal', /^(qu.*\bser\b.*|aspiracion|sueno)/i],
  [
    'public_story',
    /^(si.*cion(?: familiar)?|historia(?: familiar)?|relato(?: familiar)?|descripcion familiar)/i,
  ],
];

function parseBlock(block) {
  const fields = {};
  let activeKey = null;
  for (const line of block.lines) {
    const normalized = normalize(line);
    const rule = fieldRules.find(([, pattern]) => pattern.test(normalized));
    if (rule) {
      activeKey = rule[0];
      const separator = line.search(/[:：]/);
      let inlineValue =
        separator >= 0 ? cleanText(line.slice(separator + 1)) : '';
      if (!inlineValue && /^pasatiempo\.\s+/i.test(line)) {
        inlineValue = cleanText(line.slice(line.indexOf('.') + 1));
      }
      if (inlineValue)
        fields[activeKey] = append(fields[activeKey], inlineValue);
      continue;
    }
    if (activeKey) fields[activeKey] = append(fields[activeKey], line);
  }

  const dateOfBirth = parseCompleteSpanishDate(fields.date_source || '');
  const privateNotes = [];
  if (!dateOfBirth && fields.date_source)
    privateNotes.push(`Fecha indicada en fuente: ${fields.date_source}`);
  if (fields.age_source)
    privateNotes.push(`Edad indicada en fuente: ${fields.age_source}`);
  const record = {
    code: `MG-${String(block.number).padStart(3, '0')}`,
    full_name: fields.full_name || null,
    date_of_birth: dateOfBirth,
    gender: fields.gender || null,
    school_grade: fields.school_grade || null,
    favorite_subject: fields.favorite_subject || null,
    hobby: fields.hobby || null,
    future_goal: fields.future_goal || null,
    public_story: fields.public_story || null,
    status: 'draft',
  };
  const missingFields = [
    'full_name',
    'school_grade',
    'favorite_subject',
    'hobby',
    'future_goal',
    'public_story',
  ].filter((field) => !record[field]);
  if (missingFields.length) {
    privateNotes.push(`Campos no detectados: ${missingFields.join(', ')}.`);
  }
  privateNotes.push(
    'Importado automáticamente del documento original; requiere revisión editorial y de consentimiento.',
  );
  return { ...record, import_notes: privateNotes.join('\n') };
}

const months = new Map([
  ['enero', 1],
  ['febrero', 2],
  ['marzo', 3],
  ['abril', 4],
  ['mayo', 5],
  ['junio', 6],
  ['julio', 7],
  ['agosto', 8],
  ['septiembre', 9],
  ['setiembre', 9],
  ['octubre', 10],
  ['noviembre', 11],
  ['diciembre', 12],
]);

function parseCompleteSpanishDate(value) {
  const numeric = value.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/);
  const written = normalize(value).match(
    /\b(\d{1,2})\s+de\s+([a-z]+)\s+de\s+(\d{4})\b/,
  );
  const parts = numeric
    ? [Number(numeric[3]), Number(numeric[2]), Number(numeric[1])]
    : written
      ? [Number(written[3]), months.get(written[2]), Number(written[1])]
      : null;
  if (!parts || !parts[1]) return null;
  const [year, month, day] = parts;
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  )
    return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function append(current, next) {
  return cleanText([current, next].filter(Boolean).join(' '));
}
function cleanText(value) {
  return value.replace(/\s+/g, ' ').trim();
}
function normalize(value) {
  return cleanText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?]/g, '');
}

async function main() {
  await access(source);
  const buffer = await readFile(source);
  const { value } = await mammoth.extractRawText({ buffer });
  const records = parseBeneficiaries(value);

  if (
    records.length !== 41 ||
    new Set(records.map((record) => record.code)).size !== 41 ||
    records.some((record) => record.code === 'MG-042')
  ) {
    throw new Error(
      `Importación detenida: se esperaban 41 perfiles MG-001–MG-041 y se detectaron ${records.length}.`,
    );
  }

  console.log(
    `Validación correcta: ${records.length} perfiles, MG-042 excluido, todos como borrador.`,
  );
  console.log(
    `${records.filter((record) => !record.date_of_birth).length} fechas completas quedan pendientes de revisión.`,
  );
  const fieldCoverage = [
    'full_name',
    'school_grade',
    'favorite_subject',
    'hobby',
    'future_goal',
    'public_story',
  ]
    .map(
      (field) =>
        `${field}: ${records.filter((record) => Boolean(record[field])).length}/41`,
    )
    .join(', ');
  console.log(
    `Cobertura estructurada (sin mostrar valores): ${fieldCoverage}.`,
  );

  if (dryRun) return;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Define SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para ejecutar la importación.',
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase
    .from('beneficiaries')
    .upsert(records, { onConflict: 'code', ignoreDuplicates: true });
  if (error) throw error;
  console.log('Importación finalizada. No se creó ningún archivo intermedio.');
}

if (import.meta.main) await main();

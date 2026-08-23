// ── Mapas PT/EN → número ─────────────────────────────────────────────────────

/** Qualquer forma textual de mês → número 1-12 */
export const MONTH_TO_NUM: Record<string, number> = {
  jan: 1, janeiro: 1,
  fev: 2, fevereiro: 2,
  mar: 3, março: 3,
  abr: 4, abril: 4,
  mai: 5, maio: 5,
  jun: 6, junho: 6,
  jul: 7, julho: 7,
  ago: 8, agosto: 8,
  set: 9, setembro: 9,
  out: 10, outubro: 10,
  nov: 11, novembro: 11,
  dez: 12, dezembro: 12,
  // aliases EN (para presets e entrada direta em inglês)
  feb: 2, apr: 4, may: 5, aug: 8, sep: 9, oct: 10, dec: 12,
};

/** Qualquer forma textual de dia da semana → número 0-7 (0 e 7 = dom) */
export const DOW_TO_NUM: Record<string, number> = {
  dom: 0, domingo: 0, sun: 0,
  seg: 1, segunda: 1, mon: 1,
  ter: 2, terça: 2, tue: 2,
  qua: 3, quarta: 3, wed: 3,
  qui: 4, quinta: 4, thu: 4,
  sex: 5, sexta: 5, fri: 5,
  sab: 6, sáb: 6, sábado: 6, sat: 6,
};

// ── Mapas PT/EN → EN (para o cronstrue) ──────────────────────────────────────

export const MONTH_MAP: Record<string, string> = {
  jan: 'JAN', fev: 'FEB', mar: 'MAR', abr: 'APR',
  mai: 'MAY', jun: 'JUN', jul: 'JUL', ago: 'AUG',
  set: 'SEP', out: 'OCT', nov: 'NOV', dez: 'DEC',
  janeiro: 'JAN', fevereiro: 'FEB', março: 'MAR', abril: 'APR',
  maio: 'MAY', junho: 'JUN', julho: 'JUL', agosto: 'AUG',
  setembro: 'SEP', outubro: 'OCT', novembro: 'NOV', dezembro: 'DEC',
};

export const DOW_MAP: Record<string, string> = {
  dom: 'SUN', seg: 'MON', ter: 'TUE', qua: 'WED',
  qui: 'THU', sex: 'FRI', sab: 'SAT', sáb: 'SAT',
  domingo: 'SUN', segunda: 'MON', terça: 'TUE', quarta: 'WED',
  quinta: 'THU', sexta: 'FRI', sábado: 'SAT',
};

// ── Funções ──────────────────────────────────────────────────────────────────

/**
 * Substitui palavras dentro de um token usando o mapa fornecido.
 * Preserva *, /, números, - e , intactos.
 */
export function translateToken(token: string, map: Record<string, string>): string {
  return token.replace(/[a-zA-ZÀ-ú]+/g, (word) => {
    const key = word.toLowerCase();
    return map[key] ?? word.toUpperCase();
  });
}

/**
 * Substitui palavras dentro de um token pelo número correspondente.
 * Exemplo: "jan-abr" → "1-4", "seg,sex" → "1,5"
 */
function tokenToNumeric(token: string, map: Record<string, number>): string {
  return token.replace(/[a-zA-ZÀ-ú]+/g, (word) => {
    const num = map[word.toLowerCase()];
    return num !== undefined ? String(num) : word;
  });
}

/**
 * Retorna a expressão cron com mês e dia da semana em inglês (para o cronstrue).
 */
export function toEnglishCron(fields: string[]): string {
  const [min, hour, dom, month, dow] = fields.map(f => f.trim() || '*');
  return [
    min,
    hour,
    dom,
    translateToken(month, MONTH_MAP),
    translateToken(dow, DOW_MAP),
  ].join(' ');
}

/**
 * Retorna a expressão cron com todos os valores numéricos (para exibição e cópia).
 * Exemplo: "* * * dez dom" → "* * * 12 0"
 */
export function toNumericCron(fields: string[]): string {
  const [min, hour, dom, month, dow] = fields.map(f => f.trim() || '*');
  return [
    min,
    hour,
    dom,
    tokenToNumeric(month, MONTH_TO_NUM),
    tokenToNumeric(dow, DOW_TO_NUM),
  ].join(' ');
}
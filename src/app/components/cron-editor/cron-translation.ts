/**
 * Monta a expressão cron a partir dos valores dos campos.
 * Sem tradução — os valores são usados como o usuário digitou.
 */
export function toEnglishCron(fields: string[]): string {
  return fields.map(f => f.trim() || '*').join(' ');
}
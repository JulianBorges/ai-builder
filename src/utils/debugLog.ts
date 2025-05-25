/**
 * Utilitário para logs padronizados e consistentes no projeto AI Builder
 * Exibe até N caracteres do conteúdo, com emoji e rótulo de contexto
 */
export function debugLog(label: string, content: any, max: number = 300) {
  const preview = typeof content === "string" ? content.slice(0, max) : JSON.stringify(content, null, 2).slice(0, max);
  console.log(`🧪 ${label}:`, preview);
}
// Tailwind reutilizado
export const CAMPO =
  "w-full rounded-sm border border-borderc bg-white px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export const CAMPO_ERRO = "border-danger focus:border-danger focus:ring-danger/20";

export const ROTULO = "mb-1.5 block text-sm font-semibold text-ink";

export const CARD = "rounded-md border border-borderc bg-surface shadow-soft-sm";

// vermelho quando existe mensagem de erro
export function classeCampo(erro?: string): string {
  return erro ? CAMPO + " " + CAMPO_ERRO : CAMPO;
}

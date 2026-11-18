
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// "2026-12-14" -> "14/12/2026" 
export function formatarData(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return dia + "/" + mes + "/" + ano;
}

export function formatarDataHora(data: string): string {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Quantos dias faltam até a validade (negativo = vencido)
export function diasParaVencer(dataValidade: string): number {
  const [ano, mes, dia] = dataValidade.slice(0, 10).split("-").map(Number);
  const validade = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.round((validade.getTime() - hoje.getTime()) / 86400000);
}

export function textoValidade(dataValidade: string): string {
  const dias = diasParaVencer(dataValidade);
  if (dias < 0) return "Vencido";
  if (dias === 0) return "Vence hoje";
  if (dias === 1) return "Vence amanhã";
  return "Vence em " + dias + " dias";
}

export function percentualDesconto(original: number, promocional: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - promocional) / original) * 100);
}

export function codigoRetirada(pedidoId: number): string {
  return "RF-" + String(pedidoId).padStart(6, "0");
}

export const NOME_PAGAMENTO = {
  PIX: "Pix",
  CARTAO_CREDITO: "Cartão de crédito",
  CARTAO_DEBITO: "Cartão de débito",
};

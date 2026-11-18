import Badge from "./Badge";
import type { StatusPedido as Status } from "../types/api";

// Etiqueta do status do pedido
export default function StatusPedido({ status, pago }: { status: Status; pago?: boolean }) {
  if (status === "CONCLUIDO") return <Badge tom="brand">Retirado</Badge>;
  if (pago) return <Badge tom="aviso">Pago · aguardando retirada</Badge>;
  return <Badge tom="laranja">Aguardando pagamento</Badge>;
}

import type { ReactNode } from "react";
import Icon from "./Icon";
import Button from "./Button";


export function Carregando({ texto = "Carregando dados da API..." }: { texto?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
      <p className="font-medium text-ink">{texto}</p>
      <p className="max-w-sm text-sm">
        A API fica no Render e pode levar até um minuto para “acordar” no primeiro acesso.
      </p>
    </div>
  );
}

interface ErroProps {
  mensagem: string;
  aoTentarDeNovo?: () => void;
}

export function ErroCarregar({ mensagem, aoTentarDeNovo }: ErroProps) {
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-danger-soft text-danger">
        <Icon name="alert" />
      </span>
      <p className="font-semibold text-ink">Não foi possível carregar</p>
      <p className="text-sm">{mensagem}</p>
      {aoTentarDeNovo && (
        <Button variante="secondary" tamanho="sm" onClick={aoTentarDeNovo}>
          <Icon name="refresh" size={16} /> Tentar de novo
        </Button>
      )}
    </div>
  );
}

interface VazioProps {
  titulo: string;
  descricao?: string;
  children?: ReactNode;
}

export function Vazio({ titulo, descricao, children }: VazioProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-md border border-dashed border-borderc bg-white px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand">
        <Icon name="box" />
      </span>
      <p className="font-semibold text-ink">{titulo}</p>
      {descricao && <p className="text-sm">{descricao}</p>}
      {children}
    </div>
  );
}

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { formatarData } from "../lib/formatar";

interface JanelaRetiradaProps {
  dataValidade: string; 
}

const JANELA_MS = 3 * 24 * 60 * 60 * 1000;

// O produto vale até o fim do dia da validade (23:59)
function fimDaValidade(dataValidade: string): Date {
  const [ano, mes, dia] = dataValidade.slice(0, 10).split("-").map(Number);
  return new Date(ano, mes - 1, dia, 23, 59, 59);
}

// 138720000 ms -> "1d 14h 32min"
function formatarTempo(ms: number): string {
  const minutosTotais = Math.floor(ms / 60000);
  const dias = Math.floor(minutosTotais / 1440);
  const horas = Math.floor((minutosTotais % 1440) / 60);
  const minutos = minutosTotais % 60;
  return (dias > 0 ? dias + "d " : "") + (dias > 0 || horas > 0 ? horas + "h " : "") + minutos + "min";
}

// Contagem regressiva até o produto vencer
export default function JanelaRetirada({ dataValidade }: JanelaRetiradaProps) {
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => setAgora(Date.now()), 60000);
    return () => clearInterval(intervalo);
  }, []);

  const restante = fimDaValidade(dataValidade).getTime() - agora;
  const encerrado = restante <= 0;
  const progresso = encerrado ? 0 : Math.min(100, Math.round((restante / JANELA_MS) * 100));

  return (
    <div className="rounded-2xl bg-linear-to-br from-[#0f1f17] to-[#14532d] p-5 text-white shadow-soft-md">
      <div className="flex items-center justify-between">
        <h3 className="text-base text-white">Janela de retirada</h3>
        <Icon name="clock" size={18} className="text-green-300" />
      </div>

      {encerrado ? (
        <p className="mt-3 font-display text-xl font-bold text-white">Prazo de retirada encerrado</p>
      ) : (
        <>
          <p className="mt-2 font-display text-3xl font-extrabold text-white" aria-live="off">
            {formatarTempo(restante)}
          </p>
          <p className="text-sm text-white/75">para retirar antes do vencimento</p>
        </>
      )}

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"
        role="progressbar"
        aria-label="Tempo restante para retirada"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progresso}
      >
        <div className="h-full rounded-full bg-green-300 transition-all" style={{ width: progresso + "%" }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-white/75">
        <span>agora</span>
        <span>vence {formatarData(dataValidade).slice(0, 5)}</span>
      </div>
    </div>
  );
}

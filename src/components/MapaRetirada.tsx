import { useEffect, useState } from "react";
import type { Estabelecimento } from "../types/api";
import Alerta from "./Alerta";
import Button from "./Button";
import Icon from "./Icon";
import { montarEndereco, urlAbrirNoMaps, urlComoChegar, urlMapaEmbed } from "../lib/mapa";

interface MapaRetiradaProps {
  estabelecimento: Estabelecimento;
}

export default function MapaRetirada({ estabelecimento }: MapaRetiradaProps) {
  const endereco = montarEndereco(estabelecimento);
  const [mapaCarregou, setMapaCarregou] = useState(false);
  const [toast, setToast] = useState<"copiado" | "falhou" | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setMapaCarregou(false);
  }, [endereco]);

  async function copiarEndereco() {
    try {
      await navigator.clipboard.writeText(endereco);
      setToast("copiado");
    } catch {

      setToast("falhou");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-borderc bg-white shadow-soft-sm">
      {endereco === "" ? (
        <div className="p-5">
          <Alerta tipo="aviso">Endereço do local ainda não cadastrado</Alerta>
        </div>
      ) : (
        <>
          <div className="relative h-[300px] md:h-[420px]">
            {!mapaCarregou && <div className="absolute inset-0 animate-pulse bg-gray-100" aria-hidden="true" />}
            <iframe
              key={endereco}
              title="Mapa do local de retirada"
              src={urlMapaEmbed(endereco)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapaCarregou(true)}
              className="h-full w-full border-0"
            />
            <div className="pointer-events-none absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-md bg-ink px-3.5 py-2 shadow-soft-md">
              <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                <Icon name="pin" size={15} className="shrink-0 text-green-400" /> Retire aqui
              </p>
              <p className="truncate text-xs font-semibold text-green-300">{estabelecimento.nome}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-borderc p-4 md:p-5">
            <Button href={urlComoChegar(endereco)} className="flex-1 sm:flex-none">
              <Icon name="navegar" size={18} /> Como chegar
            </Button>
            <Button href={urlAbrirNoMaps(endereco)} variante="secondary" className="flex-1 sm:flex-none">
              <Icon name="externo" size={18} /> Abrir no Google Maps
            </Button>
            <Button variante="secondary" onClick={copiarEndereco} className="w-full sm:w-auto">
              <Icon name="copiar" size={18} /> Copiar endereço
            </Button>
          </div>
        </>
      )}

      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toast && (
          <p className="flex animate-fadeUp items-center gap-2 rounded-full bg-[#0f1f17] px-5 py-3 text-sm font-semibold text-white shadow-soft-lg">
            {toast === "copiado" ? (
              <>
                <Icon name="check" size={18} className="text-green-400" /> Endereço copiado!
              </>
            ) : (
              <>
                <Icon name="alert" size={18} className="text-orange-300" /> Não foi possível copiar o endereço.
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

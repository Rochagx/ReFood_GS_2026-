import { useState } from "react";
import Icon from "./Icon";
import { urlValida } from "../lib/validar";

interface ProdutoImagemProps {
  imagem: string | null;
  nome: string;
  categoria: string;
  className?: string;
}

// Cores do "fundo" quando o produto não tem foto
function corDaCategoria(categoria: string): string {
  const c = categoria.toLowerCase();
  if (c.includes("pad") || c.includes("pão") || c.includes("pao")) return "from-amber-100 to-orange-200 text-amber-700";
  if (c.includes("fruta") || c.includes("horti") || c.includes("verdura") || c.includes("legume"))
    return "from-lime-100 to-green-200 text-green-700";
  if (c.includes("doce") || c.includes("bolo") || c.includes("sobremesa")) return "from-rose-100 to-pink-200 text-rose-700";
  if (c.includes("latic") || c.includes("leite") || c.includes("queijo")) return "from-sky-100 to-blue-200 text-sky-700";
  if (c.includes("refei") || c.includes("prato") || c.includes("marmita")) return "from-orange-100 to-amber-200 text-orange-700";
  return "from-emerald-50 to-emerald-200 text-emerald-700";
}

export default function ProdutoImagem({ imagem, nome, categoria, className = "" }: ProdutoImagemProps) {
  const [falhou, setFalhou] = useState(false);

  if (imagem && urlValida(imagem) && !falhou) {
    return (
      <img
        src={imagem}
        alt={nome}
        loading="lazy"
        onError={() => setFalhou(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={"Imagem ilustrativa: " + nome}
      className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br ${corDaCategoria(categoria)} ${className}`}
    >
      <Icon name="bag" size={36} />
      <span className="text-xs font-bold uppercase tracking-wider opacity-80">{categoria || "Alimento"}</span>
    </div>
  );
}

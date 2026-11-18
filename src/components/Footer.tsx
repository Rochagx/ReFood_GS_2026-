import { Link } from "react-router-dom";
import logoWhite from "../assets/logo-white.svg";

interface GrupoLinks {
  titulo: string;
  links: { label: string; to: string }[];
}

const GRUPOS: GrupoLinks[] = [
  {
    titulo: "Solução",
    links: [
      { label: "Ofertas", to: "/ofertas" },
      { label: "Parceiros", to: "/parceiros" },
      { label: "Impacto", to: "/impacto" },
      { label: "Sou parceiro", to: "/entrar" },
    ],
  },
  {
    titulo: "Projeto",
    links: [
      { label: "Sobre", to: "/sobre" },
      { label: "Integrantes", to: "/integrantes" },
      { label: "FAQ", to: "/faq" },
      { label: "Contato", to: "/contato" },
    ],
  },
];

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-rodape text-white/80">
      <div className="mx-auto grid max-w-container grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <img src={logoWhite} alt="ReFood" className="h-9 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-white/65">
            Alimentação consciente, desperdício reduzido. Conectamos estabelecimentos a consumidores para que
            nenhum alimento bom vá para o lixo.
          </p>
        </div>

        {GRUPOS.map((grupo) => (
          <div key={grupo.titulo}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{grupo.titulo}</h2>
            <ul className="space-y-2.5">
              {grupo.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/70 transition-colors hover:text-green-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-container px-4 py-5 text-center text-xs text-white/50 md:px-6 lg:px-8">
          © {ano} ReFood · Global Solution FIAP — CitizenTech · Turma 1TDSPO
        </p>
      </div>
    </footer>
  );
}

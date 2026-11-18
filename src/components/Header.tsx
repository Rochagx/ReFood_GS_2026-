import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import Icon from "./Icon";
import { useSessao } from "../context/SessaoContext";

interface LinkMenu {
  to: string;
  label: string;
  end?: boolean;
}

const LINKS: LinkMenu[] = [
  { to: "/", label: "Início", end: true },
  { to: "/ofertas", label: "Ofertas" },
  { to: "/parceiros", label: "Parceiros" },
  { to: "/impacto", label: "Impacto" },
  { to: "/sobre", label: "Sobre" },
  { to: "/integrantes", label: "Integrantes" },
  { to: "/faq", label: "FAQ" },
  { to: "/contato", label: "Contato" },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { usuario } = useSessao();
  const linkConta: LinkMenu = usuario
    ? usuario.tipoUsuario === "COMERCIANTE"
      ? { to: "/painel", label: "Meu painel" }
      : { to: "/pedidos", label: "Meus pedidos" }
    : { to: "/entrar", label: "Entrar" };

  return (
    <header className="sticky top-0 z-50 h-header border-b border-borderc bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-full max-w-container items-center justify-between gap-4 px-4 md:px-6 lg:px-8" aria-label="Navegação principal">
        <Link to="/" className="shrink-0" aria-label="ReFood — página inicial">
          <img src={logo} alt="ReFood" className="h-9 w-auto" />
        </Link>

        {/* menu desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-brand-soft text-brand-dark" : "text-ink hover:text-brand"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to={linkConta.to}
            className="hidden items-center gap-2 rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:inline-flex"
          >
            <Icon name={usuario ? "user" : "logout"} size={16} />
            <span className="max-w-[140px] truncate">{usuario ? linkConta.label : "Entrar"}</span>
          </Link>

          {/* botão hambúrguer */}
          <button
            className="grid h-10 w-10 place-items-center rounded-sm text-ink hover:bg-bg lg:hidden"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            <Icon name={menuAberto ? "x" : "menu"} size={24} />
          </button>
        </div>
      </nav>

      {/* menu mobile */}
      <div
        id="menu-mobile"
        className={`absolute inset-x-0 top-header border-b border-borderc bg-white shadow-soft-md transition-all duration-300 lg:hidden ${
          menuAberto ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <ul className="mx-auto flex max-w-container flex-col gap-1 px-4 py-4 md:px-6">
          {[...LINKS, linkConta].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                onClick={() => setMenuAberto(false)} 
                className={({ isActive }) =>
                  `block rounded-sm px-3 py-2.5 text-base font-medium ${
                    isActive ? "bg-brand-soft text-brand-dark" : "text-ink hover:bg-bg"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Usuario } from "../types/api";


interface SessaoContextType {
  usuario: Usuario | null;
  entrar: (usuario: Usuario) => void;
  sair: () => void;
}

const CHAVE = "refood:usuario";

const SessaoContext = createContext<SessaoContextType | undefined>(undefined);

function lerDoStorage(): Usuario | null {
  try {
    const salvo = localStorage.getItem(CHAVE);
    return salvo ? (JSON.parse(salvo) as Usuario) : null;
  } catch {
    return null;
  }
}

export function SessaoProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(lerDoStorage);

  function entrar(novo: Usuario) {
    setUsuario(novo);
    localStorage.setItem(CHAVE, JSON.stringify(novo));
  }

  function sair() {
    setUsuario(null);
    localStorage.removeItem(CHAVE);
  }

  return <SessaoContext.Provider value={{ usuario, entrar, sair }}>{children}</SessaoContext.Provider>;
}

export function useSessao() {
  const contexto = useContext(SessaoContext);
  if (!contexto) {
    throw new Error("useSessao precisa estar dentro do SessaoProvider");
  }
  return contexto;
}

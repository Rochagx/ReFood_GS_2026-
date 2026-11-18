import type { ReactNode } from "react";
import Container from "./Container";
import Button from "./Button";
import Icon from "./Icon";
import { useSessao } from "../context/SessaoContext";
import type { TipoUsuario } from "../types/api";

interface ExigePerfilProps {
  tipo: TipoUsuario;
  children: ReactNode;
}

export default function ExigePerfil({ tipo, children }: ExigePerfilProps) {
  const { usuario } = useSessao();

  if (usuario && usuario.tipoUsuario === tipo) return <>{children}</>;

  const nomeTipo = tipo === "COMERCIANTE" ? "comerciante" : "consumidor";

  return (
    <section className="py-20">
      <Container className="max-w-lg text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand">
          <Icon name="user" size={26} />
        </span>
        <h1 className="mt-4 text-2xl">Área do {nomeTipo}</h1>
        <p className="mt-2">
          {usuario
            ? "Você está com outro tipo de perfil. Troque para um perfil de " + nomeTipo + " para continuar."
            : "Entre com um perfil de " + nomeTipo + " para acessar esta página."}
        </p>
        <Button to="/entrar" className="mt-6">
          {usuario ? "Trocar de perfil" : "Entrar ou criar conta"}
        </Button>
      </Container>
    </section>
  );
}

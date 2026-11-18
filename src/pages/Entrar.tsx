import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import Campo from "../components/Campo";
import Button from "../components/Button";
import Alerta from "../components/Alerta";
import Badge from "../components/Badge";
import Icon from "../components/Icon";
import { Carregando, ErroCarregar } from "../components/Estados";
import useApi from "../hooks/useApi";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { useSessao } from "../context/SessaoContext";
import { criarUsuario, listarUsuarios } from "../services/api";
import { emailValido } from "../lib/validar";
import { CAMPO, classeCampo } from "../lib/estilos";
import type { TipoUsuario, Usuario } from "../types/api";

interface ErrosCadastro {
  nome?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
}

const TIPOS: TipoUsuario[] = ["CONSUMIDOR", "COMERCIANTE"];

export default function Entrar() {
  useDocumentMeta("Entrar — ReFood");

  const navigate = useNavigate();
  const { usuario, entrar, sair } = useSessao();
  const usuarios = useApi(listarUsuarios);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("CONSUMIDOR");

  const [erros, setErros] = useState<ErrosCadastro>({});
  const [enviando, setEnviando] = useState(false);
  const [erroApi, setErroApi] = useState("");
  const [perfilEscolhido, setPerfilEscolhido] = useState("");

  function validar(): ErrosCadastro {
    const novosErros: ErrosCadastro = {};
    if (nome.trim().length < 3) novosErros.nome = "Informe seu nome (mínimo 3 caracteres).";
    else if (nome.length > 100) novosErros.nome = "O nome pode ter no máximo 100 caracteres.";
    if (!emailValido(email)) novosErros.email = "Informe um e-mail válido, ex.: nome@email.com.";
    if (senha.length < 6) novosErros.senha = "A senha precisa ter pelo menos 6 caracteres.";
    if (confirmarSenha !== senha) novosErros.confirmarSenha = "As senhas não conferem.";
    return novosErros;
  }

  function irParaArea(u: Usuario) {
    navigate(u.tipoUsuario === "COMERCIANTE" ? "/painel" : "/ofertas");
  }

  async function aoCadastrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const novosErros = validar();
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return; 

    setEnviando(true);
    setErroApi("");
    try {
      // POST /usuario
      const novo = await criarUsuario({
        nome: nome.trim(),
        email: email.trim(),
        senha: senha,
        tipoUsuario: tipoUsuario,
      });
      entrar(novo);
      irParaArea(novo);
    } catch (erro) {
      setErroApi((erro as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  function aoEscolherPerfil(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!usuarios.dados) return;
    const escolhido = usuarios.dados.find((u) => u.id === Number(perfilEscolhido));
    if (escolhido) {
      entrar(escolhido);
      irParaArea(escolhido);
    }
  }


  if (usuario) {
    return (
      <>
        <PageHeader etiqueta="Minha conta" titulo={"Olá, " + usuario.nome + "!"} />
        <section className="py-12">
          <Container className="max-w-xl">
            <div className="rounded-md border border-borderc bg-white p-6 shadow-soft-sm">
              <p className="flex flex-wrap items-center gap-2 text-sm">
                Você está usando o perfil
                <Badge tom={usuario.tipoUsuario === "COMERCIANTE" ? "laranja" : "brand"}>
                  {usuario.tipoUsuario === "COMERCIANTE" ? "Comerciante" : "Consumidor"}
                </Badge>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button to={usuario.tipoUsuario === "COMERCIANTE" ? "/painel" : "/pedidos"}>
                  {usuario.tipoUsuario === "COMERCIANTE" ? "Ir para o painel" : "Ver meus pedidos"}
                </Button>
                <Button variante="secondary" onClick={sair}>
                  <Icon name="logout" size={16} /> Sair do perfil
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        etiqueta="Acesso"
        titulo="Entre ou crie sua conta"
        descricao="Consumidores reservam ofertas. Comerciantes cadastram o estabelecimento e publicam excedentes."
      />

      <section className="py-12">
        <Container className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* cadastro: POST /usuario */}
          <form noValidate onSubmit={aoCadastrar} className="rounded-md border border-borderc bg-white p-6 shadow-soft-sm md:p-8">
            <h2 className="text-xl">Criar conta</h2>
            <p className="mt-1 text-sm">Campos com * são obrigatórios.</p>

            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-semibold text-ink">Tipo de conta *</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {TIPOS.map((tipo) => (
                  <label
                    key={tipo}
                    className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
                      tipoUsuario === tipo ? "border-brand bg-brand-soft" : "border-borderc hover:border-brand/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoUsuario"
                      value={tipo}
                      checked={tipoUsuario === tipo}
                      onChange={() => setTipoUsuario(tipo)}
                      className="mt-1 accent-brand"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-ink">{tipo === "CONSUMIDOR" ? "Consumidor" : "Comerciante"}</span>
                      <span className="block text-xs text-muted">
                        {tipo === "CONSUMIDOR" ? "Quero comprar alimentos com desconto" : "Tenho um estabelecimento"}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Campo id="cad-nome" rotulo="Nome" obrigatorio erro={erros.nome} className="sm:col-span-2">
                <input
                  id="cad-nome"
                  autoComplete="name"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  aria-invalid={!!erros.nome}
                  className={classeCampo(erros.nome)}
                />
              </Campo>
              <Campo id="cad-email" rotulo="E-mail" obrigatorio erro={erros.email} className="sm:col-span-2">
                <input
                  id="cad-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!erros.email}
                  className={classeCampo(erros.email)}
                />
              </Campo>
              <Campo id="cad-senha" rotulo="Senha" obrigatorio erro={erros.senha} ajuda="Mínimo de 6 caracteres">
                <input
                  id="cad-senha"
                  type="password"
                  autoComplete="new-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  aria-invalid={!!erros.senha}
                  className={classeCampo(erros.senha)}
                />
              </Campo>
              <Campo id="cad-confirmar" rotulo="Confirmar senha" obrigatorio erro={erros.confirmarSenha}>
                <input
                  id="cad-confirmar"
                  type="password"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  aria-invalid={!!erros.confirmarSenha}
                  className={classeCampo(erros.confirmarSenha)}
                />
              </Campo>
            </div>

            {erroApi && (
              <Alerta tipo="erro" className="mt-5">
                Não foi possível criar a conta: {erroApi}
              </Alerta>
            )}

            <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={enviando}>
              {enviando ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          {/*  GET /usuario */}
          <aside className="rounded-md border border-borderc bg-white p-6 shadow-soft-sm">
            <h2 className="text-xl">Já tenho cadastro</h2>
            <Alerta tipo="info" className="mt-3">
              Protótipo acadêmico: a API ainda não tem login, então você escolhe o seu perfil na lista.
            </Alerta>

            {usuarios.carregando && <Carregando texto="Buscando perfis..." />}
            {usuarios.erro && <ErroCarregar mensagem={usuarios.erro} aoTentarDeNovo={usuarios.recarregar} />}
            {usuarios.dados && (
              <form onSubmit={aoEscolherPerfil} className="mt-5">
                <Campo id="perfil" rotulo="Perfil">
                  <select id="perfil" value={perfilEscolhido} onChange={(e) => setPerfilEscolhido(e.target.value)} className={CAMPO}>
                    <option value="">Selecione seu perfil...</option>
                    {usuarios.dados.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} — {u.tipoUsuario === "COMERCIANTE" ? "Comerciante" : "Consumidor"}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Button type="submit" variante="secondary" block className="mt-4" disabled={!perfilEscolhido}>
                  Entrar com este perfil
                </Button>
              </form>
            )}
          </aside>
        </Container>
      </section>
    </>
  );
}

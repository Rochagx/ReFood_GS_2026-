import { useState, type FormEvent } from "react";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import Campo from "../components/Campo";
import Button from "../components/Button";
import Alerta from "../components/Alerta";
import Icon from "../components/Icon";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { classeCampo } from "../lib/estilos";
import { emailValido } from "../lib/validar";

interface ErrosContato {
  nome?: string;
  email?: string;
  assunto?: string;
  mensagem?: string;
}

export default function Contato() {
  useDocumentMeta("Contato — ReFood");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [erros, setErros] = useState<ErrosContato>({});
  const [enviado, setEnviado] = useState(false);

  function validar(): ErrosContato {
    const novosErros: ErrosContato = {};
    if (nome.trim().length < 3) novosErros.nome = "Informe seu nome (mínimo 3 caracteres).";
    if (!emailValido(email)) novosErros.email = "Informe um e-mail válido, ex.: nome@email.com.";
    if (assunto === "") novosErros.assunto = "Selecione um assunto.";
    if (mensagem.trim().length < 10) novosErros.mensagem = "A mensagem precisa ter pelo menos 10 caracteres.";
    return novosErros;
  }

  function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const novosErros = validar();
    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      setEnviado(false);
      return;
    }

    setEnviado(true);
    setNome("");
    setEmail("");
    setAssunto("");
    setMensagem("");
  }

  const temErros = Object.keys(erros).length > 0;

  return (
    <>
      <PageHeader etiqueta="Contato" titulo="Fale com a equipe" descricao="Dúvidas, sugestões ou parcerias? Respondemos em até 2 dias úteis." />

      <section className="py-14">
        <Container className="grid items-start gap-8 lg:grid-cols-[1fr_1.6fr]">
          <aside className="rounded-md bg-rodape p-6 text-white md:p-8">
            <h2 className="text-xl text-white">Informações</h2>
            <p className="mt-2 text-sm text-white/70">Projeto acadêmico da Global Solution FIAP — CitizenTech.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                  <Icon name="pin" size={17} />
                </span>
                FIAP — Av. Paulista, 1106, São Paulo
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                  <Icon name="user" size={17} />
                </span>
                Turma 1TDSPO
              </li>
            </ul>
          </aside>

          <form noValidate onSubmit={aoEnviar} className="rounded-md border border-borderc bg-white p-6 shadow-soft-sm md:p-8">
            {enviado && (
              <Alerta tipo="sucesso" className="mb-5">
                Mensagem enviada com sucesso! A equipe ReFood responderá em breve.
              </Alerta>
            )}
            {temErros && (
              <Alerta tipo="erro" className="mb-5">
                Corrija os campos destacados antes de enviar.
              </Alerta>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Campo id="nome" rotulo="Nome completo" obrigatorio erro={erros.nome}>
                <input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  aria-invalid={!!erros.nome}
                  className={classeCampo(erros.nome)}
                  placeholder="Como devemos te chamar?"
                />
              </Campo>
              <Campo id="email" rotulo="E-mail" obrigatorio erro={erros.email}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!erros.email}
                  className={classeCampo(erros.email)}
                  placeholder="nome@email.com"
                />
              </Campo>
              <Campo id="assunto" rotulo="Assunto" obrigatorio erro={erros.assunto} className="sm:col-span-2">
                <select
                  id="assunto"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  aria-invalid={!!erros.assunto}
                  className={classeCampo(erros.assunto)}
                >
                  <option value="">Selecione...</option>
                  <option value="duvida">Dúvida sobre pedido</option>
                  <option value="parceria">Quero ser parceiro</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="outro">Outro</option>
                </select>
              </Campo>
              <Campo id="mensagem" rotulo="Mensagem" obrigatorio erro={erros.mensagem} className="sm:col-span-2">
                <textarea
                  id="mensagem"
                  rows={5}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  aria-invalid={!!erros.mensagem}
                  className={classeCampo(erros.mensagem) + " resize-y"}
                  placeholder="Escreva sua mensagem"
                />
              </Campo>
            </div>

            <Button type="submit" className="mt-6 w-full sm:w-auto">
              Enviar mensagem
            </Button>
          </form>
        </Container>
      </section>
    </>
  );
}

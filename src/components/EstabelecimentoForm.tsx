import { useState, type FormEvent } from "react";
import Campo from "./Campo";
import Button from "./Button";
import Alerta from "./Alerta";
import { classeCampo } from "../lib/estilos";
import { apenasNumeros, cepValido, cnpjValido, formatarCep, formatarCnpj, formatarTelefone } from "../lib/validar";
import { atualizarEstabelecimento, criarEstabelecimento } from "../services/api";
import type { Estabelecimento } from "../types/api";

interface EstabelecimentoFormProps {
  usuarioId: number;
  estabelecimento?: Estabelecimento; 
  aoSalvar: (estabelecimento: Estabelecimento) => void;
  aoCancelar?: () => void;
}

interface ErrosEstabelecimento {
  nome?: string;
  cnpj?: string;
  endereco?: string;
  cep?: string;
  telefone?: string;
  descricao?: string;
}

export default function EstabelecimentoForm({ usuarioId, estabelecimento, aoSalvar, aoCancelar }: EstabelecimentoFormProps) {
  const editando = estabelecimento !== undefined;

  const [nome, setNome] = useState(estabelecimento ? estabelecimento.nome : "");
  const [cnpj, setCnpj] = useState(estabelecimento ? estabelecimento.cnpj : "");
  const [endereco, setEndereco] = useState(estabelecimento ? estabelecimento.endereco : "");
  const [cep, setCep] = useState(estabelecimento && estabelecimento.cep ? estabelecimento.cep : "");
  const [telefone, setTelefone] = useState(estabelecimento && estabelecimento.telefone ? estabelecimento.telefone : "");
  const [descricao, setDescricao] = useState(estabelecimento && estabelecimento.descricao ? estabelecimento.descricao : "");

  const [erros, setErros] = useState<ErrosEstabelecimento>({});
  const [enviando, setEnviando] = useState(false);
  const [erroApi, setErroApi] = useState("");

  function validar(): ErrosEstabelecimento {
    const novosErros: ErrosEstabelecimento = {};
    const digitosTelefone = apenasNumeros(telefone);

    if (nome.trim().length < 2) novosErros.nome = "Informe o nome do estabelecimento.";
    if (!cnpjValido(cnpj)) novosErros.cnpj = "O CNPJ precisa ter 14 dígitos.";
    if (endereco.trim().length < 5) novosErros.endereco = "Informe o endereço completo.";
    if (cep !== "" && !cepValido(cep)) novosErros.cep = "O CEP precisa ter 8 dígitos.";
    if (telefone !== "" && (digitosTelefone.length < 10 || digitosTelefone.length > 11)) {
      novosErros.telefone = "Informe DDD + número.";
    }
    if (descricao.length > 500) novosErros.descricao = "Máximo de 500 caracteres.";

    return novosErros;
  }

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroApi("");

    const novosErros = validar();
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return; 


    const dados = {
      usuarioId,
      nome: nome.trim(),
      cnpj: formatarCnpj(cnpj),
      endereco: endereco.trim(),
      cep: cep ? formatarCep(cep) : "",
      telefone: telefone ? formatarTelefone(telefone) : "",
      descricao: descricao.trim(),
    };

    setEnviando(true);
    try {
      let salvo: Estabelecimento;
      if (estabelecimento) {
        salvo = await atualizarEstabelecimento(estabelecimento.id, dados);
      } else {
        salvo = await criarEstabelecimento(dados);
      }
      aoSalvar(salvo);
    } catch (erro) {
      setErroApi((erro as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form noValidate onSubmit={aoEnviar} className="rounded-md border border-borderc bg-white p-5 shadow-soft-sm md:p-6">
      <h2 className="text-xl">{editando ? "Editar estabelecimento" : "Cadastre seu estabelecimento"}</h2>
      <p className="mt-1 text-sm">Esses dados aparecem para os consumidores na hora de retirar o pedido.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Campo id="e-nome" rotulo="Nome do estabelecimento" obrigatorio erro={erros.nome} className="sm:col-span-2">
          <input
            id="e-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            aria-invalid={!!erros.nome}
            className={classeCampo(erros.nome)}
            placeholder="Ex.: Padaria Pão Quente"
          />
        </Campo>
        <Campo id="e-cnpj" rotulo="CNPJ" obrigatorio erro={erros.cnpj}>
          <input
            id="e-cnpj"
            inputMode="numeric"
            value={cnpj}
            onChange={(e) => setCnpj(formatarCnpj(e.target.value))}
            aria-invalid={!!erros.cnpj}
            className={classeCampo(erros.cnpj)}
            placeholder="00.000.000/0000-00"
          />
        </Campo>
        <Campo id="e-tel" rotulo="Telefone" erro={erros.telefone} ajuda="Opcional">
          <input
            id="e-tel"
            inputMode="tel"
            value={telefone}
            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
            aria-invalid={!!erros.telefone}
            className={classeCampo(erros.telefone)}
            placeholder="(11) 99999-9999"
          />
        </Campo>
        <Campo id="e-end" rotulo="Endereço" obrigatorio erro={erros.endereco} className="sm:col-span-2">
          <input
            id="e-end"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            aria-invalid={!!erros.endereco}
            className={classeCampo(erros.endereco)}
            placeholder="Rua, número, bairro, cidade"
          />
        </Campo>
        <Campo id="e-cep" rotulo="CEP" erro={erros.cep} ajuda="Opcional">
          <input
            id="e-cep"
            inputMode="numeric"
            value={cep}
            onChange={(e) => setCep(formatarCep(e.target.value))}
            aria-invalid={!!erros.cep}
            className={classeCampo(erros.cep)}
            placeholder="00000-000"
          />
        </Campo>
        <Campo id="e-desc" rotulo="Descrição" erro={erros.descricao} ajuda="Opcional · até 500 caracteres" className="sm:col-span-2">
          <textarea
            id="e-desc"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            aria-invalid={!!erros.descricao}
            className={classeCampo(erros.descricao) + " resize-y"}
          />
        </Campo>
      </div>

      {erroApi && (
        <Alerta tipo="erro" className="mt-5">
          Não foi possível salvar: {erroApi}
        </Alerta>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar estabelecimento"}
        </Button>
        {aoCancelar && (
          <Button variante="secondary" onClick={aoCancelar} disabled={enviando}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

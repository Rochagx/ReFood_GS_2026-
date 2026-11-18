import { useState, type FormEvent } from "react";
import Campo from "./Campo";
import Button from "./Button";
import Alerta from "./Alerta";
import { classeCampo } from "../lib/estilos";
import { diasParaVencer } from "../lib/formatar";
import { urlValida } from "../lib/validar";
import { atualizarProduto, criarProduto } from "../services/api";
import type { Produto } from "../types/api";

interface ProdutoFormProps {
  estabelecimentoId: number;
  produto?: Produto; 
  aoSalvar: (produto: Produto) => void;
  aoCancelar: () => void;
}

interface ErrosProduto {
  nome?: string;
  categoria?: string;
  precoOriginal?: string;
  precoPromocional?: string;
  quantidadeEstoque?: string;
  dataValidade?: string;
  imagem?: string;
}

const CATEGORIAS = ["Padaria", "Hortifruti", "Laticínios", "Doces", "Refeições", "Bebidas", "Mercearia"];

// aceita "3,50" ou "3.50"
function paraNumero(texto: string): number {
  return Number(texto.replace(",", "."));
}

export default function ProdutoForm({ estabelecimentoId, produto, aoSalvar, aoCancelar }: ProdutoFormProps) {
  const editando = produto !== undefined;

  const [nome, setNome] = useState(produto ? produto.nome : "");
  const [categoria, setCategoria] = useState(produto ? produto.categoria : "");
  const [precoOriginal, setPrecoOriginal] = useState(produto ? String(produto.precoOriginal) : "");
  const [precoPromocional, setPrecoPromocional] = useState(produto ? String(produto.precoPromocional) : "");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(produto ? String(produto.quantidadeEstoque) : "");
  const [dataValidade, setDataValidade] = useState(produto ? produto.dataValidade : "");
  const [imagem, setImagem] = useState(produto && urlValida(produto.imagem) ? produto.imagem || "" : "");

  const [erros, setErros] = useState<ErrosProduto>({});
  const [enviando, setEnviando] = useState(false);
  const [erroApi, setErroApi] = useState("");

  function validar(): ErrosProduto {
    const novosErros: ErrosProduto = {};
    const original = paraNumero(precoOriginal);
    const promocional = paraNumero(precoPromocional);
    const estoque = Number(quantidadeEstoque);

    if (nome.trim().length < 2) novosErros.nome = "Informe o nome do produto.";
    else if (nome.length > 120) novosErros.nome = "Máximo de 120 caracteres.";

    if (categoria.trim() === "") novosErros.categoria = "Informe a categoria.";
    else if (categoria.length > 50) novosErros.categoria = "Máximo de 50 caracteres.";

    if (precoOriginal === "" || isNaN(original) || original < 0.01) {
      novosErros.precoOriginal = "Informe um preço maior que zero.";
    }

    if (precoPromocional === "" || isNaN(promocional) || promocional < 0.01) {
      novosErros.precoPromocional = "Informe um preço maior que zero.";
    } else if (promocional > original) {
      novosErros.precoPromocional = "O preço promocional não pode ser maior que o original.";
    }

    if (quantidadeEstoque === "" || !Number.isInteger(estoque) || estoque < 0) {
      novosErros.quantidadeEstoque = "Informe um número inteiro (0 ou mais).";
    }

    if (dataValidade === "") novosErros.dataValidade = "Informe a data de validade.";
    else if (diasParaVencer(dataValidade) < 0) novosErros.dataValidade = "A validade não pode estar no passado.";

    if (imagem !== "" && !urlValida(imagem)) novosErros.imagem = "Use um link começando com http:// ou https://";

    return novosErros;
  }

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroApi("");

    const novosErros = validar();
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return; 

    const dados = {
      estabelecimentoId,
      nome: nome.trim(),
      categoria: categoria.trim(),
      precoOriginal: paraNumero(precoOriginal),
      precoPromocional: paraNumero(precoPromocional),
      quantidadeEstoque: Number(quantidadeEstoque),
      dataValidade,
      imagem: imagem.trim(),
    };

    setEnviando(true);
    try {
      let salvo: Produto;
      if (produto) {
        salvo = await atualizarProduto(produto.id, dados);
      } else {
        salvo = await criarProduto(dados);
      }
      aoSalvar(salvo);
    } catch (erro) {
      setErroApi((erro as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form noValidate onSubmit={aoEnviar} className="rounded-md border border-brand/30 bg-white p-5 shadow-soft-md md:p-6">
      <h3 className="text-lg">{editando ? "Editar produto" : "Novo produto"}</h3>
      <p className="mt-1 text-sm">Campos com * são obrigatórios.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Campo id="p-nome" rotulo="Nome do produto" obrigatorio erro={erros.nome} className="sm:col-span-2">
          <input
            id="p-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            aria-invalid={!!erros.nome}
            className={classeCampo(erros.nome)}
            placeholder="Ex.: Pão francês (kg)"
          />
        </Campo>
        <Campo id="p-categoria" rotulo="Categoria" obrigatorio erro={erros.categoria}>
          <input
            id="p-categoria"
            list="lista-categorias"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-invalid={!!erros.categoria}
            className={classeCampo(erros.categoria)}
            placeholder="Escolha ou digite"
          />
          <datalist id="lista-categorias">
            {CATEGORIAS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Campo>
        <Campo id="p-validade" rotulo="Validade" obrigatorio erro={erros.dataValidade}>
          <input
            id="p-validade"
            type="date"
            value={dataValidade}
            onChange={(e) => setDataValidade(e.target.value)}
            aria-invalid={!!erros.dataValidade}
            className={classeCampo(erros.dataValidade)}
          />
        </Campo>
        <Campo id="p-original" rotulo="Preço original (R$)" obrigatorio erro={erros.precoOriginal}>
          <input
            id="p-original"
            inputMode="decimal"
            value={precoOriginal}
            onChange={(e) => setPrecoOriginal(e.target.value)}
            aria-invalid={!!erros.precoOriginal}
            className={classeCampo(erros.precoOriginal)}
            placeholder="10,00"
          />
        </Campo>
        <Campo id="p-promo" rotulo="Preço promocional (R$)" obrigatorio erro={erros.precoPromocional}>
          <input
            id="p-promo"
            inputMode="decimal"
            value={precoPromocional}
            onChange={(e) => setPrecoPromocional(e.target.value)}
            aria-invalid={!!erros.precoPromocional}
            className={classeCampo(erros.precoPromocional)}
            placeholder="5,00"
          />
        </Campo>
        <Campo id="p-estoque" rotulo="Quantidade em estoque" obrigatorio erro={erros.quantidadeEstoque}>
          <input
            id="p-estoque"
            type="number"
            min={0}
            value={quantidadeEstoque}
            onChange={(e) => setQuantidadeEstoque(e.target.value)}
            aria-invalid={!!erros.quantidadeEstoque}
            className={classeCampo(erros.quantidadeEstoque)}
          />
        </Campo>
        <Campo id="p-imagem" rotulo="Link da imagem" erro={erros.imagem} ajuda="Opcional">
          <input
            id="p-imagem"
            type="url"
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
            aria-invalid={!!erros.imagem}
            className={classeCampo(erros.imagem)}
            placeholder="https://..."
          />
        </Campo>
      </div>

      {erroApi && (
        <Alerta tipo="erro" className="mt-5">
          A API recusou o produto: {erroApi}
        </Alerta>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar produto"}
        </Button>
        <Button variante="secondary" onClick={aoCancelar} disabled={enviando}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

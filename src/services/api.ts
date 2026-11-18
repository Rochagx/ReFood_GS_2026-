// todas as chamadas para a API Java do ReFood ficam aqui
// API publicada: https://refood-cdeg.onrender.com
import type {
  Estabelecimento,
  EstabelecimentoRequest,
  Pagamento,
  Pedido,
  PedidoRequest,
  Produto,
  ProdutoRequest,
  TipoPagamento,
  Usuario,
  UsuarioRequest,
} from "../types/api";

const URL_BASE = "/api";

// traducao do spring
function traduzir(mensagem: string): string {
  return mensagem
    .replace("must not be blank", "não pode ficar em branco")
    .replace("must not be null", "é obrigatório")
    .replace("must be a well-formed email address", "precisa ser um e-mail válido")
    .replace("must be greater than or equal to", "precisa ser maior ou igual a")
    .replace("must be greater than", "precisa ser maior que")
    .replace("size must be between", "precisa ter um tamanho entre")
    .replace(" and ", " e ");
}

//  mensagem de erro que a API manda 
async function mensagemDeErro(resposta: Response): Promise<string> {
  try {
    const corpo = await resposta.json();
    if (corpo.message) return traduzir(corpo.message);
  } catch {
  
  }
  if (resposta.status === 404) return "Registro não encontrado.";
  return "Erro " + resposta.status + " ao falar com a API.";
}

async function enviar(caminho: string, metodo: string, corpo?: object): Promise<Response> {
  try {
    return await fetch(URL_BASE + caminho, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique sua internet e tente de novo.");
  }
}

async function chamar<T>(caminho: string, metodo = "GET", corpo?: object): Promise<T> {
  const resposta = await enviar(caminho, metodo, corpo);

  if (!resposta.ok) {
    throw new Error(await mensagemDeErro(resposta));
  }

  return (await resposta.json()) as T;
}

async function chamarLista<T>(caminho: string): Promise<T[]> {
  const resposta = await enviar(caminho, "GET");

  if (resposta.status === 404) {
    return [];
  }
  if (!resposta.ok) {
    throw new Error(await mensagemDeErro(resposta));
  }

  return (await resposta.json()) as T[];
}

// ---------- usuários -------
export function listarUsuarios() {
  return chamar<Usuario[]>("/usuario");
}

export function buscarUsuario(id: number) {
  return chamar<Usuario>("/usuario/" + id);
}

export function criarUsuario(dados: UsuarioRequest) {
  return chamar<Usuario>("/usuario", "POST", dados);
}

export function atualizarUsuario(id: number, dados: UsuarioRequest) {
  return chamar<Usuario>("/usuario/" + id, "PUT", dados);
}

// ---------- estabelecimentos ------
export function listarEstabelecimentos() {
  return chamar<Estabelecimento[]>("/estabelecimento");
}

export function buscarEstabelecimento(id: number) {
  return chamar<Estabelecimento>("/estabelecimento/" + id);
}

export function criarEstabelecimento(dados: EstabelecimentoRequest) {
  return chamar<Estabelecimento>("/estabelecimento", "POST", dados);
}

export function atualizarEstabelecimento(id: number, dados: EstabelecimentoRequest) {
  return chamar<Estabelecimento>("/estabelecimento/" + id, "PUT", dados);
}

// ---------- produtos --
export function listarProdutos() {
  return chamar<Produto[]>("/produto");
}

export function buscarProduto(id: number) {
  return chamar<Produto>("/produto/" + id);
}

export function listarProdutosDoEstabelecimento(estabelecimentoId: number) {
  return chamarLista<Produto>("/produto/estabelecimento/" + estabelecimentoId);
}

export function criarProduto(dados: ProdutoRequest) {
  return chamar<Produto>("/produto", "POST", dados);
}

export function atualizarProduto(id: number, dados: ProdutoRequest) {
  return chamar<Produto>("/produto/" + id, "PUT", dados);
}

// A API devolve 409 ou 500 quando o produto já tem pedidos.
export async function excluirProduto(id: number): Promise<void> {
  const resposta = await enviar("/produto/" + id, "DELETE");

  if (resposta.status === 409 || resposta.status === 500) {
    throw new Error("Este produto já tem pedidos e não pode ser excluído. Zere o estoque para tirá-lo das ofertas.");
  }
  if (!resposta.ok) {
    throw new Error(await mensagemDeErro(resposta));
  }
}

// ---------- pedidos --------
export function listarPedidos() {
  return chamar<Pedido[]>("/pedido");
}

export function buscarPedido(id: number) {
  return chamar<Pedido>("/pedido/" + id);
}

export function listarPedidosDoUsuario(usuarioId: number) {
  return chamarLista<Pedido>("/pedido/usuario/" + usuarioId);
}

export function listarPedidosDoEstabelecimento(estabelecimentoId: number) {
  return chamarLista<Pedido>("/pedido/estabelecimento/" + estabelecimentoId);
}

// A API valida estoque e produto vencido 
export function criarPedido(dados: PedidoRequest) {
  return chamar<Pedido>("/pedido", "POST", dados);
}

export function concluirPedido(id: number) {
  return chamar<Pedido>("/pedido/" + id + "/concluir", "PATCH");
}

// ---------- pagamentos ----------
export function listarPagamentos() {
  return chamar<Pagamento[]>("/pagamento");
}

export function pagarPedido(pedidoId: number, tipoPagamento: TipoPagamento) {
  return chamar<Pagamento>("/pagamento", "POST", { pedidoId, tipoPagamento });
}

// A API devolve 404/409 quando o pedido ainda não tem pagamento
export async function buscarPagamentoDoPedido(pedidoId: number): Promise<Pagamento | null> {
  const resposta = await enviar("/pagamento/pedido/" + pedidoId, "GET");

  if (resposta.status === 404 || resposta.status === 409) {
    return null;
  }
  if (!resposta.ok) {
    throw new Error(await mensagemDeErro(resposta));
  }

  return (await resposta.json()) as Pagamento;
}

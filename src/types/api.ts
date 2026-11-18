
export type TipoUsuario = "CONSUMIDOR" | "COMERCIANTE";
export type StatusPedido = "PENDENTE" | "CONCLUIDO";
export type TipoPagamento = "PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: TipoUsuario;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: TipoUsuario;
}

export interface Estabelecimento {
  id: number;
  usuarioId: number;
  nome: string;
  cnpj: string;
  endereco: string;
  cep: string | null; 
  telefone: string | null;
  descricao: string | null;
}


export interface EstabelecimentoRequest {
  usuarioId: number;
  nome: string;
  cnpj: string;
  endereco: string;
  cep: string | null;
  telefone: string | null;
  descricao: string | null;
}

export interface Produto {
  id: number;
  estabelecimentoId: number;
  nome: string;
  categoria: string;
  precoOriginal: number;
  precoPromocional: number;
  quantidadeEstoque: number;
  dataValidade: string; // "18/11/2026"
  imagem: string | null; // opcional 
}

export interface ProdutoRequest {
  estabelecimentoId: number;
  nome: string;
  categoria: string;
  precoOriginal: number;
  precoPromocional: number;
  quantidadeEstoque: number;
  dataValidade: string;
  imagem: string | null;
}

export interface ItemPedido {
  id: number;
  produtoId: number;
  nomeProduto: string;
  quantidade: number;
  valorUnitario: number;
  valorSubtotal: number;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  estabelecimentoId: number;
  dataPedido: string;
  valorTotal: number;
  status: StatusPedido;
  itens: ItemPedido[];
}

export interface PedidoRequest {
  usuarioId: number;
  estabelecimentoId: number;
  itens: { produtoId: number; quantidade: number }[];
}

export interface Pagamento {
  id: number;
  pedidoId: number;
  tipoPagamento: TipoPagamento;
  valorPagamento: number;
  dataPagamento: string;
}

export interface ErroApi {
  status: number;
  error: string;
  message: string;
  path: string;
}

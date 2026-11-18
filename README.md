# ReFood — Alimentação consciente, desperdício reduzido

O **ReFood** é uma plataforma que conecta mercados, restaurantes, padarias e feiras a consumidores interessados em adquirir alimentos excedentes ou próximos do vencimento por preços reduzidos, com retirada por QR Code em máquinas inteligentes (vending machines) espalhadas pela cidade.

Projeto da **Global Solution 2026/2 — CitizenTech** (FIAP), disciplina **Front-End Design Engineering**.

## Links

| | |
| --- | --- |
| Aplicação (Vercel) | https://SEU-PROJETO.vercel.app <!-- TODO: colar o link da Vercel --> |
| Repositório (GitHub) | https://github.com/Rochagx/ReFood_GS_2026- |
| API Java (Render) | https://refood-cdeg.onrender.com |
| Documentação da API | https://refood-cdeg.onrender.com/swagger-ui/index.html |
| Vídeo (YouTube) | https://youtu.be/SEU-VIDEO <!-- TODO: vídeo de até 3 minutos --> |

## Objetivo

Reduzir o desperdício alimentar, incentivar o consumo consciente e oferecer alimentos de qualidade a preços mais acessíveis, usando a tecnologia como ferramenta de impacto social e sustentabilidade.

## Funcionalidades

| Página | Rota | Integração com a API |
| --- | --- | --- |
| Início | `/` | GET `/produto`, GET `/estabelecimento` (ofertas em destaque) |
| Ofertas | `/ofertas` | GET `/produto` com busca, filtro por categoria e ordenação |
| Detalhe da oferta | `/ofertas/:id` | GET `/produto/{id}`, GET `/estabelecimento/{id}`, **POST `/pedido`** |
| Parceiros | `/parceiros` | GET `/estabelecimento` |
| Detalhe do parceiro | `/parceiros/:id` | GET `/estabelecimento/{id}`, GET `/produto/estabelecimento/{id}` |
| Entrar / Criar conta | `/entrar` | GET `/usuario`, **POST `/usuario`** |
| Meus pedidos | `/pedidos` | GET `/pedido/usuario/{id}`, GET `/pagamento` |
| Detalhe do pedido | `/pedidos/:id` | GET `/pedido/{id}`, **POST `/pagamento`**, **PATCH `/pedido/{id}/concluir`** |
| Painel do parceiro | `/painel` | **POST/PUT `/estabelecimento`**, **POST/PUT/DELETE `/produto`**, GET/PATCH pedidos |
| Impacto | `/impacto` | GET `/pedido`, `/produto`, `/estabelecimento` (indicadores calculados) |
| Sobre, Integrantes, FAQ, Contato | `/sobre`, `/integrantes`, `/faq`, `/contato` | Institucionais (Contato com formulário validado) |

Todas as telas que consomem a API mostram **carregando**, **erro** (com botão “tentar de novo”) e **ausência de dados**.

## Telas

### Início
![Página inicial com ofertas em destaque](docs/prints/home.png)

### Ofertas
![Lista de ofertas com busca e filtros](docs/prints/ofertas.png)

### Detalhe da oferta e onde retirar
![Detalhe da oferta com mapa de retirada](docs/prints/oferta-detalhe.png)

### Parceiros
![Lista de estabelecimentos parceiros](docs/prints/parceiros.png)

### Detalhe do parceiro
![Produtos de um parceiro](docs/prints/parceiro-detalhe.png)

### Impacto
![Indicadores de impacto calculados pela API](docs/prints/impacto.png)

### Entrar / criar perfil
![Escolha ou criação de perfil](docs/prints/entrar.png)

### Integrantes
![Página de integrantes](docs/prints/integrantes.png)

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React 18 | Componentes, hooks (`useState`, `useEffect`, `useContext`) |
| Vite | Servidor de desenvolvimento, build e proxy da API |
| TypeScript | Tipagem de props, estados e respostas da API |
| React Router | Rotas estáticas e com parâmetro (`useParams`, `useNavigate`, `useSearchParams`) |
| Tailwind CSS 4 | Estilização e responsividade (mobile 390, tablet 768, desktop 1440) |
| Fetch API | Todas as requisições HTTP (sem Axios) |
| Context API + localStorage | Perfil ativo (consumidor/comerciante) |
| Vercel | Deploy do front-end |

## Estrutura de pastas

```
src/
├── assets/        # logo e fotos dos integrantes
├── components/    # componentes reutilizáveis (Button, ProdutoCard, Campo, Alerta, Estados, formulários...)
├── context/       # SessaoContext (perfil ativo)
├── hooks/         # useApi (loading/erro/dados) e useDocumentMeta
├── lib/           # formatação, validações e classes Tailwind reutilizadas
├── pages/         # uma página por rota
├── services/      # api.ts — todas as chamadas fetch para a API Java
├── types/         # api.ts — interfaces dos dados da API
├── App.tsx        # rotas
└── main.tsx
```

## Como executar

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
git clone https://github.com/Rochagx/ReFood_GS_2026-.git
cd ReFood_GS_2026-
npm install
npm run dev
```

Abra `http://localhost:5173`.

> A API está no plano gratuito do Render: o primeiro acesso pode levar cerca de 1 minuto até ela “acordar”.

### Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Checagem de tipos + build de produção |
| `npm run preview` | Testa o build localmente |

### Como o front fala com a API

As chamadas usam o prefixo `/api`. Em desenvolvimento o **proxy do Vite** (`vite.config.ts`) e na Vercel o **rewrite** (`vercel.json`) encaminham para `https://refood-cdeg.onrender.com`, evitando problemas de CORS.

## Integrantes

| Nome | RM | GitHub |
| --- | --- | --- |
| Guilherme dos Santos Rocha | 570005 | [Rochagx](https://github.com/Rochagx) |
| Giovanni Della Crucce Azevedo Santana | 572752 | [giovannidcas](https://github.com/giovannidcas) |
| César Anastácio dos Anjos Ledres | 573833 | [cesarledres](https://github.com/cesarledres) |
| Caio Gonçalves Feixas | 569956 | [Caiofeixas](https://github.com/Caiofeixas) |
| Théo Caria Gonçalves | 572914 | [theo4321](https://github.com/theo4321) |

Turma 1TDSPO — FIAP.

## Contato

Dúvidas sobre o projeto: abra uma *issue* no repositório ou use a página [Contato](https://SEU-PROJETO.vercel.app/contato).

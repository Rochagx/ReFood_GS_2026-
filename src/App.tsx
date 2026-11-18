import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SessaoProvider } from "./context/SessaoContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Integrantes from "./pages/Integrantes";
import Faq from "./pages/Faq";
import Contato from "./pages/Contato";
import Ofertas from "./pages/Ofertas";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import Parceiros from "./pages/Parceiros";
import ParceiroDetalhe from "./pages/ParceiroDetalhe";
import Entrar from "./pages/Entrar";
import MeusPedidos from "./pages/MeusPedidos";
import PedidoDetalhe from "./pages/PedidoDetalhe";
import Painel from "./pages/Painel";
import Impacto from "./pages/Impacto";
import NaoEncontrado from "./pages/NaoEncontrado";

export default function App() {
  return (
    <SessaoProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* páginas institucionais */}
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/integrantes" element={<Integrantes />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contato" element={<Contato />} />

            {/* páginas integradas com a API Java */}
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/ofertas/:id" element={<ProdutoDetalhe />} />
            <Route path="/parceiros" element={<Parceiros />} />
            <Route path="/parceiros/:id" element={<ParceiroDetalhe />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/pedidos" element={<MeusPedidos />} />
            <Route path="/pedidos/:id" element={<PedidoDetalhe />} />
            <Route path="/painel" element={<Painel />} />
            <Route path="/impacto" element={<Impacto />} />

            <Route path="*" element={<NaoEncontrado />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessaoProvider>
  );
}

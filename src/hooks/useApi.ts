import { useEffect, useState } from "react";

export default function useApi<T>(buscar: () => Promise<T>, dependencias: unknown[] = []) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await buscar();
      setDados(resultado);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, dependencias);

  return { dados, carregando, erro, recarregar: carregar };
}

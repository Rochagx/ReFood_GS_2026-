
export function emailValido(email: string): boolean {
  const texto = email.trim();
  const arroba = texto.indexOf("@");
  return arroba > 0 && texto.indexOf(".", arroba) > arroba + 1 && !texto.endsWith(".");
}

export function apenasNumeros(texto: string): string {
  let numeros = "";
  for (const letra of texto) {
    if (letra >= "0" && letra <= "9") {
      numeros += letra;
    }
  }
  return numeros;
}

export function cnpjValido(cnpj: string): boolean {
  return apenasNumeros(cnpj).length === 14;
}

export function formatarCnpj(cnpj: string): string {
  const n = apenasNumeros(cnpj).slice(0, 14);
  let texto = n.slice(0, 2);
  if (n.length > 2) texto += "." + n.slice(2, 5);
  if (n.length > 5) texto += "." + n.slice(5, 8);
  if (n.length > 8) texto += "/" + n.slice(8, 12);
  if (n.length > 12) texto += "-" + n.slice(12, 14);
  return texto;
}

export function cepValido(cep: string): boolean {
  return apenasNumeros(cep).length === 8;
}

export function formatarCep(cep: string): string {
  const n = apenasNumeros(cep).slice(0, 8);
  if (n.length > 5) return n.slice(0, 5) + "-" + n.slice(5);
  return n;
}

export function formatarTelefone(tel: string): string {
  const n = apenasNumeros(tel).slice(0, 11);
  if (n.length <= 2) return n;

  const tamanhoMeio = n.length === 11 ? 5 : 4;
  const meio = n.slice(2, 2 + tamanhoMeio);
  const fim = n.slice(2 + tamanhoMeio);

  let texto = "(" + n.slice(0, 2) + ") " + meio;
  if (fim) texto += "-" + fim;
  return texto;
}

export function urlValida(url: string | null | undefined): boolean {
  if (!url) return false;
  const texto = url.trim();
  const comecoCerto = texto.startsWith("http://") || texto.startsWith("https://");
  return comecoCerto && texto.includes(".") && !texto.includes(" ");
}

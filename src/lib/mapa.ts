
import type { Estabelecimento } from "../types/api";

export function montarEndereco(estab: Estabelecimento): string {
  let texto = estab.endereco ? estab.endereco.trim() : "";

  if (estab.cep) {
    if (texto !== "") texto += ", ";
    texto += "CEP " + estab.cep.trim();
  }

  return texto;
}

export function urlMapaEmbed(endereco: string): string {
  return "https://maps.google.com/maps?q=" + encodeURIComponent(endereco) + "&z=16&output=embed";
}

export function urlComoChegar(endereco: string): string {
  return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(endereco);
}

export function urlAbrirNoMaps(endereco: string): string {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(endereco);
}

// ============================================================
// CONFIGURAÇÃO ÚNICA DO SITE — edite apenas aqui
// ============================================================

// TODO: SUBSTITUIR pelo número real (apenas dígitos, com DDI 55 + DDD). Ex: "5541999999999"
export const WHATSAPP_NUMBER = "";

export const INSTAGRAM_URL = "https://www.instagram.com/karenm.lashes_/";
export const INSTAGRAM_HANDLE = "@karenm.lashes_";

export const ADDRESS_LINE = "Rua do Guarumbi, 153 — Uberaba";
export const ADDRESS_CITY = "Curitiba — PR";
// Pesquisa usada no Google Maps (editável)
export const MAPS_QUERY = "Rua do Guarumbi, 153, Uberaba, Curitiba - PR";

export const DEFAULT_MESSAGE =
  "Olá, Karen! Conheci seu trabalho pelo site e gostaria de saber mais sobre os procedimentos e horários disponíveis para agendamento.";

export function whatsappLink(message: string = DEFAULT_MESSAGE) {
  // Sem número configurado, wa.me abre o WhatsApp para escolher o contato — nenhum número fictício é usado.
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function serviceMessage(service: string) {
  return `Olá, Karen! Conheci seu trabalho pelo site e gostaria de agendar o procedimento "${service}". Quais horários estão disponíveis?`;
}

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;

// SERVIÇOS — preencha quando os procedimentos forem definidos.
// duration e price são opcionais: só aparecem quando informados.
export type Service = { name: string; description: string; duration?: string; price?: string };
export const SERVICES: Service[] = [];

// PORTFÓLIO — adicione fotos REAIS. ratio: "tall" | "wide" | "square"
export type PortfolioItem = { src: string; alt: string; ratio?: "tall" | "wide" | "square" };
export const PORTFOLIO: PortfolioItem[] = [];

// Fotos reais (deixe vazio até ter as imagens)
export const HERO_PHOTO = "";
export const ABOUT_PHOTO = "";

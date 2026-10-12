export const CRIA360_WHATSAPP = "51942859704";
export function whatsappLink(message: string, number = CRIA360_WHATSAPP) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
export function whatsappDisplay(number = CRIA360_WHATSAPP) {
  const clean = number.replace(/\D/g, "");
  return /^51\d{9}$/.test(clean) ? clean.replace(/^51(\d{3})(\d{3})(\d{3})$/, "+51 $1 $2 $3") : `+${clean}`;
}

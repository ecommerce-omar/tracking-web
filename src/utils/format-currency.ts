export function formatCurrency(
  price: number,
  locale = "pt-BR",
  currency = "BRL"
) {
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);

  return formattedPrice;
}

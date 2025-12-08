// Keeps formatting logic in one place.
export function formatEUR(value) {
  return new Intl.NumberFormat("en-FI", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

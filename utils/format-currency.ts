export function formatCurrency(amount: number, currency: string = "KES"): string {
  // Handle invalid or null inputs
  if (amount == null || isNaN(amount)) {
    return "–"
  }

  // Use Kenyan Shilling (KES) as default
  const formatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return formatter.format(amount)
}
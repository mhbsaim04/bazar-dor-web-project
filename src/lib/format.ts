export function formatBanglaNumber(value: number, maximumFractionDigits = 1): string {
  if (!Number.isFinite(value)) return "০";
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatMoney(value: number): string {
  return `${formatBanglaNumber(value, 2)} টাকা`;
}

export function formatPercent(value: number): string {
  const absolute = formatBanglaNumber(Math.abs(value), 1);
  if (value > 0) return `▲ ${absolute}%`;
  if (value < 0) return `▼ ${absolute}%`;
  return `— ${absolute}%`;
}

export function getBanglaDate(date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function safeRedirectPath(value: string | null, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

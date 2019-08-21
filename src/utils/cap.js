export function cap(value, min, max) {
  return Math.max(Math.min(Number(value) || 0, max), min)
}

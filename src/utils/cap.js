export function cap(value, min, max) {
  return Math.max(Math.min(value, max), min)
}

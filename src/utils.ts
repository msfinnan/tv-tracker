/**
 * Generates a unique identifier by combining a random base-36 string
 * with the current timestamp in base-36. This provides sufficient
 * uniqueness for client-side ID generation.
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}


export type QueryPattern = { pattern: string, options?: string }

export type QueryRange<T> = { min: T, max: T } | { min: T, max?: never } | { min?: never, max: T }

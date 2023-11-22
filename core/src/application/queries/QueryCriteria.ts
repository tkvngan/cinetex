
export type ByPattern = { pattern: string, options?: string }

export type ByRange<T> = { min: T, max: T } | { min: T, max?: never } | { min?: never, max: T }

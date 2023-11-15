export function TODO(message?: string): never {
    throw new Error(message || "Unimplemented!")
}

export function error(message?: string): never {
    throw new Error(message || "Error!")
}

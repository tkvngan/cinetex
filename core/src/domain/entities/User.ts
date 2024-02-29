import {Entity, Id} from "../types/Entity"

export type User = Entity & Readonly<{
    id: Id
    email: string
    password: string
    emailVerified: boolean
    firstName?: string
    lastName?: string
    phoneNumber?: string,
    createdAt: Date,
    roles: string[],
}>

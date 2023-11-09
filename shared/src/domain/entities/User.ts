import {Entity, Id} from "../types/Entity";

export type User = Entity & Readonly<{
    id: Id
    fullName?: string
    email: string
    phoneNumber: string
}>

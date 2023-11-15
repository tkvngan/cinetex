import {Entity, Id} from "../types";

export type User = Entity & Readonly<{
    id: Id
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string
}>

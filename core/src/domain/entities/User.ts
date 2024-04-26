import {Entity, Id} from "../types/Entity"

export interface User extends Entity {
    readonly id: Id
    readonly email: string
    readonly password: string
    readonly emailVerified: boolean
    readonly firstName?: string
    readonly lastName?: string
    readonly phoneNumber?: string,
    readonly createdAt?: Date,
    readonly roles: readonly string[],
}

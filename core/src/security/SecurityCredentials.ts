import {JWTPayload} from "jose";
import {User} from "../domain/entities";

export type SecurityCredentials = Readonly<JWTPayload & { user: Omit<User, "password"> }>

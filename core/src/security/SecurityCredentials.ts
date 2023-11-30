import {JWTPayload} from "jose";
import {User} from "../domain/entities";

export type SecurityCredentials = {
    readonly user: Omit<User, "password">;
    readonly jwtToken: string;
    readonly jwtPayload?: JWTPayload;
}

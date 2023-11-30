import {User} from "../domain/entities";

export type SecurityCredentials = {
    readonly user: Omit<User, "password">;
    readonly token: string;
    readonly attributes?: Record<string, any>; //JWTPayload;
}

import {User} from "../domain/entities";

export type SecurityCredentials = {
    readonly user: Omit<User, "password">;
    readonly token: string;
    readonly attributes?: Record<string, any>; // this actually stores the payload of the JWT
}

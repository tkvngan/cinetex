import {User} from "../domain/entities/User";

export type Credentials = {
    readonly user: Omit<User, "password"| "emailVerified"> & { emailVerified?: boolean};
    readonly token: string;
    readonly attributes?: Record<string, any>; // this actually stores the payload of the JWT
}

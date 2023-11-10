import { User } from "@cinetex/shared/domain/entities/User";
import {Pattern} from "./Repository";

export type UserSearchCriteria = {
    name?: string | Pattern;
    email?: string | Pattern;
    phoneNumber?: string | Pattern;
}

export interface UserRepository {

    getAllUsers(): Promise<User[]>;

    getUser(id: string): Promise<User | undefined>;

    getUserByEmail(email: string): Promise<User | undefined>;

    getUsers(criteria: UserSearchCriteria): Promise<User[]>;

    addUser(user: User): Promise<User>;

    deleteUser(id: string): Promise<User | undefined>;

    deleteUsers(criteria: UserSearchCriteria): Promise<number>;

    updateUser(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined>;

}

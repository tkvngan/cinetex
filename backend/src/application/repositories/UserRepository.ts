import {User} from "shared/dist/domain/entities/User";
import {QueryPattern} from "shared/dist/application/usecases/queries/QueryCriteria";

export type UserQueryCriteria = {
    name?: string | QueryPattern;
    email?: string | QueryPattern;
    phoneNumber?: string | QueryPattern;
}

export interface UserRepository {

    getAllUsers(): Promise<User[]>;

    getUserById(id: string): Promise<User | undefined>;

    getUserByEmail(email: string): Promise<User | undefined>;

    getUsersByQuery(criteria: UserQueryCriteria): Promise<User[]>;

    addUser(user: User): Promise<User>;

    deleteUserById(id: string): Promise<User | undefined>;

    deleteUsersByQuery(criteria: UserQueryCriteria): Promise<number>;

    updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined>;

}

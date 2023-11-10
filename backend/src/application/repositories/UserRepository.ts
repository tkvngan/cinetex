import {User} from "@cinetex/shared/domain/entities/User";
import {QueryPattern} from "@cinetex/shared/application/usecases/queries/QueryCriteria";

export type UserQueryCriteria = {
    name?: string | QueryPattern;
    email?: string | QueryPattern;
    phoneNumber?: string | QueryPattern;
}

export interface UserRepository {

    getAllUsers(): Promise<User[]>;

    getUserId(id: string): Promise<User | undefined>;

    getUserByEmail(email: string): Promise<User | undefined>;

    getUsersByQuery(criteria: UserQueryCriteria): Promise<User[]>;

    addUser(user: User): Promise<User>;

    deleteUserById(id: string): Promise<User | undefined>;

    deleteUsersByQuery(criteria: UserQueryCriteria): Promise<number>;

    updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined>;

}

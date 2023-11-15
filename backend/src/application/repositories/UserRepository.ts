import {User} from "core/dist/domain/entities/User";
import {QueryUserCriteria} from "../interactors/queries";

export interface UserRepository {

    getAllUsers(): Promise<User[]>;

    getUserById(id: string): Promise<User | undefined>;

    getUserByEmail(email: string): Promise<User | undefined>;

    addUser(user: User): Promise<User>;

    deleteUserById(id: string): Promise<User | undefined>;

    deleteUsersByQuery(criteria: QueryUserCriteria): Promise<number>;

    updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined>;

    queryUsers(criteria: QueryUserCriteria): Promise<User[]>;


}

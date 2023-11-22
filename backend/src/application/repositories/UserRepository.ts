import {User} from "cinetex-core/dist/domain/entities/User";
import {UsersQuery} from "cinetex-core/dist/application/queries";

export interface UserRepository {

    getAllUsers(): Promise<User[]>;

    getUserById(id: string): Promise<User | undefined>;

    getUserByEmail(email: string): Promise<User | undefined>;

    addUser(user: User): Promise<User>;

    deleteUserById(id: string): Promise<User | undefined>;

    deleteUsersByQuery(query: UsersQuery): Promise<number>;

    updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined>;

    queryUsers(query: UsersQuery): Promise<User[]>;


}

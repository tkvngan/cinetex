import {User} from "cinetex-core/dist/domain/entities/User";
import {UsersQuery} from "cinetex-core/dist/application/queries";
import {Credentials} from "cinetex-core/dist/security/Credentials";

export interface UserRepository {

    getAllUsers(): Promise<User[]>;

    getUserById(id: string): Promise<User | undefined>;

    getUserByEmail(email: string): Promise<User | undefined>;

    createUser(user: User): Promise<User>;

    deleteUserById(id: string): Promise<User | undefined>;

    deleteAllUsers(): Promise<number>;

    deleteUsersByQuery(query: UsersQuery): Promise<number>;

    updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined>;

    queryUsers(query: UsersQuery): Promise<User[]>;

    setUserCredentials(credentials: Credentials): Promise<void>;

    getUserCredentials(): Promise<Credentials | undefined>;

    clearUserCredentials(): Promise<void>;


}
